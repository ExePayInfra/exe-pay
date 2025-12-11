'use client';

import { useState, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { PublicKey } from '@solana/web3.js';
import {
  generateUnifiedAddress,
  parseUnifiedAddress,
  UnifiedAddressType,
  getAddressTypeName,
  isUnifiedAddress,
} from '@exe-pay/privacy';
import { generateStealthAddress, generateIntegratedAddress } from '@exe-pay/privacy';

export function UnifiedAddressGenerator() {
  const { publicKey } = useWallet();
  const [addressType, setAddressType] = useState<UnifiedAddressType>(UnifiedAddressType.STEALTH);
  const [paymentId, setPaymentId] = useState('');
  const [subaddressIndex, setSubaddressIndex] = useState(0);
  const [unifiedAddress, setUnifiedAddress] = useState('');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  
  // Parse mode
  const [parseInput, setParseInput] = useState('');
  const [parsedAddress, setParsedAddress] = useState<any>(null);
  const [parseError, setParseError] = useState('');

  // Clear address when type changes
  useEffect(() => {
    setUnifiedAddress('');
    setError('');
    setCopied(false);
  }, [addressType]);

  const handleGenerate = async () => {
    if (!publicKey) {
      setError('Please connect your wallet first');
      return;
    }

    setError('');
    setUnifiedAddress(''); // Clear previous address
    
    try {
      let address = '';
      
      switch (addressType) {
        case UnifiedAddressType.STANDARD:
          // Simple standard address
          address = generateUnifiedAddress({
            type: UnifiedAddressType.STANDARD,
            publicKey,
          });
          break;

        case UnifiedAddressType.STEALTH: {
          // Generate stealth address components first
          const stealth = await generateStealthAddress(publicKey);
          
          // Check if stealth generation succeeded
          if (!stealth || !stealth.address) {
            throw new Error('Failed to generate stealth address');
          }
          
          // For unified addresses, we need the view and spend keys
          // Using the generated stealth address and wallet keys
          address = generateUnifiedAddress({
            type: UnifiedAddressType.STEALTH,
            publicKey: new PublicKey(stealth.address),
            viewKey: publicKey, // Wallet public key as view key
            spendKey: new PublicKey(stealth.address), // Stealth address as spend key
          });
          break;
        }

        case UnifiedAddressType.INTEGRATED: {
          // Validate payment ID
          if (!paymentId || paymentId.length !== 16) {
            setError('Payment ID must be 16 hex characters (8 bytes)');
            return;
          }
          
          // Validate hex characters
          if (!/^[0-9a-f]{16}$/i.test(paymentId)) {
            setError('Payment ID must contain only hex characters (0-9, a-f)');
            return;
          }
          
          // Generate stealth address with payment ID
          const integrated = await generateIntegratedAddress(publicKey, paymentId);
          
          if (!integrated || !integrated.address) {
            throw new Error('Failed to generate integrated address');
          }
          
          address = generateUnifiedAddress({
            type: UnifiedAddressType.INTEGRATED,
            publicKey: new PublicKey(integrated.address),
            viewKey: publicKey,
            spendKey: new PublicKey(integrated.address),
            paymentId,
          });
          break;
        }

        case UnifiedAddressType.SUBADDRESS: {
          // Generate subaddress
          const stealth = await generateStealthAddress(publicKey);
          
          if (!stealth || !stealth.address) {
            throw new Error('Failed to generate subaddress');
          }
          
          address = generateUnifiedAddress({
            type: UnifiedAddressType.SUBADDRESS,
            publicKey: new PublicKey(stealth.address),
            viewKey: publicKey,
            spendKey: new PublicKey(stealth.address),
            subaddressIndex,
          });
          break;
        }
      }

      setUnifiedAddress(address);
      console.log('[Unified Address] Generated:', address);
    } catch (err: any) {
      console.error('[Unified Address] Error:', err);
      setError(err.message || 'Failed to generate unified address');
      setUnifiedAddress(''); // Clear on error
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(unifiedAddress);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('[Unified Address] Copy failed:', err);
    }
  };

  const handleParse = () => {
    setParseError('');
    setParsedAddress(null);
    
    try {
      const parsed = parseUnifiedAddress(parseInput);
      setParsedAddress(parsed);
      console.log('[Unified Address] Parsed:', parsed);
    } catch (err: any) {
      console.error('[Unified Address] Parse error:', err);
      setParseError(err.message || 'Failed to parse address');
    }
  };

  return (
    <div className="space-y-8">
      {/* Generator Section */}
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
        <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <span className="text-3xl">🏠</span>
          Generate Unified Address
        </h3>
        
        <p className="text-gray-600 mb-6">
          Create a single address that supports all privacy modes. Recipients can use one address for everything!
        </p>

        {/* Address Type Selector */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Address Type
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setAddressType(UnifiedAddressType.STANDARD)}
                className={`p-4 rounded-xl border-2 transition-all ${
                  addressType === UnifiedAddressType.STANDARD
                    ? 'border-purple-500 bg-purple-50'
                    : 'border-gray-200 hover:border-purple-300'
                }`}
              >
                <div className="font-semibold text-gray-900">Standard</div>
                <div className="text-sm text-gray-600">Normal address</div>
              </button>

              <button
                onClick={() => setAddressType(UnifiedAddressType.STEALTH)}
                className={`p-4 rounded-xl border-2 transition-all ${
                  addressType === UnifiedAddressType.STEALTH
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-blue-300'
                }`}
              >
                <div className="font-semibold text-gray-900">Stealth</div>
                <div className="text-sm text-gray-600">Private payments</div>
              </button>

              <button
                onClick={() => setAddressType(UnifiedAddressType.INTEGRATED)}
                className={`p-4 rounded-xl border-2 transition-all ${
                  addressType === UnifiedAddressType.INTEGRATED
                    ? 'border-green-500 bg-green-50'
                    : 'border-gray-200 hover:border-green-300'
                }`}
              >
                <div className="font-semibold text-gray-900">Integrated</div>
                <div className="text-sm text-gray-600">With payment ID</div>
              </button>

              <button
                onClick={() => setAddressType(UnifiedAddressType.SUBADDRESS)}
                className={`p-4 rounded-xl border-2 transition-all ${
                  addressType === UnifiedAddressType.SUBADDRESS
                    ? 'border-cyan-500 bg-cyan-50'
                    : 'border-gray-200 hover:border-cyan-300'
                }`}
              >
                <div className="font-semibold text-gray-900">Subaddress</div>
                <div className="text-sm text-gray-600">Multiple IDs</div>
              </button>
            </div>
          </div>

          {/* Type-specific inputs */}
          {addressType === UnifiedAddressType.INTEGRATED && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Payment ID (16 hex characters)
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={paymentId}
                  onChange={(e) => setPaymentId(e.target.value.toLowerCase())}
                  placeholder="0123456789abcdef"
                  maxLength={16}
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent font-mono text-sm"
                />
                <button
                  onClick={() => {
                    // Generate random 16 hex character payment ID
                    const random = Array.from({ length: 16 }, () =>
                      Math.floor(Math.random() * 16).toString(16)
                    ).join('');
                    setPaymentId(random);
                  }}
                  className="px-4 py-3 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors font-medium whitespace-nowrap"
                >
                  Random
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Used to identify specific invoices or orders
              </p>
            </div>
          )}

          {addressType === UnifiedAddressType.SUBADDRESS && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Subaddress Index
              </label>
              <input
                type="number"
                value={subaddressIndex}
                onChange={(e) => setSubaddressIndex(parseInt(e.target.value) || 0)}
                min="0"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              />
              <p className="text-xs text-gray-500 mt-1">
                Create multiple addresses from the same wallet
              </p>
            </div>
          )}

          {/* Generate Button */}
          <button
            onClick={handleGenerate}
            disabled={!publicKey}
            className="w-full py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
          >
            {publicKey ? 'Generate Unified Address' : 'Connect Wallet First'}
          </button>

          {/* Error */}
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}

          {/* Generated Address */}
          {unifiedAddress && (
            <div className="space-y-3 animate-fade-in-up">
              <div className="p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border border-purple-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-purple-700">
                    ✨ Unified Address ({getAddressTypeName(addressType)})
                  </span>
                  <button
                    onClick={handleCopy}
                    className="px-3 py-1 bg-white rounded-md text-sm font-medium text-purple-700 hover:bg-purple-100 transition-colors"
                  >
                    {copied ? '✓ Copied!' : 'Copy'}
                  </button>
                </div>
                <div className="font-mono text-sm text-gray-900 break-all bg-white p-3 rounded border border-purple-200">
                  {unifiedAddress}
                </div>
              </div>

              <div className="text-xs text-gray-600 space-y-1">
                <p>✅ This address can be shared with anyone</p>
                <p>✅ It automatically handles the selected privacy mode</p>
                <p>✅ Compatible with all ExePay features</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Parser Section */}
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
        <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <span className="text-3xl">🔍</span>
          Parse Unified Address
        </h3>
        
        <p className="text-gray-600 mb-6">
          Decode a unified address to see its type and components.
        </p>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Unified Address
            </label>
            <textarea
              value={parseInput}
              onChange={(e) => setParseInput(e.target.value)}
              placeholder="exe1..."
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm resize-none"
            />
          </div>

          <button
            onClick={handleParse}
            disabled={!parseInput}
            className="w-full py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-cyan-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Parse Address
          </button>

          {parseError && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {parseError}
            </div>
          )}

          {parsedAddress && (
            <div className="space-y-3 animate-fade-in-up">
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="space-y-3">
                  <div>
                    <span className="text-sm font-medium text-blue-700">Type:</span>
                    <span className="ml-2 text-sm text-gray-900 font-semibold">
                      {getAddressTypeName(parsedAddress.type)}
                    </span>
                  </div>

                  <div>
                    <span className="text-sm font-medium text-blue-700">Public Key:</span>
                    <div className="mt-1 font-mono text-xs text-gray-900 break-all bg-white p-2 rounded">
                      {parsedAddress.publicKey.toBase58()}
                    </div>
                  </div>

                  {parsedAddress.viewKey && (
                    <div>
                      <span className="text-sm font-medium text-blue-700">View Key:</span>
                      <div className="mt-1 font-mono text-xs text-gray-900 break-all bg-white p-2 rounded">
                        {parsedAddress.viewKey.toBase58()}
                      </div>
                    </div>
                  )}

                  {parsedAddress.spendKey && (
                    <div>
                      <span className="text-sm font-medium text-blue-700">Spend Key:</span>
                      <div className="mt-1 font-mono text-xs text-gray-900 break-all bg-white p-2 rounded">
                        {parsedAddress.spendKey.toBase58()}
                      </div>
                    </div>
                  )}

                  {parsedAddress.paymentId && (
                    <div>
                      <span className="text-sm font-medium text-blue-700">Payment ID:</span>
                      <span className="ml-2 font-mono text-sm text-gray-900">
                        {parsedAddress.paymentId}
                      </span>
                    </div>
                  )}

                  {parsedAddress.subaddressIndex !== undefined && (
                    <div>
                      <span className="text-sm font-medium text-blue-700">Subaddress Index:</span>
                      <span className="ml-2 text-sm text-gray-900 font-semibold">
                        {parsedAddress.subaddressIndex}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

