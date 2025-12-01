export default function WhitepaperPage() {
  return (
    <div className="prose max-w-none">
      <div className="mb-8 not-prose bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-xl p-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-4">
          ExePay Technical Whitepaper
        </h1>
        <p className="text-lg text-gray-700 mb-4">
          Privacy-Preserving Payment Infrastructure for High-Performance Blockchains
        </p>
        <div className="flex gap-4 items-center text-sm text-gray-600">
          <span>Version 1.0</span>
          <span>•</span>
          <span>December 2025</span>
          <span>•</span>
          <a 
            href="https://github.com/ExePayInfra/exe-pay/blob/main/WHITEPAPER.md"
            target="_blank"
            rel="noopener noreferrer"
            className="text-purple-600 hover:text-purple-700 font-medium"
          >
            View on GitHub →
          </a>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 my-6 not-prose">
        <h3 className="text-lg font-semibold text-blue-900 mb-2">📄 Abstract</h3>
        <p className="text-blue-800 text-sm">
          We present ExePay, a comprehensive privacy-preserving payment infrastructure for Solana that combines 
          zero-knowledge proof systems, cryptographic stealth protocols, and state compression to achieve 
          enterprise-grade transaction privacy with sub-second finality. By adapting Monero's battle-tested 
          stealth address protocol to Solana's account model and integrating Light Protocol's ZK compression, 
          we achieve a 1000x cost reduction while maintaining strong privacy guarantees.
        </p>
      </div>

      <h2>Table of Contents</h2>
      <ul>
        <li><a href="#introduction">1. Introduction</a></li>
        <li><a href="#background">2. Background and Related Work</a></li>
        <li><a href="#architecture">3. System Architecture</a></li>
        <li><a href="#cryptography">4. Cryptographic Foundations</a></li>
        <li><a href="#privacy">5. Privacy Components</a></li>
        <li><a href="#payments">6. Payment Infrastructure</a></li>
        <li><a href="#security">7. Security Analysis</a></li>
        <li><a href="#performance">8. Performance Evaluation</a></li>
        <li><a href="#future">9. Future Work</a></li>
        <li><a href="#conclusion">10. Conclusion</a></li>
      </ul>

      <h2 id="introduction">1. Introduction</h2>

      <h3>1.1 Motivation</h3>
      <p>
        Public blockchains provide unprecedented transparency and auditability, but this transparency creates 
        significant privacy concerns for both individuals and enterprises. Every transaction on Solana is publicly 
        visible, revealing wallet balances, transaction graphs, income patterns, and spending habits.
      </p>

      <p>This transparency is incompatible with:</p>
      <ul>
        <li><strong>Business requirements</strong> - Protecting revenue from competitors</li>
        <li><strong>Individual privacy</strong> - Financial sovereignty and safety</li>
        <li><strong>Regulatory compliance</strong> - GDPR and data minimization principles</li>
        <li><strong>Real-world adoption</strong> - Mainstream users expect privacy</li>
      </ul>

      <h3>1.2 Design Goals</h3>
      <p>ExePay aims to achieve:</p>
      <ol>
        <li><strong>Privacy</strong> - Hide transaction participants and amounts while maintaining auditability</li>
        <li><strong>Performance</strong> - Sub-second transaction finality compatible with Solana's speed</li>
        <li><strong>Cost</strong> - Transaction costs under $0.01 via zero-knowledge state compression</li>
        <li><strong>Compatibility</strong> - Works with existing Solana wallets and infrastructure</li>
        <li><strong>Flexibility</strong> - Configurable privacy levels for different use cases</li>
        <li><strong>Compliance</strong> - Cryptographic payment proofs for auditing and dispute resolution</li>
      </ol>

      <h3>1.3 Key Contributions</h3>
      <ul>
        <li>Novel adaptation of UTXO-based privacy (Monero) to account-based blockchains (Solana)</li>
        <li>Hybrid privacy architecture combining stealth addresses with ZK compression</li>
        <li>Payment proof protocol enabling privacy with regulatory compliance</li>
        <li>Performance optimizations (view tags, batch processing) for practical deployment</li>
        <li>Production implementation with comprehensive SDK and mainnet deployment</li>
      </ul>

      <h2 id="background">2. Background and Related Work</h2>

      <h3>2.1 Privacy in Cryptocurrencies</h3>
      
      <div className="grid md:grid-cols-2 gap-4 my-6 not-prose">
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <h4 className="font-semibold text-gray-900 mb-2">Zcash</h4>
          <p className="text-sm text-gray-700">
            Introduced zk-SNARKs for transaction privacy but requires trusted setup and has high computational 
            overhead (30+ second proving time).
          </p>
        </div>

        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <h4 className="font-semibold text-gray-900 mb-2">Monero</h4>
          <p className="text-sm text-gray-700">
            Uses ring signatures, stealth addresses, and RingCT. Battle-tested over 10 years with $3B market cap. 
            Separate blockchain incompatible with Solana.
          </p>
        </div>

        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <h4 className="font-semibold text-gray-900 mb-2">Tornado Cash</h4>
          <p className="text-sm text-gray-700">
            Provided Ethereum mixing via ZK proofs but faced regulatory challenges. Sanctioned by OFAC in 2022 
            due to lack of compliance features.
          </p>
        </div>

        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <h4 className="font-semibold text-gray-900 mb-2">Light Protocol</h4>
          <p className="text-sm text-gray-700">
            Introduces ZK state compression for Solana (1000x cost reduction). Provides amount privacy but not 
            recipient/sender privacy.
          </p>
        </div>
      </div>

      <p className="text-lg font-medium text-gray-900 my-4">
        ✨ <strong>No existing solution</strong> combines stealth addresses, ZK compression, payment proofs, and 
        production-ready implementation on Solana.
      </p>

      <h2 id="architecture">3. System Architecture</h2>

      <h3>3.1 Overview</h3>
      <p>ExePay consists of three layers:</p>

      <div className="bg-gray-50 border border-gray-300 rounded-lg p-6 my-6 font-mono text-sm">
        <pre className="whitespace-pre">{`┌─────────────────────────────────────────────────────────┐
│                  Application Layer                       │
│  (Web App, Mobile, SDK, API)                            │
└────────────────────┬────────────────────────────────────┘
                     │
┌────────────────────┴────────────────────────────────────┐
│                  Privacy Layer                           │
│  • Stealth Addresses      • Payment Proofs              │
│  • ZK Compression         • Subaddresses                │
│  • Shielded Balances      • Scanning Engine             │
└────────────────────┬────────────────────────────────────┘
                     │
┌────────────────────┴────────────────────────────────────┐
│                Payment Infrastructure                    │
│  • Multi-token        • Batch Transfers                 │
│  • Recurring          • Payment Links                   │
└────────────────────┬────────────────────────────────────┘
                     │
┌────────────────────┴────────────────────────────────────┐
│                  Solana Blockchain                       │
│  (Account Model, <400ms finality, $0.00025/tx)          │
└─────────────────────────────────────────────────────────┘`}</pre>
      </div>

      <h3>3.2 Privacy Modes</h3>
      <p>Users can select privacy level based on their requirements:</p>

      <div className="overflow-x-auto my-6">
        <table className="min-w-full">
          <thead>
            <tr className="bg-gray-100">
              <th>Mode</th>
              <th>Recipient</th>
              <th>Sender</th>
              <th>Amount</th>
              <th>Cost</th>
              <th>Use Case</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>Public</strong></td>
              <td>Visible</td>
              <td>Visible</td>
              <td>Visible</td>
              <td>$0.00025</td>
              <td>Transparent transactions</td>
            </tr>
            <tr>
              <td><strong>Shielded</strong></td>
              <td>Hidden</td>
              <td>Visible</td>
              <td>Hidden</td>
              <td>$0.001</td>
              <td>Light Protocol ZK compression</td>
            </tr>
            <tr>
              <td><strong>Stealth</strong></td>
              <td>Hidden</td>
              <td>Visible</td>
              <td>Visible</td>
              <td>$0.00025</td>
              <td>Recipient privacy (Monero-style)</td>
            </tr>
            <tr>
              <td><strong>Full</strong> (Roadmap)</td>
              <td>Hidden</td>
              <td>Hidden</td>
              <td>Hidden</td>
              <td>$0.002</td>
              <td>Maximum privacy</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2 id="cryptography">4. Cryptographic Foundations</h2>

      <h3>4.1 Elliptic Curve Diffie-Hellman (ECDH)</h3>
      <p>
        ExePay uses <strong>X25519</strong> for ECDH key exchange, enabling two parties to establish a shared secret. 
        Alice generates private key <em>a</em> and public key <em>A = aG</em>. Bob generates private key <em>b</em> and 
        public key <em>B = bG</em>. The shared secret is <em>S = aB = bA = abG</em>.
      </p>
      <p>
        <strong>Security:</strong> Relies on hardness of Computational Diffie-Hellman (CDH) problem. 
        Requires O(2<sup>128</sup>) operations for Curve25519 (128-bit security).
      </p>

      <h3>4.2 Key Derivation Functions</h3>
      <p>
        We use <strong>Keccak-256</strong> for key derivation. Keccak-256 provides 256-bit output with:
      </p>
      <ul>
        <li>Collision resistance: O(2<sup>128</sup>) operations</li>
        <li>Preimage resistance: O(2<sup>256</sup>) operations</li>
        <li>Used in Ethereum, proven secure</li>
      </ul>

      <h3>4.3 Zero-Knowledge Proofs</h3>
      <p>
        We utilize <strong>Groth16</strong> pairing-based zk-SNARKs for proving statements without revealing witnesses:
      </p>
      <ul>
        <li><strong>Completeness:</strong> Valid proofs always verify</li>
        <li><strong>Soundness:</strong> Invalid proofs rejected with overwhelming probability</li>
        <li><strong>Zero-knowledge:</strong> Proof reveals nothing about witness</li>
        <li><strong>Succinctness:</strong> Proof size O(1), verification time O(|public inputs|)</li>
      </ul>

      <h2 id="privacy">5. Privacy Components</h2>

      <h3>5.1 Stealth Addresses</h3>
      <p><strong>Protocol:</strong></p>
      <ol>
        <li><strong>Recipient Setup:</strong> Generate spend keypair (s, S) and view keypair (v, V). Publish meta-address M = (S, V)</li>
        <li><strong>Sender Payment:</strong> Generate ephemeral keypair (r, R). Compute shared secret P = rV. Derive stealth address K and view tag t</li>
        <li><strong>Recipient Scanning:</strong> For each transaction, check view tag. If match, compute stealth address and verify ownership</li>
        <li><strong>Recipient Claiming:</strong> Derive stealth private key and transfer funds</li>
      </ol>

      <p><strong>Security:</strong> Recipient anonymity relies on DLP hardness and collision resistance of Keccak-256.</p>

      <h3>5.2 Payment Proofs</h3>
      <p>
        Cryptographic proofs enabling senders to prove payment without revealing recipient identity. 
        Proof includes transaction signature, ephemeral public key, amount, and recipient meta-address hash.
      </p>
      <p><strong>Use Cases:</strong> Tax audits, dispute resolution, compliance, business expense verification</p>

      <h3>5.3 Integrated Addresses</h3>
      <p>
        Extend stealth addresses to embed 8-byte payment ID for invoice/order tracking. Payment ID included in transaction memo, 
        auto-matched by recipient during scanning.
      </p>

      <h3>5.4 Subaddresses</h3>
      <p>
        Hierarchical stealth identities: S<sub>i</sub> = H(s || i) · G + S, V<sub>i</sub> = H(v || i) · G + V. 
        Each subaddress is cryptographically unlinkable (DLP hardness). Perfect for separating business/personal funds.
      </p>

      <h3>5.5 View Tags</h3>
      <p>
        1-byte hint attached to each payment. Recipient checks hint first (cheap), filtering 99% of transactions instantly. 
        Only 1% require expensive ECDH computation. <strong>100x performance improvement</strong>.
      </p>

      <h2 id="payments">6. Payment Infrastructure</h2>

      <ul>
        <li><strong>Multi-Token:</strong> SOL, SPL tokens with automatic routing</li>
        <li><strong>Batch Transfers:</strong> Combine multiple transfers (up to 30 per transaction)</li>
        <li><strong>Recurring Payments:</strong> Authorized schedules with user control</li>
        <li><strong>Payment Links:</strong> QR code generation, expiration, single-use links</li>
      </ul>

      <h2 id="security">7. Security Analysis</h2>

      <h3>Threat Model</h3>
      <p><strong>Adversary Capabilities:</strong></p>
      <ul>
        <li>Monitors all on-chain transactions</li>
        <li>Controls multiple RPC nodes</li>
        <li>May compromise view key (but not spend key)</li>
        <li>Cannot break cryptographic primitives (128-bit security)</li>
      </ul>

      <p><strong>Assets Protected:</strong> Recipient identity, transaction linkability, payment amounts (in compressed mode)</p>
      <p><strong>Assets Not Protected:</strong> Sender identity (visible on-chain), transaction existence, metadata</p>

      <h3>Attack Mitigation</h3>
      <ul>
        <li><strong>Transaction Graph Analysis:</strong> Stealth addresses break transaction graph links</li>
        <li><strong>Timing Analysis:</strong> Users can delay transactions, use varying intervals</li>
        <li><strong>Amount Analysis:</strong> Shielded balances hide amounts</li>
        <li><strong>Denial of Service:</strong> View tags filter 99% of spam</li>
      </ul>

      <h2 id="performance">8. Performance Evaluation</h2>

      <h3>Benchmarks (M1 MacBook Pro, 16GB RAM)</h3>

      <div className="overflow-x-auto my-6">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="bg-gray-100">
              <th>Operation</th>
              <th>Time</th>
              <th>TPS</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Generate Stealth Address</td>
              <td>2.1 ms</td>
              <td>476</td>
            </tr>
            <tr>
              <td>Scan 100 Tx (with view tags)</td>
              <td>18 ms</td>
              <td>5,555</td>
            </tr>
            <tr>
              <td>Scan 100 Tx (without view tags)</td>
              <td>1,830 ms</td>
              <td>54</td>
            </tr>
            <tr>
              <td>Generate Payment Proof</td>
              <td>3.4 ms</td>
              <td>294</td>
            </tr>
            <tr>
              <td>ZK Proof Generation</td>
              <td>420 ms</td>
              <td>2.4</td>
            </tr>
            <tr>
              <td>ZK Proof Verification</td>
              <td>8 ms</td>
              <td>125</td>
            </tr>
          </tbody>
        </table>
      </div>

      <p className="font-medium text-green-700">
        ✅ View tags provide <strong>101x speedup</strong> for scanning (18ms vs 1830ms)
      </p>

      <h3>Cost Analysis</h3>
      <ul>
        <li>Standard Transfer: <strong>$0.00025</strong></li>
        <li>Stealth Address Payment: <strong>$0.00025</strong></li>
        <li>Compressed Transfer: <strong>$0.00000025</strong> (1000x cheaper)</li>
        <li>Batch Transfer (10 recipients): <strong>$0.000025 per recipient</strong></li>
      </ul>

      <h2 id="future">9. Future Work</h2>

      <ul>
        <li><strong>Sender Anonymity:</strong> Ring signatures for sender privacy (Monero's RingCT adapted to Solana)</li>
        <li><strong>Advanced ZK Circuits:</strong> Single proof for entire transaction (sender + receiver + amount)</li>
        <li><strong>Cross-Chain Privacy:</strong> ZK bridge protocol for Ethereum, Polygon</li>
        <li><strong>Hardware Wallets:</strong> Ledger/Trezor integration for secure key management</li>
        <li><strong>Mobile SDK:</strong> Native iOS/Android with GPU-accelerated ZK proving</li>
      </ul>

      <h2 id="conclusion">10. Conclusion</h2>

      <p>
        ExePay demonstrates that <strong>strong privacy and high performance are not mutually exclusive</strong>. 
        By adapting proven cryptographic protocols to high-performance blockchains and integrating cutting-edge 
        ZK technology, we achieve:
      </p>

      <div className="grid md:grid-cols-2 gap-4 my-6 not-prose">
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="font-semibold text-green-900 mb-2">🔐 Cryptographic Privacy</div>
          <p className="text-sm text-green-800">Recipient anonymity + amount hiding (ZK compression)</p>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="font-semibold text-blue-900 mb-2">⚡ Sub-second Finality</div>
          <p className="text-sm text-blue-800">Solana's 400ms blocks maintained</p>
        </div>

        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
          <div className="font-semibold text-purple-900 mb-2">💰 $0.00025 Cost</div>
          <p className="text-sm text-purple-800">1000x cheaper than Ethereum</p>
        </div>

        <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
          <div className="font-semibold text-indigo-900 mb-2">🚀 Production Ready</div>
          <p className="text-sm text-indigo-800">Mainnet deployed, audited libraries</p>
        </div>
      </div>

      <p className="text-lg font-medium text-gray-900 mt-8">
        Privacy is not a feature. It's a fundamental right.
      </p>

      <div className="bg-gradient-to-r from-purple-50 to-blue-50 border-2 border-purple-200 rounded-xl p-6 my-8 not-prose">
        <h3 className="text-xl font-bold text-gray-900 mb-3">📖 Complete Whitepaper</h3>
        <p className="text-gray-700 mb-4">
          This page provides an overview. For the complete technical whitepaper including mathematical proofs, 
          code examples, and full references, visit:
        </p>
        <div className="flex gap-4">
          <a 
            href="https://github.com/ExePayInfra/exe-pay/blob/main/WHITEPAPER.md"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
            </svg>
            View on GitHub
          </a>
        </div>
      </div>
    </div>
  );
}

