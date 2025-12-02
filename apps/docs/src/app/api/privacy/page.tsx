export default function PrivacyAPIPage() {
  return (
    <div className="prose max-w-none">
      <h1>@exe-pay/privacy</h1>
      
      <p className="text-xl text-gray-600">
        Privacy features for confidential transactions on Solana, including stealth addresses, view keys, payment proofs, and more.
      </p>

      <div className="bg-purple-50 border-l-4 border-purple-500 p-6 my-8 not-prose">
        <h3 className="font-bold text-purple-900 mb-2">All Features Production-Ready on Mainnet</h3>
        <p className="text-purple-800">
          All privacy features have been tested and deployed to Solana mainnet. Ready for production use.
        </p>
      </div>

      <h2>Installation</h2>

      <pre><code>{`npm install @exe-pay/privacy @solana/web3.js`}</code></pre>

      <h2>Features</h2>

      <h3>1. Stealth Addresses</h3>
      <p>
        Monero-inspired one-time addresses that protect recipient privacy. Uses X25519 ECDH + Keccak-256 hashing.
      </p>

      <pre><code>{`import { generateStealthAddress, deriveStealthAddress } from '@exe-pay/privacy';
import { Keypair } from '@solana/web3.js';

// Generate stealth meta-address (receiver does this once)
const wallet = Keypair.generate();
const metaAddress = await generateStealthMetaAddress(wallet);
console.log('Share this meta-address:', metaAddress);

// Send payment (sender does this)
const { stealthAddress, ephemeralPubkey, viewTag } = 
  await generateStealthAddress(metaAddress);

// Now send SOL to stealthAddress
// Include ephemeralPubkey and viewTag in transaction memo

// Scan for payments (receiver does this)
const payments = await scanForPayments(
  connection,
  wallet.publicKey,
  wallet.secretKey
);`}</code></pre>

      <h3>2. View Keys</h3>
      <p>
        Read-only keys for compliance and auditing. Derived using SHA-256 from Ed25519 spending keys.
      </p>

      <pre><code>{`import { generateViewKeys, encodeViewKeys } from '@exe-pay/privacy';

// Generate view keys
const message = new TextEncoder().encode('Generate View Keys');
const signature = await signMessage(message);
const viewKeys = await generateViewKeys(publicKey, signature);

// Encode for export
const encoded = encodeViewKeys(viewKeys);
console.log('Private View Key:', encoded.privateViewKey); // Keep secret
console.log('Public View Key:', encoded.publicViewKey);   // Share with auditors
console.log('Spend Public Key:', encoded.spendPublicKey); // Your wallet address

// Export for accounting software
const credential = {
  publicViewKey: encoded.publicViewKey,
  spendPublicKey: encoded.spendPublicKey,
  network: 'mainnet-beta'
};`}</code></pre>

      <h3>3. Payment Proofs</h3>
      <p>
        Cryptographic proofs to prove payment was made to a specific recipient.
      </p>

      <pre><code>{`import { generatePaymentProof, verifyPaymentProof } from '@exe-pay/privacy';

// Generate proof (sender)
const proof = await generatePaymentProof({
  senderPrivateKey: sender.secretKey,
  recipientPublicKey: recipient.publicKey,
  amount: 1000000,
  transactionSignature: txSignature
});

// Verify proof (anyone can verify)
const isValid = await verifyPaymentProof(proof, {
  recipientPublicKey: recipient.publicKey,
  amount: 1000000,
  transactionSignature: txSignature
});`}</code></pre>

      <h3>4. Integrated Addresses</h3>
      <p>
        Stealth addresses with embedded payment IDs for invoice tracking.
      </p>

      <pre><code>{`import { generateIntegratedAddress, decodeIntegratedAddress } from '@exe-pay/privacy';

// Generate with payment ID
const paymentId = 'INV-12345';
const integratedAddress = await generateIntegratedAddress(
  metaAddress,
  paymentId
);

// Decode to get payment ID
const { stealthAddress, paymentId: decoded } = 
  await decodeIntegratedAddress(integratedAddress);

console.log('Payment ID:', decoded); // 'INV-12345'`}</code></pre>

      <h3>5. Subaddresses</h3>
      <p>
        Generate multiple unlinkable receiving addresses from a single wallet.
      </p>

      <pre><code>{`import { generateSubaddress } from '@exe-pay/privacy';

// Generate subaddresses
const subaddress1 = await generateSubaddress(wallet, 0, 1); // Account 0, Index 1
const subaddress2 = await generateSubaddress(wallet, 0, 2); // Account 0, Index 2

// Use for different purposes
const businessAddress = await generateSubaddress(wallet, 0, 100);
const personalAddress = await generateSubaddress(wallet, 0, 200);`}</code></pre>

      <h3>6. Enhanced Scanning with View Tags</h3>
      <p>
        99% faster payment detection using one-byte view tags.
      </p>

      <pre><code>{`import { scanForPayments } from '@exe-pay/privacy';

// Scan with view tags (optimized)
const payments = await scanForPayments(
  connection,
  publicKey,
  privateKey,
  {
    useViewTags: true,      // Enable fast scanning
    limit: 100,             // Last 100 transactions
    onProgress: (found) => {
      console.log(\`Found \${found} payments\`);
    }
  }
);

// Each payment includes:
payments.forEach(payment => {
  console.log('Amount:', payment.amount);
  console.log('Stealth Address:', payment.stealthAddress);
  console.log('Ephemeral Pubkey:', payment.ephemeralPubkey);
  console.log('View Tag:', payment.viewTag);
});`}</code></pre>

      <h3>7. RPC Privacy</h3>
      <p>
        Hide IP address by rotating through multiple RPC endpoints.
      </p>

      <pre><code>{`import { PrivacyRPCClient } from '@exe-pay/privacy';

// Create client with multiple endpoints
const rpcClient = new PrivacyRPCClient([
  'https://api.mainnet-beta.solana.com',
  'https://solana-api.projectserum.com',
  'https://rpc.ankr.com/solana',
]);

// Use like normal Connection
const balance = await rpcClient.getBalance(publicKey);
const latestBlockhash = await rpcClient.getLatestBlockhash();

// Rotates endpoints automatically for each request`}</code></pre>

      <h2>Type Definitions</h2>

      <pre><code>{`interface StealthAddress {
  stealthAddress: PublicKey;
  ephemeralPubkey: PublicKey;
  viewTag: number;
}

interface ViewKey {
  privateViewKey: Uint8Array;
  publicViewKey: PublicKey;
  spendPublicKey: PublicKey;
}

interface EncodedViewKey {
  privateViewKey: string;  // Base58 encoded
  publicViewKey: string;   // Base58 encoded
  spendPublicKey: string;  // Base58 encoded
}

interface PaymentProof {
  senderPublicKey: PublicKey;
  recipientPublicKey: PublicKey;
  amount: number;
  transactionSignature: string;
  proof: Uint8Array;
}

interface ScannedPayment {
  amount: number;
  stealthAddress: PublicKey;
  ephemeralPubkey: PublicKey;
  viewTag: number;
  transactionSignature: string;
  timestamp: number;
}`}</code></pre>

      <h2>Security Notes</h2>

      <div className="bg-yellow-50 border-l-4 border-yellow-500 p-6 my-8 not-prose">
        <h3 className="font-bold text-yellow-900 mb-2">⚠️ Important Security Information</h3>
        <ul className="text-yellow-800 space-y-2">
          <li><strong>View Keys:</strong> Private view keys reveal transaction history but cannot spend funds. Keep them secure like financial statements.</li>
          <li><strong>Stealth Addresses:</strong> Each payment uses a unique address. Never reuse the same stealth address.</li>
          <li><strong>Key Storage:</strong> Never expose private keys or view keys in client-side code. Use secure storage.</li>
          <li><strong>RPC Privacy:</strong> While RPC rotation helps, consider using a VPN for maximum privacy.</li>
        </ul>
      </div>

      <h2>Best Practices</h2>

      <ul>
        <li><strong>Always use view tags</strong> for scanning - 99% performance improvement</li>
        <li><strong>Generate view keys once</strong> and store securely for compliance</li>
        <li><strong>Use integrated addresses</strong> for business invoices and order tracking</li>
        <li><strong>Create subaddresses</strong> for different purposes (business, personal, savings)</li>
        <li><strong>Keep ephemeral keys</strong> in transaction memos for recipient scanning</li>
        <li><strong>Rotate RPC endpoints</strong> when sending sensitive transactions</li>
      </ul>

      <h2>Mainnet Configuration</h2>

      <pre><code>{`import { Connection } from '@solana/web3.js';
import { PrivacyRPCClient } from '@exe-pay/privacy';

// For mainnet production
const connection = new PrivacyRPCClient([
  'https://api.mainnet-beta.solana.com',
  'https://solana-api.projectserum.com',
], {
  commitment: 'confirmed',
  confirmTransactionInitialTimeout: 60000
});

// All privacy features work on mainnet
const stealthAddress = await generateStealthAddress(metaAddress);
const viewKeys = await generateViewKeys(publicKey, signature);`}</code></pre>

      <div className="bg-blue-50 border-l-4 border-blue-500 p-6 my-8 not-prose">
        <h3 className="font-bold text-blue-900 mb-2">💡 Need Help?</h3>
        <p className="text-blue-800">
          Check out our <a href="/examples" className="underline font-semibold">code examples</a> for complete working implementations, 
          or visit our <a href="https://github.com/ExePayInfra/exe-pay" className="underline font-semibold">GitHub repository</a> for more resources.
        </p>
      </div>
    </div>
  );
}

