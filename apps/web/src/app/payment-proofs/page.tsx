'use client';

export const dynamic = 'force-dynamic';

import { Navigation, Footer } from '@/components/Navigation';
import { PaymentProofGenerator } from '@/components/PaymentProofGenerator';
import { BackButton } from '@/components/BackButton';
import { ClientWalletProvider } from '@/components/ClientWalletProvider';

export default function PaymentProofsPage() {
  return (
    <ClientWalletProvider>
      <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        <Navigation />
        
        <div className="max-w-4xl mx-auto px-4 py-8 pt-24">
          {/* Back Button */}
          <div className="mb-6">
            <BackButton />
          </div>

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-3">
              Payment Proofs
            </h1>
            <p className="text-lg text-gray-600">
              Generate and verify cryptographic proofs of payment while preserving privacy
            </p>
          </div>

          {/* Info Cards */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl p-6 border border-purple-100">
              <div className="text-3xl mb-3">🔐</div>
              <h3 className="text-lg font-bold text-purple-900 mb-2">
                Privacy-Preserving
              </h3>
              <p className="text-sm text-purple-800">
                Prove you made a payment without revealing the recipient's identity to the public.
              </p>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-6 border border-blue-100">
              <div className="text-3xl mb-3">✅</div>
              <h3 className="text-lg font-bold text-blue-900 mb-2">
                Cryptographically Verified
              </h3>
              <p className="text-sm text-blue-800">
                Anyone can verify the proof on-chain without compromising privacy.
              </p>
            </div>
          </div>

          {/* Use Cases */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 mb-8">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              Use Cases
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <span className="text-2xl">⚖️</span>
                <div>
                  <h4 className="font-semibold text-gray-900">Dispute Resolution</h4>
                  <p className="text-sm text-gray-600">
                    Prove you sent payment if there's a disagreement
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <span className="text-2xl">📊</span>
                <div>
                  <h4 className="font-semibold text-gray-900">Accounting & Audits</h4>
                  <p className="text-sm text-gray-600">
                    Provide proof to auditors without revealing recipients
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <span className="text-2xl">💼</span>
                <div>
                  <h4 className="font-semibold text-gray-900">Business Payments</h4>
                  <p className="text-sm text-gray-600">
                    Track payments for invoices and contracts
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <span className="text-2xl">🧾</span>
                <div>
                  <h4 className="font-semibold text-gray-900">Tax Reporting</h4>
                  <p className="text-sm text-gray-600">
                    Provide payment records for tax purposes
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Main Component */}
          <PaymentProofGenerator />

          {/* How It Works */}
          <div className="mt-8 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6 border border-gray-200">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              How It Works
            </h3>
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold">
                  1
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Generate Proof</h4>
                  <p className="text-sm text-gray-600">
                    After making a stealth payment, generate a cryptographic proof using the transaction signature and payment details.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold">
                  2
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Share Proof</h4>
                  <p className="text-sm text-gray-600">
                    Share the encoded proof with the recipient, auditor, or any party that needs to verify the payment.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold">
                  3
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Verify On-Chain</h4>
                  <p className="text-sm text-gray-600">
                    Anyone with the proof can verify it against the Solana blockchain without revealing the recipient's identity.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Security Note */}
          <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <span className="text-2xl">⚠️</span>
              <div>
                <h4 className="font-semibold text-yellow-900 mb-1">Security Note</h4>
                <p className="text-sm text-yellow-800">
                  Payment proofs are cryptographically secure and cannot be forged. However, they do reveal that YOU made a payment to a specific stealth address. Only share proofs with trusted parties.
                </p>
              </div>
            </div>
          </div>
        </div>

        <Footer />
      </main>
    </ClientWalletProvider>
  );
}

