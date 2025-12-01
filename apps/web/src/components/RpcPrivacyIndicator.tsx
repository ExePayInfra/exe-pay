'use client';

import { useState, useEffect } from 'react';
import { useConnection } from '@solana/wallet-adapter-react';
import { getRpcPrivacyStats, type RpcStats } from '@exe-pay/privacy';

export function RpcPrivacyIndicator() {
  const { connection } = useConnection();
  const [stats, setStats] = useState<RpcStats | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    if (connection) {
      const privacyStats = getRpcPrivacyStats(connection);
      setStats(privacyStats);
    }
  }, [connection]);

  if (!stats) return null;

  return (
    <div className="fixed bottom-4 right-4 z-40">
      <button
        onClick={() => setShowDetails(!showDetails)}
        className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 py-2 rounded-full shadow-lg hover:shadow-xl transition-all flex items-center gap-2 group"
      >
        <span className="text-lg">🔐</span>
        <span className="text-sm font-semibold">IP Protected</span>
        <svg 
          className={`w-4 h-4 transition-transform ${showDetails ? 'rotate-180' : ''}`} 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {showDetails && (
        <div className="absolute bottom-14 right-0 bg-white rounded-xl shadow-2xl border border-gray-200 p-4 w-80 animate-fade-in">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-bold text-gray-900 flex items-center gap-2">
              <span>🔐</span>
              <span>RPC Privacy Active</span>
            </h4>
            <button
              onClick={() => setShowDetails(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          </div>

          <div className="space-y-3 text-sm">
            <div className="bg-green-50 rounded-lg p-3 border border-green-200">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-green-600">✅</span>
                <span className="font-semibold text-green-900">Your IP is hidden</span>
              </div>
              <p className="text-xs text-green-800">
                Transactions are routed through multiple RPC providers
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Current RPC:</span>
                <span className="font-mono text-xs text-gray-900 truncate max-w-[150px]">
                  {new URL(stats.currentEndpoint).hostname}
                </span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Available RPCs:</span>
                <span className="font-semibold text-gray-900">
                  {stats.totalEndpoints}
                </span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Rotations:</span>
                <span className="font-semibold text-gray-900">
                  {stats.rotationCount}
                </span>
              </div>
            </div>

            <div className="pt-3 border-t border-gray-200">
              <p className="text-xs text-gray-600">
                <strong>How it works:</strong> Each transaction uses a random RPC endpoint, making it harder to track your IP address and correlate transactions.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

