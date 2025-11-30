'use client';

import { useState, useEffect } from 'react';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { 
  generateStealthMetaAddress,
  encodeStealthMetaAddress,
  scanForPayments,
  getStoredPayments,
  storePayments,
  markPaymentClaimed,
  claimPayment,
  canClaimPayment,
  getViewingKeyMessage,
  deriveViewingKey,
  derivePublicKey,
  type StealthMetaAddress,
  type DetectedPayment as PrivacyDetectedPayment
} from '@exe-pay/privacy';

// Use the DetectedPayment type from privacy package
type DetectedPayment = PrivacyDetectedPayment;

export function StealthPaymentScanner() {
  const { publicKey, wallet, signTransaction, signMessage } = useWallet();
  const { connection } = useConnection();
  
  const [scanning, setScanning] = useState(false);
  const [payments, setPayments] = useState<DetectedPayment[]>([]);
  const [metaAddress, setMetaAddress] = useState<StealthMetaAddress | null>(null);
  const [error, setError] = useState('');
  const [claimingId, setClaimingId] = useState<string | null>(null);
  const [viewingKey, setViewingKey] = useState<Uint8Array | null>(null);
  const [needsSignature, setNeedsSignature] = useState(false);

  // Don't auto-generate meta address - it will be generated when user signs
  useEffect(() => {
    if (publicKey && wallet) {
      // Load saved payments from localStorage
      const saved = getStoredPayments();
      setPayments(saved);
    }
  }, [publicKey, wallet]);

  const handleRequestSignature = async () => {
    if (!signMessage || !publicKey) {
      setError('Wallet does not support message signing');
      return;
    }

    try {
      console.log('[Scanner UI] Requesting viewing key signature...');
      
      const message = getViewingKeyMessage();
      const signature = await signMessage(message);
      
      console.log('[Scanner UI] ✓ Signature received');
      
      // Derive viewing key from signature
      const derivedKey = deriveViewingKey(signature);
      setViewingKey(derivedKey);
      setNeedsSignature(false);
      
      console.log('[Scanner UI] ✓ Viewing key derived');
      
      // Generate meta address with derived key (SAME as generator!)
      const derivedPublicKey = derivePublicKey(derivedKey);
      const { Keypair: SolanaKeypair, PublicKey: SolanaPublicKey } = await import('@solana/web3.js');
      
      const fullKey = new Uint8Array(64);
      fullKey.set(derivedKey, 0);
      fullKey.set(derivedPublicKey, 32);
      
      const derivedKeypair = SolanaKeypair.fromSecretKey(fullKey);
      const meta = generateStealthMetaAddress(derivedKeypair);
      setMetaAddress(meta);
      
      console.log('[Scanner UI] ✓ Meta address generated with derived key');
      console.log('[Scanner UI] Viewing key:', meta.viewingKey.toBase58());
      console.log('[Scanner UI] Full secret key (first 16 bytes):', Array.from(fullKey.slice(0, 16)));
      
      // Automatically start scanning with FULL keypair secret key
      await handleScan(fullKey, meta);
      
    } catch (err: any) {
      console.error('[Scanner UI] Signature request failed:', err);
      setError(err.message || 'Failed to sign message');
    }
  };

  const handleScan = async (key?: Uint8Array, meta?: StealthMetaAddress) => {
    if (!publicKey || !wallet) {
      setError('Please connect your wallet');
      return;
    }

    // Check if we have viewing key and meta address
    const scanKey = key || viewingKey;
    const scanMeta = meta || metaAddress;
    
    if (!scanKey || !scanMeta) {
      setNeedsSignature(true);
      setError('Please sign the message to enable scanning');
      return;
    }

    setScanning(true);
    setError('');
    setNeedsSignature(false);

    try {
      console.log('[Scanner UI] Starting scan for stealth payments...');
      console.log('[Scanner UI] Scan key length:', scanKey.length);
      console.log('[Scanner UI] Scan key (first 16 bytes):', Array.from(scanKey.slice(0, 16)));

      // scanKey should already be 64 bytes (full Ed25519 keypair)
      const userSecretKey = scanKey;

      // Use the real scanner from privacy package
      const detected = await scanForPayments(
        connection,
        publicKey,
        scanMeta,
        userSecretKey,
        { limit: 50 }
      );

      console.log(`[Scanner UI] Detected ${detected.length} stealth payments`);

      // Save to localStorage
      setPayments(detected);
      storePayments(detected);

    } catch (err: any) {
      console.error('[Scanner UI] Scan failed:', err);
      setError(err.message || 'Failed to scan for payments');
    } finally {
      setScanning(false);
    }
  };

  const handleClaim = async (payment: DetectedPayment) => {
    if (!publicKey || !signTransaction) {
      setError('Please connect your wallet');
      return;
    }

    setClaimingId(payment.signature);
    setError('');

    try {
      console.log('[Scanner UI] Claiming payment:', payment.signature);
      console.log('[Scanner UI] Amount:', payment.amount / 1e9, 'SOL');
      console.log('[Scanner UI] From address:', payment.address.toBase58());

      // Use the real claim function to transfer funds
      const result = await claimPayment(connection, payment, publicKey);
      
      console.log('[Scanner UI] ✓ Claim successful!');
      console.log('[Scanner UI] Transaction:', result.signature);
      console.log('[Scanner UI] Amount claimed:', result.amount / 1e9, 'SOL');
      
      // Mark as claimed in storage
      markPaymentClaimed(payment.signature);
      
      // Reload payments
      const updated = getStoredPayments();
      setPayments(updated);

      // Show success message in UI
      setError('');
      
      // Create a success notification element
      const notification = document.createElement('div');
      notification.className = 'fixed top-4 right-4 z-50 bg-green-500 text-white px-6 py-4 rounded-lg shadow-2xl animate-slide-in-right max-w-md';
      notification.innerHTML = `
        <div class="flex items-start gap-3">
          <div class="text-2xl">✅</div>
          <div class="flex-1">
            <h3 class="font-bold text-lg mb-1">Payment Claimed!</h3>
            <p class="text-sm opacity-90 mb-2">${(result.amount / 1e9).toFixed(6)} SOL transferred to your wallet</p>
            <a href="https://explorer.solana.com/tx/${result.signature}?cluster=devnet" target="_blank" rel="noopener noreferrer" class="text-xs underline hover:no-underline">
              View on Explorer →
            </a>
          </div>
          <button onclick="this.parentElement.parentElement.remove()" class="text-white hover:text-gray-200 text-xl leading-none">&times;</button>
        </div>
      `;
      document.body.appendChild(notification);
      setTimeout(() => notification.remove(), 10000); // Auto-remove after 10s

    } catch (err: any) {
      console.error('[Scanner UI] Claim failed:', err);
      const errorMessage = err.message || 'Failed to claim payment';
      setError(errorMessage);
      
      // Create an error notification element
      const notification = document.createElement('div');
      notification.className = 'fixed top-4 right-4 z-50 bg-red-500 text-white px-6 py-4 rounded-lg shadow-2xl animate-slide-in-right max-w-md';
      notification.innerHTML = `
        <div class="flex items-start gap-3">
          <div class="text-2xl">❌</div>
          <div class="flex-1">
            <h3 class="font-bold text-lg mb-1">Claim Failed</h3>
            <p class="text-sm opacity-90">${errorMessage}</p>
            <p class="text-xs opacity-75 mt-2">Check console for details</p>
          </div>
          <button onclick="this.parentElement.parentElement.remove()" class="text-white hover:text-gray-200 text-xl leading-none">&times;</button>
        </div>
      `;
      document.body.appendChild(notification);
      setTimeout(() => notification.remove(), 8000); // Auto-remove after 8s
    } finally {
      setClaimingId(null);
    }
  };

  if (!publicKey) {
    return (
      <div className="bg-white rounded-2xl p-8 shadow-xl border border-gray-200">
        <div className="text-center">
          <div className="text-4xl mb-4">🔍</div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            Connect Wallet
          </h3>
          <p className="text-gray-600">
            Connect your wallet to scan for incoming stealth payments
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Scanner Card */}
      <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-8 shadow-xl border border-purple-200">
        <div className="flex items-start gap-4 mb-6">
          <div className="text-4xl">🔍</div>
          <div className="flex-1">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              Scan for Incoming Payments
            </h3>
            <p className="text-gray-600">
              Scan the blockchain to detect private payments sent to your stealth address
            </p>
          </div>
        </div>

        {/* Your Stealth Address */}
        {metaAddress && (
          <div className="bg-white rounded-xl p-4 mb-6">
            <h4 className="font-semibold text-gray-900 mb-2">Your Stealth Meta-Address</h4>
            <p className="font-mono text-sm text-gray-700 break-all">
              {encodeStealthMetaAddress(metaAddress)}
            </p>
          </div>
        )}

        {/* Signature Request or Scan Button */}
        {needsSignature || !viewingKey ? (
          <div className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-semibold text-blue-900 mb-2">🔐 Enable Privacy Scanning</h4>
              <p className="text-sm text-blue-800 mb-3">
                To detect payments sent to you, sign a message to derive your viewing key.
              </p>
              <ul className="text-xs text-blue-700 space-y-1 mb-4">
                <li>✓ Free (no transaction)</li>
                <li>✓ Doesn't access your funds</li>
                <li>✓ Only used locally in your browser</li>
                <li>✓ Required once per session</li>
              </ul>
            </div>
            <button
              onClick={handleRequestSignature}
              disabled={scanning}
              className="w-full px-6 py-4 bg-gradient-to-br from-cyan-500 via-blue-600 to-indigo-600 text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 text-lg shadow-lg hover:shadow-2xl hover:scale-[1.02] flex items-center justify-center gap-3 group relative overflow-hidden"
              style={{ borderRadius: '0.5rem 1.5rem 0.5rem 1.5rem' }}
            >
              <span className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></span>
              <svg className="w-5 h-5 transition-transform duration-300 group-hover:scale-110 relative z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <span className="relative z-10">Sign Message to Enable Scanning</span>
            </button>
          </div>
        ) : (
          <button
            onClick={() => handleScan()}
            disabled={scanning}
            className="w-full px-6 py-4 bg-gradient-to-br from-purple-600 via-pink-600 to-fuchsia-600 text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 text-lg shadow-lg hover:shadow-2xl hover:scale-[1.02] flex items-center justify-center gap-3 group relative overflow-hidden"
            style={{ borderRadius: '0.5rem 1.5rem 0.5rem 1.5rem' }}
          >
            <span className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></span>
            <svg className="w-5 h-5 transition-transform duration-300 group-hover:scale-110 relative z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <span className="relative z-10">{scanning ? 'Scanning Blockchain...' : 'Scan for Payments'}</span>
          </button>
        )}

        {/* Error */}
        {error && (
          <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-800 text-sm">{error}</p>
          </div>
        )}
      </div>

      {/* Detected Payments */}
      {payments.length > 0 && (
        <div className="bg-white rounded-2xl p-8 shadow-xl border border-gray-200">
          <h3 className="text-xl font-bold text-gray-900 mb-6">
            Detected Payments ({payments.length})
          </h3>

          <div className="space-y-4">
            {payments.map((payment) => (
              <div
                key={payment.signature}
                className={`
                  rounded-xl p-6 border-2 transition-all
                  ${payment.claimed
                    ? 'bg-gray-50 border-gray-200'
                    : 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-200'
                  }
                `}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-2xl">
                        {payment.claimed ? '✓' : '💰'}
                      </span>
                      <h4 className="font-bold text-gray-900 text-lg">
                        {(payment.amount / LAMPORTS_PER_SOL).toFixed(4)} SOL
                      </h4>
                      {payment.claimed && (
                        <span className="px-2 py-1 bg-gray-200 text-gray-700 text-xs rounded-full font-semibold">
                          Claimed
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600">
                      {new Date(payment.timestamp).toLocaleString()}
                    </p>
                  </div>

                  {!payment.claimed && (
                    <button
                      onClick={() => handleClaim(payment)}
                      disabled={claimingId === payment.signature}
                      className="px-6 py-3 bg-gradient-to-br from-emerald-500 via-green-600 to-teal-600 text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-2xl hover:scale-105 flex items-center gap-2 group relative overflow-hidden"
                      style={{ borderRadius: '1rem 0.5rem 1rem 0.5rem' }}
                    >
                      <span className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/30 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></span>
                      <svg className="w-4 h-4 transition-transform duration-300 group-hover:rotate-12 relative z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="relative z-10">{claimingId === payment.signature ? 'Claiming...' : 'Claim'}</span>
                    </button>
                  )}
                </div>

                {/* Transaction Details */}
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="text-gray-600 font-medium">One-Time Address:</span>
                    <p className="font-mono text-gray-800 text-xs break-all">
                      {payment.address.toBase58()}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-600 font-medium">Ephemeral Key:</span>
                    <p className="font-mono text-gray-800 text-xs break-all">
                      {payment.ephemeralPubkey.toBase58()}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-600 font-medium">Transaction:</span>
                    <div className="flex items-center gap-2">
                      <p className="font-mono text-gray-800 text-xs truncate flex-1">
                        {payment.signature}
                      </p>
                      <a
                        href={`https://explorer.solana.com/tx/${payment.signature}${
                          process.env.NEXT_PUBLIC_SOLANA_NETWORK === 'devnet' ? '?cluster=devnet' : ''
                        }`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-purple-600 hover:text-purple-700 font-medium"
                      >
                        View →
                      </a>
                    </div>
                  </div>
                  {payment.viewTag > 0 && (
                    <div>
                      <span className="text-gray-600 font-medium">View Tag:</span>
                      <span className="font-mono text-gray-800 ml-2">{payment.viewTag}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* No Payments Found */}
      {!scanning && payments.length === 0 && (
        <div className="bg-white rounded-2xl p-8 shadow-xl border border-gray-200 text-center">
          <div className="text-4xl mb-4">📭</div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            No Payments Detected
          </h3>
          <p className="text-gray-600">
            Click "Scan for Payments" to check for incoming stealth payments
          </p>
        </div>
      )}

      {/* How Scanning Works */}
      <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
        <h4 className="font-semibold text-blue-900 mb-3">How Payment Scanning Works</h4>
        <div className="space-y-2 text-sm text-blue-800">
          <div className="flex items-start gap-2">
            <span>1️⃣</span>
            <span>Scanner fetches your recent transactions from Solana</span>
          </div>
          <div className="flex items-start gap-2">
            <span>2️⃣</span>
            <span>Checks each transaction for ephemeral public keys</span>
          </div>
          <div className="flex items-start gap-2">
            <span>3️⃣</span>
            <span>Uses view tags for 99% faster filtering</span>
          </div>
          <div className="flex items-start gap-2">
            <span>4️⃣</span>
            <span>Performs ECDH to check if payment is for you</span>
          </div>
          <div className="flex items-start gap-2">
            <span>5️⃣</span>
            <span>Displays detected payments with claim button</span>
          </div>
        </div>
      </div>

      {/* Privacy Note */}
      <div className="bg-yellow-50 rounded-xl p-6 border border-yellow-200">
        <div className="flex items-start gap-3">
          <div className="text-2xl">💡</div>
          <div>
            <h4 className="font-semibold text-yellow-900 mb-2">Privacy Note</h4>
            <p className="text-sm text-yellow-800">
              Scanning is done locally in your browser. Your private keys never leave your device.
              Only you can detect payments meant for you using your view key.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

