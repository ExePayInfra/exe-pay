export default function PrivacyModesPage() {
  return (
    <div className="max-w-4xl">
      <h1 className="text-4xl font-bold text-gray-900 mb-6">Privacy Modes</h1>
      <p className="text-lg text-gray-700 mb-8">
        ExePay offers multiple privacy levels for your transactions. Choose the right level based on your needs, from standard public transfers to maximum privacy with stealth addresses and Light Protocol ZK compression.
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

      {/* Stealth Addresses Mode */}
      <div className="bg-gradient-to-br from-indigo-50 to-blue-50 border-2 border-indigo-200 rounded-xl p-8 mb-8">
        <div className="flex items-start gap-4 mb-4">
          <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center flex-shrink-0">
            <svg className="w-6 h-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h2 className="text-2xl font-bold text-gray-900">Stealth Addresses</h2>
              <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded-full border border-green-300">
                MAINNET READY
              </span>
            </div>
            <p className="text-gray-700 mb-4">One-time payment addresses for maximum recipient privacy. Monero-inspired implementation.</p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">What's Visible:</h3>
            <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
              <li><span className="line-through">Your main wallet address</span> <span className="text-green-600 font-semibold">(Hidden - uses one-time address)</span></li>
              <li>One-time payment address (unique per transaction)</li>
              <li>Amount (visible on-chain)</li>
              <li>Timestamp</li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-2">How It Works:</h3>
            <ol className="list-decimal list-inside text-gray-700 space-y-2 ml-4">
              <li>Generate a stealth meta-address (one-time setup)</li>
              <li>Sender uses your stealth meta-address to generate a unique one-time Solana address</li>
              <li>Payment is sent to the one-time address using X25519 ECDH encryption</li>
              <li>You scan the blockchain with view tags for efficient detection</li>
              <li>Claim funds from detected payments to your main wallet</li>
            </ol>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Best For:</h3>
            <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
              <li>Receiving donations without revealing your main address</li>
              <li>Accepting payments while preventing address tracking</li>
              <li>Maximum recipient privacy on mainnet</li>
              <li>Breaking on-chain transaction graphs</li>
            </ul>
          </div>

          <div className="bg-white p-4 rounded-lg border border-indigo-200">
            <h3 className="font-semibold text-gray-900 mb-2">Example Use Case:</h3>
            <p className="text-gray-700">
              Receiving recurring donations where you don't want your main wallet address to be publicly known or linked to your identity.
            </p>
          </div>
        </div>
      </div>

      {/* Light Protocol Mode */}
      <div className="bg-gradient-to-br from-purple-50 to-indigo-50 border-2 border-purple-200 rounded-xl p-8 mb-8">
        <div className="flex items-start gap-4 mb-4">
          <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center flex-shrink-0">
            <svg className="w-6 h-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h2 className="text-2xl font-bold text-gray-900">Light Protocol (ZK Compression)</h2>
              <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded-full border border-blue-300">
                BETA (DEVNET)
              </span>
            </div>
            <p className="text-gray-700 mb-4">Complete on-chain privacy with zero-knowledge compression. Hides sender, recipient, and amount.</p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">What's Visible:</h3>
            <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
              <li><span className="line-through">Sender address</span> <span className="text-purple-600 font-semibold">(Hidden via ZK compression)</span></li>
              <li><span className="line-through">Recipient address</span> <span className="text-purple-600 font-semibold">(Hidden via ZK compression)</span></li>
              <li><span className="line-through">Exact amount</span> <span className="text-purple-600 font-semibold">(Hidden via Pedersen commitments)</span></li>
              <li>✅ Minimal transaction metadata (timestamp, proof verification)</li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-2">How It Works:</h3>
            <ol className="list-decimal list-inside text-gray-700 space-y-2 ml-4">
              <li>Deposit funds into Light Protocol's shielded pool</li>
              <li>Zero-knowledge proofs validate balance and transfers without revealing details</li>
              <li>Compressed accounts reduce on-chain storage costs by 90%</li>
              <li>Nullifiers prevent double-spending cryptographically</li>
              <li>Withdraw to regular accounts when needed</li>
            </ol>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Best For:</h3>
            <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
              <li>Maximum on-chain privacy (sender + recipient + amount hidden)</li>
              <li>Cost-efficient private transactions (90% cheaper than standard accounts)</li>
              <li>Enterprise privacy requirements</li>
              <li>Compliance with privacy regulations</li>
            </ul>
          </div>

          <div className="bg-white p-4 rounded-lg border border-purple-200">
            <h3 className="font-semibold text-gray-900 mb-2">Example Use Case:</h3>
            <p className="text-gray-700">
              Business payments where complete confidentiality is required - no one can see who sent, who received, or how much was transferred.
            </p>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <h3 className="font-semibold text-blue-900 mb-2">Status Update:</h3>
            <p className="text-blue-800">
              Light Protocol is currently in <strong>beta on Solana devnet</strong>. Full mainnet deployment is awaiting Light Protocol's mainnet launch. Track progress on <a href="https://lightprotocol.com" target="_blank" rel="noopener noreferrer" className="underline font-semibold">Light Protocol</a>.
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
              <th className="border border-gray-300 px-4 py-3 text-center font-semibold text-gray-900">Stealth Addresses</th>
              <th className="border border-gray-300 px-4 py-3 text-center font-semibold text-gray-900">Light Protocol</th>
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
              <td className="border border-gray-300 px-4 py-3 text-center">❌ (One-time)</td>
              <td className="border border-gray-300 px-4 py-3 text-center">❌</td>
            </tr>
            <tr>
              <td className="border border-gray-300 px-4 py-3 text-gray-700">Amount Visible</td>
              <td className="border border-gray-300 px-4 py-3 text-center">✅</td>
              <td className="border border-gray-300 px-4 py-3 text-center">✅</td>
              <td className="border border-gray-300 px-4 py-3 text-center">❌</td>
            </tr>
            <tr className="bg-gray-50">
              <td className="border border-gray-300 px-4 py-3 text-gray-700">Unlinkable</td>
              <td className="border border-gray-300 px-4 py-3 text-center">❌</td>
              <td className="border border-gray-300 px-4 py-3 text-center">✅</td>
              <td className="border border-gray-300 px-4 py-3 text-center">✅</td>
            </tr>
            <tr>
              <td className="border border-gray-300 px-4 py-3 text-gray-700">Transaction Speed</td>
              <td className="border border-gray-300 px-4 py-3 text-center text-green-600">Instant</td>
              <td className="border border-gray-300 px-4 py-3 text-center text-green-600">Instant</td>
              <td className="border border-gray-300 px-4 py-3 text-center text-yellow-600">2-3s</td>
            </tr>
            <tr className="bg-gray-50">
              <td className="border border-gray-300 px-4 py-3 text-gray-700">Transaction Cost</td>
              <td className="border border-gray-300 px-4 py-3 text-center text-green-600">~$0.0001</td>
              <td className="border border-gray-300 px-4 py-3 text-center text-green-600">~$0.0002</td>
              <td className="border border-gray-300 px-4 py-3 text-center text-yellow-600">~$0.002</td>
            </tr>
            <tr>
              <td className="border border-gray-300 px-4 py-3 text-gray-700">Setup Required</td>
              <td className="border border-gray-300 px-4 py-3 text-center">None</td>
              <td className="border border-gray-300 px-4 py-3 text-center">Generate address</td>
              <td className="border border-gray-300 px-4 py-3 text-center">Deposit to pool</td>
            </tr>
            <tr className="bg-gray-50">
              <td className="border border-gray-300 px-4 py-3 text-gray-700">Status</td>
              <td className="border border-gray-300 px-4 py-3 text-center text-green-600">✅ Mainnet</td>
              <td className="border border-gray-300 px-4 py-3 text-center text-green-600">✅ Mainnet</td>
              <td className="border border-gray-300 px-4 py-3 text-center text-blue-600">🔬 Beta (Devnet)</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="bg-green-50 border-l-4 border-green-500 p-6 mb-8">
        <div className="flex items-start">
          <svg className="w-6 h-6 text-green-500 mr-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <h3 className="font-bold text-green-900 mb-2">Production Status Update (Nov 2025)</h3>
            <p className="text-green-800 mb-2">
              <strong>Stealth Addresses</strong> are now <strong>LIVE ON MAINNET</strong>! Production-ready one-time addresses with X25519 ECDH encryption, 
              view tag optimization, and full claiming functionality.
            </p>
            <p className="text-green-800">
              <strong>Light Protocol</strong> is in beta on devnet, awaiting mainnet launch for complete on-chain privacy with ZK compression. 
              Follow our <a href="https://github.com/ExePayInfra/exe-pay" className="underline font-semibold">GitHub</a> for updates.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

