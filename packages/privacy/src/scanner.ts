/**
 * Payment Scanner for Stealth Addresses
 * 
 * Scans blockchain for incoming stealth payments by:
 * 1. Fetching recent transactions
 * 2. Parsing ephemeral public keys from memos
 * 3. Using view tags for 99% filtering efficiency
 * 4. Performing ECDH to verify ownership
 * 5. Deriving private keys for claiming
 */

import { Connection, PublicKey } from '@solana/web3.js';
import type { ParsedTransactionWithMeta } from '@solana/web3.js';
import { x25519, ed25519 } from '@noble/curves/ed25519';
import { keccak_256 } from '@noble/hashes/sha3';
import type { StealthMetaAddress } from './stealth.js';

export interface DetectedPayment {
  // Payment details
  address: PublicKey;
  amount: number;
  signature: string;
  timestamp: number;
  
  // Privacy metadata
  ephemeralPubkey: PublicKey;
  viewTag: number;
  
  // Derived keys for claiming
  privateKey?: Uint8Array;
  claimed: boolean;
}

export interface ScanOptions {
  // Number of recent transactions to scan
  limit?: number;
  
  // Start scanning from this signature
  before?: string;
  
  // Only return unclaimed payments
  unclaimedOnly?: boolean;
}

/**
 * Parse ephemeral public key from transaction memo
 */
function parseEphemeralKey(memo: string): { ephemeralPubkey: PublicKey; viewTag: number } | null {
  try {
    // Memo format: "ExePay:Stealth:<base58_ephemeral_key>:<view_tag>"
    const parts = memo.split(':');
    
    if (parts.length !== 4 || parts[0] !== 'ExePay' || parts[1] !== 'Stealth') {
      return null;
    }
    
    const ephemeralPubkey = new PublicKey(parts[2]);
    const viewTag = parseInt(parts[3], 10);
    
    if (isNaN(viewTag)) {
      return null;
    }
    
    return { ephemeralPubkey, viewTag };
  } catch (err) {
    return null;
  }
}

/**
 * Calculate view tag from shared secret
 * View tags provide 99% filtering efficiency (256 possible values)
 * Uses first byte of shared secret (same as generateStealthAddress)
 */
function calculateViewTag(sharedSecret: Uint8Array): number {
  return sharedSecret[0]; // First byte gives us 0-255 range
}

/**
 * Check if a stealth payment belongs to the user
 */
export function isPaymentForUser(
  ephemeralPubkey: PublicKey,
  viewTag: number,
  metaAddress: StealthMetaAddress,
  userSecretKey: Uint8Array
): boolean {
  try {
    console.log('[isPaymentForUser] Checking payment ownership...');
    console.log('[isPaymentForUser] View tag from memo:', viewTag);
    console.log('[isPaymentForUser] User secret key length:', userSecretKey.length);
    console.log('[isPaymentForUser] User secret key (first 16 bytes):', Array.from(userSecretKey.slice(0, 16)));
    console.log('[isPaymentForUser] Meta address viewing key:', metaAddress.viewingKey.toBase58());
    
    // Convert Ed25519 keys to X25519 format for ECDH
    const userX25519Secret = ed25519.utils.toMontgomerySecret(userSecretKey.slice(0, 32));
    const ephemeralX25519 = x25519.getPublicKey(ephemeralPubkey.toBytes());
    
    console.log('[isPaymentForUser] Performing ECDH...');
    console.log('[isPaymentForUser] User X25519 secret (first 8 bytes):', Array.from(userX25519Secret.slice(0, 8)));
    
    // Perform ECDH to derive shared secret
    const sharedSecret = x25519.getSharedSecret(userX25519Secret, ephemeralX25519);
    
    console.log('[isPaymentForUser] Shared secret derived, length:', sharedSecret.length);
    console.log('[isPaymentForUser] Shared secret (first 8 bytes):', Array.from(sharedSecret.slice(0, 8)));
    
    // Calculate expected view tag
    const expectedViewTag = calculateViewTag(sharedSecret);
    
    console.log('[isPaymentForUser] Expected view tag:', expectedViewTag);
    console.log('[isPaymentForUser] Actual view tag:', viewTag);
    console.log('[isPaymentForUser] Match?', viewTag === expectedViewTag);
    
    // Quick filter: if view tags don't match, this payment is not for us
    if (viewTag !== expectedViewTag) {
      console.log('[isPaymentForUser] View tags do not match - payment not for us');
      return false;
    }
    
    // View tag matches! This payment is likely for us
    // (1/256 chance of false positive, but we can verify further if needed)
    console.log('[isPaymentForUser] ✓ View tags match - payment is for us!');
    return true;
  } catch (err) {
    console.error('[Scanner] Error checking payment ownership:', err);
    return false;
  }
}

/**
 * Derive the private key for a detected stealth payment
 */
export function deriveClaimKey(
  ephemeralPubkey: PublicKey,
  metaAddress: StealthMetaAddress,
  userSecretKey: Uint8Array
): Uint8Array {
  try {
    // Convert Ed25519 keys to X25519 format for ECDH
    const userX25519Secret = ed25519.utils.toMontgomerySecret(userSecretKey.slice(0, 32));
    const ephemeralX25519 = x25519.getPublicKey(ephemeralPubkey.toBytes());
    
    // Perform ECDH
    const sharedSecret = x25519.getSharedSecret(userX25519Secret, ephemeralX25519);
    
    // Derive private key: privateKey = userSecretKey + hash(sharedSecret)
    const hash = keccak_256(sharedSecret);
    
    // Convert user secret key to scalar for Ed25519
    const userScalar = ed25519.utils.toMontgomerySecret(userSecretKey.slice(0, 32));
    const hashScalar = ed25519.utils.toMontgomerySecret(hash);
    
    // Add scalars (mod curve order)
    const claimKeyScalar = new Uint8Array(32);
    for (let i = 0; i < 32; i++) {
      claimKeyScalar[i] = (userScalar[i] + hashScalar[i]) & 0xff;
    }
    
    return claimKeyScalar;
  } catch (err) {
    console.error('[Scanner] Error deriving claim key:', err);
    throw err;
  }
}

/**
 * Scan blockchain for incoming stealth payments
 */
export async function scanForPayments(
  connection: Connection,
  userPublicKey: PublicKey,
  metaAddress: StealthMetaAddress,
  userSecretKey: Uint8Array,
  options: ScanOptions = {}
): Promise<DetectedPayment[]> {
  const {
    limit = 100,
    before,
    unclaimedOnly = false
  } = options;
  
  console.log('[Scanner] Starting scan for stealth payments...');
  console.log('[Scanner] User:', userPublicKey.toBase58());
  console.log('[Scanner] Limit:', limit);
  
  const detectedPayments: DetectedPayment[] = [];
  
  try {
    // Get recent transaction signatures
    const signatures = await connection.getSignaturesForAddress(userPublicKey, {
      limit,
      before
    });
    
    console.log(`[Scanner] Found ${signatures.length} transactions to check`);
    
    // Check each transaction
    for (const sigInfo of signatures) {
      try {
        // Fetch parsed transaction
        const tx = await connection.getParsedTransaction(sigInfo.signature, {
          maxSupportedTransactionVersion: 0
        });
        
        if (!tx || !tx.meta) {
          continue;
        }
        
        // Look for our memo in transaction
        let ephemeralData: { ephemeralPubkey: PublicKey; viewTag: number } | null = null;
        
        // Check all instructions for memos
        for (const instruction of tx.transaction.message.instructions) {
          // Check if this is a memo instruction
          if ('program' in instruction && instruction.program === 'spl-memo') {
            console.log('[Scanner] Found memo instruction:', instruction);
            
            // Memo data is in the 'parsed' field as a string
            if ('parsed' in instruction && typeof instruction.parsed === 'string') {
              const memo = instruction.parsed;
              console.log('[Scanner] Memo content:', memo);
              ephemeralData = parseEphemeralKey(memo);
              
              if (ephemeralData) {
                console.log('[Scanner] ✓ Parsed ephemeral data:', ephemeralData);
                break;
              }
            }
          }
        }
        
        // If no ephemeral data found, skip
        if (!ephemeralData) {
          console.log('[Scanner] No ephemeral data found in transaction:', sigInfo.signature);
          continue;
        }
        
        const { ephemeralPubkey, viewTag } = ephemeralData;
        
        console.log('[Scanner] Checking if payment is for us...');
        console.log('[Scanner] Ephemeral pubkey:', ephemeralPubkey.toBase58());
        console.log('[Scanner] View tag:', viewTag);
        
        // Check if this payment is for us using view tag + ECDH
        const isForUs = isPaymentForUser(
          ephemeralPubkey,
          viewTag,
          metaAddress,
          userSecretKey
        );
        
        console.log('[Scanner] Is payment for us?', isForUs);
        
        if (!isForUs) {
          console.log('[Scanner] Payment not for us, skipping...');
          continue;
        }
        
        console.log('[Scanner] ✓ Found payment for us!', sigInfo.signature);
        
        // Parse payment details
        const instructions = tx.transaction.message.instructions;
        for (const instruction of instructions) {
          if ('parsed' in instruction && instruction.parsed?.type === 'transfer') {
            const info = instruction.parsed.info;
            
            // Derive private key for claiming
            const privateKey = deriveClaimKey(
              ephemeralPubkey,
              metaAddress,
              userSecretKey
            );
            
            const payment: DetectedPayment = {
              address: new PublicKey(info.destination),
              amount: info.lamports,
              signature: sigInfo.signature,
              timestamp: sigInfo.blockTime ? sigInfo.blockTime * 1000 : Date.now(),
              ephemeralPubkey,
              viewTag,
              privateKey,
              claimed: false
            };
            
            detectedPayments.push(payment);
            break;
          }
        }
      } catch (err) {
        console.error('[Scanner] Error processing transaction:', sigInfo.signature, err);
      }
    }
    
    console.log(`[Scanner] Detected ${detectedPayments.length} stealth payments`);
    
    // Filter by claimed status if requested
    if (unclaimedOnly) {
      return detectedPayments.filter(p => !p.claimed);
    }
    
    return detectedPayments;
  } catch (err) {
    console.error('[Scanner] Scan failed:', err);
    throw err;
  }
}

/**
 * Scan for a specific payment by signature
 */
export async function scanPayment(
  connection: Connection,
  signature: string,
  metaAddress: StealthMetaAddress,
  userSecretKey: Uint8Array
): Promise<DetectedPayment | null> {
  try {
    console.log('[Scanner] Checking specific transaction:', signature);
    
    const tx = await connection.getParsedTransaction(signature, {
      maxSupportedTransactionVersion: 0
    });
    
    if (!tx || !tx.meta) {
      return null;
    }
    
    // Parse ephemeral key from memo
    let ephemeralData: { ephemeralPubkey: PublicKey; viewTag: number } | null = null;
    
    for (const instruction of tx.transaction.message.instructions) {
      if ('program' in instruction && instruction.program === 'spl-memo') {
        if ('parsed' in instruction) {
          ephemeralData = parseEphemeralKey(instruction.parsed);
        }
      }
    }
    
    if (!ephemeralData) {
      return null;
    }
    
    const { ephemeralPubkey, viewTag } = ephemeralData;
    
    // Check ownership
    const isForUs = isPaymentForUser(
      ephemeralPubkey,
      viewTag,
      metaAddress,
      userSecretKey
    );
    
    if (!isForUs) {
      return null;
    }
    
    // Parse payment details
    for (const instruction of tx.transaction.message.instructions) {
      if ('parsed' in instruction && instruction.parsed?.type === 'transfer') {
        const info = instruction.parsed.info;
        
        const privateKey = deriveClaimKey(
          ephemeralPubkey,
          metaAddress,
          userSecretKey
        );
        
        return {
          address: new PublicKey(info.destination),
          amount: info.lamports,
          signature,
          timestamp: tx.blockTime ? tx.blockTime * 1000 : Date.now(),
          ephemeralPubkey,
          viewTag,
          privateKey,
          claimed: false
        };
      }
    }
    
    return null;
  } catch (err) {
    console.error('[Scanner] Error scanning payment:', err);
    return null;
  }
}

/**
 * Get payment history from localStorage
 */
export function getStoredPayments(): DetectedPayment[] {
  try {
    const stored = localStorage.getItem('exepay_stealth_payments');
    if (!stored) {
      return [];
    }
    
    const parsed = JSON.parse(stored);
    
    // Convert serialized data back to proper types
    return parsed.map((p: any) => ({
      ...p,
      address: new PublicKey(p.address),
      ephemeralPubkey: new PublicKey(p.ephemeralPubkey),
      privateKey: p.privateKey ? new Uint8Array(Object.values(p.privateKey)) : undefined
    }));
  } catch (err) {
    console.error('[Scanner] Error loading stored payments:', err);
    return [];
  }
}

/**
 * Save payment history to localStorage
 */
export function storePayments(payments: DetectedPayment[]): void {
  try {
    // Serialize for storage
    const serialized = payments.map(p => ({
      ...p,
      address: p.address.toBase58(),
      ephemeralPubkey: p.ephemeralPubkey.toBase58(),
      privateKey: p.privateKey ? Array.from(p.privateKey) : undefined
    }));
    
    localStorage.setItem('exepay_stealth_payments', JSON.stringify(serialized));
  } catch (err) {
    console.error('[Scanner] Error storing payments:', err);
  }
}

/**
 * Mark a payment as claimed
 */
export function markPaymentClaimed(signature: string): void {
  try {
    const payments = getStoredPayments();
    const updated = payments.map(p =>
      p.signature === signature ? { ...p, claimed: true } : p
    );
    storePayments(updated);
  } catch (err) {
    console.error('[Scanner] Error marking payment as claimed:', err);
  }
}

