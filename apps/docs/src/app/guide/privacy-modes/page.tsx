export default function PrivacyModesPage() {
  return (
    <div className="max-w-4xl">
      <h1 className="text-4xl font-bold text-gray-900 mb-6">Privacy Modes</h1>
      <p className="text-lg text-gray-700 mb-8">
        ExePay offers three levels of privacy for your transactions. Choose the right level based on your needs.
      </p>

      {/* Public Mode */}
      <div className="bg-white border-2 border-gray-200 rounded-xl p-8 mb-8">
        <div className="flex items-start gap-4 mb-4">
          <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center flex-shrink-0">
            <svg className="w-6 h-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Public Mode</h2>
            <p className="text-gray-600 mb-4">Standard Solana transfers. Everything is visible on-chain.</p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">What's Visible:</h3>
            <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
              <li>Sender address</li>
              <li>Recipient address</li>
              <li>Exact amount</li>
              <li>Timestamp</li>
              <li>Transaction signature</li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Best For:</h3>
            <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
              <li>Transparent transactions (donations, public payments)</li>
              <li>Compliance requirements</li>
              <li>Lowest transaction fees</li>
            </ul>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold text-gray-900 mb-2">Example Use Case:</h3>
            <p className="text-gray-700">
              Paying for a service where both parties want a public record of the transaction.
            </p>
          </div>
        </div>
      </div>

      {/* Shielded Mode */}
      <div className="bg-gradient-to-br from-indigo-50 to-blue-50 border-2 border-indigo-200 rounded-xl p-8 mb-8">
        <div className="flex items-start gap-4 mb-4">
          <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center flex-shrink-0">
            <svg className="w-6 h-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h2 className="text-2xl font-bold text-gray-900">Shielded Mode</h2>
              <span className="px-2 py-1 bg-amber-100 text-amber-800 text-xs font-semibold rounded-full border border-amber-300">
                DEMO MODE
              </span>
            </div>
            <p className="text-gray-700 mb-4">Hides transaction amounts using encryption. Addresses remain visible.</p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">What's Visible:</h3>
            <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
              <li>Sender address</li>
              <li>Recipient address</li>
              <li>Timestamp</li>
              <li><span className="line-through">Exact amount</span> <span className="text-green-600 font-semibold">(Hidden via ElGamal encryption)</span></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-2">How It Works:</h3>
            <ol className="list-decimal list-inside text-gray-700 space-y-2 ml-4">
              <li>Amount is encrypted using ElGamal encryption</li>
              <li>Zero-knowledge proof validates the transaction without revealing the amount</li>
              <li>Only sender and recipient can decrypt the amount</li>
              <li>Network validates the transaction is legitimate</li>
            </ol>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Best For:</h3>
            <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
              <li>Salary payments (hide exact amounts from public)</li>
              <li>Business transactions (protect pricing information)</li>
              <li>Personal payments where you know the recipient</li>
            </ul>
          </div>

          <div className="bg-white p-4 rounded-lg border border-indigo-200">
            <h3 className="font-semibold text-gray-900 mb-2">Example Use Case:</h3>
            <p className="text-gray-700">
              Paying a contractor where you want to keep the payment amount private from competitors, but the relationship is public.
            </p>
          </div>
        </div>
      </div>

      {/* Private Mode */}
      <div className="bg-gradient-to-br from-purple-50 to-indigo-50 border-2 border-purple-200 rounded-xl p-8 mb-8">
        <div className="flex items-start gap-4 mb-4">
          <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center flex-shrink-0">
            <svg className="w-6 h-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h2 className="text-2xl font-bold text-gray-900">Private Mode</h2>
              <span className="px-2 py-1 bg-amber-100 text-amber-800 text-xs font-semibold rounded-full border border-amber-300">
                DEMO MODE
              </span>
            </div>
            <p className="text-gray-700 mb-4">Fully anonymous transactions. Nothing is visible except that a transaction occurred.</p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">What's Visible:</h3>
            <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
              <li><span className="line-through">Sender address</span> <span className="text-green-600 font-semibold">(Hidden via stealth addresses)</span></li>
              <li><span className="line-through">Recipient address</span> <span className="text-green-600 font-semibold">(Hidden via stealth addresses)</span></li>
              <li><span className="line-through">Exact amount</span> <span className="text-green-600 font-semibold">(Hidden via encryption)</span></li>
              <li>✅ A transaction occurred (timestamp, signature)</li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-2">How It Works:</h3>
            <ol className="list-decimal list-inside text-gray-700 space-y-2 ml-4">
              <li>Stealth addresses hide sender and recipient identities</li>
              <li>Amount is encrypted using advanced cryptography</li>
              <li>Zero-knowledge proofs validate everything without revealing data</li>
              <li>Nullifiers prevent double-spending without linking transactions</li>
            </ol>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Best For:</h3>
            <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
              <li>Maximum financial privacy</li>
              <li>Whistleblower payments</li>
              <li>Anonymous donations</li>
              <li>Protecting against surveillance</li>
            </ul>
          </div>

          <div className="bg-white p-4 rounded-lg border border-purple-200">
            <h3 className="font-semibold text-gray-900 mb-2">Example Use Case:</h3>
            <p className="text-gray-700">
              Making a donation to a sensitive cause where you want complete anonymity for both parties.
            </p>
          </div>
        </div>
      </div>

      {/* Comparison Table */}
      <h2 className="text-3xl font-bold text-gray-900 mb-6 mt-12">Quick Comparison</h2>
      <div className="overflow-x-auto mb-8">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-gray-900">Feature</th>
              <th className="border border-gray-300 px-4 py-3 text-center font-semibold text-gray-900">Public</th>
              <th className="border border-gray-300 px-4 py-3 text-center font-semibold text-gray-900">Shielded</th>
              <th className="border border-gray-300 px-4 py-3 text-center font-semibold text-gray-900">Private</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-gray-300 px-4 py-3 text-gray-700">Sender Visible</td>
              <td className="border border-gray-300 px-4 py-3 text-center">✅</td>
              <td className="border border-gray-300 px-4 py-3 text-center">✅</td>
              <td className="border border-gray-300 px-4 py-3 text-center">❌</td>
            </tr>
            <tr className="bg-gray-50">
              <td className="border border-gray-300 px-4 py-3 text-gray-700">Recipient Visible</td>
              <td className="border border-gray-300 px-4 py-3 text-center">✅</td>
              <td className="border border-gray-300 px-4 py-3 text-center">✅</td>
              <td className="border border-gray-300 px-4 py-3 text-center">❌</td>
            </tr>
            <tr>
              <td className="border border-gray-300 px-4 py-3 text-gray-700">Amount Visible</td>
              <td className="border border-gray-300 px-4 py-3 text-center">✅</td>
              <td className="border border-gray-300 px-4 py-3 text-center">❌</td>
              <td className="border border-gray-300 px-4 py-3 text-center">❌</td>
            </tr>
            <tr className="bg-gray-50">
              <td className="border border-gray-300 px-4 py-3 text-gray-700">Transaction Speed</td>
              <td className="border border-gray-300 px-4 py-3 text-center text-green-600">Fast</td>
              <td className="border border-gray-300 px-4 py-3 text-center text-yellow-600">Medium</td>
              <td className="border border-gray-300 px-4 py-3 text-center text-orange-600">Slower</td>
            </tr>
            <tr>
              <td className="border border-gray-300 px-4 py-3 text-gray-700">Transaction Cost</td>
              <td className="border border-gray-300 px-4 py-3 text-center text-green-600">Lowest</td>
              <td className="border border-gray-300 px-4 py-3 text-center text-yellow-600">Medium</td>
              <td className="border border-gray-300 px-4 py-3 text-center text-orange-600">Highest</td>
            </tr>
            <tr className="bg-gray-50">
              <td className="border border-gray-300 px-4 py-3 text-gray-700">Privacy Level</td>
              <td className="border border-gray-300 px-4 py-3 text-center">None</td>
              <td className="border border-gray-300 px-4 py-3 text-center">Medium</td>
              <td className="border border-gray-300 px-4 py-3 text-center text-green-600">Maximum</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="bg-blue-50 border-l-4 border-blue-500 p-6 mb-8">
        <div className="flex items-start">
          <svg className="w-6 h-6 text-blue-500 mr-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <h3 className="font-bold text-blue-900 mb-2">Production Status</h3>
            <p className="text-blue-800 mb-2">
              <strong>Shielded</strong> and <strong>Private</strong> modes are currently in <strong>DEMO MODE</strong>. They simulate the privacy features but do not provide real cryptographic privacy on mainnet yet.
            </p>
            <p className="text-blue-800">
              Production-ready privacy features with real zero-knowledge proofs are in active development. Follow our <a href="https://github.com/ExePayInfra/exe-pay" className="underline font-semibold">GitHub</a> for updates.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

