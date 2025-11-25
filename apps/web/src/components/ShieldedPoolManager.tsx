'use client';

import { useState, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { Connection, LAMPORTS_PER_SOL } from '@solana/web3.js';

interface ShieldedPoolManagerProps {
  onBalanceChange?: (balance: bigint) => void;
}

export function ShieldedPoolManager({ onBalanceChange }: ShieldedPoolManagerProps) {
  const { publicKey, signTransaction, connected } = useWallet();
  const [shieldedBalance, setShieldedBalance] = useState<bigint>(0n);
  const [regularBalance, setRegularBalance] = useState<number>(0);
  const [depositAmount, setDepositAmount] = useState('');
  const [depositing, setDepositing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showDeposit, setShowDeposit] = useState(false);

  // Fetch balances
  useEffect(() => {
    if (!publicKey || !connected) {
      setShieldedBalance(0n);
      setRegularBalance(0);
      return;
    }

    fetchBalances();
    const interval = setInterval(fetchBalances, 10000); // Refresh every 10s
    return () => clearInterval(interval);
  }, [publicKey, connected]);

  const fetchBalances = async () => {
    if (!publicKey) return;

    try {
      // Fetch regular balance
      const rpcUrl = process.env.NEXT_PUBLIC_SOLANA_RPC_URL || 'https://api.devnet.solana.com';
      const connection = new Connection(rpcUrl, 'confirmed');
      const balance = await connection.getBalance(publicKey);
      setRegularBalance(balance / LAMPORTS_PER_SOL);

      // Fetch shielded balance
      const { getShieldedBalance, getLightProtocolClient } = await import('@/lib/lightProtocol');
      const lightRpc = getLightProtocolClient();
      const shielded = await getShieldedBalance(lightRpc, publicKey);
      setShieldedBalance(shielded.amount);
      onBalanceChange?.(shielded.amount);

    } catch (err: any) {
      console.error('[Shielded Pool] Error fetching balances:', err);
    }
  };

  const handleDeposit = async () => {
    if (!publicKey || !signTransaction) {
      setError('Wallet not connected');
      return;
    }

    const amount = parseFloat(depositAmount);
    if (isNaN(amount) || amount <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    if (amount > regularBalance) {
      setError(`Insufficient balance. You have ${regularBalance.toFixed(4)} SOL`);
      return;
    }

    setDepositing(true);
    setError(null);
    setSuccess(null);

    try {
      console.log('[Shielded Pool] 🔒 Depositing', amount, 'SOL...');

      // Import Light Protocol functions
      const { depositToShieldedPool, getLightProtocolClient, updateDemoShieldedBalance } = await import('@/lib/lightProtocol');

      // Get RPC clients
      const lightRpc = getLightProtocolClient();
      const rpcUrl = process.env.NEXT_PUBLIC_SOLANA_RPC_URL || 'https://api.devnet.solana.com';
      const connection = new Connection(rpcUrl, 'confirmed');

      // Convert to lamports
      const lamports = BigInt(Math.floor(amount * LAMPORTS_PER_SOL));

      // Deposit to shielded pool
      const signature = await depositToShieldedPool(
        lightRpc,
        connection,
        publicKey,
        signTransaction,
        lamports
      );

      console.log('[Shielded Pool] ✅ Deposit successful!');
      console.log('[Shielded Pool] Signature:', signature);

      // Update demo balance if in demonstration mode
      if (signature.startsWith('demo_')) {
        updateDemoShieldedBalance(publicKey, lamports);
      }

      setSuccess(`Successfully deposited ${amount} SOL to shielded pool!`);
      setDepositAmount('');
      setShowDeposit(false);

      // Refresh balances
      setTimeout(fetchBalances, 1000);

    } catch (err: any) {
      console.error('[Shielded Pool] ❌ Deposit failed:', err);
      setError(err.message || 'Failed to deposit');
    } finally {
      setDepositing(false);
    }
  };

  // Don't show anything if wallet not connected
  if (!connected || !publicKey) {
    return null;
  }

  const shieldedBalanceSOL = Number(shieldedBalance) / LAMPORTS_PER_SOL;

  return (
    <div className="mb-6 space-y-4">
      {/* Balance Display */}
      <div className="grid grid-cols-2 gap-4">
        {/* Regular Balance */}
        <div className="p-4 bg-white border border-gray-200 rounded-lg">
          <div className="text-xs text-gray-500 mb-1">Regular Balance</div>
          <div className="text-2xl font-bold text-gray-900">
            {regularBalance.toFixed(4)} <span className="text-sm font-normal text-gray-500">SOL</span>
          </div>
          <div className="text-xs text-gray-400 mt-1">Visible on-chain</div>
        </div>

        {/* Shielded Balance */}
        <div className="p-4 bg-gradient-to-br from-purple-50 to-indigo-50 border border-purple-200 rounded-lg">
          <div className="text-xs text-purple-600 mb-1 font-medium">🔒 Shielded Balance</div>
          <div className="text-2xl font-bold text-purple-900">
            {shieldedBalanceSOL.toFixed(4)} <span className="text-sm font-normal text-purple-600">SOL</span>
          </div>
          <div className="text-xs text-purple-500 mt-1">Hidden on-chain</div>
        </div>
      </div>

      {/* Success Message */}
      {success && (
        <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-start space-x-2">
            <svg className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div className="flex-1">
              <p className="text-sm text-green-900 font-medium">{success}</p>
              <p className="text-xs text-green-700 mt-1">
                Your funds are now private and hidden on-chain
              </p>
            </div>
            <button
              onClick={() => setSuccess(null)}
              className="text-green-600 hover:text-green-700"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Deposit Section */}
      {!showDeposit ? (
        <button
          onClick={() => setShowDeposit(true)}
          className="w-full px-4 py-3 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center space-x-2"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          <span>Deposit to Shielded Pool</span>
        </button>
      ) : (
        <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-purple-900">Deposit to Shielded Pool</h3>
            <button
              onClick={() => {
                setShowDeposit(false);
                setError(null);
                setDepositAmount('');
              }}
              className="text-purple-600 hover:text-purple-700"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <p className="text-xs text-purple-700 mb-3">
            Shield your SOL to make it private. Amount and owner will be hidden on-chain.
          </p>

          {error && (
            <div className="mb-3 p-2 bg-red-50 border border-red-200 rounded text-xs text-red-700">
              {error}
            </div>
          )}

          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-purple-900 mb-1">
                Amount (SOL)
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(e.target.value)}
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                  max={regularBalance}
                  className="w-full px-3 py-2 border border-purple-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900 placeholder-gray-400"
                  disabled={depositing}
                />
                <button
                  onClick={() => setDepositAmount(regularBalance.toString())}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-purple-600 hover:text-purple-700 font-medium"
                  disabled={depositing}
                >
                  MAX
                </button>
              </div>
              <p className="text-xs text-purple-600 mt-1">
                Available: {regularBalance.toFixed(4)} SOL
              </p>
            </div>

            <button
              onClick={handleDeposit}
              disabled={depositing || !depositAmount}
              className="w-full px-4 py-2 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {depositing ? (
                <span className="flex items-center justify-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Depositing...</span>
                </span>
              ) : (
                <span className="flex items-center justify-center space-x-2">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  <span>Deposit & Shield</span>
                </span>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Info Box */}
      <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex items-start space-x-2">
          <svg className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div className="text-xs text-blue-900">
            <p className="font-medium mb-1">About Shielded Pool</p>
            <p className="text-blue-700">
              Funds in the shielded pool are hidden on-chain using ZK compression. 
              You can send private payments from your shielded balance without revealing amounts or recipients.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

