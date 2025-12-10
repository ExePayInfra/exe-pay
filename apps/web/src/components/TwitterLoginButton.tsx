'use client';

import { signIn, useSession } from 'next-auth/react';
import { useEffect } from 'react';
import { generateTwitterWallet, exportKeypair } from '@exe-pay/utils';
import { saveWallet } from '@/lib/wallet-storage';

interface TwitterLoginButtonProps {
  onSuccess?: () => void;
  variant?: 'create' | 'import';
}

export function TwitterLoginButton({ onSuccess, variant = 'create' }: TwitterLoginButtonProps) {
  const { data: session, status } = useSession();

  useEffect(() => {
    if (session?.twitterId && status === 'authenticated') {
      handleTwitterWalletCreation();
    }
  }, [session, status]);

  const handleTwitterWalletCreation = async () => {
    if (!session?.twitterId) return;

    try {
      console.log('[Twitter Login] Creating wallet for Twitter user:', session.username);
      
      // Generate deterministic wallet from Twitter ID
      // Use NEXTAUTH_SECRET as app secret
      const appSecret = process.env.NEXT_PUBLIC_APP_SECRET || 'exepay-default-secret-change-in-production';
      const { keypair, mnemonic } = generateTwitterWallet(session.twitterId, appSecret);
      const exported = exportKeypair(keypair);
      
      // Save wallet with Twitter-derived password
      // User can change this later by exporting and re-importing
      const password = `twitter-${session.twitterId}-${appSecret}`;
      
      await saveWallet(
        mnemonic,
        exported.privateKey,
        exported.publicKey,
        password,
        `${session.username}'s Wallet`
      );
      
      console.log('[Twitter Login] Wallet created successfully');
      onSuccess?.();
    } catch (error) {
      console.error('[Twitter Login] Failed to create wallet:', error);
    }
  };

  const handleLogin = () => {
    signIn('twitter', {
      callbackUrl: '/wallet',
    });
  };

  if (status === 'loading') {
    return (
      <button
        disabled
        className="w-full py-3 px-6 bg-gray-400 text-white font-semibold rounded-lg cursor-not-allowed flex items-center justify-center gap-2"
      >
        <span className="animate-spin">⏳</span>
        <span>Loading...</span>
      </button>
    );
  }

  return (
    <button
      onClick={handleLogin}
      className="w-full py-3 px-6 bg-[#1DA1F2] hover:bg-[#1a8cd8] text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
    >
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
      </svg>
      <span>
        {variant === 'create' ? 'Continue with Twitter' : 'Sign in with Twitter'}
      </span>
    </button>
  );
}

