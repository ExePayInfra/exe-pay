'use client';

import { useState } from 'react';
import { PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js';

type Interval = 'daily' | 'weekly' | 'monthly';

export function RecurringPaymentForm() {
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [interval, setInterval] = useState<Interval>('monthly');
  const [maxPayments, setMaxPayments] = useState('12');
  const [memo, setMemo] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const getNextPaymentDate = () => {
    const now = new Date();
    switch (interval) {
      case 'daily':
        now.setDate(now.getDate() + 1);
        break;
      case 'weekly':
        now.setDate(now.getDate() + 7);
        break;
      case 'monthly':
        now.setMonth(now.getMonth() + 1);
        break;
    }
    return now.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const getEndDate = () => {
    const now = new Date();
    const payments = parseInt(maxPayments) || 1;
    
    switch (interval) {
      case 'daily':
        now.setDate(now.getDate() + payments);
        break;
      case 'weekly':
        now.setDate(now.getDate() + (payments * 7));
        break;
      case 'monthly':
        now.setMonth(now.getMonth() + payments);
        break;
    }
    return now.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const getTotalAmount = () => {
    const amt = parseFloat(amount) || 0;
    const payments = parseInt(maxPayments) || 0;
    return amt * payments;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      // Validate recipient address
      if (!recipient.trim()) {
        throw new Error('Recipient address is required');
      }

      try {
        new PublicKey(recipient.trim());
      } catch {
        throw new Error('Invalid recipient address');
      }

      // Validate amount
      const amountValue = parseFloat(amount);
      if (isNaN(amountValue) || amountValue <= 0) {
        throw new Error('Amount must be greater than 0');
      }

      // Validate max payments
      const paymentsValue = parseInt(maxPayments);
      if (isNaN(paymentsValue) || paymentsValue < 1 || paymentsValue > 365) {
        throw new Error('Max payments must be between 1 and 365');
      }

      // Demo mode - just show what would happen
      await new Promise(resolve => setTimeout(resolve, 1500));

      setSuccess(true);
      setError('');
      
      console.log('Recurring payment demo:', {
        recipient,
        amount: amountValue * LAMPORTS_PER_SOL,
        interval,
        maxPayments: paymentsValue,
        memo,
        totalAmount: getTotalAmount() * LAMPORTS_PER_SOL,
        nextPayment: getNextPaymentDate(),
        endDate: getEndDate()
      });
    } catch (err: any) {
      console.error('Recurring payment error:', err);
      setError(err.message || 'Failed to create recurring payment');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-8 shadow-2xl">
        <h3 className="text-2xl font-bold text-white mb-6">Recurring Payment</h3>
        
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
              Amount per Payment (SOL)
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
            {amount && !isNaN(parseFloat(amount)) && (
              <p className="mt-2 text-sm text-gray-400">
                ≈ {(parseFloat(amount) * LAMPORTS_PER_SOL).toLocaleString()} lamports
              </p>
            )}
          </div>

          {/* Interval */}
          <div>
            <label htmlFor="interval" className="block text-sm font-medium text-gray-300 mb-2">
              Payment Frequency
            </label>
            <select
              id="interval"
              value={interval}
              onChange={(e) => setInterval(e.target.value as Interval)}
              className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              disabled={loading}
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </select>
          </div>

          {/* Max Payments */}
          <div>
            <label htmlFor="maxPayments" className="block text-sm font-medium text-gray-300 mb-2">
              Number of Payments
            </label>
            <input
              type="number"
              id="maxPayments"
              value={maxPayments}
              onChange={(e) => setMaxPayments(e.target.value)}
              placeholder="12"
              min="1"
              max="365"
              className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              required
              disabled={loading}
            />
            <p className="mt-2 text-sm text-gray-400">
              Maximum: 365 payments
            </p>
          </div>

          {/* Memo */}
          <div>
            <label htmlFor="memo" className="block text-sm font-medium text-gray-300 mb-2">
              Memo (Optional)
            </label>
            <input
              type="text"
              id="memo"
              value={memo}
              onChange={(e) => setMemo(e.target.value)}
              placeholder="Subscription, Salary, etc."
              maxLength={140}
              className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              disabled={loading}
            />
            <p className="mt-2 text-sm text-gray-400">{memo.length}/140 characters</p>
          </div>

          {/* Schedule Preview */}
          {amount && maxPayments && (
            <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4 space-y-2">
              <h4 className="font-semibold text-purple-200 mb-3">Payment Schedule</h4>
              <div className="flex justify-between text-sm">
                <span className="text-purple-300">Frequency:</span>
                <span className="text-white font-medium capitalize">{interval}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-purple-300">Next Payment:</span>
                <span className="text-white font-medium">{getNextPaymentDate()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-purple-300">Final Payment:</span>
                <span className="text-white font-medium">{getEndDate()}</span>
              </div>
              <div className="border-t border-purple-500/30 mt-3 pt-3">
                <div className="flex justify-between">
                  <span className="text-purple-200 font-semibold">Total Amount:</span>
                  <span className="text-white text-lg font-bold">{getTotalAmount().toFixed(6)} SOL</span>
                </div>
                <p className="text-xs text-purple-300 mt-1">
                  {maxPayments} payments × {parseFloat(amount || '0').toFixed(6)} SOL
                </p>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4">
              <p className="text-red-200 text-sm">{error}</p>
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div className="bg-green-500/20 border border-green-500/50 rounded-lg p-4">
              <p className="text-green-200 text-sm mb-2">
                ✅ Demo: Recurring payment schedule created!
              </p>
              <p className="text-green-300 text-xs">
                Would send {parseFloat(amount).toFixed(6)} SOL {interval} for {maxPayments} payments
              </p>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 px-6 rounded-lg font-semibold text-white bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></span>
                Processing...
              </span>
            ) : (
              '🔒 Preview Recurring Payment (Demo)'
            )}
          </button>
        </form>

        {/* Info */}
        <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
          <p className="text-sm text-blue-200">
            <span className="font-semibold">📘 Demo Mode:</span> This is a preview. Connect your wallet to set up real recurring payments. Payments will execute automatically on schedule!
          </p>
        </div>
      </div>
    </div>
  );
}

