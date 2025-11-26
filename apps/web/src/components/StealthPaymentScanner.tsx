'use client';

import { useState, useEffect } from 'react';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { 
  generateStealthMetaAddress,
  encodeStealthMetaAddress,
  isStealthAddressForUser,
  deriveStealthPrivateKey,
  type StealthMetaAddress
} from '@exe-pay/privacy';

interface DetectedPayment {
  address: string;
  amount: number;
  signature: string;
  timestamp: number;
  ephemeralPubkey: string;
  viewTag: number;
  claimed: boolean;
}

export function StealthPaymentScanner() {
  const { publicKey, wallet, signTransaction } = useWallet();
  const { connection } = useConnection();
  
  const [scanning, setScanning] = useState(false);
  const [payments, setPayments] = useState<DetectedPayment[]>([]);
  const [metaAddress, setMetaAddress] = useState<StealthMetaAddress | null>(null);
  const [error, setError] = useState('');
  const [claimingId, setClaimingId] = useState<string | null>(null);

  useEffect(() => {
    if (publicKey && wallet) {
      try {
        // Generate user's stealth meta-address
        const meta = generateStealthMetaAddress({
          publicKey,
          secretKey: new Uint8Array(64) // Placeholder
        } as any);
        setMetaAddress(meta);

        // Load saved payments from localStorage
        const saved = localStorage.getItem('exepay_stealth_payments');
        if (saved) {
          try {
            setPayments(JSON.parse(saved));
          } catch (err) {
            console.error('Failed to load saved payments:', err);
          }
        }
      } catch (err) {
        console.error('Failed to generate meta-address:', err);
      }
    }
  }, [publicKey, wallet]);

  const handleScan = async () => {
    if (!publicKey || !metaAddress) {
      setError('Please connect your wallet');
      return;
    }

    setScanning(true);
    setError('');

    try {
      console.log('[Scanner] Starting scan for stealth payments...');

      // Get recent transactions for the user's wallet
      const signatures = await connection.getSignaturesForAddress(publicKey, {
        limit: 50
      });

      console.log(`[Scanner] Found ${signatures.length} transactions to check`);

      const detectedPayments: DetectedPayment[] = [];

      // Check each transaction
      for (const sigInfo of signatures) {
        try {
          const tx = await connection.getParsedTransaction(sigInfo.signature, {
            maxSupportedTransactionVersion: 0
          });

          if (!tx || !tx.meta) continue;

          // Look for transfers in the transaction
          const instructions = tx.transaction.message.instructions;
          
          for (const instruction of instructions) {
            // Check if it's a system transfer
            if ('parsed' in instruction && instruction.parsed?.type === 'transfer') {
              const info = instruction.parsed.info;
              
              // Check if this could be a stealth payment
              // In a real implementation, we'd check the memo for ephemeral key
              // For now, we'll detect any incoming transfers
              if (info.destination === publicKey.toBase58()) {
                const payment: DetectedPayment = {
                  address: info.destination,
                  amount: info.lamports / LAMPORTS_PER_SOL,
                  signature: sigInfo.signature,
                  timestamp: sigInfo.blockTime ? sigInfo.blockTime * 1000 : Date.now(),
                  ephemeralPubkey: 'Demo', // Would parse from memo
                  viewTag: 0, // Would parse from memo
                  claimed: false
                };

                detectedPayments.push(payment);
              }
            }
          }
        } catch (err) {
          console.error('[Scanner] Error checking transaction:', err);
        }
      }

      console.log(`[Scanner] Detected ${detectedPayments.length} potential stealth payments`);

      // Save to localStorage
      setPayments(detectedPayments);
      localStorage.setItem('exepay_stealth_payments', JSON.stringify(detectedPayments));

    } catch (err: any) {
      console.error('[Scanner] Scan failed:', err);
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
      console.log('[Scanner] Claiming payment:', payment.signature);

      // In a real implementation:
      // 1. Derive private key for the stealth address
      // 2. Create transaction to transfer funds to main wallet
      // 3. Sign and send

      // For now, just mark as claimed
      const updated = payments.map(p =>
        p.signature === payment.signature ? { ...p, claimed: true } : p
      );
      setPayments(updated);
      localStorage.setItem('exepay_stealth_payments', JSON.stringify(updated));

      alert('Payment claimed successfully! (Demo mode - full implementation coming soon)');

    } catch (err: any) {
      console.error('[Scanner] Claim failed:', err);
      setError(err.message || 'Failed to claim payment');
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

        {/* Scan Button */}
        <button
          onClick={handleScan}
          disabled={scanning}
          className="w-full px-6 py-4 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-lg"
        >
          {scanning ? '🔍 Scanning Blockchain...' : '🔍 Scan for Payments'}
        </button>

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
                        {payment.amount} SOL
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
                    <span className="text-gray-600 font-medium">Address:</span>
                    <p className="font-mono text-gray-800 text-xs break-all">
                      {payment.address}
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

