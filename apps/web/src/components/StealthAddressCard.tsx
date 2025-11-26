'use client';

import { useState, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { 
  generateStealthMetaAddress,
  encodeStealthMetaAddress,
  getViewingKeyMessage,
  deriveViewingKey,
  derivePublicKey,
  type StealthMetaAddress
} from '@exe-pay/privacy';

export function StealthAddressCard() {
  const { publicKey, signMessage } = useWallet();
  const [metaAddress, setMetaAddress] = useState<StealthMetaAddress | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    if (!publicKey || !signMessage) return;

    setLoading(true);
    try {
      // Request signature to derive viewing key
      const message = getViewingKeyMessage();
      const signature = await signMessage(new TextEncoder().encode(message));

      // Derive viewing key from signature
      const derivedKeypair = deriveViewingKey(signature);
      const viewingPubkey = derivePublicKey(derivedKeypair.secretKey);

      // Generate stealth meta-address
      const meta = generateStealthMetaAddress(viewingPubkey, publicKey);
      setMetaAddress(meta);
    } catch (err) {
      console.error('[Stealth Card] Failed to generate:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!metaAddress) return;
    
    const encoded = encodeStealthMetaAddress(metaAddress);
    navigator.clipboard.writeText(encoded);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!publicKey) {
    return null;
  }

  return (
    <div className="glass-card p-6 rounded-2xl animate-slide-up shadow-lg border border-white/50">
      <div className="flex items-center gap-3 mb-4">
        <div className="text-2xl">🔒</div>
        <h3 className="text-lg font-bold text-gray-900">Your Stealth Address</h3>
      </div>

      {!metaAddress ? (
        <div className="space-y-3">
          <p className="text-xs text-gray-600">
            Generate your stealth meta-address to receive private payments
          </p>
          <button
            onClick={handleGenerate}
            disabled={loading}
            className="w-full py-2.5 px-4 rounded-lg font-semibold text-sm text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 active:scale-95 transition-all disabled:opacity-50"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                Generating...
              </span>
            ) : (
              '🔐 Generate Address'
            )}
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
            <p className="font-mono text-xs text-gray-700 break-all leading-relaxed">
              {encodeStealthMetaAddress(metaAddress)}
            </p>
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleCopy}
              className="flex-1 py-2 px-3 rounded-lg font-semibold text-xs text-indigo-600 bg-indigo-50 hover:bg-indigo-100 active:scale-95 transition-all"
            >
              {copied ? '✓ Copied!' : '📋 Copy'}
            </button>
            <a
              href="/privacy"
              className="flex-1 py-2 px-3 rounded-lg font-semibold text-xs text-purple-600 bg-purple-50 hover:bg-purple-100 active:scale-95 transition-all text-center"
            >
              🔍 View Details
            </a>
          </div>

          <div className="bg-green-50 rounded-lg p-3 border border-green-200">
            <p className="text-xs text-green-800">
              <strong>✓ Ready!</strong> Share this address to receive private payments.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

