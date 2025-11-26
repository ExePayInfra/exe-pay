'use client';

import { useState, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { Keypair, PublicKey as SolanaPublicKey } from '@solana/web3.js';
import { 
  generateStealthMetaAddress, 
  encodeStealthMetaAddress,
  getViewingKeyMessage,
  deriveViewingKey,
  derivePublicKey
} from '@exe-pay/privacy';
import dynamic from 'next/dynamic';

// Lazy load QRCode to improve initial load time
const QRCode = dynamic(() => import('qrcode'), { ssr: false });

export function StealthAddressGenerator() {
  const { publicKey, wallet, signMessage } = useWallet();
  const [stealthAddress, setStealthAddress] = useState<string>('');
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  const [needsSignature, setNeedsSignature] = useState(false);
  const [generating, setGenerating] = useState(false);

  const handleGenerate = async () => {
    if (!publicKey || !wallet || !signMessage) {
      console.error('Wallet not connected or does not support signing');
      return;
    }

    setGenerating(true);
    setNeedsSignature(false);

    try {
      console.log('[Stealth Generator] Requesting signature for viewing key...');
      
      // Request signature to derive viewing key
      const message = getViewingKeyMessage();
      const signature = await signMessage(message);
      
      console.log('[Stealth Generator] ✓ Signature received');
      
      // Derive viewing key from signature
      const viewingKey = deriveViewingKey(signature);
      
      // Derive public key from the viewing key
      const derivedPublicKey = derivePublicKey(viewingKey);
      const derivedSolanaPublicKey = new SolanaPublicKey(derivedPublicKey);
      
      console.log('[Stealth Generator] ✓ Viewing key derived');
      console.log('[Stealth Generator] Derived public key:', derivedSolanaPublicKey.toBase58());
      
      // Create keypair with derived keys
      const fullKey = new Uint8Array(64);
      fullKey.set(viewingKey, 0);
      fullKey.set(derivedPublicKey, 32);
      
      const derivedKeypair = Keypair.fromSecretKey(fullKey);
      
      // Generate stealth meta-address using derived keypair
      const metaAddress = generateStealthMetaAddress(derivedKeypair);
      
      const encoded = encodeStealthMetaAddress(metaAddress);
      setStealthAddress(encoded);

      console.log('[Stealth Generator] ✓ Stealth meta-address generated');

      // Generate QR code asynchronously
      import('qrcode').then((QRCodeModule) => {
        QRCodeModule.default.toDataURL(encoded, {
          width: 256,
          margin: 2,
          color: {
            dark: '#4F46E5',
            light: '#FFFFFF'
          }
        }).then(setQrCodeUrl);
      });
    } catch (error) {
      console.error('[Stealth Generator] Failed to generate stealth address:', error);
      setNeedsSignature(true);
    } finally {
      setGenerating(false);
    }
  };

  useEffect(() => {
    if (publicKey && wallet && signMessage && !stealthAddress) {
      setNeedsSignature(true);
    }
  }, [publicKey, wallet, signMessage, stealthAddress]);

  const handleCopy = async () => {
    if (stealthAddress) {
      await navigator.clipboard.writeText(stealthAddress);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!publicKey) {
    return (
      <div className="bg-white rounded-2xl p-8 shadow-xl border border-gray-200">
        <div className="text-center">
          <div className="text-4xl mb-4">🔒</div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            Connect Wallet
          </h3>
          <p className="text-gray-600">
            Connect your wallet to generate your stealth address
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Main Card */}
      <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-8 shadow-xl border border-indigo-200">
        <div className="flex items-start gap-4 mb-6">
          <div className="text-4xl">🔒</div>
          <div className="flex-1">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              Your Stealth Address
            </h3>
            <p className="text-gray-600">
              Share this address to receive private payments. Each payment uses a unique one-time address.
            </p>
          </div>
        </div>

        {/* Generate Button */}
        {needsSignature && !stealthAddress && (
          <div className="space-y-4 mb-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-semibold text-blue-900 mb-2">🔐 Generate Your Stealth Address</h4>
              <p className="text-sm text-blue-800 mb-3">
                Sign a message to generate your stealth meta-address. This uses derived keys for maximum privacy.
              </p>
              <ul className="text-xs text-blue-700 space-y-1">
                <li>✓ Free (no transaction)</li>
                <li>✓ Uses same keys as scanner</li>
                <li>✓ Can be shared publicly</li>
              </ul>
            </div>
            <button
              onClick={handleGenerate}
              disabled={generating}
              className="w-full px-6 py-4 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-lg"
            >
              {generating ? '🔄 Generating...' : '🔐 Sign to Generate Address'}
            </button>
          </div>
        )}

        {/* QR Code */}
        {qrCodeUrl && (
          <div className="flex justify-center mb-6">
            <div className="bg-white p-4 rounded-xl shadow-lg">
              <img 
                src={qrCodeUrl} 
                alt="Stealth Address QR Code" 
                className="w-64 h-64"
              />
            </div>
          </div>
        )}

        {/* Address Display */}
        <div className="bg-white rounded-xl p-4 mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Stealth Meta-Address
          </label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={stealthAddress}
              readOnly
              className="flex-1 px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg font-mono text-sm"
            />
            <button
              onClick={handleCopy}
              className={`
                px-4 py-3 rounded-lg font-semibold transition-all
                ${copied 
                  ? 'bg-green-500 text-white' 
                  : 'bg-indigo-600 text-white hover:bg-indigo-700'
                }
              `}
            >
              {copied ? '✓ Copied!' : 'Copy'}
            </button>
          </div>
        </div>

        {/* Privacy Features */}
        <div className="grid md:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg p-4">
            <div className="text-2xl mb-2">🎭</div>
            <h4 className="font-semibold text-gray-900 mb-1">Anonymous</h4>
            <p className="text-sm text-gray-600">
              Each payment uses a unique address
            </p>
          </div>

          <div className="bg-white rounded-lg p-4">
            <div className="text-2xl mb-2">🔗</div>
            <h4 className="font-semibold text-gray-900 mb-1">Unlinkable</h4>
            <p className="text-sm text-gray-600">
              Cannot link payments to you
            </p>
          </div>

          <div className="bg-white rounded-lg p-4">
            <div className="text-2xl mb-2">🛡️</div>
            <h4 className="font-semibold text-gray-900 mb-1">Secure</h4>
            <p className="text-sm text-gray-600">
              Battle-tested cryptography
            </p>
          </div>
        </div>
      </div>

      {/* Explanation */}
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
        <button
          onClick={() => setShowExplanation(!showExplanation)}
          className="flex items-center justify-between w-full text-left"
        >
          <h4 className="text-lg font-semibold text-gray-900">
            How Stealth Addresses Work
          </h4>
          <span className="text-2xl text-indigo-600">
            {showExplanation ? '▼' : '▶'}
          </span>
        </button>

        {showExplanation && (
          <div className="mt-4 space-y-4 text-sm text-gray-600">
            <div className="bg-indigo-50 rounded-lg p-4 border border-indigo-200">
              <h5 className="font-semibold text-indigo-900 mb-2">
                What is a Stealth Address?
              </h5>
              <p>
                A stealth address is like a master address that can generate unlimited one-time
                addresses. When someone sends you a payment, they create a unique address that
                only you can detect and spend from.
              </p>
            </div>

            <div className="space-y-3">
              <div className="flex gap-3">
                <div className="text-2xl">1️⃣</div>
                <div>
                  <h5 className="font-semibold text-gray-900 mb-1">You Share</h5>
                  <p>Share your stealth meta-address publicly (like an email address)</p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="text-2xl">2️⃣</div>
                <div>
                  <h5 className="font-semibold text-gray-900 mb-1">Sender Generates</h5>
                  <p>Sender creates a unique one-time address from your meta-address</p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="text-2xl">3️⃣</div>
                <div>
                  <h5 className="font-semibold text-gray-900 mb-1">Payment Sent</h5>
                  <p>Payment goes to the one-time address (looks random to everyone)</p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="text-2xl">4️⃣</div>
                <div>
                  <h5 className="font-semibold text-gray-900 mb-1">You Detect</h5>
                  <p>Your wallet scans and detects payments meant for you</p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="text-2xl">5️⃣</div>
                <div>
                  <h5 className="font-semibold text-gray-900 mb-1">You Spend</h5>
                  <p>You derive the private key and spend the funds</p>
                </div>
              </div>
            </div>

            <div className="bg-green-50 rounded-lg p-4 border border-green-200">
              <h5 className="font-semibold text-green-900 mb-2">
                Privacy Benefits
              </h5>
              <ul className="space-y-1">
                <li className="flex items-start gap-2">
                  <span className="text-green-600">✓</span>
                  <span>Each payment uses a different address</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600">✓</span>
                  <span>Cannot link multiple payments to you</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600">✓</span>
                  <span>Your real address stays private</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600">✓</span>
                  <span>Battle-tested since 2014 (Monero)</span>
                </li>
              </ul>
            </div>

            <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
              <h5 className="font-semibold text-blue-900 mb-2">
                Technical Details
              </h5>
              <ul className="space-y-1">
                <li className="flex items-start gap-2">
                  <span className="text-blue-600">•</span>
                  <span>Uses X25519 ECDH (same as Signal, WireGuard)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600">•</span>
                  <span>Constant-time operations (side-channel resistant)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600">•</span>
                  <span>View tags for efficient scanning</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600">•</span>
                  <span>No trusted setup required</span>
                </li>
              </ul>
            </div>
          </div>
        )}
      </div>

      {/* Usage Tips */}
      <div className="bg-yellow-50 rounded-xl p-6 border border-yellow-200">
        <div className="flex items-start gap-3">
          <div className="text-2xl">💡</div>
          <div>
            <h4 className="font-semibold text-yellow-900 mb-2">Usage Tips</h4>
            <ul className="space-y-2 text-sm text-yellow-800">
              <li className="flex items-start gap-2">
                <span>•</span>
                <span>Share this address publicly (website, social media, email)</span>
              </li>
              <li className="flex items-start gap-2">
                <span>•</span>
                <span>You can use the same address for all private payments</span>
              </li>
              <li className="flex items-start gap-2">
                <span>•</span>
                <span>Payments will appear in your wallet automatically</span>
              </li>
              <li className="flex items-start gap-2">
                <span>•</span>
                <span>Keep your wallet connected to scan for new payments</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

