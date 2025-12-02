/**
 * View Keys for ExePay
 * 
 * View keys allow read-only access to payment history without spending permission.
 * Based on Monero's proven view key cryptography.
 * 
 * Use Cases:
 * - Tax accountants viewing transaction history
 * - Business audits and compliance
 * - Multi-device viewing without risk
 * - Automated accounting integrations
 */

import { Keypair, PublicKey } from '@solana/web3.js';
import { keccak_256 } from '@noble/hashes/sha3';
import { ed25519, x25519 } from '@noble/curves/ed25519';

// Helper functions for encoding (using hex for simplicity and compatibility)
const toBase58 = (bytes: Uint8Array): string => {
  return Buffer.from(bytes).toString('hex');
};

const fromBase58 = (str: string): Uint8Array => {
  return new Uint8Array(Buffer.from(str, 'hex'));
};

/**
 * View Key Pair
 * - Private view key: Detects payments, cannot spend
 * - Public view key: Shared with others for monitoring
 */
export interface ViewKeyPair {
  privateKey: Uint8Array;  // Secret view key (32 bytes)
  publicKey: Uint8Array;   // Public view key (32 bytes)
}

/**
 * Encoded View Key (for sharing)
 */
export interface EncodedViewKey {
  privateViewKey: string;  // Base58 encoded private view key
  publicViewKey: string;   // Base58 encoded public view key
  spendPublicKey: string;  // Base58 encoded spend public key (for address derivation)
}

/**
 * Generate view keys from a Solana wallet keypair
 * 
 * Derivation:
 * - View private key = keccak256("view" || wallet_secret_key)
 * - View public key = view_private_key * G (Ed25519 curve point)
 * 
 * @param walletKeypair - User's main wallet keypair
 * @returns ViewKeyPair containing private and public view keys
 */
export function generateViewKeys(walletKeypair: Keypair): ViewKeyPair {
  // Derive view private key from wallet secret
  const viewKeyInput = new Uint8Array([
    ...Buffer.from('view'),  // Domain separator
    ...walletKeypair.secretKey.slice(0, 32)
  ]);
  
  const viewPrivateKey = keccak_256(viewKeyInput);
  
  // Generate public view key (Ed25519 point)
  const viewPublicKey = ed25519.getPublicKey(viewPrivateKey);
  
  return {
    privateKey: viewPrivateKey,
    publicKey: viewPublicKey
  };
}

/**
 * Encode view keys for storage or sharing
 * 
 * Format: Base58 encoding for readability
 * Private view key: For user's secure storage
 * Public view key + Spend public key: For sharing with auditors
 * 
 * @param viewKeys - View key pair
 * @param spendPublicKey - Wallet's public key (for address derivation)
 * @returns Encoded view keys as base58 strings
 */
export function encodeViewKeys(
  viewKeys: ViewKeyPair, 
  spendPublicKey: PublicKey
): EncodedViewKey {
  return {
    privateViewKey: toBase58(viewKeys.privateKey),
    publicViewKey: toBase58(viewKeys.publicKey),
    spendPublicKey: spendPublicKey.toBase58()
  };
}

/**
 * Decode view keys from base58 strings
 * 
 * @param encoded - Encoded view keys
 * @returns Decoded ViewKeyPair and spend public key
 */
export function decodeViewKeys(encoded: EncodedViewKey): {
  viewKeys: ViewKeyPair;
  spendPublicKey: PublicKey;
} {
  return {
    viewKeys: {
      privateKey: fromBase58(encoded.privateViewKey),
      publicKey: fromBase58(encoded.publicViewKey)
    },
    spendPublicKey: new PublicKey(encoded.spendPublicKey)
  };
}

/**
 * Check if a stealth address belongs to a user (using view key only)
 * 
 * This is the key function that enables payment detection without spending ability.
 * View key holder can scan blockchain and identify their payments.
 * 
 * @param viewPrivateKey - User's private view key
 * @param spendPublicKey - User's public spend key
 * @param ephemeralPubkey - Ephemeral public key from transaction
 * @param stealthAddress - Stealth address to check
 * @returns true if payment belongs to user
 */
export async function isPaymentForUserViewKey(
  viewPrivateKey: Uint8Array,
  spendPublicKey: PublicKey,
  ephemeralPubkey: PublicKey,
  stealthAddress: PublicKey
): Promise<boolean> {
  try {
    // Compute shared secret using view key (ECDH)
    // This is what view keys enable: detecting payments without spending ability
    const sharedSecret = await ed25519Ecdh(
      viewPrivateKey,
      ephemeralPubkey.toBytes()
    );
    
    // Derive stealth public key (same as sender did)
    const stealthPubkeyHash = keccak_256(
      Buffer.concat([
        Buffer.from(sharedSecret),
        Buffer.from([0])
      ])
    );
    
    // Convert hash to Ed25519 scalar
    const stealthPrivateKeyScalar = ed25519ScalarReduce(stealthPubkeyHash);
    
    // Derive stealth public key: H(shared_secret) * G + spend_public_key
    const derivedStealthPoint = await ed25519PointAdd(
      await ed25519ScalarMultBase(stealthPrivateKeyScalar),
      spendPublicKey.toBytes()
    );
    
    // Compare with actual stealth address
    return Buffer.from(derivedStealthPoint).equals(stealthAddress.toBytes());
  } catch (error) {
    console.error('[View Key] Payment check failed:', error);
    return false;
  }
}

/**
 * Generate shareable view-only credential
 * 
 * This is what users share with accountants/auditors.
 * Contains: Public view key + Spend public key (no spending ability)
 * 
 * @param encoded - Full encoded view keys
 * @returns Shareable credential (no private keys)
 */
export function generateShareableViewCredential(encoded: EncodedViewKey): {
  publicViewKey: string;
  spendPublicKey: string;
  warning: string;
} {
  return {
    publicViewKey: encoded.publicViewKey,
    spendPublicKey: encoded.spendPublicKey,
    warning: 'This credential allows viewing payments but NOT spending. Safe to share with auditors.'
  };
}

/**
 * Validate view key format
 * 
 * @param encoded - Encoded view key to validate
 * @returns true if valid format
 */
export function validateViewKey(encoded: Partial<EncodedViewKey>): boolean {
  try {
    if (encoded.privateViewKey) {
      const decoded = fromBase58(encoded.privateViewKey);
      if (decoded.length !== 32) return false;
    }
    
    if (encoded.publicViewKey) {
      const decoded = fromBase58(encoded.publicViewKey);
      if (decoded.length !== 32) return false;
    }
    
    if (encoded.spendPublicKey) {
      new PublicKey(encoded.spendPublicKey); // Will throw if invalid
    }
    
    return true;
  } catch {
    return false;
  }
}

// ============================================================================
// Cryptographic Helper Functions
// ============================================================================

/**
 * Ed25519 ECDH (Elliptic Curve Diffie-Hellman)
 * 
 * Converts Ed25519 keys to X25519 (Montgomery curve) for ECDH
 * Same approach as our stealth address implementation
 */
async function ed25519Ecdh(
  privateKey: Uint8Array,
  publicKey: Uint8Array
): Promise<Uint8Array> {
  // Convert Ed25519 to X25519 (Montgomery curve)
  const x25519Private = ed25519.utils.toMontgomerySecret(privateKey);
  const x25519Public = ed25519.utils.toMontgomery(publicKey);
  
  // Perform X25519 ECDH
  const rawSharedSecret = x25519.getSharedSecret(x25519Private, x25519Public);
  
  // Hash the shared secret (same as our stealth address implementation)
  const hashedSecret = keccak_256(rawSharedSecret);
  
  return hashedSecret;
}

/**
 * Reduce a 32-byte hash to Ed25519 scalar (mod curve order)
 */
function ed25519ScalarReduce(hash: Uint8Array): Uint8Array {
  // Ed25519 curve order
  const L = BigInt('0x1000000000000000000000000000000014def9dea2f79cd65812631a5cf5d3ed');
  
  // Convert hash to BigInt
  let scalar = BigInt('0x' + Buffer.from(hash).toString('hex'));
  
  // Reduce modulo curve order
  scalar = scalar % L;
  
  // Convert back to 32-byte little-endian
  const bytes = new Uint8Array(32);
  for (let i = 0; i < 32; i++) {
    bytes[i] = Number((scalar >> BigInt(8 * i)) & BigInt(0xff));
  }
  
  return bytes;
}

/**
 * Ed25519 scalar multiplication with base point (G)
 */
async function ed25519ScalarMultBase(scalar: Uint8Array): Promise<Uint8Array> {
  return ed25519.getPublicKey(scalar);
}

/**
 * Ed25519 point addition
 */
async function ed25519PointAdd(
  point1: Uint8Array,
  point2: Uint8Array
): Promise<Uint8Array> {
  const { ExtendedPoint } = ed25519;
  
  const p1 = ExtendedPoint.fromHex(point1);
  const p2 = ExtendedPoint.fromHex(point2);
  
  const sum = p1.add(p2);
  return sum.toRawBytes();
}

/**
 * Export format for external systems (accounting software, etc.)
 */
export interface ViewKeyExport {
  version: '1.0';
  type: 'exepay-view-key';
  network: 'mainnet' | 'devnet' | 'testnet';
  publicViewKey: string;
  spendPublicKey: string;
  createdAt: string;  // ISO timestamp
  capabilities: string[];
}

/**
 * Create standardized export for integrations
 */
export function createViewKeyExport(
  encoded: EncodedViewKey,
  network: 'mainnet' | 'devnet' | 'testnet' = 'mainnet'
): ViewKeyExport {
  return {
    version: '1.0',
    type: 'exepay-view-key',
    network,
    publicViewKey: encoded.publicViewKey,
    spendPublicKey: encoded.spendPublicKey,
    createdAt: new Date().toISOString(),
    capabilities: [
      'view-payments',
      'scan-blockchain',
      'export-history',
      'generate-reports'
    ]
  };
}

