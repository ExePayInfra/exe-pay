'use client';

import { useState, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { Connection, PublicKey, Transaction, SystemProgram, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { getTokens, parseTokenAmount, type Token } from '@/lib/tokens';
import { SecureWalletConnect } from './SecureWalletConnect';

type Interval = 'daily' | 'weekly' | 'monthly';

interface Subscription {
  id: string;
  recipient: string;
  amount: string;
  token: string;
  interval: Interval;
  nextPayment: Date;
  paymentsRemaining: number;
  totalPayments: number;
  status: 'active' | 'paused' | 'completed' | 'cancelled';
  createdAt: Date;
}

export function RecurringPaymentForm() {
  const { publicKey, signTransaction } = useWallet();
  const [mounted, setMounted] = useState(false);
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [selectedToken, setSelectedToken] = useState<Token | null>(null);
  const [tokens, setTokens] = useState<Token[]>([]);
  const [interval, setInterval] = useState<Interval>('monthly');
  const [maxPayments, setMaxPayments] = useState('12');
  const [startDate, setStartDate] = useState('');
  const [memo, setMemo] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);

  useEffect(() => {
    setMounted(true);
    
    // Load tokens
    const network = (process.env.NEXT_PUBLIC_SOLANA_NETWORK || 'devnet') as 'mainnet-beta' | 'devnet';
    const availableTokens = getTokens(network);
    setTokens(availableTokens);
    setSelectedToken(availableTokens[0]); // Default to SOL

    // Set default start date to tomorrow
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    setStartDate(tomorrow.toISOString().split('T')[0]);

    // Load subscriptions from localStorage
    const saved = localStorage.getItem('exepay_subscriptions');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Convert date strings back to Date objects
        const subs = parsed.map((sub: any) => ({
          ...sub,
          nextPayment: new Date(sub.nextPayment),
          createdAt: new Date(sub.createdAt),
        }));
        setSubscriptions(subs);
      } catch (err) {
        console.error('Failed to load subscriptions:', err);
      }
    }
  }, []);


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

      // Validate start date
      const start = new Date(startDate);
      if (isNaN(start.getTime())) {
        throw new Error('Invalid start date');
      }

      // Create subscription
      const newSubscription: Subscription = {
        id: `sub_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        recipient: recipient.trim(),
        amount,
        token: selectedToken.symbol,
        interval,
        nextPayment: start,
        paymentsRemaining: paymentsValue,
        totalPayments: paymentsValue,
        status: 'active',
        createdAt: new Date(),
      };

      // Save to localStorage
      const updated = [...subscriptions, newSubscription];
      setSubscriptions(updated);
      localStorage.setItem('exepay_subscriptions', JSON.stringify(updated));

      setSuccess(true);
      setError('');
      
      // Clear form
      setRecipient('');
      setAmount('');
      setMemo('');
      
      console.log('Subscription created:', newSubscription);
    } catch (err: any) {
      console.error('Recurring payment error:', err);
      setError(err.message || 'Failed to create recurring payment');
    } finally {
      setLoading(false);
    }
  };

  const pauseSubscription = (id: string) => {
    const updated = subscriptions.map(sub =>
      sub.id === id ? { ...sub, status: 'paused' as const } : sub
    );
    setSubscriptions(updated);
    localStorage.setItem('exepay_subscriptions', JSON.stringify(updated));
  };

  const resumeSubscription = (id: string) => {
    const updated = subscriptions.map(sub =>
      sub.id === id ? { ...sub, status: 'active' as const } : sub
    );
    setSubscriptions(updated);
    localStorage.setItem('exepay_subscriptions', JSON.stringify(updated));
  };

  const cancelSubscription = (id: string) => {
    if (!confirm('Are you sure you want to cancel this subscription?')) {
      return;
    }
    const updated = subscriptions.map(sub =>
      sub.id === id ? { ...sub, status: 'cancelled' as const } : sub
    );
    setSubscriptions(updated);
    localStorage.setItem('exepay_subscriptions', JSON.stringify(updated));
  };

  const deleteSubscription = (id: string) => {
    if (!confirm('Are you sure you want to delete this subscription? This cannot be undone.')) {
      return;
    }
    const updated = subscriptions.filter(sub => sub.id !== id);
    setSubscriptions(updated);
    localStorage.setItem('exepay_subscriptions', JSON.stringify(updated));
  };

  const executePayment = async (subscription: Subscription) => {
    try {
      if (!publicKey || !signTransaction) {
        throw new Error('Wallet not connected');
      }

      const rpcUrl = process.env.NEXT_PUBLIC_SOLANA_RPC_URL || 'https://api.mainnet-beta.solana.com';
      const connection = new Connection(rpcUrl, 'confirmed');
      
      const senderPubkey = publicKey;
      const recipientPubkey = new PublicKey(subscription.recipient);
      const lamports = Math.floor(parseFloat(subscription.amount) * LAMPORTS_PER_SOL);

      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: senderPubkey,
          toPubkey: recipientPubkey,
          lamports,
        })
      );

      const { blockhash } = await connection.getLatestBlockhash();
      transaction.recentBlockhash = blockhash;
      transaction.feePayer = senderPubkey;

      const signed = await signTransaction(transaction);
      const signature = await connection.sendRawTransaction(signed.serialize());
      await connection.confirmTransaction(signature, 'confirmed');

      // Update subscription
      const updated = subscriptions.map(sub => {
        if (sub.id === subscription.id) {
          const remaining = sub.paymentsRemaining - 1;
          const nextPayment = new Date(sub.nextPayment);
          
          // Calculate next payment date
          switch (sub.interval) {
            case 'daily':
              nextPayment.setDate(nextPayment.getDate() + 1);
              break;
            case 'weekly':
              nextPayment.setDate(nextPayment.getDate() + 7);
              break;
            case 'monthly':
              nextPayment.setMonth(nextPayment.getMonth() + 1);
              break;
          }

          return {
            ...sub,
            paymentsRemaining: remaining,
            nextPayment,
            status: remaining === 0 ? 'completed' as const : sub.status,
          };
        }
        return sub;
      });

      setSubscriptions(updated);
      localStorage.setItem('exepay_subscriptions', JSON.stringify(updated));

      alert(`Payment sent successfully! ${subscription.paymentsRemaining - 1} payments remaining.`);
    } catch (err: any) {
      console.error('Payment execution failed:', err);
      alert(`Payment failed: ${err.message}`);
    }
  };

  if (!mounted) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-8 text-center">
          <p className="text-white">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Wallet Connection */}
      {!publicKey ? (
        <SecureWalletConnect />
      ) : (
        <>
          {/* Create Subscription Form */}
          <div className="bg-white rounded-2xl p-8 shadow-2xl border border-gray-200">
            <SecureWalletConnect showHeader={true} />
            
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Create Recurring Payment</h3>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Token Selector */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
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
                          ? 'border-cyan-500 bg-cyan-500/20'
                          : 'border-white/20 bg-white/5 hover:border-cyan-400/50'
                      } disabled:opacity-50`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{token.logo}</span>
                        <div className="text-left">
                          <p className="text-white font-semibold">{token.symbol}</p>
                          <p className="text-xs text-gray-400">{token.name}</p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

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
              Amount per Payment ({selectedToken?.symbol || 'SOL'})
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

          {/* Start Date */}
          <div>
            <label htmlFor="startDate" className="block text-sm font-medium text-gray-300 mb-2">
              Start Date
            </label>
            <input
              type="date"
              id="startDate"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
              className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
              required
              disabled={loading}
            />
            <p className="mt-2 text-sm text-gray-400">
              First payment will be sent on this date
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
                ✅ Subscription created successfully!
              </p>
              <p className="text-green-300 text-xs">
                {parseFloat(amount).toFixed(6)} {selectedToken?.symbol} will be sent {interval} for {maxPayments} payments
              </p>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 px-6 rounded-lg font-semibold text-white bg-gradient-to-r from-blue-500 to-cyan-400 hover:from-blue-600 hover:to-cyan-500 shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></span>
                Creating...
              </span>
            ) : (
              '🔄 Create Subscription'
            )}
          </button>
        </form>

        {/* Info */}
        <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
          <p className="text-sm text-blue-200">
            <span className="font-semibold">💡 How it works:</span> Create a subscription and manually execute payments on schedule. Fully automated payments coming soon!
          </p>
        </div>
      </div>

      {/* Active Subscriptions */}
      {subscriptions.length > 0 && (
        <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-8 shadow-2xl">
          <h3 className="text-2xl font-bold text-white mb-6">Your Subscriptions</h3>
          
          <div className="space-y-4">
            {subscriptions.map((sub) => (
              <div
                key={sub.id}
                className={`bg-white/5 border rounded-xl p-6 ${
                  sub.status === 'active' ? 'border-green-500/30' :
                  sub.status === 'paused' ? 'border-yellow-500/30' :
                  sub.status === 'completed' ? 'border-blue-500/30' :
                  'border-red-500/30'
                }`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="text-lg font-semibold text-white">
                        {sub.amount} {sub.token} / {sub.interval}
                      </h4>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        sub.status === 'active' ? 'bg-green-500/20 text-green-300' :
                        sub.status === 'paused' ? 'bg-yellow-500/20 text-yellow-300' :
                        sub.status === 'completed' ? 'bg-blue-500/20 text-blue-300' :
                        'bg-red-500/20 text-red-300'
                      }`}>
                        {sub.status.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-sm text-gray-400 font-mono mb-1">
                      To: {sub.recipient.slice(0, 8)}...{sub.recipient.slice(-8)}
                    </p>
                    <p className="text-sm text-gray-400">
                      Next: {sub.nextPayment.toLocaleDateString()} • {sub.paymentsRemaining}/{sub.totalPayments} remaining
                    </p>
                  </div>
                  
                  <div className="flex flex-col gap-2">
                    {sub.status === 'active' && (
                      <>
                        <button
                          onClick={() => executePayment(sub)}
                          className="px-4 py-2 bg-green-500/20 border border-green-500/50 rounded text-green-200 hover:bg-green-500/30 text-sm font-medium transition-all"
                        >
                          Execute Payment
                        </button>
                        <button
                          onClick={() => pauseSubscription(sub.id)}
                          className="px-4 py-2 bg-yellow-500/20 border border-yellow-500/50 rounded text-yellow-200 hover:bg-yellow-500/30 text-sm font-medium transition-all"
                        >
                          Pause
                        </button>
                      </>
                    )}
                    {sub.status === 'paused' && (
                      <button
                        onClick={() => resumeSubscription(sub.id)}
                        className="px-4 py-2 bg-green-500/20 border border-green-500/50 rounded text-green-200 hover:bg-green-500/30 text-sm font-medium transition-all"
                      >
                        Resume
                      </button>
                    )}
                    {(sub.status === 'active' || sub.status === 'paused') && (
                      <button
                        onClick={() => cancelSubscription(sub.id)}
                        className="px-4 py-2 bg-red-500/20 border border-red-500/50 rounded text-red-200 hover:bg-red-500/30 text-sm font-medium transition-all"
                      >
                        Cancel
                      </button>
                    )}
                    {(sub.status === 'completed' || sub.status === 'cancelled') && (
                      <button
                        onClick={() => deleteSubscription(sub.id)}
                        className="px-4 py-2 bg-red-500/20 border border-red-500/50 rounded text-red-200 hover:bg-red-500/30 text-sm font-medium transition-all"
                      >
                        Delete
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
        </>
      )}
    </div>
  );
}

