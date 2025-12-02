export default function ReactHooksAPIPage() {
  return (
    <div className="prose max-w-none">
      <h1>@exe-pay/react-hooks</h1>
      
      <p className="text-xl text-gray-600">
        React hooks for seamless integration of ExePay features into your React applications. Built on top of Solana Wallet Adapter.
      </p>

      <h2>Installation</h2>

      <pre><code>{`npm install @exe-pay/react-hooks @solana/wallet-adapter-react`}</code></pre>

      <h2>Available Hooks</h2>

      <h3>useWallet</h3>
      <p>Core wallet connection hook from Solana Wallet Adapter.</p>

      <pre><code>{`import { useWallet } from '@solana/wallet-adapter-react';

export function MyComponent() {
  const { 
    publicKey,           // User's wallet address
    connected,           // Connection status
    connecting,          // Loading state
    disconnect,          // Disconnect function
    signMessage,         // Sign arbitrary message
    signTransaction,     // Sign transaction
    sendTransaction      // Sign and send transaction
  } = useWallet();

  return (
    <div>
      {connected ? (
        <p>Connected: {publicKey?.toBase58()}</p>
      ) : (
        <button onClick={() => {}}>Connect Wallet</button>
      )}
    </div>
  );
}`}</code></pre>

      <h3>useConnection</h3>
      <p>Access Solana RPC connection for blockchain queries.</p>

      <pre><code>{`import { useConnection } from '@solana/wallet-adapter-react';
import { LAMPORTS_PER_SOL } from '@solana/web3.js';

export function BalanceDisplay() {
  const { connection } = useConnection();
  const { publicKey } = useWallet();
  const [balance, setBalance] = useState(0);

  useEffect(() => {
    if (!publicKey) return;

    // Fetch balance
    connection.getBalance(publicKey).then(lamports => {
      setBalance(lamports / LAMPORTS_PER_SOL);
    });

    // Subscribe to balance changes
    const subscriptionId = connection.onAccountChange(
      publicKey,
      (accountInfo) => {
        setBalance(accountInfo.lamports / LAMPORTS_PER_SOL);
      }
    );

    return () => {
      connection.removeAccountChangeListener(subscriptionId);
    };
  }, [publicKey, connection]);

  return <p>Balance: {balance.toFixed(4)} SOL</p>;
}`}</code></pre>

      <h3>Custom Hook: useStealthAddress</h3>
      <p>Hook for managing stealth addresses and private payments.</p>

      <pre><code>{`import { useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { generateStealthAddress, generateStealthMetaAddress } from '@exe-pay/privacy';

export function useStealthAddress() {
  const { publicKey, signMessage } = useWallet();
  const [metaAddress, setMetaAddress] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const generateMeta = async () => {
    if (!publicKey || !signMessage) throw new Error('Wallet not connected');
    
    setLoading(true);
    try {
      const message = new TextEncoder().encode('Generate Stealth Meta-Address');
      const signature = await signMessage(message);
      
      const meta = await generateStealthMetaAddress(publicKey, signature);
      setMetaAddress(meta);
      return meta;
    } finally {
      setLoading(false);
    }
  };

  const generateStealth = async (recipientMeta: string) => {
    const { stealthAddress, ephemeralPubkey, viewTag } = 
      await generateStealthAddress(recipientMeta);
    return { stealthAddress, ephemeralPubkey, viewTag };
  };

  return { metaAddress, generateMeta, generateStealth, loading };
}`}</code></pre>

      <h3>Custom Hook: useViewKeys</h3>
      <p>Hook for generating and managing view keys.</p>

      <pre><code>{`import { useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { generateViewKeys, encodeViewKeys } from '@exe-pay/privacy';

export function useViewKeys() {
  const { publicKey, signMessage } = useWallet();
  const [viewKeys, setViewKeys] = useState(null);
  const [loading, setLoading] = useState(false);

  const generate = async () => {
    if (!publicKey || !signMessage) throw new Error('Wallet not connected');
    
    setLoading(true);
    try {
      const message = new TextEncoder().encode(
        \`Generate View Keys - \${Date.now()}\`
      );
      const signature = await signMessage(message);
      
      const keys = await generateViewKeys(publicKey, signature);
      const encoded = encodeViewKeys(keys);
      setViewKeys(encoded);
      return encoded;
    } finally {
      setLoading(false);
    }
  };

  const exportKeys = () => {
    if (!viewKeys) return;
    
    const data = JSON.stringify(viewKeys, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = 'exepay-view-keys.json';
    a.click();
    
    URL.revokeObjectURL(url);
  };

  return { viewKeys, generate, exportKeys, loading };
}`}</code></pre>

      <h3>Custom Hook: usePaymentScanner</h3>
      <p>Hook for scanning blockchain for stealth payments.</p>

      <pre><code>{`import { useState, useCallback } from 'react';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { scanForPayments } from '@exe-pay/privacy';

export function usePaymentScanner() {
  const { publicKey } = useWallet();
  const { connection } = useConnection();
  const [payments, setPayments] = useState([]);
  const [scanning, setScanning] = useState(false);

  const scan = useCallback(async () => {
    if (!publicKey) throw new Error('Wallet not connected');
    
    setScanning(true);
    try {
      const found = await scanForPayments(connection, publicKey, {
        limit: 100,
        useViewTags: true,
        onProgress: (count) => console.log(\`Found \${count} payments\`)
      });
      
      setPayments(found);
      return found;
    } finally {
      setScanning(false);
    }
  }, [publicKey, connection]);

  return { payments, scan, scanning };
}`}</code></pre>

      <h2>Provider Setup</h2>

      <pre><code>{`import { WalletProvider } from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { PhantomWalletAdapter, SolflareWalletAdapter } from '@solana/wallet-adapter-wallets';
import { ConnectionProvider } from '@solana/wallet-adapter-react';
import '@solana/wallet-adapter-react-ui/styles.css';

const wallets = [
  new PhantomWalletAdapter(),
  new SolflareWalletAdapter(),
];

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ConnectionProvider endpoint="https://api.mainnet-beta.solana.com">
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          {children}
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}`}</code></pre>

      <h2>Best Practices</h2>

      <ul>
        <li><strong>Always check wallet connection</strong> before transactions</li>
        <li><strong>Handle loading states</strong> to improve user experience</li>
        <li><strong>Implement error boundaries</strong> for transaction failures</li>
        <li><strong>Use confirmation strategy</strong> appropriate for your use case</li>
        <li><strong>Cache RPC calls</strong> to reduce API usage</li>
        <li><strong>Implement retry logic</strong> for failed transactions</li>
      </ul>

      <div className="bg-green-50 border-l-4 border-green-500 p-6 my-8 not-prose">
        <h3 className="font-bold text-green-900 mb-2">✅ Production Ready</h3>
        <p className="text-green-800">
          All hooks are tested on Solana mainnet and ready for production use. 
          Visit our <a href="/examples" className="underline font-semibold">examples page</a> for complete implementations.
        </p>
      </div>
    </div>
  );
}

