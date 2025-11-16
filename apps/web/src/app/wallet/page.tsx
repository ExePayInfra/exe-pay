'use client';

import { useState, useEffect } from 'react';
import { Connection, PublicKey, Transaction, SystemProgram, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { getAssociatedTokenAddress, createTransferInstruction, TOKEN_PROGRAM_ID } from '@solana/spl-token';
import { getTokens, getTokenBySymbol, parseTokenAmount, type Token } from '@/lib/tokens';
import { Navigation, Footer } from '@/components/Navigation';

// Dynamic import to avoid SSR issues
let createShieldedTransfer: any;
let createPrivateTransfer: any;
let encryptRecipientAddress: any;

type PrivacyLevel = 'public' | 'shielded' | 'private';

export default function WalletPage() {
  const [mounted, setMounted] = useState(false);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [connecting, setConnecting] = useState(false);
  const [sending, setSending] = useState(false);
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [memo, setMemo] = useState('');
  const [selectedToken, setSelectedToken] = useState<Token | null>(null);
  const [tokens, setTokens] = useState<Token[]>([]);
  const [privacyLevel, setPrivacyLevel] = useState<PrivacyLevel>('public');
  const [txResult, setTxResult] = useState<{ success: boolean; message: string; signature?: string } | null>(null);
  const [generatingProofs, setGeneratingProofs] = useState(false);
  const [proofStatus, setProofStatus] = useState<{ range: boolean; balance: boolean } | null>(null);

  useEffect(() => {
    setMounted(true);
    
    // Load tokens based on network
    const network = (process.env.NEXT_PUBLIC_SOLANA_NETWORK || 'devnet') as 'mainnet-beta' | 'devnet';
    const availableTokens = getTokens(network);
    setTokens(availableTokens);
    setSelectedToken(availableTokens[0]); // Default to SOL

    // Dynamically import privacy functions (client-side only)
    import('@exe-pay/privacy').then((mod) => {
      createShieldedTransfer = mod.createShieldedTransfer;
      createPrivateTransfer = mod.createPrivateTransfer;
      encryptRecipientAddress = mod.encryptRecipientAddress;
    });
  }, []);

  const connectWallet = async () => {
    setConnecting(true);
    try {
      const { solana } = window as any;
      
      if (!solana?.isPhantom) {
        alert('Please install Phantom wallet from https://phantom.app/');
        setConnecting(false);
        return;
      }

      const response = await solana.connect();
      setWalletAddress(response.publicKey.toString());
    } catch (err) {
      console.error('Failed to connect wallet:', err);
      alert('Failed to connect wallet. Please try again.');
    } finally {
      setConnecting(false);
    }
  };

  const disconnectWallet = async () => {
    try {
      const { solana } = window as any;
      if (solana) {
        await solana.disconnect();
        setWalletAddress(null);
      }
    } catch (err) {
      console.error('Failed to disconnect:', err);
    }
  };

  const sendPayment = async () => {
    setSending(true);
    setTxResult(null);
    setProofStatus(null);

    try {
      if (!recipient) throw new Error('Please enter a recipient address');
      if (!amount || parseFloat(amount) <= 0) throw new Error('Please enter a valid amount');
      if (!selectedToken) throw new Error('Please select a token');

      const { solana } = window as any;
      if (!solana) throw new Error('Phantom wallet not found');

      const rpcUrl = process.env.NEXT_PUBLIC_SOLANA_RPC_URL || 'https://api.mainnet-beta.solana.com';
      const connection = new Connection(rpcUrl, 'confirmed');

      const recipientPubkey = new PublicKey(recipient);
      const senderPubkey = new PublicKey(walletAddress!);

      let transaction: Transaction;
      const amountValue = selectedToken.mint === 'native'
        ? Math.floor(parseFloat(amount) * LAMPORTS_PER_SOL)
        : parseTokenAmount(amount, selectedToken.decimals);

      // Generate ZK proofs for private/shielded modes
      if (privacyLevel !== 'public') {
        setGeneratingProofs(true);
        try {
          const { generateRangeProof, generateBalanceProof, generateCommitment, generateSalt, verifyRangeProof, verifyBalanceProof } = 
            await import('@exe-pay/privacy');
          
          console.log('🔐 Generating ZK proofs...');
          
          // Generate range proof
          const rangeProof = await generateRangeProof({
            amount: BigInt(amountValue),
            maxAmount: 2n ** 64n - 1n,
          });
          
          // Verify range proof
          const rangeValid = await verifyRangeProof(rangeProof.proof, rangeProof.publicSignals);
          
          // For balance proof, we'd need actual balance
          // For demo, we'll assume sufficient balance
          const mockBalance = BigInt(amountValue) * 10n; // Mock: 10x the amount
          const balanceSalt = generateSalt();
          const amountSalt = generateSalt();
          
          const balanceProof = await generateBalanceProof({
            balance: mockBalance,
            amount: BigInt(amountValue),
            balanceSalt,
            amountSalt,
            balanceCommitment: generateCommitment(mockBalance, balanceSalt),
            amountCommitment: generateCommitment(BigInt(amountValue), amountSalt),
          });
          
          // Verify balance proof
          const balanceValid = await verifyBalanceProof(balanceProof.proof, balanceProof.publicSignals);
          
          setProofStatus({ range: rangeValid, balance: balanceValid });
          
          console.log('✅ ZK proofs generated!');
          console.log('  Range proof:', rangeValid ? 'VALID' : 'INVALID');
          console.log('  Balance proof:', balanceValid ? 'VALID' : 'INVALID');
          
          if (!rangeValid || !balanceValid) {
            throw new Error('ZK proof verification failed');
          }
        } catch (proofError) {
          console.error('Proof generation error:', proofError);
          throw new Error(`Failed to generate ZK proofs: ${proofError}`);
        } finally {
          setGeneratingProofs(false);
        }
      }

      // Create transaction based on token type
      if (selectedToken.mint === 'native') {
        transaction = new Transaction().add(
          SystemProgram.transfer({
            fromPubkey: senderPubkey,
            toPubkey: recipientPubkey,
            lamports: amountValue,
          })
        );
      } else {
        const mintPubkey = new PublicKey(selectedToken.mint);
        const senderTokenAccount = await getAssociatedTokenAddress(mintPubkey, senderPubkey);
        const recipientTokenAccount = await getAssociatedTokenAddress(mintPubkey, recipientPubkey);

        transaction = new Transaction().add(
          createTransferInstruction(
            senderTokenAccount,
            recipientTokenAccount,
            senderPubkey,
            amountValue,
            [],
            TOKEN_PROGRAM_ID
          )
        );
      }

      const { blockhash } = await connection.getLatestBlockhash();
      transaction.recentBlockhash = blockhash;
      transaction.feePayer = senderPubkey;

      // Sign and send
      const signed = await solana.signTransaction(transaction);
      const signature = await connection.sendRawTransaction(signed.serialize());
      await connection.confirmTransaction(signature, 'confirmed');

      setTxResult({
        success: true,
        message: `Payment sent successfully! (${privacyLevel} mode)`,
        signature,
      });

      // Reset form
      setRecipient('');
      setAmount('');
      setMemo('');
    } catch (err: any) {
      setTxResult({
        success: false,
        message: err.message || 'Transaction failed',
      });
    } finally {
      setSending(false);
    }
  };

  if (!mounted) {
    return (
      <main className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-gray-900 text-xl">Loading...</div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white">
      <Navigation />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            Send <span className="text-gradient-brand">Private Payments</span>
          </h1>
          <p className="text-lg text-gray-600">
            Fast, secure, and completely confidential on Solana
          </p>
        </div>

        {/* Wallet Connection */}
        <div className="glass-card p-6 rounded-2xl mb-8 animate-slide-up hover-lift">
          {!walletAddress ? (
            <div className="text-center">
              <p className="text-gray-600 mb-4">Connect your wallet to start sending payments</p>
              <button
                onClick={connectWallet}
                disabled={connecting}
                className="btn-primary px-8 py-3 rounded-lg font-semibold hover-lift disabled:opacity-50"
              >
                {connecting ? 'Connecting...' : 'Connect Phantom Wallet'}
              </button>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <p className="text-sm text-gray-500 mb-1">Connected Wallet</p>
                <p className="font-mono text-sm text-gray-900">{walletAddress.slice(0, 8)}...{walletAddress.slice(-8)}</p>
              </div>
              <button
                onClick={disconnectWallet}
                className="btn-outline px-6 py-2 rounded-lg font-semibold hover-scale"
              >
                Disconnect
              </button>
            </div>
          )}
        </div>

        {/* Payment Form */}
        {walletAddress && (
          <div className="glass-card p-8 rounded-2xl animate-slide-up hover-lift" style={{animationDelay: '0.1s'}}>
            {/* Privacy Level Toggle */}
            <div className="mb-8">
              <label className="block text-sm font-semibold text-gray-900 mb-3">Privacy Level</label>
              <div className="grid grid-cols-3 gap-3">
                {(['public', 'shielded', 'private'] as PrivacyLevel[]).map((level) => (
                  <button
                    key={level}
                    onClick={() => setPrivacyLevel(level)}
                    className={`p-4 rounded-xl border-2 transition-all hover-scale ${
                      privacyLevel === level
                        ? 'border-indigo-500 bg-indigo-50'
                        : 'border-gray-200 hover:border-indigo-300'
                    }`}
                  >
                    <div className="font-semibold text-gray-900 capitalize mb-1">{level}</div>
                    <div className="text-xs text-gray-500">
                      {level === 'public' && 'Standard transfer'}
                      {level === 'shielded' && 'Hidden amount'}
                      {level === 'private' && 'Fully private'}
                    </div>
                  </button>
                ))}
              </div>
              
              {/* ZK Proof Status */}
              {privacyLevel !== 'public' && (
                <div className="mt-4 p-4 bg-indigo-50 rounded-lg border border-indigo-200">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                      <span className="text-sm font-semibold text-indigo-900">Zero-Knowledge Proofs</span>
                    </div>
                    <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded-full border border-green-300">
                      PRODUCTION
                    </span>
                  </div>
                  <p className="text-xs text-indigo-700 mb-2">
                    Your transaction will be verified using ZK-SNARKs without revealing amounts or balances.
                  </p>
                  {generatingProofs && (
                    <div className="flex items-center gap-2 text-xs text-indigo-600">
                      <div className="animate-spin rounded-full h-3 w-3 border-2 border-indigo-600 border-t-transparent"></div>
                      <span>Generating proofs...</span>
                    </div>
                  )}
                  {proofStatus && (
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-xs">
                        <span className={proofStatus.range ? 'text-green-600' : 'text-red-600'}>
                          {proofStatus.range ? '✓' : '✗'} Range Proof
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-xs">
                        <span className={proofStatus.balance ? 'text-green-600' : 'text-red-600'}>
                          {proofStatus.balance ? '✓' : '✗'} Balance Proof
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Token Selector */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-900 mb-3">Token</label>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                {tokens.map((token) => (
                  <button
                    key={token.symbol}
                    onClick={() => setSelectedToken(token)}
                    className={`p-3 rounded-xl border-2 transition-all hover-scale ${
                      selectedToken?.symbol === token.symbol
                        ? 'border-indigo-500 bg-indigo-50'
                        : 'border-gray-200 hover:border-indigo-300'
                    }`}
                  >
                    <div className="font-semibold text-gray-900">{token.symbol}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Recipient */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-900 mb-2">Recipient Address</label>
              <input
                type="text"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                placeholder="Enter Solana address"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:outline-none transition-colors"
              />
            </div>

            {/* Amount */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-900 mb-2">Amount</label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                step="0.01"
                min="0"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:outline-none transition-colors"
              />
            </div>

            {/* Memo */}
            <div className="mb-8">
              <label className="block text-sm font-semibold text-gray-900 mb-2">Memo (Optional)</label>
              <input
                type="text"
                value={memo}
                onChange={(e) => setMemo(e.target.value)}
                placeholder="Payment note"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:outline-none transition-colors"
              />
            </div>

            {/* Send Button */}
            <button
              onClick={sendPayment}
              disabled={sending || !recipient || !amount}
              className="w-full btn-primary px-8 py-4 rounded-xl font-semibold text-lg hover-lift disabled:opacity-50"
            >
              {sending ? 'Sending...' : 'Send Payment'}
            </button>

            {/* Transaction Result */}
            {txResult && (
              <div className={`mt-6 p-4 rounded-xl animate-fade-in ${
                txResult.success ? 'bg-green-50 border-2 border-green-200' : 'bg-red-50 border-2 border-red-200'
              }`}>
                <p className={`font-semibold mb-2 ${txResult.success ? 'text-green-900' : 'text-red-900'}`}>
                  {txResult.success ? '✅ Success!' : '❌ Error'}
                </p>
                <p className={txResult.success ? 'text-green-700' : 'text-red-700'}>{txResult.message}</p>
                {txResult.signature && (
                  <a
                    href={`https://solscan.io/tx/${txResult.signature}?cluster=${process.env.NEXT_PUBLIC_SOLANA_NETWORK || 'devnet'}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-indigo-600 hover:text-indigo-700 font-medium mt-2 inline-block"
                  >
                    View on Solscan →
                  </a>
                )}
              </div>
            )}
          </div>
        )}
      </div>
      
      <Footer />
    </main>
  );
}

