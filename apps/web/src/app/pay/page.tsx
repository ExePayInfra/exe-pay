"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useState, useEffect } from "react";
import { parsePaymentLink, formatPaymentAmount } from "@exe-pay/utils";
import type { ParsedPaymentLink } from "@exe-pay/utils";

function PaymentPageContent() {
  const searchParams = useSearchParams();
  const [paymentData, setPaymentData] = useState<ParsedPaymentLink | null>(null);
  const [error, setError] = useState("");
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    try {
      // Construct URL from search params
      const url = new URL(window.location.href);
      const parsed = parsePaymentLink(url);
      setPaymentData(parsed);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Invalid payment link");
    }
  }, [searchParams]);

  const handlePay = async () => {
    if (!paymentData) return;

    setProcessing(true);
    setError("");

    try {
      // TODO: Integrate with wallet and ExePay client
      // For now, show success message
      await new Promise(resolve => setTimeout(resolve, 2000));
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Payment failed");
    } finally {
      setProcessing(false);
    }
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full">
          <div className="text-center">
            <div className="text-6xl mb-4">⚠️</div>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Invalid Payment Link
            </h1>
            <p className="text-gray-600 mb-6">{error}</p>
            <a
              href="/"
              className="inline-block bg-purple-600 text-white font-medium py-2 px-6 rounded-lg hover:bg-purple-700 transition-colors"
            >
              Go Home
            </a>
          </div>
        </div>
      </div>
    );
  }

  if (!paymentData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading payment details...</p>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full">
          <div className="text-center">
            <div className="text-6xl mb-4">✅</div>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Payment Successful!
            </h1>
            <p className="text-gray-600 mb-6">
              Your payment of {formatPaymentAmount(paymentData.amount)} has been sent privately.
            </p>
            <div className="space-y-2">
              <a
                href="/"
                className="block w-full bg-purple-600 text-white font-medium py-2 px-6 rounded-lg hover:bg-purple-700 transition-colors"
              >
                Make Another Payment
              </a>
              <button
                onClick={() => window.close()}
                className="block w-full bg-gray-200 text-gray-700 font-medium py-2 px-6 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full">
        <div className="text-center mb-6">
          <div className="text-5xl mb-4">💳</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Payment Request
          </h1>
          <p className="text-gray-600">
            Complete this private payment on Solana
          </p>
        </div>

        <div className="bg-gray-50 rounded-lg p-6 mb-6 space-y-4">
          {/* Amount */}
          <div>
            <p className="text-sm text-gray-600 mb-1">Amount</p>
            <p className="text-3xl font-bold text-gray-900">
              {formatPaymentAmount(paymentData.amount)}
            </p>
          </div>

          {/* Recipient */}
          <div>
            <p className="text-sm text-gray-600 mb-1">To</p>
            <p className="text-sm font-mono text-gray-900 break-all">
              {paymentData.recipient.toBase58()}
            </p>
          </div>

          {/* Label */}
          {paymentData.label && (
            <div>
              <p className="text-sm text-gray-600 mb-1">Payment For</p>
              <p className="text-sm text-gray-900">{paymentData.label}</p>
            </div>
          )}

          {/* Memo */}
          {paymentData.memo && (
            <div>
              <p className="text-sm text-gray-600 mb-1">Message</p>
              <p className="text-sm text-gray-900">{paymentData.memo}</p>
            </div>
          )}

          {/* Token */}
          {paymentData.tokenMint && (
            <div>
              <p className="text-sm text-gray-600 mb-1">Token</p>
              <p className="text-xs font-mono text-gray-900 break-all">
                {paymentData.tokenMint.toBase58()}
              </p>
            </div>
          )}
        </div>

        {/* Privacy Notice */}
        <div className="bg-purple-50 border border-cyan-200 rounded-lg p-4 mb-6">
          <div className="flex items-start gap-2">
            <span className="text-cyan-600 text-xl">🔒</span>
            <div>
              <p className="text-sm font-medium text-cyan-900 mb-1">
                Private Payment
              </p>
              <p className="text-xs text-cyan-700">
                This transaction uses zero-knowledge proofs to keep your payment private.
              </p>
            </div>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        {/* Pay Button */}
        <button
          onClick={handlePay}
          disabled={processing}
          className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold py-3 px-6 rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {processing ? (
            <span className="flex items-center justify-center gap-2">
              <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>
              Processing...
            </span>
          ) : (
            `Pay ${formatPaymentAmount(paymentData.amount)} Privately`
          )}
        </button>

        <p className="text-xs text-gray-500 text-center mt-4">
          Powered by ExePay • Privacy-preserving payments on Solana
        </p>
      </div>
    </div>
  );
}

export default function PaymentPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    }>
      <PaymentPageContent />
    </Suspense>
  );
}

