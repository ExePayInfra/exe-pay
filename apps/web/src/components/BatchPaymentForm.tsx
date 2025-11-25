'use client';

import { useState, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { Connection, PublicKey, Transaction, SystemProgram, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { getAssociatedTokenAddress, createTransferInstruction, TOKEN_PROGRAM_ID } from '@solana/spl-token';
import { getTokens, parseTokenAmount, type Token } from '@/lib/tokens';
import { SecureWalletConnect } from './SecureWalletConnect';

interface Recipient {
  id: string;
  address: string;
  amount: string;
  memo?: string;
  status?: 'pending' | 'sending' | 'success' | 'error';
  signature?: string;
  errorMessage?: string;
}

export function BatchPaymentForm() {
  const { publicKey, signTransaction, connected } = useWallet();
  const [mounted, setMounted] = useState(false);
  const [recipients, setRecipients] = useState<Recipient[]>([
    { id: '1', address: '', amount: '', memo: '', status: 'pending' }
  ]);
  const [selectedToken, setSelectedToken] = useState<Token | null>(null);
  const [tokens, setTokens] = useState<Token[]>([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  
  useEffect(() => {
    setMounted(true);
    
    // Load tokens based on network
    const network = (process.env.NEXT_PUBLIC_SOLANA_NETWORK || 'mainnet-beta') as 'mainnet-beta' | 'devnet';
    const availableTokens = getTokens(network);
    setTokens(availableTokens);
    setSelectedToken(availableTokens[0]); // Default to SOL
  }, []);

  const addRecipient = () => {
    const newId = (recipients.length + 1).toString();
    setRecipients([...recipients, { id: newId, address: '', amount: '', memo: '', status: 'pending' }]);
  };

  const removeRecipient = (id: string) => {
    if (recipients.length > 1) {
      setRecipients(recipients.filter(r => r.id !== id));
    }
  };

  const updateRecipient = (id: string, field: keyof Recipient, value: string) => {
    setRecipients(recipients.map(r => 
      r.id === id ? { ...r, [field]: value } : r
    ));
  };

  const calculateTotal = () => {
    return recipients.reduce((sum, r) => {
      const amount = parseFloat(r.amount) || 0;
      return sum + amount;
    }, 0);
  };

  const validateRecipients = (): boolean => {
    for (const recipient of recipients) {
      if (!recipient.address.trim()) {
        setError('All recipients must have an address');
        return false;
      }

      try {
        new PublicKey(recipient.address.trim());
      } catch {
        setError(`Invalid address for recipient ${recipient.id}`);
        return false;
      }

      const amount = parseFloat(recipient.amount);
      if (isNaN(amount) || amount <= 0) {
        setError(`Invalid amount for recipient ${recipient.id}`);
        return false;
      }
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!publicKey) {
      setError('Please connect your wallet first');
      return;
    }

    if (!signTransaction) {
      setError('Wallet does not support signing');
      return;
    }

    if (!selectedToken) {
      setError('Please select a token');
      return;
    }
    
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      if (!validateRecipients()) {
        setLoading(false);
        return;
      }

      const rpcUrl = process.env.NEXT_PUBLIC_SOLANA_RPC_URL || 'https://api.mainnet-beta.solana.com';
      const connection = new Connection(rpcUrl, 'confirmed');
      const senderPubkey = publicKey;

      let successCount = 0;
      let failCount = 0;

      // Send to each recipient sequentially
      for (let i = 0; i < recipients.length; i++) {
        const recipient = recipients[i];
        
        // Update status to sending
        setRecipients(prev => prev.map(r => 
          r.id === recipient.id ? { ...r, status: 'sending' as const } : r
        ));

        try {
          const recipientPubkey = new PublicKey(recipient.address.trim());
          let transaction: Transaction;

          // Handle native SOL vs SPL tokens
          if (selectedToken.mint === 'native') {
            const lamports = Math.floor(parseFloat(recipient.amount) * LAMPORTS_PER_SOL);
            transaction = new Transaction().add(
              SystemProgram.transfer({
                fromPubkey: senderPubkey,
                toPubkey: recipientPubkey,
                lamports,
              })
            );
          } else {
            const tokenAmount = parseTokenAmount(recipient.amount, selectedToken.decimals);
            const mintPubkey = new PublicKey(selectedToken.mint);

            const senderTokenAccount = await getAssociatedTokenAddress(mintPubkey, senderPubkey);
            const recipientTokenAccount = await getAssociatedTokenAddress(mintPubkey, recipientPubkey);

            transaction = new Transaction().add(
              createTransferInstruction(
                senderTokenAccount,
                recipientTokenAccount,
                senderPubkey,
                tokenAmount,
                [],
                TOKEN_PROGRAM_ID
              )
            );
          }

          const { blockhash } = await connection.getLatestBlockhash();
          transaction.recentBlockhash = blockhash;
          transaction.feePayer = senderPubkey;

          const signed = await signTransaction(transaction);
          const signature = await connection.sendRawTransaction(signed.serialize());
          await connection.confirmTransaction(signature, 'confirmed');

          // Update status to success
          setRecipients(prev => prev.map(r => 
            r.id === recipient.id ? { 
              ...r, 
              status: 'success' as const, 
              signature: signature 
            } : r
          ));

          successCount++;
        } catch (err: any) {
          console.error(`Failed to send to recipient ${recipient.id}:`, err);
          
          // Update status to error
          setRecipients(prev => prev.map(r => 
            r.id === recipient.id ? { 
              ...r, 
              status: 'error' as const, 
              errorMessage: err.message || 'Transfer failed' 
            } : r
          ));

          failCount++;
        }

        // Small delay between transactions
        if (i < recipients.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 500));
        }
      }

      if (successCount === recipients.length) {
        setSuccess(true);
        setError('');
      } else if (successCount > 0) {
        setError(`Completed ${successCount}/${recipients.length} transfers. ${failCount} failed.`);
      } else {
        setError('All transfers failed. Please check your balance and try again.');
      }
      
    } catch (err: any) {
      console.error('Batch payment error:', err);
      setError(err.message || 'Batch payment failed');
    } finally {
      setLoading(false);
    }
  };

  const total = calculateTotal();

  if (!mounted) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-8 text-center">
          <p className="text-white">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Wallet Connection - Using Shared Secure Component */}
      {!connected ? (
        <SecureWalletConnect />
      ) : (
        <div className="bg-white rounded-2xl p-8 shadow-2xl border border-gray-200">
          {/* Wallet Connected Header */}
          <SecureWalletConnect showHeader={true} />

          <h3 className="text-2xl font-bold text-gray-900 mb-6">Batch Payment</h3>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Token Selector */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Select Token
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {tokens.map((token) => (
                  <button
                    key={token.symbol}
                    type="button"
                    onClick={() => setSelectedToken(token)}
                    disabled={loading}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      selectedToken?.symbol === token.symbol
                        ? 'border-indigo-500 bg-indigo-50'
                        : 'border-gray-200 bg-white hover:border-indigo-300'
                    } disabled:opacity-50`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{token.logo}</span>
                      <div className="text-left">
                        <p className="text-gray-900 font-semibold">{token.symbol}</p>
                        <p className="text-xs text-gray-600">{token.name}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          {/* Recipients */}
          <div className="space-y-4">
            {recipients.map((recipient, index) => (
              <div key={recipient.id} className={`border rounded-xl p-4 transition-all ${
                recipient.status === 'success' ? 'border-green-500 bg-green-50' :
                recipient.status === 'error' ? 'border-red-500 bg-red-50' :
                recipient.status === 'sending' ? 'border-indigo-500 bg-indigo-50' :
                'border-gray-200 bg-gray-50'
              }`}>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <h4 className="text-lg font-semibold text-gray-900">Recipient {index + 1}</h4>
                    {recipient.status === 'sending' && (
                      <span className="flex items-center gap-1 text-indigo-600 text-sm">
                        <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-indigo-600"></span>
                        Sending...
                      </span>
                    )}
                    {recipient.status === 'success' && (
                      <span className="flex items-center gap-1 text-green-600 text-sm">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        Success
                      </span>
                    )}
                    {recipient.status === 'error' && (
                      <span className="flex items-center gap-1 text-red-600 text-sm">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                        Failed
                      </span>
                    )}
                  </div>
                  {recipients.length > 1 && !loading && (
                    <button
                      type="button"
                      onClick={() => removeRecipient(recipient.id)}
                      className="text-red-400 hover:text-red-300 transition-colors"
                    >
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Wallet Address
                    </label>
                    <input
                      type="text"
                      value={recipient.address}
                      onChange={(e) => updateRecipient(recipient.id, 'address', e.target.value)}
                      placeholder="Enter Solana wallet address"
                      autoComplete="off"
                      className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all font-mono text-sm"
                      required
                      disabled={loading}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Amount ({selectedToken?.symbol || 'SOL'})
                    </label>
                    <input
                      type="number"
                      value={recipient.amount}
                      onChange={(e) => updateRecipient(recipient.id, 'amount', e.target.value)}
                      placeholder="0.00"
                      step="0.000000001"
                      min="0"
                      autoComplete="off"
                      className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                      required
                      disabled={loading}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Memo (Optional)
                    </label>
                    <input
                      type="text"
                      value={recipient.memo || ''}
                      onChange={(e) => updateRecipient(recipient.id, 'memo', e.target.value)}
                      placeholder="Payment note"
                      maxLength={50}
                      autoComplete="off"
                      className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                      disabled={loading}
                    />
                  </div>
                </div>

                {/* Success/Error Messages */}
                {recipient.signature && (
                  <div className="mt-3 p-2 bg-green-100 border border-green-300 rounded text-sm">
                    <a
                      href={`https://solscan.io/tx/${recipient.signature}${process.env.NEXT_PUBLIC_SOLANA_NETWORK === 'devnet' ? '?cluster=devnet' : ''}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-green-700 hover:text-green-800 underline font-medium"
                    >
                      View on Solscan →
                    </a>
                  </div>
                )}
                {recipient.errorMessage && (
                  <div className="mt-3 p-2 bg-red-100 border border-red-300 rounded text-sm text-red-700 font-medium">
                    {recipient.errorMessage}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Add Recipient Button */}
          <button
            type="button"
            onClick={addRecipient}
            disabled={loading || recipients.length >= 100}
            className="w-full py-3 px-6 rounded-lg font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 border-2 border-indigo-200 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Add Recipient {recipients.length >= 100 && '(Max 100)'}
          </button>

          {/* Summary */}
          <div className="bg-indigo-50 border-2 border-indigo-200 rounded-lg p-4">
            <div className="flex justify-between items-center text-gray-900">
              <span className="font-semibold">Total Amount:</span>
              <span className="text-2xl font-bold text-indigo-600">{total.toFixed(6)} {selectedToken?.symbol || 'SOL'}</span>
            </div>
            <div className="flex justify-between items-center text-gray-700 text-sm mt-2">
              <span>Recipients:</span>
              <span className="font-semibold">{recipients.length}</span>
            </div>
            <div className="flex justify-between items-center text-gray-700 text-sm mt-1">
              <span>Estimated Fee:</span>
              <span className="font-semibold">~{(recipients.length * 0.000005).toFixed(6)} SOL</span>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4">
              <p className="text-red-700 text-sm font-medium">{error}</p>
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4">
              <p className="text-green-700 text-sm font-medium">
                ✅ Successfully sent {total.toFixed(6)} {selectedToken?.symbol || 'SOL'} to {recipients.length} recipients!
              </p>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading || recipients.length === 0}
            className="w-full py-4 px-6 rounded-lg font-semibold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></span>
                Sending to {recipients.length} recipients...
              </span>
            ) : (
              `🚀 Send Batch Payment`
            )}
          </button>
        </form>

        {/* Info */}
        <div className="mt-6 p-4 bg-indigo-50 border-2 border-indigo-200 rounded-lg">
          <p className="text-sm text-gray-700">
            <span className="font-semibold text-indigo-600">💡 Batch Payments:</span> Send to up to 100 recipients. Each transfer is sent sequentially with real-time status updates. Transactions are confirmed on Solana {process.env.NEXT_PUBLIC_SOLANA_NETWORK === 'devnet' ? 'Devnet' : 'Mainnet'}.
          </p>
        </div>
        </div>
      )}
    </div>
  );
}

