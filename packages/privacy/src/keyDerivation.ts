/**
 * Key Derivation for Stealth Addresses (Option 1: Message Signing)
 * 
 * Since Solana wallets don't expose secret keys, we derive viewing/spending keys
 * from wallet signatures. This is secure and works with all wallet adapters.
 */

import { keccak_256 } from '@noble/hashes/sha3';
import { ed25519 } from '@noble/curves/ed25519';

/**
 * Message to sign for deriving viewing key
 * Version number allows key rotation in future
 */
export const VIEWING_KEY_MESSAGE = 'ExePay Stealth Viewing Key v1';

/**
 * Message to sign for deriving spending key
 * Separate from viewing key for security
 */
export const SPENDING_KEY_MESSAGE = 'ExePay Stealth Spending Key v1';

/**
 * Derive a deterministic 32-byte key from a wallet signature
 */
export function deriveKeyFromSignature(signature: Uint8Array): Uint8Array {
  // Hash the signature to get a 32-byte key
  const key = keccak_256(signature);
  return key;
}

/**
 * Derive viewing key from wallet signature
 * Used for scanning and detecting payments
 */
export function deriveViewingKey(signature: Uint8Array): Uint8Array {
  return deriveKeyFromSignature(signature);
}

/**
 * Derive spending key from wallet signature
 * Used for claiming funds from stealth addresses
 */
export function deriveSpendingKey(signature: Uint8Array): Uint8Array {
  return deriveKeyFromSignature(signature);
}

/**
 * Get the message that should be signed for viewing key
 */
export function getViewingKeyMessage(): Uint8Array {
  return new TextEncoder().encode(VIEWING_KEY_MESSAGE);
}

/**
 * Get the message that should be signed for spending key
 */
export function getSpendingKeyMessage(): Uint8Array {
  return new TextEncoder().encode(SPENDING_KEY_MESSAGE);
}

/**
 * Derive public key from a derived secret key
 */
export function derivePublicKey(secretKey: Uint8Array): Uint8Array {
  return ed25519.getPublicKey(secretKey);
}

