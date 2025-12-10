/**
 * Wallet Storage Manager
 * Handles secure storage and retrieval of encrypted wallet data
 */

import { encryptData, decryptData, type EncryptedData } from '@exe-pay/utils';
import { Keypair } from '@solana/web3.js';

const STORAGE_KEY = 'exepay_wallet';
const WALLET_NAME_KEY = 'exepay_wallet_name';

export interface StoredWallet {
  publicKey: string;
  encryptedMnemonic: EncryptedData;
  encryptedPrivateKey: EncryptedData;
  name: string;
  createdAt: number;
}

/**
 * Check if a wallet is stored
 */
export function hasStoredWallet(): boolean {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem(STORAGE_KEY) !== null;
}

/**
 * Get stored wallet name (not sensitive, can be stored unencrypted)
 */
export function getWalletName(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(WALLET_NAME_KEY);
}

/**
 * Save wallet to encrypted storage
 */
export async function saveWallet(
  mnemonic: string,
  privateKey: string,
  publicKey: string,
  password: string,
  name?: string
): Promise<void> {
  // Encrypt sensitive data
  const encryptedMnemonic = await encryptData(mnemonic, password);
  const encryptedPrivateKey = await encryptData(privateKey, password);
  
  const wallet: StoredWallet = {
    publicKey,
    encryptedMnemonic,
    encryptedPrivateKey,
    name: name || 'ExePay Wallet',
    createdAt: Date.now(),
  };
  
  // Store encrypted wallet
  localStorage.setItem(STORAGE_KEY, JSON.stringify(wallet));
  localStorage.setItem(WALLET_NAME_KEY, wallet.name);
  
  console.log('[Wallet Storage] Wallet saved securely');
}

/**
 * Load and decrypt wallet
 */
export async function loadWallet(password: string): Promise<{
  mnemonic: string;
  privateKey: string;
  publicKey: string;
  name: string;
}> {
  const stored = localStorage.getItem(STORAGE_KEY);
  
  if (!stored) {
    throw new Error('No wallet found in storage');
  }
  
  const wallet: StoredWallet = JSON.parse(stored);
  
  try {
    // Decrypt sensitive data
    const mnemonic = await decryptData(wallet.encryptedMnemonic, password);
    const privateKey = await decryptData(wallet.encryptedPrivateKey, password);
    
    return {
      mnemonic,
      privateKey,
      publicKey: wallet.publicKey,
      name: wallet.name,
    };
  } catch (error) {
    throw new Error('Failed to decrypt wallet. Incorrect password.');
  }
}

/**
 * Get public key without decrypting (safe to display)
 */
export function getPublicKey(): string | null {
  if (typeof window === 'undefined') return null;
  
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return null;
  
  try {
    const wallet: StoredWallet = JSON.parse(stored);
    return wallet.publicKey;
  } catch {
    return null;
  }
}

/**
 * Update wallet name
 */
export function updateWalletName(newName: string): void {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return;
  
  try {
    const wallet: StoredWallet = JSON.parse(stored);
    wallet.name = newName;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(wallet));
    localStorage.setItem(WALLET_NAME_KEY, newName);
    console.log('[Wallet Storage] Wallet name updated');
  } catch (error) {
    console.error('[Wallet Storage] Failed to update wallet name', error);
  }
}

/**
 * Delete wallet from storage (WARNING: Irreversible without backup!)
 */
export function deleteWallet(): void {
  localStorage.removeItem(STORAGE_KEY);
  localStorage.removeItem(WALLET_NAME_KEY);
  console.log('[Wallet Storage] Wallet deleted');
}

/**
 * Verify password without fully loading wallet
 */
export async function verifyPassword(password: string): Promise<boolean> {
  try {
    await loadWallet(password);
    return true;
  } catch {
    return false;
  }
}

/**
 * Export wallet data for backup (requires password)
 */
export async function exportWalletBackup(password: string): Promise<{
  mnemonic: string;
  privateKey: string;
  publicKey: string;
  name: string;
  exportDate: string;
}> {
  const wallet = await loadWallet(password);
  
  return {
    ...wallet,
    exportDate: new Date().toISOString(),
  };
}

/**
 * Check if wallet was created recently (for onboarding flow)
 */
export function isNewWallet(withinHours: number = 24): boolean {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return false;
  
  try {
    const wallet: StoredWallet = JSON.parse(stored);
    const hoursSinceCreation = (Date.now() - wallet.createdAt) / (1000 * 60 * 60);
    return hoursSinceCreation < withinHours;
  } catch {
    return false;
  }
}

/**
 * Session storage for unlocked wallet (temporary, cleared on tab close)
 */
const SESSION_KEY = 'exepay_wallet_session';
const SESSION_EXPIRY = 30 * 60 * 1000; // 30 minutes

export function setWalletSession(keypair: Keypair): void {
  if (typeof window === 'undefined') return;
  
  const session = {
    secretKey: Array.from(keypair.secretKey),
    expiresAt: Date.now() + SESSION_EXPIRY,
  };
  
  sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

export function getWalletSession(): Keypair | null {
  if (typeof window === 'undefined') return null;
  
  const stored = sessionStorage.getItem(SESSION_KEY);
  if (!stored) return null;
  
  try {
    const session = JSON.parse(stored);
    
    // Check if session expired
    if (Date.now() > session.expiresAt) {
      clearWalletSession();
      return null;
    }
    
    return Keypair.fromSecretKey(new Uint8Array(session.secretKey));
  } catch {
    return null;
  }
}

export function clearWalletSession(): void {
  if (typeof window === 'undefined') return;
  sessionStorage.removeItem(SESSION_KEY);
}

export function hasActiveSession(): boolean {
  return getWalletSession() !== null;
}

