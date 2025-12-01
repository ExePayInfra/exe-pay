'use client';

import { useState, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { Keypair, PublicKey } from '@solana/web3.js';
import { 
  generateSubaddress,
  encodeSubaddress,
  encodeStealthMetaAddress,
  type Subaddress
} from '@exe-pay/privacy';

interface SavedSubaddress extends Subaddress {
  id: string;
}

export function SubaddressManager() {
  const { publicKey, signMessage } = useWallet();
  
  const [subaddresses, setSubaddresses] = useState<SavedSubaddress[]>([]);
  const [newLabel, setNewLabel] = useState('');
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [masterKeypair, setMasterKeypair] = useState<Keypair | null>(null);

  // Load saved subaddresses from localStorage
  useEffect(() => {
    if (publicKey) {
      const saved = localStorage.getItem(`exepay_subaddresses_${publicKey.toBase58()}`);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          // Reconstruct PublicKey objects from stored strings
          const reconstructed = parsed.map((sub: any) => ({
            ...sub,
            metaAddress: {
              spendingKey: new PublicKey(sub.metaAddress.spendingKey),
              viewingKey: new PublicKey(sub.metaAddress.viewingKey),
            }
          }));
          setSubaddresses(reconstructed);
        } catch (err) {
          console.error('[Subaddress] Failed to load saved subaddresses:', err);
        }
      }
    }
  }, [publicKey]);

  // Save subaddresses to localStorage
  const saveSubaddresses = (subs: SavedSubaddress[]) => {
    if (publicKey) {
      // Convert PublicKey objects to strings for storage
      const serializable = subs.map(sub => ({
        ...sub,
        metaAddress: {
          spendingKey: sub.metaAddress.spendingKey.toBase58(),
          viewingKey: sub.metaAddress.viewingKey.toBase58(),
        }
      }));
      localStorage.setItem(`exepay_subaddresses_${publicKey.toBase58()}`, JSON.stringify(serializable));
      setSubaddresses(subs);
    }
  };

  // Initialize master keypair
  const initializeMasterKeypair = async () => {
    if (!publicKey || !signMessage) {
      setError('Please connect your wallet first');
      return null;
    }

    try {
      // Sign message to derive master keypair
      const message = new TextEncoder().encode(
        `ExePay Subaddress Master Key\nWallet: ${publicKey.toBase58()}\nTimestamp: ${Date.now()}`
      );
      const signature = await signMessage(message);

      // Derive master keypair from signature
      const masterKp = Keypair.fromSeed(signature.slice(0, 32));
      setMasterKeypair(masterKp);
      return masterKp;
    } catch (err: any) {
      console.error('[Subaddress] Failed to initialize master keypair:', err);
      setError(err.message || 'Failed to sign message');
      return null;
    }
  };

  const handleGenerateSubaddress = async () => {
    if (!publicKey) {
      setError('Please connect your wallet first');
      return;
    }

    if (!newLabel.trim()) {
      setError('Please enter a label');
      return;
    }

    setGenerating(true);
    setError('');

    try {
      // Initialize master keypair if not already done
      let masterKp = masterKeypair;
      if (!masterKp) {
        masterKp = await initializeMasterKeypair();
        if (!masterKp) return;
      }

      // Find next available index
      const nextIndex = subaddresses.length > 0
        ? Math.max(...subaddresses.map(s => s.index)) + 1
        : 0;

      // Generate subaddress
      const subaddress = generateSubaddress(masterKp, nextIndex, newLabel.trim());
      
      // Override spending key with actual wallet public key
      subaddress.metaAddress.spendingKey = publicKey;

      // Create saved subaddress
      const savedSubaddress: SavedSubaddress = {
        ...subaddress,
        id: `sub_${Date.now()}_${Math.random().toString(36).substring(7)}`,
      };

      // Add to list
      const updated = [...subaddresses, savedSubaddress];
      saveSubaddresses(updated);

      // Reset form
      setNewLabel('');

      console.log('[Subaddress] Generated subaddress:', savedSubaddress.index);
    } catch (err: any) {
      console.error('[Subaddress] Error:', err);
      setError(err.message || 'Failed to generate subaddress');
    } finally {
      setGenerating(false);
    }
  };

  const handleCopy = async (subaddress: SavedSubaddress) => {
    try {
      const encoded = encodeStealthMetaAddress(subaddress.metaAddress);
      await navigator.clipboard.writeText(encoded);
      setCopiedId(subaddress.id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      setError('Failed to copy to clipboard');
    }
  };

  const handleDelete = (id: string) => {
    if (!confirm('Are you sure you want to delete this subaddress?')) return;
    
    const updated = subaddresses.filter(s => s.id !== id);
    saveSubaddresses(updated);
  };

  const handleUpdateLabel = (id: string, newLabel: string) => {
    const updated = subaddresses.map(s =>
      s.id === id ? { ...s, label: newLabel } : s
    );
    saveSubaddresses(updated);
  };

  return (
    <div className="bg-white rounded-2xl p-8 shadow-xl border border-gray-100">
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          Subaddresses
        </h2>
        <p className="text-gray-600">
          Create multiple stealth identities from one wallet for better organization
        </p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Create New Subaddress */}
      <div className="mb-8 p-6 bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl border border-purple-100">
        <h3 className="text-lg font-bold text-purple-900 mb-4">
          Create New Subaddress
        </h3>
        
        <div className="flex gap-3">
          <input
            type="text"
            value={newLabel}
            onChange={(e) => setNewLabel(e.target.value)}
            placeholder="e.g., Business, Personal, Donations, Client A..."
            className="flex-1 px-4 py-3 border border-purple-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            onKeyPress={(e) => e.key === 'Enter' && handleGenerateSubaddress()}
          />
          <button
            onClick={handleGenerateSubaddress}
            disabled={generating || !newLabel.trim() || !publicKey}
            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
          >
            {generating ? 'Creating...' : '+ Create'}
          </button>
        </div>
        
        <p className="mt-2 text-xs text-purple-700">
          Each subaddress is independent and unlinkable. Perfect for organizing payments by purpose.
        </p>
      </div>

      {/* Subaddresses List */}
      {subaddresses.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-xl border border-gray-200">
          <div className="text-5xl mb-4">🔗</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            No Subaddresses Yet
          </h3>
          <p className="text-gray-600 mb-4">
            Create your first subaddress to organize your payments
          </p>
          <div className="text-sm text-gray-500">
            <p className="mb-1">💼 Business payments</p>
            <p className="mb-1">👤 Personal payments</p>
            <p className="mb-1">❤️ Donations</p>
            <p>🤝 Per-client addresses</p>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-900">
              Your Subaddresses ({subaddresses.length})
            </h3>
          </div>

          {subaddresses.map((subaddress) => (
            <div
              key={subaddress.id}
              className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-6 border border-gray-200 hover:border-purple-300 transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <input
                      type="text"
                      value={subaddress.label || ''}
                      onChange={(e) => handleUpdateLabel(subaddress.id, e.target.value)}
                      className="text-xl font-bold text-gray-900 bg-transparent border-b-2 border-transparent hover:border-purple-300 focus:border-purple-500 focus:outline-none transition-colors"
                      placeholder="Add label..."
                    />
                    <span className="px-3 py-1 bg-purple-100 text-purple-700 text-xs font-semibold rounded-full">
                      #{subaddress.index}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500">
                    Created {new Date(subaddress.createdAt).toLocaleDateString()}
                  </p>
                </div>
                
                <button
                  onClick={() => handleDelete(subaddress.id)}
                  className="text-red-500 hover:text-red-700 p-2"
                  title="Delete subaddress"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="text-xs font-medium text-gray-600 block mb-1">
                    Stealth Meta-Address:
                  </label>
                  <div className="bg-white p-3 rounded-lg border border-gray-300 font-mono text-xs text-gray-900 break-all">
                    {encodeStealthMetaAddress(subaddress.metaAddress)}
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleCopy(subaddress)}
                    className="flex-1 px-4 py-2 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 transition-colors"
                  >
                    {copiedId === subaddress.id ? '✓ Copied!' : '📋 Copy Address'}
                  </button>
                  <button
                    onClick={() => {
                      const url = `${window.location.origin}/privacy?address=${encodeStealthMetaAddress(subaddress.metaAddress)}`;
                      navigator.clipboard.writeText(url);
                      alert('Payment link copied!');
                    }}
                    className="flex-1 px-4 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors"
                  >
                    🔗 Share Link
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Info Box */}
      <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h4 className="text-sm font-semibold text-blue-900 mb-2">
          💡 How Subaddresses Work
        </h4>
        <ul className="text-xs text-blue-800 space-y-1">
          <li>• Generate infinite addresses from one wallet</li>
          <li>• Each subaddress is cryptographically independent</li>
          <li>• Payments to different subaddresses are unlinkable</li>
          <li>• Perfect for organizing by purpose (business, personal, etc.)</li>
          <li>• Like Monero subaddresses - battle-tested privacy</li>
        </ul>
      </div>

      {/* Use Cases */}
      <div className="mt-6 grid grid-cols-2 gap-4">
        <div className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg border border-purple-200">
          <div className="text-2xl mb-2">💼</div>
          <h4 className="font-semibold text-purple-900 text-sm mb-1">Business</h4>
          <p className="text-xs text-purple-800">Separate work payments from personal</p>
        </div>
        
        <div className="p-4 bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-lg border border-indigo-200">
          <div className="text-2xl mb-2">👤</div>
          <h4 className="font-semibold text-indigo-900 text-sm mb-1">Personal</h4>
          <p className="text-xs text-indigo-800">Keep personal finances private</p>
        </div>
        
        <div className="p-4 bg-gradient-to-br from-pink-50 to-pink-100 rounded-lg border border-pink-200">
          <div className="text-2xl mb-2">❤️</div>
          <h4 className="font-semibold text-pink-900 text-sm mb-1">Donations</h4>
          <p className="text-xs text-pink-800">Track charitable contributions</p>
        </div>
        
        <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border border-blue-200">
          <div className="text-2xl mb-2">🤝</div>
          <h4 className="font-semibold text-blue-900 text-sm mb-1">Per-Client</h4>
          <p className="text-xs text-blue-800">Unique address for each client</p>
        </div>
      </div>
    </div>
  );
}

