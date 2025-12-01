'use client';

import { useState } from 'react';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { PublicKey, Transaction, SystemProgram, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { 
  decodeStealthMetaAddress, 
  decodeIntegratedAddress,
  generateStealthAddress,
  type StealthAddress 
} from '@exe-pay/privacy';
import { PrivacyModeSelector, type PrivacyMode } from './PrivacyModeSelector';

export function StealthPaymentForm() {
  const { publicKey, signTransaction } = useWallet();
  const { connection } = useConnection();
  
  const [stealthMetaAddress, setStealthMetaAddress] = useState('');
  const [amount, setAmount] = useState('');
  const [memo, setMemo] = useState('');
  const [privacyMode, setPrivacyMode] = useState<PrivacyMode>('stealth');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [generatedAddress, setGeneratedAddress] = useState<StealthAddress | null>(null);
  const [txSignature, setTxSignature] = useState('');
  const [copiedAddress, setCopiedAddress] = useState(false);

  const [paymentId, setPaymentId] = useState<string | null>(null);

  const handleGenerateAddress = () => {
    try {
      setError('');
      setGeneratedAddress(null);
      setCopiedAddress(false);
      setPaymentId(null);

      // Validate stealth meta-address
      if (!stealthMetaAddress.trim()) {
        throw new Error('Please enter a stealth meta-address');
      }

      // Try to decode as integrated address first
      const integratedAddress = decodeIntegratedAddress(stealthMetaAddress.trim());
      
      let metaAddress;
      if (integratedAddress) {
        // It's an integrated address - extract payment ID
        metaAddress = integratedAddress.metaAddress;
        setPaymentId(integratedAddress.paymentId);
        console.log('[Stealth Payment] Integrated address detected, payment ID:', integratedAddress.paymentId);
      } else {
        // Try regular stealth meta-address
        metaAddress = decodeStealthMetaAddress(stealthMetaAddress.trim());
        if (!metaAddress) {
          throw new Error('Invalid stealth meta-address format');
        }
      }

      // Generate one-time stealth address
      const stealth = generateStealthAddress(metaAddress);
      setGeneratedAddress(stealth);

      console.log('[Stealth Payment] Generated one-time address:', stealth.address.toBase58());
      console.log('[Stealth Payment] Ephemeral pubkey:', stealth.ephemeralPubkey.toBase58());
      console.log('[Stealth Payment] View tag:', stealth.viewTag);

    } catch (err: any) {
      console.error('[Stealth Payment] Error:', err);
      setError(err.message || 'Failed to generate stealth address');
    }
  };

  const handleCopyAddress = async () => {
    if (generatedAddress) {
      await navigator.clipboard.writeText(generatedAddress.address.toBase58());
      setCopiedAddress(true);
      setTimeout(() => setCopiedAddress(false), 2000);
    }
  };

  const handleSend = async () => {
    if (!publicKey || !signTransaction) {
      setError('Please connect your wallet');
      return;
    }

    if (!generatedAddress) {
      setError('Please generate a stealth address first');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess(false);
    setTxSignature('');

    try {
      // Validate amount
      const amountValue = parseFloat(amount);
      if (isNaN(amountValue) || amountValue <= 0) {
        throw new Error('Amount must be greater than 0');
      }

      const lamports = Math.floor(amountValue * LAMPORTS_PER_SOL);

      // Create transaction to one-time address
      const transaction = new Transaction();

      // Add transfer instruction
      transaction.add(
        SystemProgram.transfer({
          fromPubkey: publicKey,
          toPubkey: generatedAddress.address,
          lamports,
        })
      );

      // Add memo with ephemeral key for recipient to detect payment
      // Format: "ExePay:Stealth:<ephemeral_pubkey>:<view_tag>" OR
      //         "ExePay:Stealth:<ephemeral_pubkey>:<view_tag>:<payment_id>" for integrated addresses
      const stealthMemo = paymentId 
        ? `ExePay:Stealth:${generatedAddress.ephemeralPubkey.toBase58()}:${generatedAddress.viewTag}:${paymentId}`
        : `ExePay:Stealth:${generatedAddress.ephemeralPubkey.toBase58()}:${generatedAddress.viewTag}`;
      
      console.log('[Stealth Payment] Memo:', stealthMemo);
      
      // Import memo program dynamically
      const { TransactionInstruction } = await import('@solana/web3.js');
      const MEMO_PROGRAM_ID = new PublicKey('MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr');
      
      transaction.add(
        new TransactionInstruction({
          keys: [],
          programId: MEMO_PROGRAM_ID,
          data: Buffer.from(stealthMemo, 'utf-8'),
        })
      );

      // Add memo with ephemeral public key (for recipient to scan)
      // In production, this would be stored in a custom program or memo
      const memoData = JSON.stringify({
        type: 'stealth_payment',
        ephemeralPubkey: generatedAddress.ephemeralPubkey.toBase58(),
        viewTag: generatedAddress.viewTag,
        memo: memo || undefined
      });

      // Add memo instruction (simplified - in production use proper memo program)
      transaction.add(
        SystemProgram.transfer({
          fromPubkey: publicKey,
          toPubkey: publicKey,
          lamports: 0, // Zero lamport transfer with memo
        })
      );

      // Get recent blockhash
      const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash();
      transaction.recentBlockhash = blockhash;
      transaction.feePayer = publicKey;

      // Sign transaction
      const signed = await signTransaction(transaction);

      // Send transaction
      const signature = await connection.sendRawTransaction(signed.serialize());

      // Confirm transaction
      await connection.confirmTransaction({
        signature,
        blockhash,
        lastValidBlockHeight
      });

      setSuccess(true);
      setTxSignature(signature);
      setAmount('');
      setMemo('');
      setGeneratedAddress(null);

      console.log('[Stealth Payment] Transaction successful:', signature);

    } catch (err: any) {
      console.error('[Stealth Payment] Transaction failed:', err);
      setError(err.message || 'Transaction failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Main Form */}
      <div className="bg-white rounded-2xl p-8 shadow-xl border border-gray-200">
        <div className="flex items-start gap-4 mb-6">
          <div className="text-4xl">🔒</div>
          <div className="flex-1">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              Send Private Payment
            </h3>
            <p className="text-gray-600">
              Send to a stealth address. Each payment uses a unique one-time address.
            </p>
          </div>
        </div>

        <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="space-y-6">
          {/* Stealth Meta-Address Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Recipient's Stealth Meta-Address
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={stealthMetaAddress}
                onChange={(e) => setStealthMetaAddress(e.target.value)}
                placeholder="stealth:ABC123...:XYZ789..."
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent font-mono text-sm"
                disabled={loading}
              />
              <button
                type="button"
                onClick={handleGenerateAddress}
                disabled={loading || !stealthMetaAddress.trim()}
                className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                Generate
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Paste the recipient's stealth meta-address and click Generate
            </p>
          </div>

          {/* Generated One-Time Address */}
          {generatedAddress && (
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 border border-green-200">
              <h4 className="font-semibold text-green-900 mb-3 flex items-center gap-2">
                <span className="text-xl">✓</span>
                One-Time Address Generated
              </h4>
              <div className="space-y-3 text-sm">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-green-700 font-medium">One-Time Address:</span>
                    <button
                      type="button"
                      onClick={handleCopyAddress}
                      className={`
                        px-3 py-1 rounded-lg text-xs font-semibold transition-all
                        ${copiedAddress 
                          ? 'bg-green-600 text-white' 
                          : 'bg-green-200 text-green-800 hover:bg-green-300'
                        }
                      `}
                    >
                      {copiedAddress ? '✓ Copied!' : 'Copy Address'}
                    </button>
                  </div>
                  <p className="font-mono text-green-900 break-all bg-white rounded-lg p-3 border border-green-200">
                    {generatedAddress.address.toBase58()}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <div>
                    <span className="text-green-700 font-medium">View Tag:</span>
                    <span className="font-mono text-green-900 ml-2 bg-white px-2 py-1 rounded">
                      {generatedAddress.viewTag}
                    </span>
                  </div>
                  <div className="flex-1">
                    <span className="text-green-700 font-medium">Ephemeral Key:</span>
                    <p className="font-mono text-xs text-green-800 truncate">
                      {generatedAddress.ephemeralPubkey.toBase58().slice(0, 20)}...
                    </p>
                  </div>
                </div>
                <p className="text-green-700 text-xs mt-2 bg-green-100 rounded-lg p-2">
                  ✓ This unique address will be used for this payment only. Each payment generates a different address.
                </p>
              </div>
            </div>
          )}

          {/* Amount Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Amount (SOL)
            </label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.0"
              step="0.001"
              min="0"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              disabled={loading || !generatedAddress}
              required
            />
          </div>

          {/* Memo Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Memo (Optional)
            </label>
            <input
              type="text"
              value={memo}
              onChange={(e) => setMemo(e.target.value)}
              placeholder="Payment description..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              disabled={loading || !generatedAddress}
            />
          </div>

          {/* Privacy Mode Selector */}
          <div>
            <PrivacyModeSelector
              value={privacyMode}
              onChange={setPrivacyMode}
              amount={parseFloat(amount) || 0}
              showExplanation={false}
            />
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-800 text-sm">{error}</p>
            </div>
          )}

          {/* Success Message */}
          {success && txSignature && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="text-green-800 font-semibold mb-2">✓ Payment Sent Successfully!</p>
              <p className="text-green-700 text-sm mb-2">
                Transaction Signature:
              </p>
              <p className="font-mono text-xs text-green-900 break-all bg-white rounded p-2">
                {txSignature}
              </p>
              <a
                href={`https://explorer.solana.com/tx/${txSignature}${
                  process.env.NEXT_PUBLIC_SOLANA_NETWORK === 'devnet' ? '?cluster=devnet' : ''
                }`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-green-600 hover:text-green-700 text-sm font-medium mt-2 inline-block"
              >
                View on Explorer →
              </a>
            </div>
          )}

          {/* Send Button */}
          <button
            type="submit"
            disabled={loading || !generatedAddress || !amount || !publicKey}
            className="w-full px-6 py-4 bg-gradient-to-br from-purple-600 via-pink-600 to-rose-600 text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 text-lg shadow-lg hover:shadow-2xl hover:scale-[1.02] flex items-center justify-center gap-3 group relative overflow-hidden"
            style={{ borderRadius: '1.5rem 0.5rem 1.5rem 0.5rem' }}
          >
            <span className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></span>
            <svg className="w-5 h-5 transition-transform duration-300 group-hover:rotate-12 relative z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
            <span className="relative z-10">{loading ? 'Sending...' : 'Send Private Payment'}</span>
          </button>
        </form>
      </div>

      {/* How It Works */}
      <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-6 border border-indigo-200">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">
          How Private Payments Work
        </h4>
        <div className="space-y-3 text-sm text-gray-700">
          <div className="flex gap-3">
            <span className="text-2xl">1️⃣</span>
            <div>
              <strong>Generate One-Time Address:</strong> We create a unique address from the recipient's stealth meta-address
            </div>
          </div>
          <div className="flex gap-3">
            <span className="text-2xl">2️⃣</span>
            <div>
              <strong>Send Payment:</strong> Payment goes to the one-time address (looks random to observers)
            </div>
          </div>
          <div className="flex gap-3">
            <span className="text-2xl">3️⃣</span>
            <div>
              <strong>Store Ephemeral Key:</strong> We store the ephemeral public key on-chain for recipient to scan
            </div>
          </div>
          <div className="flex gap-3">
            <span className="text-2xl">4️⃣</span>
            <div>
              <strong>Recipient Detects:</strong> Recipient scans blockchain and detects payment meant for them
            </div>
          </div>
          <div className="flex gap-3">
            <span className="text-2xl">5️⃣</span>
            <div>
              <strong>Recipient Spends:</strong> Recipient derives private key and spends the funds
            </div>
          </div>
        </div>
      </div>

      {/* Privacy Benefits */}
      <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
        <h4 className="font-semibold text-gray-900 mb-3">Privacy Benefits</h4>
        <div className="grid md:grid-cols-2 gap-4 text-sm">
          <div className="flex items-start gap-2">
            <span className="text-green-500 text-lg">✓</span>
            <span className="text-gray-700">Recipient address hidden</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-green-500 text-lg">✓</span>
            <span className="text-gray-700">Unique address per payment</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-green-500 text-lg">✓</span>
            <span className="text-gray-700">Cannot link to recipient</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-green-500 text-lg">✓</span>
            <span className="text-gray-700">Battle-tested cryptography</span>
          </div>
        </div>
      </div>
    </div>
  );
}

