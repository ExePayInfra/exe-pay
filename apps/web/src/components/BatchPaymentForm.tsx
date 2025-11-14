'use client';

import { useState } from 'react';
import { PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js';

interface Recipient {
  id: string;
  address: string;
  amount: string;
  memo?: string;
}

export function BatchPaymentForm() {
  const [recipients, setRecipients] = useState<Recipient[]>([
    { id: '1', address: '', amount: '', memo: '' }
  ]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const addRecipient = () => {
    const newId = (recipients.length + 1).toString();
    setRecipients([...recipients, { id: newId, address: '', amount: '', memo: '' }]);
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
    
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      if (!validateRecipients()) {
        setLoading(false);
        return;
      }

      // Demo mode - just show what would happen
      await new Promise(resolve => setTimeout(resolve, 1500));

      setSuccess(true);
      setError('');
      
      console.log('Batch payment demo:', {
        recipients: recipients.map(r => ({
          address: r.address,
          amount: parseFloat(r.amount) * LAMPORTS_PER_SOL,
          memo: r.memo
        })),
        total: calculateTotal() * LAMPORTS_PER_SOL
      });
    } catch (err: any) {
      console.error('Batch payment error:', err);
      setError(err.message || 'Batch payment failed');
    } finally {
      setLoading(false);
    }
  };

  const total = calculateTotal();

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-8 shadow-2xl">
        <h3 className="text-2xl font-bold text-white mb-6">Batch Payment</h3>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Recipients */}
          <div className="space-y-4">
            {recipients.map((recipient, index) => (
              <div key={recipient.id} className="bg-white/5 border border-white/10 rounded-xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-lg font-semibold text-white">Recipient {index + 1}</h4>
                  {recipients.length > 1 && (
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
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Wallet Address
                    </label>
                    <input
                      type="text"
                      value={recipient.address}
                      onChange={(e) => updateRecipient(recipient.id, 'address', e.target.value)}
                      placeholder="Enter Solana wallet address"
                      className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                      required
                      disabled={loading}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Amount (SOL)
                    </label>
                    <input
                      type="number"
                      value={recipient.amount}
                      onChange={(e) => updateRecipient(recipient.id, 'amount', e.target.value)}
                      placeholder="0.00"
                      step="0.000000001"
                      min="0"
                      className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                      required
                      disabled={loading}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Memo (Optional)
                    </label>
                    <input
                      type="text"
                      value={recipient.memo}
                      onChange={(e) => updateRecipient(recipient.id, 'memo', e.target.value)}
                      placeholder="Payment note"
                      maxLength={50}
                      className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                      disabled={loading}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Add Recipient Button */}
          <button
            type="button"
            onClick={addRecipient}
            disabled={loading || recipients.length >= 100}
            className="w-full py-3 px-6 rounded-lg font-medium text-purple-300 bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/30 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Add Recipient {recipients.length >= 100 && '(Max 100)'}
          </button>

          {/* Summary */}
          <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4">
            <div className="flex justify-between items-center text-white">
              <span className="font-semibold">Total Amount:</span>
              <span className="text-2xl font-bold">{total.toFixed(6)} SOL</span>
            </div>
            <div className="flex justify-between items-center text-purple-200 text-sm mt-2">
              <span>Recipients:</span>
              <span>{recipients.length}</span>
            </div>
            <div className="flex justify-between items-center text-purple-200 text-sm mt-1">
              <span>Estimated Fee:</span>
              <span>~{(recipients.length * 0.000005).toFixed(6)} SOL</span>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4">
              <p className="text-red-200 text-sm">{error}</p>
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div className="bg-green-500/20 border border-green-500/50 rounded-lg p-4">
              <p className="text-green-200 text-sm">
                ✅ Demo: Would send {total.toFixed(6)} SOL to {recipients.length} recipients!
              </p>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading || recipients.length === 0}
            className="w-full py-4 px-6 rounded-lg font-semibold text-white bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></span>
                Processing...
              </span>
            ) : (
              `🔒 Preview Batch Payment (Demo)`
            )}
          </button>
        </form>

        {/* Info */}
        <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
          <p className="text-sm text-blue-200">
            <span className="font-semibold">📘 Demo Mode:</span> This is a preview. Connect your wallet to send real batch payments. You can send to up to 100 recipients in a single transaction!
          </p>
        </div>
      </div>
    </div>
  );
}

