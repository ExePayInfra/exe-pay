/**
 * Social Wallet Generation
 * Creates deterministic wallets from social login (Twitter, Google, etc.)
 */

import { Keypair } from '@solana/web3.js';
import { sha256 } from '@noble/hashes/sha256';
import * as bip39 from 'bip39';
import { derivePath } from 'ed25519-hd-key';

/**
 * Generate a deterministic wallet from social account ID
 * @param provider Social provider name (e.g., 'twitter', 'google')
 * @param userId User ID from the provider
 * @param appSecret Application secret for additional entropy
 * @returns Keypair and derived mnemonic
 */
export function generateSocialWallet(
  provider: string,
  userId: string,
  appSecret: string
): { keypair: Keypair; mnemonic: string } {
  // Create deterministic seed from provider + userId + appSecret
  const seedInput = `${provider}:${userId}:${appSecret}`;
  const hash = sha256(new TextEncoder().encode(seedInput));
  
  // Convert hash to entropy for BIP39
  // Use first 16 bytes (128 bits) for 12-word mnemonic
  const entropy = hash.slice(0, 16);
  
  // Generate mnemonic from entropy
  const mnemonic = bip39.entropyToMnemonic(Buffer.from(entropy).toString('hex'));
  
  // Derive keypair from mnemonic
  const seed = bip39.mnemonicToSeedSync(mnemonic, '');
  const derivationPath = `m/44'/501'/0'/0'`;
  const derived = derivePath(derivationPath, seed.toString('hex'));
  const keypair = Keypair.fromSeed(derived.key);
  
  return { keypair, mnemonic };
}

/**
 * Generate wallet from Twitter account
 * @param twitterId Twitter user ID
 * @param appSecret Application secret
 */
export function generateTwitterWallet(
  twitterId: string,
  appSecret: string
): { keypair: Keypair; mnemonic: string } {
  return generateSocialWallet('twitter', twitterId, appSecret);
}

/**
 * Generate wallet from Google account
 * @param googleId Google user ID
 * @param appSecret Application secret
 */
export function generateGoogleWallet(
  googleId: string,
  appSecret: string
): { keypair: Keypair; mnemonic: string } {
  return generateSocialWallet('google', googleId, appSecret);
}

/**
 * Verify a social wallet belongs to a user
 * @param provider Social provider
 * @param userId User ID
 * @param appSecret Application secret
 * @param expectedPublicKey Expected public key to verify against
 */
export function verifySocialWallet(
  provider: string,
  userId: string,
  appSecret: string,
  expectedPublicKey: string
): boolean {
  const { keypair } = generateSocialWallet(provider, userId, appSecret);
  return keypair.publicKey.toBase58() === expectedPublicKey;
}

