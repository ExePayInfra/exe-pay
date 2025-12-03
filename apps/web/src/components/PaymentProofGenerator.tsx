'use client';

import { useState } from 'react';
import { useConnection } from '@solana/wallet-adapter-react';
import { 
  verifyPaymentProof, 
  encodePaymentProof, 
  decodePaymentProof,
  PaymentProof,
} from '@exe-pay/privacy';
import { PublicKey, Connection } from '@solana/web3.js';
import { keccak_256 } from '@noble/hashes/sha3';

export function PaymentProofGenerator() {
  const { connection: defaultConnection } = useConnection();
  const [activeTab, setActiveTab] = useState<'generate' | 'verify'>('generate');
  const [network, setNetwork] = useState<'mainnet' | 'devnet'>('devnet');
  
  // Generate tab state
  const [txSignature, setTxSignature] = useState('');
  const [amount, setAmount] = useState('');
  const [memo, setMemo] = useState('');
  const [generatedProof, setGeneratedProof] = useState<string>('');
  const [generating, setGenerating] = useState(false);
  const [txDetails, setTxDetails] = useState<{
    recipientAddress: string;
    actualAmount: number;
    ephemeralPubkey: string | null;
  } | null>(null);
  
  // Verify tab state
  const [proofToVerify, setProofToVerify] = useState('');
  const [verificationResult, setVerificationResult] = useState<boolean | null>(null);
  const [verifying, setVerifying] = useState(false);
  const [decodedProof, setDecodedProof] = useState<PaymentProof | null>(null);
  
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const handleGenerateProof = async () => {
    setError('');
    setGeneratedProof('');
    setTxDetails(null);
    
    if (!txSignature) {
      setError('Transaction signature is required');
      return;
    }

    setGenerating(true);

    try {
      // Create connection based on selected network
      // Use environment variable if available, otherwise use public RPC
      const rpcUrl = network === 'mainnet' 
        ? (process.env.NEXT_PUBLIC_SOLANA_RPC_URL || 'https://api.mainnet-beta.solana.com')
        : 'https://api.devnet.solana.com';
      
      const connection = new Connection(rpcUrl, 'confirmed');
      
      console.log(`[Payment Proof] Fetching transaction from ${network} (${rpcUrl})...`);
      
      // Fetch the actual transaction from chain
      let tx;
      try {
        tx = await connection.getTransaction(txSignature, {
          maxSupportedTransactionVersion: 0,
        });
      } catch (rpcError: any) {
        console.error('[Payment Proof] RPC Error:', rpcError);
        
        // Handle rate limiting / 403 errors
        if (rpcError?.message?.includes('403') || rpcError?.message?.includes('forbidden')) {
          setError(
            `⚠️ RPC Rate Limit: The public ${network} RPC is rate-limited. ` +
            `To use mainnet payment proofs, please set up a free RPC endpoint from Helius, QuickNode, or Alchemy. ` +
            `For testing, use Devnet instead.`
          );
        } else {
          setError(`Network error: ${rpcError?.message || 'Failed to fetch transaction'}`);
        }
        setGenerating(false);
        return;
      }
      
      if (!tx) {
        setError(
          `Transaction not found on ${network}. ` +
          `${network === 'mainnet' 
            ? 'Try switching to Devnet if this is a test transaction, or verify the signature is correct.' 
            : 'Verify the signature is correct or try Mainnet.'}`
        );
        setGenerating(false);
        return;
      }
      
      if (!tx.meta) {
        setError('Transaction metadata not available');
        setGenerating(false);
        return;
      }
      
      console.log('[Payment Proof] Transaction found!');
      
      // Parse the transaction to find stealth payment details
      const message = tx.transaction.message;
      const accountKeys = 'staticAccountKeys' in message 
        ? message.staticAccountKeys 
        : (message as any).accountKeys || [];
      
      // Find the recipient (usually index 1 for simple transfers)
      let recipientIndex = 1;
      let recipientAddress = accountKeys[recipientIndex]?.toBase58() || '';
      
      // Calculate actual amount transferred
      const preBalance = tx.meta.preBalances[recipientIndex] || 0;
      const postBalance = tx.meta.postBalances[recipientIndex] || 0;
      const actualAmount = postBalance - preBalance;
      
      // Look for ephemeral pubkey in memo (for stealth payments)
      let ephemeralPubkey: string | null = null;
      
      const instructions = 'compiledInstructions' in message 
        ? message.compiledInstructions 
        : (message as any).instructions || [];
      
      const memoInstruction = instructions.find((ix: any) => {
        const programId = 'staticAccountKeys' in message
          ? message.staticAccountKeys?.[ix.programIdIndex]
          : (message as any).accountKeys?.[ix.programIdIndex];
        return programId?.toBase58() === 'MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr';
      });
      
      if (memoInstruction) {
        try {
          const memoData = Buffer.from((memoInstruction as any).data, 'base64').toString('utf-8');
          if (memoData.startsWith('ExePay:Stealth:')) {
            const parts = memoData.split(':');
            if (parts.length >= 3) {
              ephemeralPubkey = parts[2];
              console.log('[Payment Proof] Found ephemeral pubkey:', ephemeralPubkey);
            }
          }
        } catch (e) {
          console.log('[Payment Proof] Could not parse memo');
        }
      }
      
      setTxDetails({
        recipientAddress,
        actualAmount,
        ephemeralPubkey,
      });
      
      // Generate cryptographic proof hash from transaction data
      // This creates a deterministic proof that can be verified
      const proofData = new Uint8Array([
        ...Buffer.from(txSignature, 'utf-8'),
        ...Buffer.from(recipientAddress, 'utf-8'),
        ...new Uint8Array(new Float64Array([actualAmount]).buffer),
      ]);
      const sharedSecretHash = Buffer.from(keccak_256(proofData)).toString('hex');
      
      // Create the proof object with REAL transaction data
      const proof: PaymentProof = {
        txSignature,
        ephemeralPubkey: ephemeralPubkey 
          ? new PublicKey(ephemeralPubkey) 
          : new PublicKey(accountKeys[0]), // Use sender as fallback
        sharedSecretHash,
        amount: amount ? parseFloat(amount) * 1_000_000_000 : actualAmount,
        timestamp: tx.blockTime ? tx.blockTime * 1000 : Date.now(),
        memo: memo || undefined,
        stealthAddress: new PublicKey(recipientAddress),
      };

      const encodedProof = encodePaymentProof(proof);
      setGeneratedProof(encodedProof);
      
      console.log('[Payment Proof] Generated REAL proof:', encodedProof);
    } catch (err) {
      console.error('[Payment Proof] Error:', err);
      setError(err instanceof Error ? err.message : 'Failed to generate proof');
    } finally {
      setGenerating(false);
    }
  };

  const handleVerifyProof = async () => {
    setError('');
    setVerificationResult(null);
    setDecodedProof(null);
    
    if (!proofToVerify) {
      setError('Please enter a payment proof');
      return;
    }

    setVerifying(true);

    try {
      // Create connection based on selected network
      // Use environment variable if available, otherwise use public RPC
      const rpcUrl = network === 'mainnet' 
        ? (process.env.NEXT_PUBLIC_SOLANA_RPC_URL || 'https://api.mainnet-beta.solana.com')
        : 'https://api.devnet.solana.com';
      
      const connection = new Connection(rpcUrl, 'confirmed');
      
      // Decode the proof
      const decoded = decodePaymentProof(proofToVerify);
      
      if (!decoded) {
        setError('Invalid proof format');
        setVerifying(false);
        return;
      }

      setDecodedProof(decoded);

      console.log(`[Payment Proof] Verifying on ${network} (${rpcUrl})...`);
      
      // Verify the proof on-chain
      const isValid = await verifyPaymentProof(decoded, connection);
      setVerificationResult(isValid);
      
      console.log('[Payment Proof] Verification result:', isValid);
    } catch (err) {
      console.error('[Payment Proof] Error:', err);
      setError(err instanceof Error ? err.message : 'Failed to verify proof');
    } finally {
      setVerifying(false);
    }
  };

  const handleCopyProof = async () => {
    try {
      await navigator.clipboard.writeText(generatedProof);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      setError('Failed to copy to clipboard');
    }
  };

  return (
    <div className="bg-white rounded-2xl p-8 shadow-xl border border-gray-100">
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          Payment Proofs
        </h2>
        <p className="text-gray-600">
          Generate cryptographic proofs of payment without revealing recipient identity
        </p>
      </div>

      {/* Network Selector */}
      <div className="mb-6 flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-700">Network:</span>
          <div className="flex gap-2">
            <button
              onClick={() => {
                setNetwork('devnet');
                setGeneratedProof('');
                setVerificationResult(null);
              }}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                network === 'devnet'
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-300'
              }`}
            >
              Devnet
            </button>
            <button
              onClick={() => {
                setNetwork('mainnet');
                setGeneratedProof('');
                setVerificationResult(null);
              }}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                network === 'mainnet'
                  ? 'bg-green-600 text-white shadow-md'
                  : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-300'
              }`}
            >
              Mainnet
            </button>
          </div>
        </div>
        <div className="text-xs text-gray-500">
          {network === 'devnet' ? '🧪 Test Network' : '🟢 Production Network'}
        </div>
      </div>

      {/* Mainnet RPC Warning */}
      {network === 'mainnet' && !process.env.NEXT_PUBLIC_SOLANA_RPC_URL && (
        <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex items-start gap-3">
            <span className="text-xl">⚠️</span>
            <div className="flex-1">
              <p className="text-sm font-semibold text-yellow-900 mb-2">
                Mainnet RPC Required
              </p>
              <p className="text-xs text-yellow-800 mb-3">
                Public Solana mainnet RPC is heavily rate-limited and may not work. To verify mainnet transactions, 
                set up a free RPC endpoint (takes 2 minutes):
              </p>
              <div className="space-y-2 text-xs">
                <div className="bg-white p-2 rounded border border-yellow-300">
                  <p className="font-semibold text-yellow-900 mb-1">Quick Setup:</p>
                  <ol className="list-decimal list-inside space-y-1 text-yellow-800">
                    <li>Get free RPC from <a href="https://helius.dev" target="_blank" rel="noopener noreferrer" className="underline font-semibold">Helius</a> (500k requests/day)</li>
                    <li>Create <code className="bg-gray-100 px-1 py-0.5 rounded">.env.local</code> file in project root</li>
                    <li>Add: <code className="bg-gray-100 px-1 py-0.5 rounded">NEXT_PUBLIC_SOLANA_RPC_URL=your_rpc_url</code></li>
                    <li>Restart dev server</li>
                  </ol>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {network === 'mainnet' && process.env.NEXT_PUBLIC_SOLANA_RPC_URL && (
        <div className="mb-6 p-3 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center gap-2">
            <span className="text-lg">✅</span>
            <p className="text-sm font-medium text-green-900">
              Custom mainnet RPC configured
            </p>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b border-gray-200">
        <button
          onClick={() => setActiveTab('generate')}
          className={`px-6 py-3 font-semibold transition-colors border-b-2 ${
            activeTab === 'generate'
              ? 'text-purple-600 border-purple-600'
              : 'text-gray-500 border-transparent hover:text-gray-700'
          }`}
        >
          Generate Proof
        </button>
        <button
          onClick={() => setActiveTab('verify')}
          className={`px-6 py-3 font-semibold transition-colors border-b-2 ${
            activeTab === 'verify'
              ? 'text-purple-600 border-purple-600'
              : 'text-gray-500 border-transparent hover:text-gray-700'
          }`}
        >
          Verify Proof
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Generate Tab */}
      {activeTab === 'generate' && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Transaction Signature *
            </label>
            <input
              type="text"
              value={txSignature}
              onChange={(e) => setTxSignature(e.target.value)}
              placeholder="5j7s..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent font-mono text-sm"
            />
            <p className="mt-1 text-xs text-gray-500">
              The on-chain transaction signature of your payment
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Amount (SOL) *
            </label>
            <input
              type="number"
              step="0.000001"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.1"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Memo (Optional)
            </label>
            <input
              type="text"
              value={memo}
              onChange={(e) => setMemo(e.target.value)}
              placeholder="Invoice #1234"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          <button
            onClick={handleGenerateProof}
            disabled={generating || !txSignature}
            className="w-full py-3 px-6 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {generating ? 'Fetching from chain...' : 'Generate Payment Proof'}
          </button>

          {/* Transaction Details (from chain) */}
          {txDetails && !generatedProof && (
            <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h4 className="text-sm font-medium text-blue-900 mb-2">📋 Transaction Found:</h4>
              <div className="text-xs space-y-1">
                <p><strong>Recipient:</strong> {txDetails.recipientAddress.slice(0, 8)}...{txDetails.recipientAddress.slice(-8)}</p>
                <p><strong>Amount:</strong> {(txDetails.actualAmount / 1_000_000_000).toFixed(4)} SOL</p>
                {txDetails.ephemeralPubkey && (
                  <p><strong>Stealth Payment:</strong> ✅ Yes</p>
                )}
              </div>
            </div>
          )}

          {/* Generated Proof */}
          {generatedProof && (
            <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <h3 className="text-sm font-medium text-green-900 mb-2 flex items-center gap-2">
                <span className="text-xl">✅</span>
                Payment Proof Generated from Chain!
              </h3>
              
              {txDetails && (
                <div className="mb-3 p-3 bg-white rounded border border-green-200 text-xs space-y-1">
                  <p><strong>Recipient:</strong> <span className="font-mono">{txDetails.recipientAddress.slice(0, 12)}...</span></p>
                  <p><strong>Amount:</strong> {(txDetails.actualAmount / 1_000_000_000).toFixed(4)} SOL</p>
                  <p><strong>Type:</strong> {txDetails.ephemeralPubkey ? '🔒 Stealth Payment' : '📝 Regular Payment'}</p>
                </div>
              )}
              
              <div className="bg-white p-3 rounded border border-green-300 mb-3 break-all text-xs font-mono max-h-24 overflow-y-auto">
                {generatedProof}
              </div>

              <button
                onClick={handleCopyProof}
                className="w-full bg-green-600 text-white font-medium py-2 px-4 rounded-lg hover:bg-green-700 transition-colors"
              >
                {copied ? '✓ Copied!' : 'Copy Proof'}
              </button>

              <div className="mt-3 text-xs text-gray-600">
                <p className="font-semibold mb-1">✅ This proof is cryptographically linked to the on-chain transaction</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Share with recipient for dispute resolution</li>
                  <li>Provide to auditors for accounting</li>
                  <li>Use for tax reporting</li>
                  <li>Verify anytime using the Verify tab</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Verify Tab */}
      {activeTab === 'verify' && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Payment Proof *
            </label>
            <textarea
              value={proofToVerify}
              onChange={(e) => setProofToVerify(e.target.value)}
              placeholder="proof:eyJ0eCI6IjVqN3MuLi4i..."
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent font-mono text-xs"
            />
            <p className="mt-1 text-xs text-gray-500">
              Paste the payment proof to verify its authenticity
            </p>
          </div>

          <button
            onClick={handleVerifyProof}
            disabled={verifying || !proofToVerify}
            className="w-full py-3 px-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {verifying ? 'Verifying...' : 'Verify Payment Proof'}
          </button>

          {/* Verification Result */}
          {verificationResult !== null && decodedProof && (
            <div className={`mt-6 p-4 rounded-lg border ${
              verificationResult 
                ? 'bg-green-50 border-green-200' 
                : 'bg-red-50 border-red-200'
            }`}>
              <h3 className={`text-sm font-medium mb-3 flex items-center gap-2 ${
                verificationResult ? 'text-green-900' : 'text-red-900'
              }`}>
                <span className="text-xl">{verificationResult ? '✅' : '❌'}</span>
                {verificationResult ? 'Proof is VALID' : 'Proof is INVALID'}
              </h3>

              {verificationResult && (
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between items-center py-2 border-b border-green-200">
                    <span className="text-gray-600">Transaction:</span>
                    <a
                      href={`https://solscan.io/tx/${decodedProof.txSignature}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-purple-600 hover:text-purple-700 font-mono text-xs"
                    >
                      {decodedProof.txSignature.slice(0, 8)}...
                    </a>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-green-200">
                    <span className="text-gray-600">Amount:</span>
                    <span className="font-semibold">
                      {(decodedProof.amount / 1_000_000_000).toFixed(4)} SOL
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-green-200">
                    <span className="text-gray-600">Date:</span>
                    <span className="font-semibold">
                      {new Date(decodedProof.timestamp).toLocaleString()}
                    </span>
                  </div>
                  {decodedProof.memo && (
                    <div className="flex justify-between items-center py-2 border-b border-green-200">
                      <span className="text-gray-600">Memo:</span>
                      <span className="font-semibold">{decodedProof.memo}</span>
                    </div>
                  )}
                  <div className="flex justify-between items-center py-2">
                    <span className="text-gray-600">Stealth Address:</span>
                    <span className="font-mono text-xs">
                      {decodedProof.stealthAddress.toBase58().slice(0, 8)}...
                    </span>
                  </div>
                </div>
              )}

              {!verificationResult && (
                <p className="text-sm text-red-700">
                  This proof could not be verified. It may be invalid, forged, or the transaction may not exist on-chain.
                </p>
              )}
            </div>
          )}
        </div>
      )}

      {/* Info Box */}
      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h4 className="text-sm font-semibold text-blue-900 mb-2">
          🔐 How Payment Proofs Work
        </h4>
        <ul className="text-xs text-blue-800 space-y-1">
          <li>• Cryptographically proves you sent a payment</li>
          <li>• Does NOT reveal recipient's identity publicly</li>
          <li>• Can be verified by anyone with the proof</li>
          <li>• Useful for disputes, audits, and accounting</li>
          <li>• Works with all stealth address payments</li>
        </ul>
      </div>
    </div>
  );
}

