import { PublicKey } from '@solana/web3.js';

/**
 * Popular SPL tokens on Solana
 */
export interface Token {
  symbol: string;
  name: string;
  mint: string; // Token mint address
  decimals: number;
  logo?: string;
}

/**
 * Mainnet token addresses
 */
export const MAINNET_TOKENS: Token[] = [
  {
    symbol: 'SOL',
    name: 'Solana',
    mint: 'native', // Special case for native SOL
    decimals: 9,
    logo: '◎',
  },
  {
    symbol: 'USDC',
    name: 'USD Coin',
    mint: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
    decimals: 6,
    logo: '💵',
  },
  {
    symbol: 'USDT',
    name: 'Tether USD',
    mint: 'Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB',
    decimals: 6,
    logo: '💲',
  },
  {
    symbol: 'BONK',
    name: 'Bonk',
    mint: 'DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263',
    decimals: 5,
    logo: '🐕',
  },
  {
    symbol: 'JUP',
    name: 'Jupiter',
    mint: 'JUPyiwrYJFskUPiHa7hkeR8VUtAeFoSYbKedZNsDvCN',
    decimals: 6,
    logo: '🪐',
  },
];

/**
 * Devnet token addresses (for testing)
 */
export const DEVNET_TOKENS: Token[] = [
  {
    symbol: 'SOL',
    name: 'Solana (Devnet)',
    mint: 'native',
    decimals: 9,
    logo: '◎',
  },
  {
    symbol: 'USDC',
    name: 'USD Coin (Devnet)',
    mint: '4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU', // Devnet USDC
    decimals: 6,
    logo: '💵',
  },
];

/**
 * Get tokens based on network
 */
export function getTokens(network: 'mainnet-beta' | 'devnet' = 'mainnet-beta'): Token[] {
  return network === 'mainnet-beta' ? MAINNET_TOKENS : DEVNET_TOKENS;
}

/**
 * Get token by symbol
 */
export function getTokenBySymbol(symbol: string, network: 'mainnet-beta' | 'devnet' = 'mainnet-beta'): Token | undefined {
  const tokens = getTokens(network);
  return tokens.find(t => t.symbol === symbol);
}

/**
 * Format token amount for display
 */
export function formatTokenAmount(amount: number, decimals: number): string {
  return (amount / Math.pow(10, decimals)).toFixed(decimals === 9 ? 4 : 2);
}

/**
 * Convert display amount to token amount (with decimals)
 */
export function parseTokenAmount(amount: string, decimals: number): number {
  return Math.floor(parseFloat(amount) * Math.pow(10, decimals));
}

