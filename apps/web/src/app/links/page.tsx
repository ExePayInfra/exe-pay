'use client';

import { useState, useEffect } from 'react';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js';
import QRCode from 'qrcode';
import { SecureWalletConnect } from '@/components/SecureWalletConnect';
import { BackButton } from '@/components/BackButton';

// Import wallet adapter styles
import '@solana/wallet-adapter-react-ui/styles.css';

interface PaymentLink {
  id: string;
  recipient: string;
  amount: number;
  token: string;
  memo?: string;
  url: string;
  qrCode: string;
  createdAt: number;
  expiresAt?: number;
  maxUses?: number;
  usedCount: number;
}

export default function PaymentLinksPage() {
  const { publicKey, connected } = useWallet();
  const { connection } = useConnection();
  const [links, setLinks] = useState<PaymentLink[]>([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [balance, setBalance] = useState<number | null>(null);
  const [showSuccessToast, setShowSuccessToast] = useState(false);

  // Form state
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [token, setToken] = useState('SOL');
  const [memo, setMemo] = useState('');
  const [expiresIn, setExpiresIn] = useState('never');
  const [maxUses, setMaxUses] = useState('');
  const [loading, setLoading] = useState(false);

  const generatePaymentLink = async () => {
    if (!recipient || !amount) {
      alert('Please fill in all required fields');
      return;
    }

    // Validate recipient address
    try {
      new PublicKey(recipient);
    } catch {
      alert('Invalid Solana address');
      return;
    }

    setLoading(true);

    try {
      // Generate unique ID
      const linkId = `${Date.now()}-${Math.random().toString(36).substring(7)}`;

      // Calculate expiration
      let expiresAt: number | undefined;
      if (expiresIn !== 'never') {
        const hoursToExpire = parseInt(expiresIn);
        expiresAt = Date.now() + hoursToExpire * 60 * 60 * 1000;
      }

      // Create payment data (includes validation info)
      const paymentData = {
        recipient,
        amount: parseFloat(amount),
        token,
        memo: memo || undefined,
        linkId,
        expiresAt,
        maxUses: maxUses ? parseInt(maxUses) : undefined,
      };

      // Generate payment URL
      const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
      const paymentUrl = `${baseUrl}/pay?data=${encodeURIComponent(
        Buffer.from(JSON.stringify(paymentData)).toString('base64')
      )}`;

      // Generate QR code
      const qrCodeDataUrl = await QRCode.toDataURL(paymentUrl, {
        width: 300,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF',
        },
      });

      // Create payment link
      const newLink: PaymentLink = {
        id: linkId,
        recipient,
        amount: parseFloat(amount),
        token,
        memo: memo || undefined,
        url: paymentUrl,
        qrCode: qrCodeDataUrl,
        createdAt: Date.now(),
        expiresAt,
        maxUses: maxUses ? parseInt(maxUses) : undefined,
        usedCount: 0,
      };

      // Save to local storage
      const existingLinks = JSON.parse(
        localStorage.getItem('exepay_payment_links') || '[]'
      );
      existingLinks.push(newLink);
      localStorage.setItem('exepay_payment_links', JSON.stringify(existingLinks));

      // Update state
      setLinks(existingLinks);

      // Reset form
      setRecipient('');
      setAmount('');
      setMemo('');
      setExpiresIn('never');
      setMaxUses('');
      setShowCreateForm(false);

      // Show success toast
      setShowSuccessToast(true);
      setTimeout(() => setShowSuccessToast(false), 3000);
      
      // Scroll to the new link
      setTimeout(() => {
        window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
      }, 100);
    } catch (error) {
      console.error('Failed to create payment link:', error);
      alert('Failed to create payment link');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('Copied to clipboard!');
  };

  const deleteLink = (linkId: string) => {
    if (!confirm('Are you sure you want to delete this payment link?')) return;

    const updatedLinks = links.filter((l) => l.id !== linkId);
    setLinks(updatedLinks);
    localStorage.setItem('exepay_payment_links', JSON.stringify(updatedLinks));
  };

  const loadLinks = () => {
    const savedLinks = JSON.parse(
      localStorage.getItem('exepay_payment_links') || '[]'
    );
    setLinks(savedLinks);
  };

  // Load links on mount
  useEffect(() => {
    loadLinks();
  }, []);

  // Fetch balance when wallet connects
  useEffect(() => {
    if (publicKey && connection) {
      connection.getBalance(publicKey).then((bal) => {
        setBalance(bal / LAMPORTS_PER_SOL);
      }).catch((err) => {
        console.error('Failed to fetch balance:', err);
      });
    } else {
      setBalance(null);
    }
  }, [publicKey, connection]);

  const isLinkExpired = (link: PaymentLink) => {
    if (!link.expiresAt) return false;
    return Date.now() > link.expiresAt;
  };

  const isLinkMaxed = (link: PaymentLink) => {
    if (!link.maxUses) return false;
    return link.usedCount >= link.maxUses;
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Success Toast */}
      {showSuccessToast && (
        <div className="fixed top-4 right-4 z-50 animate-fade-in">
          <div className="bg-green-500 text-white px-6 py-4 rounded-lg shadow-lg flex items-center gap-3">
            <span className="text-2xl">✅</span>
            <div>
              <p className="font-semibold">Payment Link Created!</p>
              <p className="text-sm text-green-100">Scroll down to view your link</p>
            </div>
          </div>
        </div>
      )}
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Back Button */}
        <div className="mb-6">
          <BackButton />
        </div>
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Payment Links
            </h1>
            <p className="text-gray-600">
              Create shareable payment links with QR codes
            </p>
          </div>
          {connected && balance !== null && (
            <div className="text-sm text-gray-600">
              Balance: {balance.toFixed(4)} SOL
            </div>
          )}
        </div>

        <SecureWalletConnect>
          {/* Content only shows when securely connected */}
          <>
            {/* Create Link Button */}
            {!showCreateForm && (
              <button
                onClick={() => setShowCreateForm(true)}
                className="mb-8 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                + Create Payment Link
              </button>
            )}

            {/* Create Link Form */}
            {showCreateForm && (
              <div className="bg-white rounded-2xl p-8 shadow-xl mb-8 border border-gray-100">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">
                    Create Payment Link
                  </h2>
                  <button
                    onClick={() => setShowCreateForm(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ✕
                  </button>
                </div>

                <div className="space-y-4">
                  {/* Recipient */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Recipient Address *
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={recipient}
                        onChange={(e) => setRecipient(e.target.value)}
                        placeholder="Enter Solana address"
                        className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900 font-mono"
                        required
                      />
                      {publicKey && (
                        <button
                          type="button"
                          onClick={() => setRecipient(publicKey.toString())}
                          className="px-4 py-3 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors font-medium whitespace-nowrap"
                          title="Use my connected wallet address"
                        >
                          📋 Use My Address
                        </button>
                      )}
                    </div>
                    {publicKey && recipient === publicKey.toString() && (
                      <p className="mt-2 text-sm text-green-600">
                        ✅ Payments will be sent to your connected wallet
                      </p>
                    )}
                  </div>

                  {/* Amount & Token */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Amount *
                      </label>
                      <input
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="0.00"
                        step="0.01"
                        min="0"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Token *
                      </label>
                      <select
                        value={token}
                        onChange={(e) => setToken(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900"
                      >
                        <option value="SOL">SOL</option>
                        <option value="USDC">USDC</option>
                        <option value="USDT">USDT</option>
                      </select>
                    </div>
                  </div>

                  {/* Memo */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Memo (Optional)
                    </label>
                    <input
                      type="text"
                      value={memo}
                      onChange={(e) => setMemo(e.target.value)}
                      placeholder="Payment for..."
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900"
                    />
                  </div>

                  {/* Expiration & Max Uses */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Expires In
                      </label>
                      <select
                        value={expiresIn}
                        onChange={(e) => setExpiresIn(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900"
                      >
                        <option value="never">Never</option>
                        <option value="1">1 hour</option>
                        <option value="24">24 hours</option>
                        <option value="168">7 days</option>
                        <option value="720">30 days</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Max Uses
                      </label>
                      <input
                        type="number"
                        value={maxUses}
                        onChange={(e) => setMaxUses(e.target.value)}
                        placeholder="Unlimited"
                        min="1"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900"
                      />
                    </div>
                  </div>

                  {/* Create Button */}
                  <button
                    onClick={generatePaymentLink}
                    disabled={loading || !recipient || !amount}
                    className="w-full py-3 px-6 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Creating...' : 'Create Payment Link'}
                  </button>
                </div>
              </div>
            )}

            {/* Links List */}
            <div className="space-y-4">
              {links.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
                  <div className="text-6xl mb-4">📄</div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    No payment links yet
                  </h3>
                  <p className="text-gray-600">
                    Create your first payment link to get started
                  </p>
                </div>
              ) : (
                links.map((link) => {
                  const expired = isLinkExpired(link);
                  const maxed = isLinkMaxed(link);
                  const inactive = expired || maxed;

                  return (
                    <div
                      key={link.id}
                      className={`bg-white rounded-2xl p-6 shadow-lg border ${
                        inactive ? 'border-red-200 opacity-60' : 'border-gray-100'
                      }`}
                    >
                      <div className="flex flex-col md:flex-row gap-6">
                        {/* QR Code */}
                        <div className="flex-shrink-0">
                          <img
                            src={link.qrCode}
                            alt="Payment QR Code"
                            className="w-48 h-48 border-4 border-gray-100 rounded-lg"
                          />
                        </div>

                        {/* Link Details */}
                        <div className="flex-grow">
                          <div className="flex justify-between items-start mb-4">
                            <div>
                              <h3 className="text-xl font-bold text-gray-900 mb-2">
                                {link.amount} {link.token}
                              </h3>
                              {link.memo && (
                                <p className="text-gray-600 mb-2">{link.memo}</p>
                              )}
                            </div>
                            <button
                              onClick={() => deleteLink(link.id)}
                              className="text-red-500 hover:text-red-700"
                            >
                              🗑️
                            </button>
                          </div>

                          <div className="space-y-2 mb-4 text-sm">
                            <div className="flex items-center gap-2">
                              <span className="text-gray-500">To:</span>
                              <span className="text-gray-900 font-mono">
                                {link.recipient.slice(0, 8)}...
                                {link.recipient.slice(-8)}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-gray-500">Created:</span>
                              <span className="text-gray-900">
                                {new Date(link.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                            {link.expiresAt && (
                              <div className="flex items-center gap-2">
                                <span className="text-gray-500">Expires:</span>
                                <span
                                  className={
                                    expired ? 'text-red-600' : 'text-gray-900'
                                  }
                                >
                                  {new Date(link.expiresAt).toLocaleDateString()}
                                  {expired && ' (Expired)'}
                                </span>
                              </div>
                            )}
                            {link.maxUses && (
                              <div className="flex items-center gap-2">
                                <span className="text-gray-500">Uses:</span>
                                <span
                                  className={
                                    maxed ? 'text-red-600' : 'text-gray-900'
                                  }
                                >
                                  {link.usedCount} / {link.maxUses}
                                  {maxed && ' (Max reached)'}
                                </span>
                              </div>
                            )}
                          </div>

                          {/* Action Buttons */}
                          <div className="flex gap-2">
                            <button
                              onClick={() => copyToClipboard(link.url)}
                              className="px-4 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors font-medium"
                            >
                              📋 Copy Link
                            </button>
                            <a
                              href={link.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors font-medium"
                            >
                              🔗 Open Link
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </>
        </SecureWalletConnect>
      </div>
    </main>
  );
}

