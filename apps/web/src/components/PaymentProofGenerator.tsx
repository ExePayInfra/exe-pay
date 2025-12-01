'use client';

import { useState } from 'react';
import { useConnection } from '@solana/wallet-adapter-react';
import { 
  generatePaymentProof, 
  verifyPaymentProof, 
  encodePaymentProof, 
  decodePaymentProof,
  PaymentProof,
  StealthAddress
} from '@exe-pay/privacy';
import { PublicKey } from '@solana/web3.js';

export function PaymentProofGenerator() {
  const { connection } = useConnection();
  const [activeTab, setActiveTab] = useState<'generate' | 'verify'>('generate');
  
  // Generate tab state
  const [txSignature, setTxSignature] = useState('');
  const [amount, setAmount] = useState('');
  const [memo, setMemo] = useState('');
  const [generatedProof, setGeneratedProof] = useState<string>('');
  const [generating, setGenerating] = useState(false);
  
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
    
    if (!txSignature || !amount) {
      setError('Transaction signature and amount are required');
      return;
    }

    setGenerating(true);

    try {
      // In a real scenario, this would come from the actual payment flow
      // For demo, we'll create a mock proof
      // Note: In production, the ephemeral private key would be stored during payment
      
      const mockEphemeralPrivateKey = new Uint8Array(32);
      crypto.getRandomValues(mockEphemeralPrivateKey);
      
      const mockStealthAddress: StealthAddress = {
        address: new PublicKey('11111111111111111111111111111111'),
        ephemeralPubkey: new PublicKey('11111111111111111111111111111111'),
        viewTag: 0,
      };

      const proof = generatePaymentProof(
        mockStealthAddress,
        mockEphemeralPrivateKey,
        txSignature,
        parseFloat(amount) * 1_000_000_000, // Convert SOL to lamports
        memo || undefined
      );

      const encodedProof = encodePaymentProof(proof);
      setGeneratedProof(encodedProof);
      
      console.log('[Payment Proof] Generated proof:', encodedProof);
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
      // Decode the proof
      const decoded = decodePaymentProof(proofToVerify);
      
      if (!decoded) {
        setError('Invalid proof format');
        setVerifying(false);
        return;
      }

      setDecodedProof(decoded);

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
            disabled={generating || !txSignature || !amount}
            className="w-full py-3 px-6 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {generating ? 'Generating...' : 'Generate Payment Proof'}
          </button>

          {/* Generated Proof */}
          {generatedProof && (
            <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <h3 className="text-sm font-medium text-green-900 mb-2 flex items-center gap-2">
                <span className="text-xl">✅</span>
                Payment Proof Generated!
              </h3>
              
              <div className="bg-white p-3 rounded border border-green-300 mb-3 break-all text-xs font-mono">
                {generatedProof}
              </div>

              <button
                onClick={handleCopyProof}
                className="w-full bg-green-600 text-white font-medium py-2 px-4 rounded-lg hover:bg-green-700 transition-colors"
              >
                {copied ? '✓ Copied!' : 'Copy Proof'}
              </button>

              <div className="mt-3 text-xs text-gray-600">
                <p className="font-semibold mb-1">What can you do with this proof?</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Share with recipient for dispute resolution</li>
                  <li>Provide to auditors for accounting</li>
                  <li>Use for tax reporting</li>
                  <li>Prove payment without revealing recipient identity</li>
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

