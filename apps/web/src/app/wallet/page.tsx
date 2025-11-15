'use client';

import { useState, useEffect } from 'react';
import { Connection, PublicKey, Transaction, SystemProgram, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { getAssociatedTokenAddress, createTransferInstruction, TOKEN_PROGRAM_ID } from '@solana/spl-token';
import { getTokens, getTokenBySymbol, parseTokenAmount, type Token } from '@/lib/tokens';

// Dynamic import to avoid SSR issues
let createShieldedTransfer: any;
let createPrivateTransfer: any;
let encryptRecipientAddress: any;

type PrivacyLevel = 'public' | 'shielded' | 'private';

export default function WalletWorkingPage() {
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
      // Check if Phantom is installed
      const { solana } = window as any;
      
      if (!solana?.isPhantom) {
        alert('Please install Phantom wallet from https://phantom.app/');
        setConnecting(false);
        return;
      }

      // Connect to Phantom
      const response = await solana.connect();
      setWalletAddress(response.publicKey.toString());
      console.log('Connected to wallet:', response.publicKey.toString());
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

    try {
      // Validate inputs
      if (!recipient) {
        throw new Error('Please enter a recipient address');
      }
      if (!amount || parseFloat(amount) <= 0) {
        throw new Error('Please enter a valid amount');
      }
      if (!selectedToken) {
        throw new Error('Please select a token');
      }

      const { solana } = window as any;
      if (!solana) {
        throw new Error('Phantom wallet not found');
      }

      // Get RPC endpoint from env or use default
      const rpcUrl = process.env.NEXT_PUBLIC_SOLANA_RPC_URL || 'https://api.mainnet-beta.solana.com';
      const connection = new Connection(rpcUrl, 'confirmed');

      // Create recipient public key
      const recipientPubkey = new PublicKey(recipient);
      const senderPubkey = new PublicKey(walletAddress!);

      let transaction: Transaction;
      let privacyInfo: { mode: string; isDemo: boolean; commitment?: Uint8Array; nullifier?: Uint8Array } = {
        mode: privacyLevel,
        isDemo: false,
      };

      // Calculate amount in lamports/tokens
      const amountValue = selectedToken.mint === 'native'
        ? Math.floor(parseFloat(amount) * LAMPORTS_PER_SOL)
        : parseTokenAmount(amount, selectedToken.decimals);

      // Handle different privacy levels
      if (privacyLevel === 'shielded') {
        // SHIELDED MODE: Amount hidden, addresses visible
        const result = await createShieldedTransfer({
          sender: senderPubkey,
          recipient: recipientPubkey,
          amount: amountValue,
          token: selectedToken.mint === 'native' ? undefined : new PublicKey(selectedToken.mint),
          connection,
        });

        transaction = result.transaction;
        privacyInfo = {
          mode: 'shielded',
          isDemo: result.isDemo,
          commitment: result.commitment,
        };
      } else if (privacyLevel === 'private') {
        // PRIVATE MODE: Everything hidden
        const encryptedRecipient = encryptRecipientAddress(recipientPubkey);
        
        const result = await createPrivateTransfer({
          senderKeypair: senderPubkey,
          recipientAddress: encryptedRecipient,
          amount: amountValue,
          token: selectedToken.mint === 'native' ? undefined : new PublicKey(selectedToken.mint),
          connection,
        });

        transaction = result.transaction;
        privacyInfo = {
          mode: 'private',
          isDemo: result.isDemo,
          nullifier: result.nullifier,
        };
      } else {
        // PUBLIC MODE: Standard transfer (current functionality)
        if (selectedToken.mint === 'native') {
          // Native SOL transfer
          transaction = new Transaction().add(
            SystemProgram.transfer({
              fromPubkey: senderPubkey,
              toPubkey: recipientPubkey,
              lamports: amountValue,
            })
          );
        } else {
          // SPL Token transfer
          const mintPubkey = new PublicKey(selectedToken.mint);

          // Get associated token accounts
          const senderTokenAccount = await getAssociatedTokenAddress(
            mintPubkey,
            senderPubkey
          );

          const recipientTokenAccount = await getAssociatedTokenAddress(
            mintPubkey,
            recipientPubkey
          );

          // Create transfer instruction
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

        // Get recent blockhash for public transactions
        const { blockhash } = await connection.getLatestBlockhash();
        transaction.recentBlockhash = blockhash;
        transaction.feePayer = senderPubkey;

        privacyInfo = { mode: 'public', isDemo: false };
      }

      // Sign and send transaction
      const signed = await solana.signAndSendTransaction(transaction);
      console.log('Transaction sent:', signed.signature);

      // Wait for confirmation
      await connection.confirmTransaction(signed.signature, 'confirmed');

      // Build success message based on privacy level
      let successMessage = `✅ Sent ${amount} ${selectedToken.symbol} successfully!`;
      
      if (privacyInfo.mode === 'shielded') {
        successMessage += privacyInfo.isDemo 
          ? '\n🛡️ Amount Hidden (Demo Mode)' 
          : '\n🛡️ Amount Hidden with Pedersen Commitment';
      } else if (privacyInfo.mode === 'private') {
        successMessage += privacyInfo.isDemo 
          ? '\n🔒 Fully Private (Demo Mode)' 
          : '\n🔒 Fully Private with zk-SNARKs';
      } else {
        successMessage += '\n🌐 Public Transaction';
      }

      setTxResult({
        success: true,
        message: successMessage,
        signature: signed.signature,
      });

      // Clear form
      setRecipient('');
      setAmount('');
      setMemo('');

    } catch (err: any) {
      console.error('Payment failed:', err);
      setTxResult({
        success: false,
        message: `❌ ${err.message || 'Payment failed. Please try again.'}`,
      });
    } finally {
      setSending(false);
    }
  };

  if (!mounted) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Header */}
      <nav className="border-b border-white/10 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">E</span>
              </div>
              <a href="/" className="text-2xl font-bold text-white hover:text-cyan-300 transition-colors">ExePay</a>
            </div>
            <div className="flex items-center gap-4">
              <a href="/" className="px-4 py-2 text-white hover:text-cyan-300 font-medium transition-colors">
                Home
              </a>
              <a href="/batch" className="px-4 py-2 text-white hover:text-cyan-300 font-medium transition-colors">
                Batch
              </a>
              <a href="/recurring" className="px-4 py-2 text-white hover:text-cyan-300 font-medium transition-colors">
                Recurring
              </a>
              <a href="/history" className="px-4 py-2 text-white hover:text-cyan-300 font-medium transition-colors">
                History
              </a>
              
              {walletAddress ? (
                <button
                  onClick={disconnectWallet}
                  className="px-4 py-2 bg-red-500/20 border border-red-500/50 rounded-lg text-red-200 hover:bg-red-500/30 font-medium transition-all"
                >
                  {walletAddress.slice(0, 4)}...{walletAddress.slice(-4)}
                </button>
              ) : (
                <button
                  onClick={connectWallet}
                  disabled={connecting}
                  className="px-6 py-2 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-lg text-white font-semibold hover:from-purple-600 hover:to-pink-600 transition-all disabled:opacity-50"
                >
                  {connecting ? 'Connecting...' : 'Connect Wallet'}
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h2 className="text-5xl font-bold text-white mb-4">
            Send Private Payments with{' '}
            <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
              Your Wallet
            </span>
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Connect your Phantom wallet and send privacy-preserving payments powered by Light Protocol.
          </p>
        </div>

        {/* Wallet Status */}
        {!walletAddress ? (
          <div className="max-w-2xl mx-auto mb-8">
            <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-8 text-center">
              <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Connect Your Wallet</h3>
              <p className="text-blue-200 mb-6">
                To send payments, please connect your Phantom wallet
              </p>
              <button
                onClick={connectWallet}
                disabled={connecting}
                className="px-8 py-4 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-lg text-white font-semibold hover:from-purple-600 hover:to-pink-600 transition-all disabled:opacity-50 shadow-lg"
              >
                {connecting ? 'Connecting...' : 'Connect Phantom Wallet'}
              </button>
            </div>
          </div>
        ) : (
          <div className="max-w-2xl mx-auto mb-8">
            <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="text-sm text-green-200 font-medium">Wallet Connected ✅</p>
                  <p className="text-xs text-green-300 font-mono">{walletAddress}</p>
                </div>
                <button
                  onClick={disconnectWallet}
                  className="px-4 py-2 bg-red-500/20 border border-red-500/50 rounded-lg text-red-200 hover:bg-red-500/30 text-sm font-medium transition-all"
                >
                  Disconnect
                </button>
              </div>
            </div>

            {/* Payment Form */}
            <div className="mt-8 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-8">
              <h3 className="text-2xl font-bold text-white mb-6">Send Payment</h3>
              
              <div className="space-y-6">
                {/* Privacy Level Selector */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Privacy Level
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {/* Public */}
                    <button
                      type="button"
                      onClick={() => setPrivacyLevel('public')}
                      disabled={sending}
                      className={`p-4 rounded-lg border-2 transition-all text-left ${
                        privacyLevel === 'public'
                          ? 'border-green-500 bg-green-500/20'
                          : 'border-white/20 bg-white/5 hover:border-green-400/50'
                      } disabled:opacity-50`}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xl">🌐</span>
                        <span className="text-white font-semibold">Public</span>
                      </div>
                      <p className="text-xs text-gray-400">Fast & cheap</p>
                      <p className="text-xs text-gray-500 mt-1">Fully visible</p>
                    </button>

                    {/* Shielded */}
                    <button
                      type="button"
                      onClick={() => setPrivacyLevel('shielded')}
                      disabled={sending}
                      className={`p-4 rounded-lg border-2 transition-all text-left ${
                        privacyLevel === 'shielded'
                          ? 'border-cyan-500 bg-cyan-500/20'
                          : 'border-white/20 bg-white/5 hover:border-cyan-400/50'
                      } disabled:opacity-50`}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xl">🛡️</span>
                        <span className="text-white font-semibold">Shielded</span>
                      </div>
                      <p className="text-xs text-gray-400">Amount hidden</p>
                      <p className="text-xs text-gray-500 mt-1">Coming soon</p>
                    </button>

                    {/* Private */}
                    <button
                      type="button"
                      onClick={() => setPrivacyLevel('private')}
                      disabled={sending}
                      className={`p-4 rounded-lg border-2 transition-all text-left ${
                        privacyLevel === 'private'
                          ? 'border-purple-500 bg-purple-500/20'
                          : 'border-white/20 bg-white/5 hover:border-purple-400/50'
                      } disabled:opacity-50`}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xl">🔒</span>
                        <span className="text-white font-semibold">Private</span>
                      </div>
                      <p className="text-xs text-gray-400">Fully hidden</p>
                      <p className="text-xs text-gray-500 mt-1">Coming soon</p>
                    </button>
                  </div>

                  {/* Privacy Explanation */}
                  <div className={`mt-3 p-3 rounded-lg border ${
                    privacyLevel === 'public' ? 'bg-green-500/10 border-green-500/30' :
                    privacyLevel === 'shielded' ? 'bg-cyan-500/10 border-cyan-500/30' :
                    'bg-purple-500/10 border-purple-500/30'
                  }`}>
                    {privacyLevel === 'public' && (
                      <div className="text-sm">
                        <p className="text-gray-300 mb-2">
                          <span className="font-semibold text-white">Public Mode:</span> Standard Solana transfer
                        </p>
                        <ul className="space-y-1 text-gray-400 text-xs">
                          <li>✅ Fastest & cheapest (~0.000005 SOL)</li>
                          <li>❌ Amount visible on-chain</li>
                          <li>❌ Addresses visible on-chain</li>
                        </ul>
                      </div>
                    )}
                    {privacyLevel === 'shielded' && (
                      <div className="text-sm">
                        <p className="text-gray-300 mb-2">
                          <span className="font-semibold text-white">Shielded Mode:</span> Amount hidden
                        </p>
                        <ul className="space-y-1 text-gray-400 text-xs">
                          <li>✅ Transaction amount encrypted</li>
                          <li>✅ Pedersen commitments</li>
                          <li>❌ Addresses still visible</li>
                          <li>💡 Coming in Week 3 with Light Protocol</li>
                        </ul>
                      </div>
                    )}
                    {privacyLevel === 'private' && (
                      <div className="text-sm">
                        <p className="text-gray-300 mb-2">
                          <span className="font-semibold text-white">Private Mode:</span> Full zero-knowledge privacy
                        </p>
                        <ul className="space-y-1 text-gray-400 text-xs">
                          <li>✅ Amount completely hidden</li>
                          <li>✅ Sender/receiver hidden</li>
                          <li>✅ zk-SNARKs + nullifiers</li>
                          <li>✅ Still verifiable & compliant</li>
                          <li>💡 Coming in Week 3 with Light Protocol</li>
                        </ul>
                      </div>
                    )}
                  </div>
                </div>

                {/* Token Selector */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Select Token
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {tokens.map((token) => (
                      <button
                        key={token.symbol}
                        onClick={() => setSelectedToken(token)}
                        className={`p-4 rounded-lg border-2 transition-all ${
                          selectedToken?.symbol === token.symbol
                            ? 'border-cyan-500 bg-cyan-500/20'
                            : 'border-white/20 bg-white/5 hover:border-cyan-400/50'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-2xl">{token.logo}</span>
                          <div className="text-left">
                            <p className="text-white font-semibold">{token.symbol}</p>
                            <p className="text-xs text-gray-400">{token.name}</p>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Recipient Address
                  </label>
                  <input
                    type="text"
                    value={recipient}
                    onChange={(e) => setRecipient(e.target.value)}
                    placeholder="Enter Solana wallet address"
                    className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Amount ({selectedToken?.symbol || 'Token'})
                  </label>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder={selectedToken?.symbol === 'SOL' ? '0.001' : '1.00'}
                    step={selectedToken?.decimals === 9 ? '0.000000001' : '0.01'}
                    className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Memo (Optional)
                  </label>
                  <input
                    type="text"
                    value={memo}
                    onChange={(e) => setMemo(e.target.value)}
                    placeholder="Payment for..."
                    className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                  />
                </div>

                {txResult && (
                  <div className={`p-4 rounded-lg ${txResult.success ? 'bg-green-500/20 border border-green-500/50' : 'bg-red-500/20 border border-red-500/50'}`}>
                    <p className={`text-sm ${txResult.success ? 'text-green-200' : 'text-red-200'}`}>
                      {txResult.message}
                    </p>
                    {txResult.signature && (
                      <a
                        href={`https://explorer.solana.com/tx/${txResult.signature}?cluster=${process.env.NEXT_PUBLIC_SOLANA_NETWORK === 'mainnet-beta' ? 'mainnet-beta' : 'devnet'}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-green-300 hover:text-green-200 underline mt-2 block"
                      >
                        View on Solana Explorer →
                      </a>
                    )}
                  </div>
                )}

                <button
                  onClick={sendPayment}
                  disabled={sending}
                  className="w-full py-4 px-6 rounded-lg font-semibold text-white bg-gradient-to-r from-blue-500 to-cyan-400 hover:from-purple-600 hover:to-pink-600 shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {sending ? '⏳ Sending...' : '🔒 Send Private Payment'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Instructions */}
        <div className="mt-12 max-w-4xl mx-auto">
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-8">
            <h3 className="text-2xl font-bold text-white mb-6">🚀 How to Use</h3>
            
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center text-cyan-400 font-bold">
                  1
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-white mb-2">Install Phantom Wallet</h4>
                  <p className="text-gray-400">
                    Download from{' '}
                    <a href="https://phantom.app/" target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:text-cyan-300">
                      phantom.app
                    </a>
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center text-cyan-400 font-bold">
                  2
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-white mb-2">Get Devnet SOL (For Testing)</h4>
                  <p className="text-gray-400 mb-2">Visit the Solana faucet:</p>
                  <a 
                    href="https://faucet.solana.com" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300 font-medium"
                  >
                    https://faucet.solana.com
                  </a>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center text-cyan-400 font-bold">
                  3
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-white mb-2">Send a Private Payment</h4>
                  <p className="text-gray-400">Connect your wallet, enter details, and send!</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Privacy Notice */}
        <div className="mt-8 max-w-4xl mx-auto">
          <div className="bg-blue-500/10 border border-cyan-500/30 rounded-xl p-6">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0">
                <svg className="w-6 h-6 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <div>
                <h4 className="text-lg font-semibold text-cyan-200 mb-2">🔐 Privacy Guaranteed</h4>
                <p className="text-sm text-cyan-300">
                  All payments use zero-knowledge proofs powered by Light Protocol. Your transaction details are completely private.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-white/10 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-400">
            <p>Built with ❤️ on Solana • Powered by Light Protocol</p>
            <p className="mt-2 text-sm">
              <a href="https://github.com/ExePayInfra/exe-pay" className="hover:text-white transition-colors" target="_blank" rel="noopener noreferrer">
                View on GitHub
              </a>
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}

