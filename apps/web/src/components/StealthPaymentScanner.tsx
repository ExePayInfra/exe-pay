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

  useEffect(() => {
    if (publicKey && wallet) {
      try {
        // Generate user's stealth meta-address
        const meta = generateStealthMetaAddress({
          publicKey,
          secretKey: new Uint8Array(64) // Placeholder
        } as any);
        setMetaAddress(meta);

        // Load saved payments from localStorage using scanner utility
        const saved = getStoredPayments();
        setPayments(saved);
      } catch (err) {
        console.error('Failed to generate meta-address:', err);
      }
    }
  }, [publicKey, wallet]);

  const handleRequestSignature = async () => {
    if (!signMessage) {
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
      
      // Automatically start scanning
      await handleScan(derivedKey);
      
    } catch (err: any) {
      console.error('[Scanner UI] Signature request failed:', err);
      setError(err.message || 'Failed to sign message');
    }
  };

  const handleScan = async (key?: Uint8Array) => {
    if (!publicKey || !metaAddress || !wallet) {
      setError('Please connect your wallet');
      return;
    }

    // Check if we have viewing key
    const scanKey = key || viewingKey;
    if (!scanKey) {
      setNeedsSignature(true);
      setError('Please sign the message to enable scanning');
      return;
    }

    setScanning(true);
    setError('');
    setNeedsSignature(false);

    try {
      console.log('[Scanner UI] Starting scan for stealth payments...');

      // Create 64-byte key (ed25519 format: 32 secret + 32 public)
      const userSecretKey = new Uint8Array(64);
      userSecretKey.set(scanKey, 0);
      // Note: Public key part not needed for ECDH, only first 32 bytes used

      // Use the real scanner from privacy package
      const detected = await scanForPayments(
        connection,
        publicKey,
        metaAddress,
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

      // Note: Claiming requires deriving the private key for the stealth address
      // This is complex and requires the spending key (separate from viewing key)
      // For now, mark as claimed and show instructions
      
      markPaymentClaimed(payment.signature);
      
      // Reload payments
      const updated = getStoredPayments();
      setPayments(updated);

      // Show info message
      alert(`Payment marked as claimed!\n\nNote: Full claiming functionality coming soon.\nFor now, funds remain at the stealth address:\n${payment.address.toBase58()}\n\nYou can import this address to claim manually.`);

    } catch (err: any) {
      console.error('[Scanner UI] Claim failed:', err);
      setError(err.message || 'Failed to claim payment');
      alert(`Failed to claim payment: ${err.message}`);
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
              className="w-full px-6 py-4 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-lg"
            >
              🔐 Sign Message to Enable Scanning
            </button>
          </div>
        ) : (
          <button
            onClick={() => handleScan()}
            disabled={scanning}
            className="w-full px-6 py-4 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-lg"
          >
            {scanning ? '🔍 Scanning Blockchain...' : '🔍 Scan for Payments'}
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
                      className="px-4 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 disabled:opacity-50 transition-all"
                    >
                      {claimingId === payment.signature ? 'Claiming...' : 'Claim'}
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

