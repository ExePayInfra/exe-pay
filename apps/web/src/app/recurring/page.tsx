'use client';

import { RecurringPaymentForm } from '@/components/RecurringPaymentForm';
import { Navigation, Footer } from '@/components/Navigation';

export default function RecurringPage() {
  return (
    <main className="min-h-screen bg-white">
      <Navigation />

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12 animate-fade-in">
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            Recurring Payments on{' '}
            <span className="text-gradient-brand">
              Solana
            </span>
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto">
            Set up automated subscriptions and recurring payments. Perfect for salaries, memberships, and more!
          </p>
        </div>

        {/* Form */}
        <RecurringPaymentForm />

        {/* Features */}
        <div className="mt-16 grid md:grid-cols-3 gap-6">
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
            <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Automated</h3>
            <p className="text-gray-400">
              Payments execute automatically on schedule
            </p>
          </div>

          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
            <div className="w-12 h-12 bg-pink-500/20 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-pink-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Flexible</h3>
            <p className="text-gray-400">
              Daily, weekly, or monthly schedules
            </p>
          </div>

          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
            <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Reliable</h3>
            <p className="text-gray-400">
              Never miss a payment deadline
            </p>
          </div>
        </div>

        {/* Use Cases */}
        <div className="mt-16">
          <h3 className="text-3xl font-bold text-white text-center mb-8">Perfect For</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-cyan-500/30 rounded-xl p-6">
              <h4 className="text-xl font-semibold text-cyan-200 mb-3">💼 Business</h4>
              <ul className="space-y-2 text-cyan-100">
                <li>• Employee salaries</li>
                <li>• Contractor payments</li>
                <li>• Vendor invoices</li>
                <li>• Subscription services</li>
              </ul>
            </div>
            <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/30 rounded-xl p-6">
              <h4 className="text-xl font-semibold text-blue-200 mb-3">👤 Personal</h4>
              <ul className="space-y-2 text-blue-100">
                <li>• Rent payments</li>
                <li>• Loan repayments</li>
                <li>• Membership fees</li>
                <li>• Donations</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </main>
  );
}

