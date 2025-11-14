'use client';

import { useMemo, useEffect, useState } from 'react';
import type { FC, ReactNode } from 'react';
import { ConnectionProvider, WalletProvider as SolanaWalletProvider } from '@solana/wallet-adapter-react';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { clusterApiUrl } from '@solana/web3.js';
import type { Adapter } from '@solana/wallet-adapter-base';

require('@solana/wallet-adapter-react-ui/styles.css');

export const WalletProvider: FC<{ children: ReactNode }> = ({ children }) => {
  // Use environment variable for network selection
  const networkEnv = process.env.NEXT_PUBLIC_SOLANA_NETWORK || 'devnet';
  const network = networkEnv === 'mainnet-beta' 
    ? WalletAdapterNetwork.Mainnet 
    : WalletAdapterNetwork.Devnet;
  
  // Use custom RPC URL if provided, otherwise use default cluster URL
  const endpoint = useMemo(() => {
    const customRpc = process.env.NEXT_PUBLIC_SOLANA_RPC_URL;
    return customRpc || clusterApiUrl(network);
  }, [network]);

  // Lazy-load wallet adapters only on client side
  const [wallets, setWallets] = useState<Adapter[]>([]);
  
  useEffect(() => {
    // Only load wallets in the browser
    if (typeof window !== 'undefined') {
      import('@solana/wallet-adapter-wallets').then(({ PhantomWalletAdapter, SolflareWalletAdapter }) => {
        setWallets([
          new PhantomWalletAdapter(),
          new SolflareWalletAdapter(),
        ]);
      });
    }
  }, []);

  return (
    <ConnectionProvider endpoint={endpoint}>
      <SolanaWalletProvider wallets={wallets} autoConnect={false}>
        <WalletModalProvider>
          {children}
        </WalletModalProvider>
      </SolanaWalletProvider>
    </ConnectionProvider>
  );
};

