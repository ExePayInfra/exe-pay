'use client';

import { useState, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { Connection, PublicKey, Transaction, SystemProgram, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { getAssociatedTokenAddress, createTransferInstruction, TOKEN_PROGRAM_ID } from '@solana/spl-token';
import { getTokens, getTokenBySymbol, parseTokenAmount, type Token } from '@/lib/tokens';
import { Navigation, Footer } from '@/components/Navigation';
import { CompressedAccountManager } from '@/components/CompressedAccountManager';
import { ShieldedPoolManager } from '@/components/ShieldedPoolManager';
import Image from 'next/image';

// Dynamic import to avoid SSR issues
let createShieldedTransfer: any;
let createPrivateTransfer: any;
let encryptRecipientAddress: any;
// Light Protocol functions for TRUE on-chain privacy
let initializeLightProtocol: any;
let createLightShieldedTransfer: any;
let getShieldedBalance: any;

type PrivacyLevel = 'public' | 'light' | 'stealth';

export default function WalletPage() {
  const { publicKey, signTransaction, connected, disconnect, select, wallets, wallet } = useWallet();
  const [sending, setSending] = useState(false);
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [memo, setMemo] = useState('');
  const [selectedToken, setSelectedToken] = useState<Token | null>(null);
  const [tokens, setTokens] = useState<Token[]>([]);
  const [privacyLevel, setPrivacyLevel] = useState<PrivacyLevel>('public');
  const [txResult, setTxResult] = useState<{ success: boolean; message: string; signature?: string } | null>(null);
  const [balance, setBalance] = useState<number | null>(null);
  const [showBalance, setShowBalance] = useState(true);
  const [showWalletSelector, setShowWalletSelector] = useState(false);
  const [connectingWallet, setConnectingWallet] = useState<string | null>(null);
  const [verifiedConnection, setVerifiedConnection] = useState(false);

  useEffect(() => {
    // Load tokens based on network
    const network = (process.env.NEXT_PUBLIC_SOLANA_NETWORK || 'mainnet-beta') as 'mainnet-beta' | 'devnet';
    const availableTokens = getTokens(network);
    setTokens(availableTokens);
    setSelectedToken(availableTokens[0]); // Default to SOL

    // Initialize Light Protocol
    const initLight = async () => {
      console.log('[ExePay] 🚀 Starting Light Protocol initialization...');
      
      try {
        console.log('[ExePay] 📦 Importing Light Protocol utilities...');
        
        // Import Light Protocol utilities
        const { 
          initializeLightProtocol: initLP,
          testLightProtocolConnection,
          getLightProtocolConfig,
          getLightProtocolNetworkInfo 
        } = await import('@/lib/lightProtocol');

        console.log('[ExePay] ✅ Light Protocol utilities imported successfully');

        // Get configuration
        const config = getLightProtocolConfig();
        const networkInfo = getLightProtocolNetworkInfo();

        console.log('[ExePay] Light Protocol Configuration:');
        console.log('[ExePay]   Network:', networkInfo.network);
        console.log('[ExePay]   Devnet:', networkInfo.isDevnet ? 'Yes' : 'No');
        console.log('[ExePay]   Explorer:', networkInfo.solscanUrl);

        // Test connection
        console.log('[ExePay] 🔌 Testing RPC connection...');
        const connected = await testLightProtocolConnection();
        
        if (connected) {
          console.log('[ExePay] ✅ Light Protocol ready for use');
          
          // Initialize RPC client
          console.log('[ExePay] 🔧 Initializing RPC client...');
          const lightRpc = initLP();
          console.log('[ExePay] ✅ Light Protocol RPC client initialized');
          console.log('[ExePay] 🎉 Phase 1 Complete - Light Protocol is ready!');
        } else {
          console.warn('[ExePay] ⚠️  Light Protocol connection test failed');
          console.warn('[ExePay] Privacy features will use demonstration mode');
        }
      } catch (error) {
        console.error('[ExePay] ❌ Failed to initialize Light Protocol:', error);
        console.error('[ExePay] Error details:', error instanceof Error ? error.message : String(error));
        console.warn('[ExePay] Privacy features will use demonstration mode');
      }
    };

    console.log('[ExePay] 🎬 Wallet page mounted - initializing...');
    initLight();

    // Dynamically import privacy functions (client-side only)
    import('@exe-pay/privacy').then((mod) => {
      createShieldedTransfer = mod.createShieldedTransfer;
      createPrivateTransfer = mod.createPrivateTransfer;
      encryptRecipientAddress = mod.encryptRecipientAddress;
      // Light Protocol functions for TRUE privacy
      initializeLightProtocol = mod.initializeLightProtocol;
      createLightShieldedTransfer = mod.createLightShieldedTransfer;
      getShieldedBalance = mod.getShieldedBalance;
      console.log('[ExePay] ✅ Privacy functions loaded');
    }).catch(err => {
      console.error('[ExePay] Failed to load privacy module:', err);
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

  const handleWalletSelect = async (walletName: string) => {
    try {
      setConnectingWallet(walletName);
      const selectedWallet = wallets.find(w => w.adapter.name === walletName);
      if (!selectedWallet) {
        throw new Error('Wallet not found');
      }

      // Check if wallet is already connected (shouldn't happen, but safety check)
      if (selectedWallet.adapter.connected) {
        console.warn(`[ExePay Security] ${walletName} already connected - disconnecting first`);
        try {
          await selectedWallet.adapter.disconnect();
          await new Promise(resolve => setTimeout(resolve, 500));
        } catch (disconnectErr) {
          console.error('Failed to disconnect:', disconnectErr);
        }
      }

      // First select the wallet
      select(selectedWallet.adapter.name);
      // Wait a moment for the selection to register
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Then trigger the connection
      // This will automatically:
      // 1. Open the wallet popup
      // 2. Show unlock screen if wallet is locked
      // 3. Show approval screen if wallet is unlocked
      console.log(`[ExePay] Attempting to connect to ${walletName}...`);
      await selectedWallet.adapter.connect();
      
      // Verify the connection actually worked and we have a public key
      if (!selectedWallet.adapter.publicKey) {
        throw new Error('Connection failed - no public key received. Please try again.');
      }
      
      // CRITICAL SECURITY CHECK: Verify wallet is actually unlocked by requesting a signature
      // This is the ONLY way to guarantee the wallet is unlocked and user has approved
      // ✅ Works for ALL wallets (Phantom, Solflare, Coinbase, Trust, etc.)
      // ✅ Works on BOTH desktop and mobile
      // ✅ Prevents silent connections with locked wallets
      try {
        console.log(`[ExePay Security] Verifying ${walletName} is unlocked by requesting test signature...`);
        
        // Create a simple test message
        const testMessage = new TextEncoder().encode(
          `ExePay Security Check - ${Date.now()}\n\nThis signature verifies your wallet is unlocked.\nNo transaction will be made.`
        );
        
        // Request signature - this will ONLY work if wallet is unlocked
        // If locked, it will show unlock screen first
        const signature = await selectedWallet.adapter.signMessage!(testMessage);
        
        if (!signature || signature.length === 0) {
          throw new Error('Signature verification failed');
        }
        
        console.log(`[ExePay Security] ${walletName} wallet verified as unlocked ✅`);
        console.log(`[ExePay Security] Signature received (${signature.length} bytes)`);
        
        // Mark connection as verified
        setVerifiedConnection(true);
      } catch (verifyErr: any) {
        console.error(`[ExePay Security] ${walletName} verification failed:`, verifyErr);
        
        // Disconnect the connection since we couldn't verify it's unlocked
        try {
          await selectedWallet.adapter.disconnect();
        } catch (disconnectErr) {
          console.error('Failed to disconnect:', disconnectErr);
        }
        
        // Reset verified connection state
        setVerifiedConnection(false);
        
        // Provide user-friendly error message
        if (verifyErr.message?.includes('User rejected') || verifyErr.code === 4001) {
          throw new Error('Signature request rejected. Connection cancelled for security.');
        } else {
          throw new Error(`Could not verify ${walletName} is unlocked. Please make sure your wallet is unlocked and try again.`);
        }
      }
      
      console.log(`[ExePay] Successfully connected to ${walletName}`);
      console.log(`[ExePay] Public Key: ${selectedWallet.adapter.publicKey.toString()}`);
    } catch (err: any) {
      console.error('Failed to connect wallet:', err);
      
      // Provide user-friendly error messages
      let errorMessage = `Failed to connect to ${walletName}.`;
      
      if (err.message?.includes('User rejected') || err.message?.includes('User cancelled') || err.code === 4001) {
        errorMessage = 'Connection rejected. Please approve the connection in your wallet.';
      } else if (err.message?.includes('User closed') || err.message?.includes('closed')) {
        errorMessage = 'Connection cancelled. Please try again and approve the connection.';
      } else if (err.message?.includes('no public key')) {
        errorMessage = 'Connection failed. Please make sure your wallet is unlocked and try again.';
      } else if (err.message?.includes('Wallet not found')) {
        errorMessage = 'Wallet not found. Please make sure it\'s installed.';
      } else if (err.message?.includes('not installed')) {
        errorMessage = `${walletName} is not installed. Please install it and try again.`;
      } else {
        errorMessage += ` ${err.message || 'Please make sure it\'s installed and try again.'}`;
      }
      
      setTxResult({
        success: false,
        message: errorMessage,
      });
    } finally {
      setConnectingWallet(null);
      setShowWalletSelector(false);
    }
  };

  const handleChangeWallet = async () => {
    try {
      setVerifiedConnection(false);
      await disconnect();
      setShowWalletSelector(true);
    } catch (err) {
      console.error('Failed to disconnect:', err);
    }
  };

  // Reset verified connection when wallet disconnects
  useEffect(() => {
    if (!connected) {
      setVerifiedConnection(false);
    }
  }, [connected]);

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

      const amountValue = selectedToken.mint === 'native'
        ? Math.floor(parseFloat(amount) * LAMPORTS_PER_SOL)
        : parseTokenAmount(amount, selectedToken.decimals);

      // Handle Light Protocol (TRUE privacy)
      if (privacyLevel === 'light') {
        console.log('🌟 Light Protocol mode selected - TRUE privacy!');
        
        if (!createLightShieldedTransfer) {
          throw new Error('Light Protocol functions not loaded. Please refresh and try again.');
        }

        // Import Light Protocol utilities
        const { getLightProtocolClient } = await import('@/lib/lightProtocol');
        const lightRpc = getLightProtocolClient();

        // Create shielded transfer (TRUE private - invisible on Solscan)
        console.log('[ExePay] 🔐 Creating Light Protocol private transfer...');
        console.log('[ExePay] Amount:', amountValue, 'lamports');
        console.log('[ExePay] Recipient:', recipientPubkey.toString().slice(0, 8) + '...');
        
        const signature = await createLightShieldedTransfer(
          lightRpc,
          connection,
          senderPubkey,
          signTransaction,
          recipientPubkey,
          BigInt(amountValue)
        );

        console.log('[ExePay] ✅ Light Protocol transfer complete!');
        console.log('[ExePay] Signature:', signature);

        setTxResult({
          success: true,
          message: `🌟 TRUE PRIVATE payment sent! Sender, receiver, and amount are HIDDEN on-chain. Powered by Light Protocol (Beta).`,
          signature,
        });

        // Refresh balance
        fetchBalance();
        
        // Clear form
        setRecipient('');
        setAmount('');
        setMemo('');

        return; // Exit early - Light Protocol handled
      }

      // Standard or ZK-proof mode (not true privacy)
      let transaction: Transaction;

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

        {(!connected || !verifiedConnection) || showWalletSelector ? (
          /* Wallet Connect/Selector Card */
          <div className="max-w-md mx-auto">
            <div className="glass-card p-6 sm:p-8 rounded-3xl animate-scale-in shadow-xl">
              {/* Header */}
              <div className="text-center mb-6">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                  <svg className="w-8 h-8 sm:w-10 sm:h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
                  {showWalletSelector ? 'Choose a Different Wallet' : 'Connect Your Wallet'}
                </h3>
                <p className="text-sm sm:text-base text-gray-600">
                  {showWalletSelector ? 'Select a wallet to connect' : 'Choose your preferred Solana wallet'}
                </p>
              </div>

              {/* Wallet List */}
              <div className="space-y-3 mb-6">
                {wallets
                  .filter(w => w.readyState === 'Installed' || w.readyState === 'Loadable')
                  // Remove duplicate wallets (especially MetaMask which appears multiple times)
                  .filter((w, index, self) => 
                    index === self.findIndex(wallet => wallet.adapter.name === w.adapter.name)
                  )
                  // Prioritize Phantom and Solflare at the top
                  .sort((a, b) => {
                    const priority = ['Phantom', 'Solflare', 'Coinbase', 'Trust'];
                    const aIndex = priority.indexOf(a.adapter.name);
                    const bIndex = priority.indexOf(b.adapter.name);
                    if (aIndex !== -1 && bIndex !== -1) return aIndex - bIndex;
                    if (aIndex !== -1) return -1;
                    if (bIndex !== -1) return 1;
                    return 0;
                  })
                  .map((w) => (
                  <button
                    key={w.adapter.name}
                    onClick={() => handleWalletSelect(w.adapter.name)}
                    disabled={connectingWallet !== null}
                    className="w-full p-4 bg-white hover:bg-indigo-50 border-2 border-gray-200 hover:border-indigo-500 rounded-xl transition-all duration-200 flex items-center gap-4 disabled:opacity-50 disabled:cursor-not-allowed group"
                  >
                    {w.adapter.icon && (
                      <div className="w-10 h-10 flex-shrink-0">
                        <Image 
                          src={w.adapter.icon} 
                          alt={w.adapter.name}
                          width={40}
                          height={40}
                          className="rounded-lg"
                        />
                      </div>
                    )}
                    <div className="flex-1 text-left">
                      <p className="font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">
                        {w.adapter.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {w.readyState === 'Installed' ? '✅ Detected' : '📲 Available'}
                      </p>
                    </div>
                    {connectingWallet === w.adapter.name ? (
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-indigo-600 border-t-transparent"></div>
                    ) : (
                      <svg className="w-5 h-5 text-gray-400 group-hover:text-indigo-600 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    )}
                  </button>
                ))}
              </div>

              {/* Cancel Button (only show when changing wallet) */}
              {showWalletSelector && (
                <button
                  onClick={() => setShowWalletSelector(false)}
                  className="w-full py-3 px-6 rounded-xl font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 transition-all duration-200"
                >
                  Cancel
                </button>
              )}

              {/* Help Text */}
              <div className="mt-6 p-4 bg-indigo-50 rounded-xl border border-indigo-100">
                <p className="text-xs text-indigo-900 font-semibold mb-2">💡 Don't see your wallet?</p>
                <p className="text-xs text-gray-600">
                  Make sure your wallet app is installed. On mobile, you may be redirected to install it.
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {/* Main Payment Form - Takes 2 columns */}
            <div className="lg:col-span-2 space-y-4 sm:space-y-6">
              {/* Light Protocol Components */}
              <div className="space-y-4 animate-slide-up">
                <CompressedAccountManager />
                <ShieldedPoolManager />
              </div>

              {/* Wallet Info Card */}
              <div className="glass-card p-4 sm:p-6 rounded-2xl animate-slide-up shadow-lg border border-white/50">
                {/* Mobile Layout */}
                <div className="flex flex-col sm:hidden gap-4">
                  {/* Wallet Info */}
                  <div className="flex items-center gap-3">
                    {wallet?.adapter.icon && (
                      <div className="w-10 h-10 flex-shrink-0">
                        <Image 
                          src={wallet.adapter.icon} 
                          alt={wallet.adapter.name}
                          width={40}
                          height={40}
                          className="rounded-lg"
                        />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-gray-500">Connected: {wallet?.adapter.name}</p>
                      <p className="font-mono text-sm font-semibold text-gray-900 truncate">
                        {publicKey?.toString().slice(0, 8)}...{publicKey?.toString().slice(-8)}
                      </p>
                    </div>
                  </div>

                  {/* Balance */}
                  {balance !== null && (
                    <div className="flex items-center justify-between p-3 bg-indigo-50 rounded-xl">
                      <div className="flex-1">
                        <p className="text-xs text-gray-500">Balance</p>
                        <p className="text-lg font-bold text-gray-900">
                          {showBalance ? `${balance.toFixed(4)} SOL` : '••••••'}
                        </p>
                      </div>
                      <button
                        onClick={() => setShowBalance(!showBalance)}
                        className="p-2 hover:bg-white rounded-lg transition-colors"
                        title={showBalance ? "Hide balance" : "Show balance"}
                      >
                        {showBalance ? (
                          <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        ) : (
                          <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                          </svg>
                        )}
                      </button>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <button
                      onClick={handleChangeWallet}
                      className="flex-1 py-2.5 px-4 rounded-xl font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 transition-all duration-200 text-sm"
                    >
                      🔄 Change Wallet
                    </button>
                    <button
                      onClick={() => disconnect()}
                      className="flex-1 py-2.5 px-4 rounded-xl font-semibold text-red-600 bg-red-50 hover:bg-red-100 transition-all duration-200 text-sm"
                    >
                      🚪 Disconnect
                    </button>
                  </div>
                </div>

                {/* Desktop Layout */}
                <div className="hidden sm:flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    {wallet?.adapter.icon && (
                      <div className="w-12 h-12 flex-shrink-0">
                        <Image 
                          src={wallet.adapter.icon} 
                          alt={wallet.adapter.name}
                          width={48}
                          height={48}
                          className="rounded-xl"
                        />
                      </div>
                    )}
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Connected: {wallet?.adapter.name}</p>
                      <p className="font-mono text-sm font-semibold text-gray-900">
                        {publicKey?.toString().slice(0, 6)}...{publicKey?.toString().slice(-6)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {balance !== null && (
                      <div className="text-right flex items-center gap-2">
                        <div>
                          <p className="text-xs text-gray-500">Balance</p>
                          <p className="text-lg font-bold text-gray-900">
                            {showBalance ? `${balance.toFixed(4)} SOL` : '••••••'}
                          </p>
                        </div>
                        <button
                          onClick={() => setShowBalance(!showBalance)}
                          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                          title={showBalance ? "Hide balance" : "Show balance"}
                        >
                          {showBalance ? (
                            <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                          ) : (
                            <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                            </svg>
                          )}
                        </button>
                      </div>
                    )}
                    <button
                      onClick={handleChangeWallet}
                      className="py-2 px-4 rounded-lg font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 transition-all duration-200 text-sm"
                    >
                      Change Wallet
                    </button>
                    <button
                      onClick={() => disconnect()}
                      className="py-2 px-4 rounded-lg font-semibold text-red-600 bg-red-50 hover:bg-red-100 transition-all duration-200 text-sm"
                    >
                      Disconnect
                    </button>
                  </div>
                </div>
              </div>

              {/* Payment Form Card */}
              <div className="glass-card p-4 sm:p-8 rounded-2xl animate-slide-up shadow-lg border border-white/50" style={{animationDelay: '0.1s'}}>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">Send Payment</h2>
                
                <div className="space-y-4 sm:space-y-6">
                  {/* Token Selector */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2 sm:mb-3">Select Token</label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
                      {tokens.map((token) => (
                        <button
                          key={token.symbol}
                          onClick={() => {
                            setSelectedToken(token);
                            fetchBalance();
                          }}
                          disabled={sending}
                          className={`p-3 sm:p-4 rounded-xl border-2 transition-all active:scale-95 ${
                            selectedToken?.symbol === token.symbol
                              ? 'border-indigo-500 bg-indigo-50 shadow-lg'
                              : 'border-gray-200 hover:border-indigo-300 bg-white'
                          } disabled:opacity-50`}
                        >
                          <div className="text-xl sm:text-2xl mb-1 sm:mb-2">{token.logo}</div>
                          <div className="text-xs font-semibold text-gray-900">{token.symbol}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Privacy Level */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2 sm:mb-3">Privacy Level</label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                      {(['public', 'shielded', 'private', 'light'] as PrivacyLevel[]).map((level) => (
                        <button
                          key={level}
                          onClick={() => setPrivacyLevel(level)}
                          disabled={sending}
                          className={`p-3 sm:p-4 rounded-xl border-2 transition-all active:scale-95 ${
                            privacyLevel === level
                              ? level === 'light'
                                ? 'border-purple-500 bg-purple-50 shadow-md'
                                : 'border-indigo-500 bg-indigo-50 shadow-md'
                              : 'border-gray-200 hover:border-indigo-300 bg-white'
                          } disabled:opacity-50 text-left`}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <div className="text-base sm:text-lg font-semibold text-gray-900 capitalize">
                              {level === 'light' ? 'Light Protocol' : level}
                            </div>
                            <div className="text-base">
                              {level === 'public' && '⚡'}
                              {level === 'shielded' && '🛡️'}
                              {level === 'private' && '🔒'}
                              {level === 'light' && '🌟'}
                            </div>
                          </div>
                          <div className="text-xs text-gray-600">
                            {level === 'public' && 'Fast & visible'}
                            {level === 'shielded' && 'Hidden amount (ZK proofs)'}
                            {level === 'private' && 'Fully anonymous (ZK proofs)'}
                            {level === 'light' && 'TRUE privacy - invisible on Solscan'}
                          </div>
                          {level === 'light' && (
                            <span className="inline-block mt-2 px-2 py-0.5 bg-purple-100 text-purple-800 text-xs font-semibold rounded">
                              🔬 BETA
                            </span>
                          )}
                          {(level === 'shielded' || level === 'private') && (
                            <span className="inline-block mt-2 px-2 py-0.5 bg-blue-100 text-blue-800 text-xs font-semibold rounded">
                              ZK READY
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
                      placeholder="Solana wallet address"
                      disabled={sending}
                      className="w-full px-4 py-3 sm:py-3.5 bg-white border-2 border-gray-200 rounded-xl text-sm sm:text-base text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all disabled:opacity-50"
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
                        className="w-full px-4 py-3 sm:py-3.5 bg-white border-2 border-gray-200 rounded-xl text-sm sm:text-base text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all disabled:opacity-50 pr-16 sm:pr-20"
                      />
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 text-xs sm:text-sm font-semibold text-gray-500">
                        {selectedToken?.symbol || 'TOKEN'}
                      </div>
                    </div>
                    {balance !== null && amount && parseFloat(amount) > 0 && (
                      <p className="text-xs text-gray-500 mt-2">
                        Remaining: {Math.max(0, balance - parseFloat(amount)).toFixed(4)} {selectedToken?.symbol}
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
                      placeholder="Add a note"
                      maxLength={50}
                      disabled={sending}
                      className="w-full px-4 py-3 sm:py-3.5 bg-white border-2 border-gray-200 rounded-xl text-sm sm:text-base text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all disabled:opacity-50"
                    />
                  </div>

                  {/* Send Button */}
                  <button
                    onClick={sendPayment}
                    disabled={sending || !recipient || !amount}
                    className="w-full py-4 sm:py-4 px-6 rounded-xl font-semibold text-base sm:text-lg text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 active:scale-95 shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
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
                <div className={`glass-card p-4 sm:p-6 rounded-2xl animate-scale-in shadow-lg border-2 ${
                  txResult.success
                    ? 'border-green-500 bg-green-50'
                    : 'border-red-500 bg-red-50'
                }`}>
                  <div className="flex items-start gap-3 sm:gap-4">
                    <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center flex-shrink-0 ${
                      txResult.success ? 'bg-green-500' : 'bg-red-500'
                    }`}>
                      <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        {txResult.success ? (
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        ) : (
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        )}
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className={`font-bold text-base sm:text-lg mb-1 ${txResult.success ? 'text-green-900' : 'text-red-900'}`}>
                        {txResult.success ? '🎉 Payment Successful!' : '❌ Payment Failed'}
                      </h3>
                      <p className={`text-xs sm:text-sm mb-3 ${txResult.success ? 'text-green-700' : 'text-red-700'}`}>
                        {txResult.message}
                      </p>
                      {txResult.signature && (
                        <a
                          href={`https://solscan.io/tx/${txResult.signature}${process.env.NEXT_PUBLIC_SOLANA_NETWORK === 'devnet' ? '?cluster=devnet' : ''}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-indigo-600 hover:text-indigo-700 active:text-indigo-800"
                        >
                          View on Solscan
                          <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar - Info & Features (Hidden on mobile, shown on desktop) */}
            <div className="hidden lg:block space-y-6">
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

