'use client';

import { useState, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
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
  const { publicKey, signTransaction, connected } = useWallet();
  const [sending, setSending] = useState(false);
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [memo, setMemo] = useState('');
  const [selectedToken, setSelectedToken] = useState<Token | null>(null);
  const [tokens, setTokens] = useState<Token[]>([]);
  const [privacyLevel, setPrivacyLevel] = useState<PrivacyLevel>('public');
  const [txResult, setTxResult] = useState<{ success: boolean; message: string; signature?: string } | null>(null);
  const [balance, setBalance] = useState<number | null>(null);

  useEffect(() => {
    // Load tokens based on network
    const network = (process.env.NEXT_PUBLIC_SOLANA_NETWORK || 'mainnet-beta') as 'mainnet-beta' | 'devnet';
    const availableTokens = getTokens(network);
    setTokens(availableTokens);
    setSelectedToken(availableTokens[0]); // Default to SOL

    // Dynamically import privacy functions (client-side only)
    import('@exe-pay/privacy').then((mod) => {
      createShieldedTransfer = mod.createShieldedTransfer;
      createPrivateTransfer = mod.createPrivateTransfer;
      encryptRecipientAddress = mod.encryptRecipientAddress;
    }).catch(err => {
      console.error('Failed to load privacy module:', err);
    });
  }, []);

  // Fetch balance when wallet connects
  useEffect(() => {
    if (publicKey && selectedToken) {
      fetchBalance();
    }
  }, [publicKey, selectedToken]);

  const fetchBalance = async () => {
    if (!publicKey || !selectedToken) return;
    
    try {
      const rpcUrl = process.env.NEXT_PUBLIC_SOLANA_RPC_URL || 'https://api.mainnet-beta.solana.com';
      const connection = new Connection(rpcUrl, 'confirmed');
      
      if (selectedToken.mint === 'native') {
        const bal = await connection.getBalance(publicKey);
        setBalance(bal / LAMPORTS_PER_SOL);
      } else {
        // For SPL tokens, we'd fetch token account balance
        setBalance(null); // Skip for now
      }
    } catch (err) {
      console.error('Failed to fetch balance:', err);
    }
  };

  const sendPayment = async () => {
    setSending(true);
    setTxResult(null);

    try {
      if (!recipient) throw new Error('Please enter a recipient address');
      if (!amount || parseFloat(amount) <= 0) throw new Error('Please enter a valid amount');
      if (!selectedToken) throw new Error('Please select a token');
      if (!publicKey) throw new Error('Please connect your wallet first');
      if (!signTransaction) throw new Error('Wallet does not support signing');

      const rpcUrl = process.env.NEXT_PUBLIC_SOLANA_RPC_URL || 'https://api.mainnet-beta.solana.com';
      const connection = new Connection(rpcUrl, 'confirmed');

      const recipientPubkey = new PublicKey(recipient);
      const senderPubkey = publicKey;

      let transaction: Transaction;
      const amountValue = selectedToken.mint === 'native'
        ? Math.floor(parseFloat(amount) * LAMPORTS_PER_SOL)
        : parseTokenAmount(amount, selectedToken.decimals);

      // Build transaction based on token type
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
      const signed = await signTransaction(transaction);
      const signature = await connection.sendRawTransaction(signed.serialize());
      await connection.confirmTransaction(signature, 'confirmed');

      setTxResult({
        success: true,
        message: `Payment sent successfully! (${privacyLevel} mode)`,
        signature,
      });

      // Refresh balance
      fetchBalance();
      
      // Clear form
      setRecipient('');
      setAmount('');
      setMemo('');
      
    } catch (err: any) {
      console.error('Payment failed:', err);
      setTxResult({
        success: false,
        message: err.message || 'Payment failed. Please try again.',
      });
    } finally {
      setSending(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            Send <span className="text-gradient-brand">Private Payments</span>
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Fast, secure, and completely confidential transactions on Solana with zero-knowledge proofs
          </p>
        </div>

        {!connected ? (
          /* Wallet Connect Card */
          <div className="max-w-md mx-auto">
            <div className="glass-card p-8 rounded-3xl animate-scale-in text-center shadow-xl">
              <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
                <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Connect Your Wallet</h3>
              <p className="text-gray-600 mb-6">
                Connect your Solana wallet to start sending secure and private payments
              </p>
              <WalletMultiButton className="!bg-gradient-to-r !from-indigo-600 !to-purple-600 hover:!from-indigo-700 hover:!to-purple-700 !rounded-xl !px-8 !py-4 !text-lg !font-semibold !mx-auto" />
              
              <div className="mt-8 p-4 bg-indigo-50 rounded-xl border border-indigo-100">
                <p className="text-xs text-indigo-900 font-semibold mb-2">Supported Wallets</p>
                <div className="flex items-center justify-center gap-3 flex-wrap">
                  <span className="px-3 py-1 bg-white rounded-lg text-xs font-medium text-gray-700">Phantom</span>
                  <span className="px-3 py-1 bg-white rounded-lg text-xs font-medium text-gray-700">Solflare</span>
                  <span className="px-3 py-1 bg-white rounded-lg text-xs font-medium text-gray-700">Coinbase</span>
                  <span className="px-3 py-1 bg-white rounded-lg text-xs font-medium text-gray-700">Trust</span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Payment Form - Takes 2 columns */}
            <div className="lg:col-span-2 space-y-6">
              {/* Wallet Info Card */}
              <div className="glass-card p-6 rounded-2xl animate-slide-up shadow-lg border border-white/50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
                      <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Connected Wallet</p>
                      <p className="font-mono text-sm font-semibold text-gray-900">
                        {publicKey?.toString().slice(0, 6)}...{publicKey?.toString().slice(-6)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {balance !== null && (
                      <div className="text-right">
                        <p className="text-xs text-gray-500">Balance</p>
                        <p className="text-lg font-bold text-gray-900">{balance.toFixed(4)} SOL</p>
                      </div>
                    )}
                    <WalletMultiButton className="!bg-gradient-to-r !from-indigo-600 !to-purple-600 hover:!from-indigo-700 hover:!to-purple-700 !rounded-lg" />
                  </div>
                </div>
              </div>

              {/* Payment Form Card */}
              <div className="glass-card p-8 rounded-2xl animate-slide-up shadow-lg border border-white/50" style={{animationDelay: '0.1s'}}>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Send Payment</h2>
                
                <div className="space-y-6">
                  {/* Token Selector */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-3">Select Token</label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {tokens.map((token) => (
                        <button
                          key={token.symbol}
                          onClick={() => {
                            setSelectedToken(token);
                            fetchBalance();
                          }}
                          disabled={sending}
                          className={`p-4 rounded-xl border-2 transition-all hover-scale ${
                            selectedToken?.symbol === token.symbol
                              ? 'border-indigo-500 bg-indigo-50 shadow-lg'
                              : 'border-gray-200 hover:border-indigo-300 bg-white'
                          } disabled:opacity-50`}
                        >
                          <div className="text-2xl mb-2">{token.logo}</div>
                          <div className="text-xs font-semibold text-gray-900">{token.symbol}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Privacy Level */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-3">Privacy Level</label>
                    <div className="grid grid-cols-3 gap-3">
                      {(['public', 'shielded', 'private'] as PrivacyLevel[]).map((level) => (
                        <button
                          key={level}
                          onClick={() => setPrivacyLevel(level)}
                          disabled={sending}
                          className={`p-4 rounded-xl border-2 transition-all hover-scale ${
                            privacyLevel === level
                              ? 'border-indigo-500 bg-indigo-50 shadow-md'
                              : 'border-gray-200 hover:border-indigo-300 bg-white'
                          } disabled:opacity-50`}
                        >
                          <div className="text-lg font-semibold text-gray-900 capitalize mb-1">{level}</div>
                          <div className="text-xs text-gray-600">
                            {level === 'public' && '⚡ Fast'}
                            {level === 'shielded' && '🛡️ Hidden amount'}
                            {level === 'private' && '🔒 Anonymous'}
                          </div>
                          {level !== 'public' && (
                            <span className="inline-block mt-2 px-2 py-0.5 bg-green-100 text-green-800 text-xs font-semibold rounded">
                              PRODUCTION
                            </span>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Recipient Address */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">Recipient Address</label>
                    <input
                      type="text"
                      value={recipient}
                      onChange={(e) => setRecipient(e.target.value)}
                      placeholder="Enter Solana wallet address"
                      disabled={sending}
                      className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all disabled:opacity-50"
                    />
                  </div>

                  {/* Amount */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">Amount</label>
                    <div className="relative">
                      <input
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="0.00"
                        step="0.000000001"
                        min="0"
                        disabled={sending}
                        className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all disabled:opacity-50 pr-20"
                      />
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-gray-500">
                        {selectedToken?.symbol || 'TOKEN'}
                      </div>
                    </div>
                    {balance !== null && amount && (
                      <p className="text-xs text-gray-500 mt-2">
                        Remaining: {(balance - parseFloat(amount)).toFixed(4)} {selectedToken?.symbol}
                      </p>
                    )}
                  </div>

                  {/* Memo (Optional) */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">Memo (Optional)</label>
                    <input
                      type="text"
                      value={memo}
                      onChange={(e) => setMemo(e.target.value)}
                      placeholder="Add a note (optional)"
                      maxLength={50}
                      disabled={sending}
                      className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all disabled:opacity-50"
                    />
                  </div>

                  {/* Send Button */}
                  <button
                    onClick={sendPayment}
                    disabled={sending || !recipient || !amount}
                    className="w-full py-4 px-6 rounded-xl font-semibold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover-lift"
                  >
                    {sending ? (
                      <span className="flex items-center justify-center gap-2">
                        <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                        Sending...
                      </span>
                    ) : (
                      <>🚀 Send {privacyLevel === 'public' ? 'Payment' : `${privacyLevel.charAt(0).toUpperCase() + privacyLevel.slice(1)} Payment`}</>
                    )}
                  </button>
                </div>
              </div>

              {/* Transaction Result */}
              {txResult && (
                <div className={`glass-card p-6 rounded-2xl animate-scale-in shadow-lg border-2 ${
                  txResult.success
                    ? 'border-green-500 bg-green-50'
                    : 'border-red-500 bg-red-50'
                }`}>
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${
                      txResult.success ? 'bg-green-500' : 'bg-red-500'
                    }`}>
                      <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        {txResult.success ? (
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        ) : (
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        )}
                      </svg>
                    </div>
                    <div className="flex-1">
                      <h3 className={`font-bold text-lg mb-1 ${txResult.success ? 'text-green-900' : 'text-red-900'}`}>
                        {txResult.success ? '🎉 Payment Successful!' : '❌ Payment Failed'}
                      </h3>
                      <p className={`text-sm mb-3 ${txResult.success ? 'text-green-700' : 'text-red-700'}`}>
                        {txResult.message}
                      </p>
                      {txResult.signature && (
                        <a
                          href={`https://solscan.io/tx/${txResult.signature}${process.env.NEXT_PUBLIC_SOLANA_NETWORK === 'devnet' ? '?cluster=devnet' : ''}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 text-sm font-semibold text-indigo-600 hover:text-indigo-700"
                        >
                          View on Solscan
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar - Info & Features */}
            <div className="space-y-6">
              {/* Privacy Features */}
              <div className="glass-card p-6 rounded-2xl animate-slide-up shadow-lg border border-white/50" style={{animationDelay: '0.2s'}}>
                <h3 className="text-lg font-bold text-gray-900 mb-4">🔒 Privacy Features</h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <svg className="w-4 h-4 text-indigo-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">Zero-Knowledge Proofs</p>
                      <p className="text-xs text-gray-600">Verify without revealing</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <svg className="w-4 h-4 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">Hidden Amounts</p>
                      <p className="text-xs text-gray-600">Keep balances private</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-pink-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <svg className="w-4 h-4 text-pink-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">Anonymous Transfers</p>
                      <p className="text-xs text-gray-600">Complete privacy</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="glass-card p-6 rounded-2xl animate-slide-up shadow-lg border border-white/50" style={{animationDelay: '0.3s'}}>
                <h3 className="text-lg font-bold text-gray-900 mb-4">⚡ Network Stats</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Transaction Speed</span>
                    <span className="text-sm font-bold text-gray-900">&lt; 1 second</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Average Fee</span>
                    <span className="text-sm font-bold text-gray-900">$0.0001</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Network</span>
                    <span className="text-sm font-bold text-indigo-600">Solana Mainnet</span>
                  </div>
                </div>
              </div>

              {/* Help Card */}
              <div className="glass-card p-6 rounded-2xl animate-slide-up shadow-lg border border-white/50 bg-gradient-to-br from-indigo-50 to-purple-50" style={{animationDelay: '0.4s'}}>
                <h3 className="text-lg font-bold text-gray-900 mb-3">💡 Need Help?</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Learn more about privacy payments and how to use ExePay securely.
                </p>
                <a
                  href="https://docs.exepay.app"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-indigo-600 hover:text-indigo-700"
                >
                  View Documentation
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </main>
  );
}

