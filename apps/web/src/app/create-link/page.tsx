import { PaymentLinkGenerator } from "@/components/PaymentLinkGenerator";

export const dynamic = 'force-dynamic';

export const metadata = {
  title: "Create Payment Link | ExePay",
  description: "Generate a shareable payment link for private Solana payments"
};

export default function CreateLinkPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Create Payment Link
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Generate a shareable link to receive private payments on Solana.
            Perfect for invoices, donations, or selling products.
          </p>
        </div>

        {/* Generator Component */}
        <PaymentLinkGenerator />

        {/* Features */}
        <div className="mt-12 grid md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg p-6 shadow-md">
            <div className="text-3xl mb-3">🔗</div>
            <h3 className="font-semibold text-gray-900 mb-2">Shareable</h3>
            <p className="text-sm text-gray-600">
              Share via email, SMS, social media, or embed on your website
            </p>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-md">
            <div className="text-3xl mb-3">🔒</div>
            <h3 className="font-semibold text-gray-900 mb-2">Private</h3>
            <p className="text-sm text-gray-600">
              All payments use zero-knowledge proofs for complete privacy
            </p>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-md">
            <div className="text-3xl mb-3">⚡</div>
            <h3 className="font-semibold text-gray-900 mb-2">Instant</h3>
            <p className="text-sm text-gray-600">
              Payments settle in seconds on Solana with low fees
            </p>
          </div>
        </div>

        {/* Use Cases */}
        <div className="mt-12 bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Use Cases</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">💼 Invoicing</h3>
              <p className="text-sm text-gray-600">
                Send payment requests to clients with custom amounts and memos
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">💰 Donations</h3>
              <p className="text-sm text-gray-600">
                Accept donations privately without revealing donor information
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">🛍️ E-commerce</h3>
              <p className="text-sm text-gray-600">
                Create payment links for products and services
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">🎁 Tips & Gifts</h3>
              <p className="text-sm text-gray-600">
                Share links for tips, gifts, or peer-to-peer payments
              </p>
            </div>
          </div>
        </div>

        {/* Back to Home */}
        <div className="mt-8 text-center">
          <a
            href="/"
            className="text-cyan-600 hover:text-cyan-700 font-medium"
          >
            ← Back to Home
          </a>
        </div>
      </div>
    </div>
  );
}

