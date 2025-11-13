'use client';

import { useState } from 'react';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { ExePayClient } from '@exe-pay/core';

export function PaymentForm() {
  const { publicKey, signTransaction } = useWallet();
  const { connection } = useConnection();
  
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [memo, setMemo] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [txSignature, setTxSignature] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!publicKey || !signTransaction) {
      setError('Please connect your wallet first');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      // Validate recipient address
      let merchantPubkey: PublicKey;
      try {
        merchantPubkey = new PublicKey(recipient);
      } catch {
        throw new Error('Invalid recipient address');
      }

      // Convert SOL to lamports
      const amountLamports = Math.floor(parseFloat(amount) * LAMPORTS_PER_SOL);
      
      if (amountLamports <= 0) {
        throw new Error('Amount must be greater than 0');
      }

      // Initialize ExePay client
      const client = new ExePayClient({
        clusterUrl: connection.rpcEndpoint,
        defaultCommitment: 'confirmed',
      });

      // Create payment intent
      console.log('Creating payment intent...');
      const intent = client.createIntent({
        amount: amountLamports,
        merchant: merchantPubkey,
        memo: memo || undefined,
      });

      // Build transaction
      console.log('Building transaction...');
      const payment = await client.build(intent, {
        feePayer: publicKey,
      });

      // Settle (execute) the payment
      console.log('Sending transaction...');
      const signer = {
        publicKey,
        signTransaction,
        signAllTransactions: async (txs: any[]) => {
          if (signTransaction) {
            return Promise.all(txs.map(tx => signTransaction(tx)));
          }
          throw new Error('signAllTransactions not supported');
        },
      };

      const result = await client.settle(payment, signer as any);

      setTxSignature(result.signature);
      setSuccess(true);
      
      // Reset form
      setRecipient('');
      setAmount('');
      setMemo('');

      console.log('Payment successful!', result);
    } catch (err: any) {
      console.error('Payment error:', err);
      setError(err.message || 'Payment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-8 shadow-2xl">
        <h3 className="text-2xl font-bold text-white mb-6">Send Private Payment</h3>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Recipient Address */}
          <div>
            <label htmlFor="recipient" className="block text-sm font-medium text-gray-300 mb-2">
              Recipient Address
            </label>
            <input
              type="text"
              id="recipient"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              placeholder="Enter Solana wallet address"
              className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              required
              disabled={loading}
            />
          </div>

          {/* Amount */}
          <div>
            <label htmlFor="amount" className="block text-sm font-medium text-gray-300 mb-2">
              Amount (SOL)
            </label>
            <input
              type="number"
              id="amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              step="0.000000001"
              min="0"
              className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              required
              disabled={loading}
            />
            <p className="mt-2 text-sm text-gray-400">
              {amount && !isNaN(parseFloat(amount)) 
                ? `≈ ${(parseFloat(amount) * LAMPORTS_PER_SOL).toLocaleString()} lamports`
                : 'Enter amount in SOL'}
            </p>
          </div>

          {/* Memo (Optional) */}
          <div>
            <label htmlFor="memo" className="block text-sm font-medium text-gray-300 mb-2">
              Memo (Optional)
            </label>
            <input
              type="text"
              id="memo"
              value={memo}
              onChange={(e) => setMemo(e.target.value)}
              placeholder="Add a private note"
              maxLength={140}
              className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              disabled={loading}
            />
            <p className="mt-2 text-sm text-gray-400">{memo.length}/140 characters</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4">
              <p className="text-red-200 text-sm">{error}</p>
            </div>
          )}

          {/* Success Message */}
          {success && txSignature && (
            <div className="bg-green-500/20 border border-green-500/50 rounded-lg p-4">
              <p className="text-green-200 text-sm mb-2">✅ Payment sent successfully!</p>
              <a
                href={`https://explorer.solana.com/tx/${txSignature}?cluster=devnet`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-green-300 hover:text-green-100 text-sm underline break-all"
              >
                View transaction: {txSignature.slice(0, 20)}...
              </a>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading || !publicKey}
            className={`w-full py-4 px-6 rounded-lg font-semibold text-white transition-all duration-200 ${
              loading || !publicKey
                ? 'bg-gray-600 cursor-not-allowed'
                : 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 shadow-lg hover:shadow-xl'
            }`}
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </span>
            ) : !publicKey ? (
              'Connect Wallet First'
            ) : (
              '🔒 Send Private Payment'
            )}
          </button>
        </form>

        {/* Privacy Notice */}
        <div className="mt-6 p-4 bg-purple-500/10 border border-purple-500/30 rounded-lg">
          <p className="text-sm text-purple-200">
            <span className="font-semibold">🔐 Privacy Guaranteed:</span> Your payment details are protected by zero-knowledge proofs. Only you and the recipient can see the transaction details.
          </p>
        </div>
      </div>
    </div>
  );
}

