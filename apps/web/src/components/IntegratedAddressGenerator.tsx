'use client';

import { useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { Keypair } from '@solana/web3.js';
import { 
  generateStealthMetaAddress,
  generateIntegratedAddress,
  encodeIntegratedAddress,
  decodeIntegratedAddress,
  encodeStealthMetaAddress,
  type IntegratedAddress
} from '@exe-pay/privacy';

export function IntegratedAddressGenerator() {
  const { publicKey, signMessage } = useWallet();
  
  const [label, setLabel] = useState('');
  const [paymentId, setPaymentId] = useState('');
  const [useCustomId, setUseCustomId] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [generatedAddress, setGeneratedAddress] = useState<IntegratedAddress | null>(null);
  const [encodedAddress, setEncodedAddress] = useState('');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  // Decode tab state
  const [addressToDecode, setAddressToDecode] = useState('');
  const [decodedAddress, setDecodedAddress] = useState<IntegratedAddress | null>(null);

  const [activeTab, setActiveTab] = useState<'generate' | 'decode'>('generate');

  const handleGenerate = async () => {
    if (!publicKey || !signMessage) {
      setError('Please connect your wallet first');
      return;
    }

    setGenerating(true);
    setError('');
    setGeneratedAddress(null);
    setEncodedAddress('');

    try {
      // Validate custom payment ID if provided
      if (useCustomId && paymentId) {
        if (!/^[0-9a-f]{16}$/i.test(paymentId)) {
          throw new Error('Payment ID must be exactly 16 hex characters (0-9, a-f)');
        }
      }

      // Sign message to derive viewing key
      const message = new TextEncoder().encode(
        `ExePay Stealth Address Generation\nWallet: ${publicKey.toBase58()}\nTimestamp: ${Date.now()}`
      );
      const signature = await signMessage(message);

      // Derive keypair from signature
      const derivedKeypair = Keypair.fromSeed(signature.slice(0, 32));

      // Generate stealth meta-address
      const metaAddress = generateStealthMetaAddress(derivedKeypair);
      
      // Override spending key with actual wallet public key
      metaAddress.spendingKey = publicKey;

      // Generate integrated address
      const integrated = generateIntegratedAddress(
        metaAddress,
        useCustomId && paymentId ? paymentId : undefined
      );

      // Encode for sharing
      const encoded = encodeIntegratedAddress(integrated);

      setGeneratedAddress(integrated);
      setEncodedAddress(encoded);

      console.log('[Integrated Address] Generated successfully');
      console.log('[Integrated Address] Payment ID:', integrated.paymentId);
      console.log('[Integrated Address] Encoded:', encoded);

    } catch (err: any) {
      console.error('[Integrated Address] Error:', err);
      setError(err.message || 'Failed to generate integrated address');
    } finally {
      setGenerating(false);
    }
  };

  const handleDecode = () => {
    setError('');
    setDecodedAddress(null);

    if (!addressToDecode.trim()) {
      setError('Please enter an integrated address');
      return;
    }

    try {
      const decoded = decodeIntegratedAddress(addressToDecode.trim());
      
      if (!decoded) {
        throw new Error('Invalid integrated address format');
      }

      setDecodedAddress(decoded);
      console.log('[Integrated Address] Decoded successfully');
      console.log('[Integrated Address] Payment ID:', decoded.paymentId);

    } catch (err: any) {
      console.error('[Integrated Address] Decode error:', err);
      setError(err.message || 'Failed to decode integrated address');
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(encodedAddress);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      setError('Failed to copy to clipboard');
    }
  };

  const generateRandomId = () => {
    const bytes = new Uint8Array(8);
    crypto.getRandomValues(bytes);
    const hex = Array.from(bytes)
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
    setPaymentId(hex);
  };

  return (
    <div className="bg-white rounded-2xl p-8 shadow-xl border border-gray-100">
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          Integrated Addresses
        </h2>
        <p className="text-gray-600">
          Stealth addresses with payment IDs for tracking invoices and orders
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b border-gray-200">
        <button
          onClick={() => setActiveTab('generate')}
          className={`px-6 py-3 font-semibold transition-colors border-b-2 ${
            activeTab === 'generate'
              ? 'text-purple-600 border-purple-600'
              : 'text-gray-500 border-transparent hover:text-gray-700'
          }`}
        >
          Generate
        </button>
        <button
          onClick={() => setActiveTab('decode')}
          className={`px-6 py-3 font-semibold transition-colors border-b-2 ${
            activeTab === 'decode'
              ? 'text-purple-600 border-purple-600'
              : 'text-gray-500 border-transparent hover:text-gray-700'
          }`}
        >
          Decode
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Generate Tab */}
      {activeTab === 'generate' && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Label (Optional)
            </label>
            <input
              type="text"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder="Invoice #1234, Order #5678, etc."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
            <p className="mt-1 text-xs text-gray-500">
              For your own reference (not included in address)
            </p>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-700">
                Payment ID
              </label>
              <button
                type="button"
                onClick={() => setUseCustomId(!useCustomId)}
                className="text-sm text-purple-600 hover:text-purple-700 font-medium"
              >
                {useCustomId ? 'Use Auto-Generated' : 'Use Custom ID'}
              </button>
            </div>

            {useCustomId ? (
              <div className="flex gap-2">
                <input
                  type="text"
                  value={paymentId}
                  onChange={(e) => setPaymentId(e.target.value.toLowerCase())}
                  placeholder="a1b2c3d4e5f67890"
                  maxLength={16}
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent font-mono text-sm"
                />
                <button
                  type="button"
                  onClick={generateRandomId}
                  className="px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                >
                  Random
                </button>
              </div>
            ) : (
              <div className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-600">
                Payment ID will be auto-generated (16 hex characters)
              </div>
            )}
            <p className="mt-1 text-xs text-gray-500">
              16 hex characters (0-9, a-f) - used to track this specific payment
            </p>
          </div>

          <button
            onClick={handleGenerate}
            disabled={generating || !publicKey}
            className="w-full py-3 px-6 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {generating ? 'Generating...' : 'Generate Integrated Address'}
          </button>

          {/* Generated Address */}
          {generatedAddress && encodedAddress && (
            <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <h3 className="text-sm font-medium text-green-900 mb-2 flex items-center gap-2">
                <span className="text-xl">✅</span>
                Integrated Address Generated!
              </h3>

              <div className="space-y-3">
                <div>
                  <label className="text-xs font-medium text-green-700 block mb-1">
                    Payment ID:
                  </label>
                  <div className="bg-white p-3 rounded border border-green-300 font-mono text-sm text-green-900">
                    {generatedAddress.paymentId}
                  </div>
                </div>

                {label && (
                  <div>
                    <label className="text-xs font-medium text-green-700 block mb-1">
                      Label:
                    </label>
                    <div className="bg-white p-3 rounded border border-green-300 text-sm text-green-900">
                      {label}
                    </div>
                  </div>
                )}

                <div>
                  <label className="text-xs font-medium text-green-700 block mb-1">
                    Integrated Address:
                  </label>
                  <div className="bg-white p-3 rounded border border-green-300 font-mono text-xs text-green-900 break-all">
                    {encodedAddress}
                  </div>
                </div>

                <button
                  onClick={handleCopy}
                  className="w-full bg-green-600 text-white font-medium py-2 px-4 rounded-lg hover:bg-green-700 transition-colors"
                >
                  {copied ? '✓ Copied!' : 'Copy Integrated Address'}
                </button>
              </div>

              <div className="mt-3 text-xs text-gray-600">
                <p className="font-semibold mb-1">How to use:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Share this address with the sender</li>
                  <li>They generate a one-time address from it</li>
                  <li>Payment includes the payment ID in memo</li>
                  <li>You can track which payment is which</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Decode Tab */}
      {activeTab === 'decode' && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Integrated Address
            </label>
            <textarea
              value={addressToDecode}
              onChange={(e) => setAddressToDecode(e.target.value)}
              placeholder="stealth:ABC123...:XYZ789...:payment:a1b2c3d4e5f67890"
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent font-mono text-sm"
            />
          </div>

          <button
            onClick={handleDecode}
            disabled={!addressToDecode.trim()}
            className="w-full py-3 px-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Decode Address
          </button>

          {/* Decoded Address */}
          {decodedAddress && (
            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h3 className="text-sm font-medium text-blue-900 mb-3 flex items-center gap-2">
                <span className="text-xl">🔍</span>
                Decoded Successfully
              </h3>

              <div className="space-y-3 text-sm">
                <div>
                  <label className="text-xs font-medium text-blue-700 block mb-1">
                    Payment ID:
                  </label>
                  <div className="bg-white p-3 rounded border border-blue-300 font-mono text-blue-900">
                    {decodedAddress.paymentId}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-medium text-blue-700 block mb-1">
                    Spending Key:
                  </label>
                  <div className="bg-white p-3 rounded border border-blue-300 font-mono text-xs text-blue-900 break-all">
                    {decodedAddress.metaAddress.spendingKey.toBase58()}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-medium text-blue-700 block mb-1">
                    Viewing Key:
                  </label>
                  <div className="bg-white p-3 rounded border border-blue-300 font-mono text-xs text-blue-900 break-all">
                    {decodedAddress.metaAddress.viewingKey.toBase58()}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Info Box */}
      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h4 className="text-sm font-semibold text-blue-900 mb-2">
          💡 What are Integrated Addresses?
        </h4>
        <ul className="text-xs text-blue-800 space-y-1">
          <li>• Combines stealth address + payment ID</li>
          <li>• Track invoices, orders, and payments</li>
          <li>• Payment ID is included in transaction memo</li>
          <li>• Better accounting and reconciliation</li>
          <li>• Like Monero's integrated addresses</li>
        </ul>
      </div>
    </div>
  );
}

