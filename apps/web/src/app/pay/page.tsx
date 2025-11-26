'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { PublicKey, LAMPORTS_PER_SOL, Transaction, SystemProgram } from '@solana/web3.js';

interface PaymentData {
  recipient: string;
  amount: number;
  token: string;
  memo?: string;
  linkId?: string;
  expiresAt?: number;
  maxUses?: number;
}

function PaymentContent() {
  const searchParams = useSearchParams();
  const { publicKey, signTransaction } = useWallet();
  const { connection } = useConnection();

  const [paymentData, setPaymentData] = useState<PaymentData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    // Parse payment data from URL
    const dataParam = searchParams.get('data');
    if (dataParam) {
      try {
        const decoded = Buffer.from(decodeURIComponent(dataParam), 'base64').toString();
        const parsed = JSON.parse(decoded) as PaymentData;
        
        // Check if link has expired
        if (parsed.expiresAt && Date.now() > parsed.expiresAt) {
          setError('This payment link has expired');
          return;
        }
        
        // Check if link has reached max uses
        if (parsed.linkId && parsed.maxUses) {
          const links = JSON.parse(localStorage.getItem('exepay_payment_links') || '[]');
          const link = links.find((l: any) => l.id === parsed.linkId);
          if (link && link.usedCount >= parsed.maxUses) {
            setError('This payment link has reached its maximum number of uses');
            return;
          }
        }
        
        setPaymentData(parsed);
      } catch (err) {
        setError('Invalid payment link');
      }
    } else {
      setError('No payment data found');
    }
  }, [searchParams]);

  const handlePayment = async () => {
    if (!publicKey || !signTransaction || !paymentData) {
      setError('Please connect your wallet');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const recipientPubkey = new PublicKey(paymentData.recipient);

      // Create transaction
      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: publicKey,
          toPubkey: recipientPubkey,
          lamports: paymentData.amount * LAMPORTS_PER_SOL,
        })
      );

      // Get recent blockhash
      const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash();
      transaction.recentBlockhash = blockhash;
      transaction.feePayer = publicKey;

      // Sign and send
      const signedTx = await signTransaction(transaction);
      const signature = await connection.sendRawTransaction(signedTx.serialize());

      // Confirm
      await connection.confirmTransaction({
        signature,
        blockhash,
        lastValidBlockHeight,
      });

      setSuccess(`Payment sent successfully! Signature: ${signature}`);

      // Update usage count in localStorage
      if (paymentData.linkId) {
        const links = JSON.parse(localStorage.getItem('exepay_payment_links') || '[]');
        const updatedLinks = links.map((link: any) => {
          if (link.id === paymentData.linkId) {
            return { ...link, usedCount: (link.usedCount || 0) + 1 };
          }
          return link;
        });
        localStorage.setItem('exepay_payment_links', JSON.stringify(updatedLinks));
      }
    } catch (err: any) {
      console.error('Payment failed:', err);
      setError(err.message || 'Payment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (error && !paymentData) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl p-8 shadow-xl border border-red-200 max-w-md w-full text-center">
          <div className="text-6xl mb-4">❌</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Invalid Payment Link</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <a
            href="/"
            className="inline-block px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-200"
          >
            Go to Homepage
          </a>
        </div>
      </div>
    );
  }

  if (!paymentData) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading payment details...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl p-8 shadow-xl border border-gray-100 max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">💰</div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Payment Request</h1>
          <p className="text-gray-600">You've been asked to send</p>
        </div>

        {/* Payment Details */}
        <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-6 mb-6 border border-purple-100">
          <div className="text-center mb-4">
            <div className="text-4xl font-bold text-gray-900">
              {paymentData.amount} {paymentData.token}
            </div>
          </div>

          <div className="space-y-3 text-sm">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">To:</span>
              <span className="text-gray-900 font-mono text-xs">
                {paymentData.recipient.slice(0, 8)}...{paymentData.recipient.slice(-8)}
              </span>
            </div>

            {paymentData.memo && (
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Memo:</span>
                <span className="text-gray-900">{paymentData.memo}</span>
              </div>
            )}

            <div className="flex justify-between items-center pt-3 border-t border-purple-200">
              <span className="text-gray-600 font-medium">Total:</span>
              <span className="text-gray-900 font-bold">
                {paymentData.amount} {paymentData.token}
              </span>
            </div>
          </div>
        </div>

        {/* Wallet Connection */}
        <div className="mb-6">
          <WalletMultiButton className="!w-full !justify-center" />
        </div>

        {/* Pay Button */}
        {publicKey && (
          <button
            onClick={handlePayment}
            disabled={loading}
            className="w-full py-4 px-6 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold text-lg rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                Processing...
              </span>
            ) : (
              `Pay ${paymentData.amount} ${paymentData.token}`
            )}
          </button>
        )}

        {/* Error Message */}
        {error && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        {/* Success Message */}
        {success && (
          <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-green-700 text-sm font-medium mb-2">✅ Payment Successful!</p>
            <p className="text-green-600 text-xs break-all">{success}</p>
            <a
              href={`https://solscan.io/tx/${success.split(': ')[1]}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-3 text-blue-600 hover:text-blue-700 text-sm font-medium"
            >
              View on Solscan →
            </a>
          </div>
        )}

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-xs text-gray-500">
            Powered by{' '}
            <a href="/" className="text-purple-600 hover:text-purple-700 font-semibold">
              ExePay
            </a>
          </p>
        </div>
      </div>
    </main>
  );
}

export default function PaymentPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading...</p>
          </div>
        </div>
      }
    >
      <PaymentContent />
    </Suspense>
  );
}
