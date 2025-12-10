import { Keypair } from '@solana/web3.js';
import * as bip39 from 'bip39';
import { derivePath } from 'ed25519-hd-key';

/**
 * Generate a new wallet with BIP39 mnemonic (12 words)
 * Returns both the mnemonic and the keypair
 */
export function generateWallet(): { mnemonic: string; keypair: Keypair } {
  // Generate 12-word mnemonic (128 bits of entropy)
  const mnemonic = bip39.generateMnemonic(128);
  
  // Derive keypair from mnemonic
  const keypair = keypairFromMnemonic(mnemonic);
  
  return { mnemonic, keypair };
}

/**
 * Recover wallet from existing BIP39 mnemonic
 * @param mnemonic 12 or 24 word seed phrase
 * @returns Solana keypair
 */
export function keypairFromMnemonic(mnemonic: string, accountIndex: number = 0): Keypair {
  // Validate mnemonic
  if (!bip39.validateMnemonic(mnemonic)) {
    throw new Error('Invalid mnemonic phrase');
  }
  
  // Convert mnemonic to seed
  const seed = bip39.mnemonicToSeedSync(mnemonic, ''); // Empty passphrase
  
  // Derive path for Solana (m/44'/501'/0'/0')
  const derivationPath = `m/44'/501'/${accountIndex}'/0'`;
  const derived = derivePath(derivationPath, seed.toString('hex'));
  
  // Create keypair from derived seed
  return Keypair.fromSeed(derived.key);
}

/**
 * Validate BIP39 mnemonic
 */
export function validateMnemonic(mnemonic: string): boolean {
  return bip39.validateMnemonic(mnemonic);
}

/**
 * Generate a 24-word mnemonic (256 bits - more secure)
 */
export function generate24WordWallet(): { mnemonic: string; keypair: Keypair } {
  const mnemonic = bip39.generateMnemonic(256);
  const keypair = keypairFromMnemonic(mnemonic);
  
  return { mnemonic, keypair };
}

/**
 * Convert keypair to exportable format
 */
export function exportKeypair(keypair: Keypair): {
  publicKey: string;
  privateKey: string;
  secretKey: Uint8Array;
} {
  return {
    publicKey: keypair.publicKey.toBase58(),
    privateKey: Buffer.from(keypair.secretKey).toString('hex'),
    secretKey: keypair.secretKey,
  };
}

/**
 * Import keypair from private key (hex string)
 */
export function importKeypairFromPrivateKey(privateKeyHex: string): Keypair {
  const secretKey = Buffer.from(privateKeyHex, 'hex');
  
  if (secretKey.length !== 64) {
    throw new Error('Invalid private key length. Expected 64 bytes.');
  }
  
  return Keypair.fromSecretKey(secretKey);
}

/**
 * Import keypair from secret key (Uint8Array or number array)
 */
export function importKeypairFromSecretKey(secretKey: Uint8Array | number[]): Keypair {
  const keyArray = secretKey instanceof Uint8Array 
    ? secretKey 
    : new Uint8Array(secretKey);
    
  if (keyArray.length !== 64) {
    throw new Error('Invalid secret key length. Expected 64 bytes.');
  }
  
  return Keypair.fromSecretKey(keyArray);
}

