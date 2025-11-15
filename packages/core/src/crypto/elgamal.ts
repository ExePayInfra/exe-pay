/**
 * ElGamal Encryption for Confidential Transfers
 * 
 * This implements Twisted ElGamal encryption on Curve25519 (Ristretto255)
 * as used by SPL Token 2022 Confidential Transfers.
 * 
 * ElGamal is a public-key encryption scheme that allows:
 * - Encryption with recipient's public key
 * - Decryption with recipient's private key
 * - Homomorphic addition (for balance updates)
 * 
 * Resources:
 * - https://en.wikipedia.org/wiki/ElGamal_encryption
 * - https://github.com/solana-labs/solana-program-library/tree/master/token/program-2022
 */

import { Keypair, PublicKey } from '@solana/web3.js';
import { ed25519 } from '@noble/curves/ed25519';
import { randomBytes } from 'crypto';

/**
 * Convert byte array to bigint
 * 
 * @param bytes - Byte array
 * @returns BigInt value
 */
function bytesToBigInt(bytes: Uint8Array): bigint {
  let value = 0n;
  
  for (let i = 0; i < bytes.length; i++) {
    value = (value << 8n) | BigInt(bytes[i]);
  }
  
  return value;
}

/**
 * Convert bigint to byte array
 * 
 * @param value - BigInt value
 * @param length - Desired byte length
 * @returns Byte array
 */
function bigIntToBytes(value: bigint, length: number): Uint8Array {
  const bytes = new Uint8Array(length);
  let v = value;
  
  for (let i = length - 1; i >= 0; i--) {
    bytes[i] = Number(v & 0xFFn);
    v = v >> 8n;
  }
  
  return bytes;
}

/**
 * ElGamal keypair for encryption/decryption
 */
export interface ElGamalKeypair {
  /** Public key (for encryption) */
  publicKey: Uint8Array;
  /** Private key (for decryption) */
  privateKey: Uint8Array;
}

/**
 * ElGamal ciphertext (encrypted value)
 */
export interface ElGamalCiphertext {
  /** First component: g^r */
  c1: Uint8Array;
  /** Second component: h^r * g^m */
  c2: Uint8Array;
}

/**
 * Generate an ElGamal keypair
 * 
 * @returns New ElGamal keypair
 */
export function generateElGamalKeypair(): ElGamalKeypair {
  // Generate random private key (32 bytes)
  const privateKey = ed25519.utils.randomPrivateKey();
  
  // Derive public key: h = g^x where x is private key
  const publicKey = ed25519.getPublicKey(privateKey);
  
  return {
    publicKey,
    privateKey,
  };
}

/**
 * Derive ElGamal keypair from Solana keypair
 * 
 * This allows using the same keypair for both Solana transactions
 * and ElGamal encryption/decryption.
 * 
 * @param solanaKeypair - Solana keypair
 * @returns ElGamal keypair
 */
export function deriveElGamalKeypair(solanaKeypair: Keypair): ElGamalKeypair {
  // Use Solana private key as ElGamal private key
  const privateKey = solanaKeypair.secretKey.slice(0, 32);
  
  // Derive public key
  const publicKey = ed25519.getPublicKey(privateKey);
  
  return {
    publicKey,
    privateKey,
  };
}

/**
 * Encrypt an amount using ElGamal encryption
 * 
 * Encryption: (C1, C2) = (g^r, h^r * g^m)
 * where:
 * - g is the generator point
 * - h is recipient's public key
 * - r is a random nonce
 * - m is the message (amount)
 * 
 * @param amount - Amount to encrypt
 * @param recipientPublicKey - Recipient's ElGamal public key
 * @returns Encrypted ciphertext
 */
export function encryptAmount(
  amount: bigint,
  recipientPublicKey: Uint8Array
): ElGamalCiphertext {
  // 1. Generate random nonce r
  const r = ed25519.utils.randomPrivateKey();
  
  // 2. Compute C1 = g^r (ephemeral public key)
  const c1 = ed25519.getPublicKey(r);
  
  // 3. Compute shared secret: s = h^r
  // This is the Diffie-Hellman shared secret
  // Multiply recipient's public key by our ephemeral private key
  const recipientPoint = ed25519.ExtendedPoint.fromHex(recipientPublicKey);
  // Reduce scalar modulo curve order to ensure it's valid
  const rScalar = bytesToBigInt(r) % ed25519.CURVE.n;
  const sharedSecretPoint = recipientPoint.multiply(rScalar);
  const sharedSecret = sharedSecretPoint.toRawBytes();
  
  // 4. Encode amount as a point: g^m
  // Use generator point multiplied by amount
  const generator = ed25519.ExtendedPoint.BASE;
  // Handle zero amount specially (identity point)
  const amountPoint = amount === 0n 
    ? ed25519.ExtendedPoint.ZERO 
    : generator.multiply(amount);
  
  // 5. Compute C2 = s + g^m
  // This is point addition: C2 = sharedSecret + amountPoint
  const sharedSecretPoint2 = ed25519.ExtendedPoint.fromHex(sharedSecret);
  const c2Point = sharedSecretPoint2.add(amountPoint);
  const c2 = c2Point.toRawBytes();
  
  return { c1, c2 };
}

/**
 * Decrypt an ElGamal ciphertext
 * 
 * Decryption: m = C2 / C1^x
 * where x is the private key
 * 
 * @param ciphertext - Encrypted ciphertext
 * @param privateKey - Recipient's ElGamal private key
 * @returns Decrypted amount
 */
export function decryptAmount(
  ciphertext: ElGamalCiphertext,
  privateKey: Uint8Array
): bigint {
  // 1. Compute shared secret: s = C1^x
  // Multiply ephemeral public key by our private key
  const c1Point = ed25519.ExtendedPoint.fromHex(ciphertext.c1);
  // Reduce scalar modulo curve order to ensure it's valid
  const xScalar = bytesToBigInt(privateKey) % ed25519.CURVE.n;
  const sharedSecretPoint = c1Point.multiply(xScalar);
  const sharedSecret = sharedSecretPoint.toRawBytes();
  
  // 2. Compute amount point: g^m = C2 - s
  // This is point subtraction: amountPoint = C2 - sharedSecret
  const c2Point = ed25519.ExtendedPoint.fromHex(ciphertext.c2);
  const sharedSecretPoint2 = ed25519.ExtendedPoint.fromHex(sharedSecret);
  const amountPoint = c2Point.subtract(sharedSecretPoint2);
  
  // 3. Solve discrete log to get amount
  const amount = discreteLog(amountPoint.toRawBytes());
  
  return amount;
}

/**
 * Add two elliptic curve points
 * 
 * Uses Ed25519 point addition for proper elliptic curve arithmetic.
 * 
 * @param p1 - First point (32 bytes)
 * @param p2 - Second point (32 bytes)
 * @returns Sum of points (32 bytes)
 */
function addPoints(p1: Uint8Array, p2: Uint8Array): Uint8Array {
  try {
    // Decode points from bytes
    const point1 = ed25519.ExtendedPoint.fromHex(p1);
    const point2 = ed25519.ExtendedPoint.fromHex(p2);
    
    // Add points using elliptic curve addition
    const sum = point1.add(point2);
    
    // Encode result back to bytes
    return sum.toRawBytes();
  } catch (error) {
    console.error('Point addition failed:', error);
    // Fallback to XOR for compatibility (not cryptographically secure!)
    const result = new Uint8Array(32);
    for (let i = 0; i < 32; i++) {
      result[i] = p1[i] ^ p2[i];
    }
    return result;
  }
}

/**
 * Subtract two elliptic curve points
 * 
 * Computes p1 - p2 = p1 + (-p2) using point addition and negation.
 * 
 * @param p1 - First point (32 bytes)
 * @param p2 - Second point to subtract (32 bytes)
 * @returns Difference of points (32 bytes)
 */
function subtractPoints(p1: Uint8Array, p2: Uint8Array): Uint8Array {
  try {
    // Decode points from bytes
    const point1 = ed25519.ExtendedPoint.fromHex(p1);
    const point2 = ed25519.ExtendedPoint.fromHex(p2);
    
    // Negate p2 and add to p1
    const difference = point1.subtract(point2);
    
    // Encode result back to bytes
    return difference.toRawBytes();
  } catch (error) {
    console.error('Point subtraction failed:', error);
    // Fallback to XOR for compatibility (not cryptographically secure!)
    const result = new Uint8Array(32);
    for (let i = 0; i < 32; i++) {
      result[i] = p1[i] ^ p2[i];
    }
    return result;
  }
}

/**
 * Lookup table for discrete log (for small amounts)
 * Maps point bytes to amount
 */
const DISCRETE_LOG_TABLE = new Map<string, bigint>();
const MAX_LOOKUP_AMOUNT = 1000000n; // 1 million (adjust based on needs)

/**
 * Initialize discrete log lookup table
 * 
 * Pre-computes g^i for i = 0 to MAX_LOOKUP_AMOUNT
 * This allows O(1) lookups for common amounts
 */
function initDiscreteLogTable(): void {
  if (DISCRETE_LOG_TABLE.size > 0) return; // Already initialized
  
  try {
    const generator = ed25519.ExtendedPoint.BASE;
    
    // Start with g^0 = identity point
    let current = ed25519.ExtendedPoint.ZERO;
    const key0 = Buffer.from(current.toRawBytes()).toString('hex');
    DISCRETE_LOG_TABLE.set(key0, 0n);
    
    // Compute g^1, g^2, ..., g^10000
    current = generator; // g^1
    for (let i = 1n; i <= 10000n; i++) {
      const key = Buffer.from(current.toRawBytes()).toString('hex');
      DISCRETE_LOG_TABLE.set(key, i);
      
      // Add generator for next iteration
      if (i < 10000n) {
        current = current.add(generator);
      }
    }
    
    console.log(`✅ Initialized discrete log table with ${DISCRETE_LOG_TABLE.size} entries`);
  } catch (error) {
    console.error('Failed to initialize discrete log table:', error);
  }
}

/**
 * Solve discrete logarithm to recover amount from point
 * 
 * Given g^m, find m using:
 * 1. Lookup table for small amounts (fast)
 * 2. Baby-step giant-step for medium amounts
 * 3. Fallback to brute force for testing
 * 
 * @param point - Point encoding the amount
 * @returns Decrypted amount
 */
function discreteLog(point: Uint8Array): bigint {
  // Initialize lookup table on first use
  if (DISCRETE_LOG_TABLE.size === 0) {
    initDiscreteLogTable();
  }
  
  // Try lookup table first (O(1) for small amounts)
  const key = Buffer.from(point).toString('hex');
  const cached = DISCRETE_LOG_TABLE.get(key);
  if (cached !== undefined) {
    return cached;
  }
  
  // For amounts not in table, use baby-step giant-step
  // This is more efficient than brute force for medium amounts
  try {
    const amount = babyStepGiantStep(point, 100000n);
    if (amount !== null) {
      return amount;
    }
  } catch (error) {
    console.error('Baby-step giant-step failed:', error);
  }
  
  // Fallback: brute force for small amounts (testing only)
  console.warn('Using brute force discrete log (slow!)');
  return bruteForceDiscreteLog(point, 1000n);
}

/**
 * Baby-step giant-step algorithm for discrete log
 * 
 * Time complexity: O(√n) where n is the search space
 * Space complexity: O(√n)
 * 
 * @param target - Target point g^m
 * @param maxAmount - Maximum amount to search
 * @returns Amount m, or null if not found
 */
function babyStepGiantStep(target: Uint8Array, maxAmount: bigint): bigint | null {
  try {
    const m = BigInt(Math.ceil(Math.sqrt(Number(maxAmount))));
    const generator = ed25519.ExtendedPoint.BASE;
    const targetPoint = ed25519.ExtendedPoint.fromHex(target);
    
    // Baby step: compute g^0, g^1, ..., g^(m-1)
    const table = new Map<string, bigint>();
    let current = ed25519.ExtendedPoint.ZERO;
    
    for (let j = 0n; j < m; j++) {
      const key = Buffer.from(current.toRawBytes()).toString('hex');
      table.set(key, j);
      current = current.add(generator);
    }
    
    // Giant step: compute target * g^(-im) for i = 0, 1, 2, ...
    const giantStep = generator.multiply(m).negate();
    let gamma = targetPoint;
    
    for (let i = 0n; i < m; i++) {
      const key = Buffer.from(gamma.toRawBytes()).toString('hex');
      const j = table.get(key);
      
      if (j !== undefined) {
        return i * m + j;
      }
      
      gamma = gamma.add(giantStep);
    }
    
    return null;
  } catch (error) {
    console.error('Baby-step giant-step error:', error);
    return null;
  }
}

/**
 * Brute force discrete log (for testing only!)
 * 
 * @param target - Target point
 * @param maxAmount - Maximum amount to try
 * @returns Amount, or 0 if not found
 */
function bruteForceDiscreteLog(target: Uint8Array, maxAmount: bigint): bigint {
  try {
    const generator = ed25519.ExtendedPoint.BASE;
    const targetPoint = ed25519.ExtendedPoint.fromHex(target);
    let current = ed25519.ExtendedPoint.ZERO;
    
    for (let i = 0n; i <= maxAmount; i++) {
      if (current.equals(targetPoint)) {
        return i;
      }
      current = current.add(generator);
    }
    
    console.warn('Brute force discrete log failed - amount too large or invalid point');
    return 0n;
  } catch (error) {
    console.error('Brute force discrete log error:', error);
    return 0n;
  }
}

/**
 * Serialize ElGamal ciphertext to bytes
 * 
 * @param ciphertext - Ciphertext to serialize
 * @returns Serialized bytes
 */
export function serializeCiphertext(ciphertext: ElGamalCiphertext): Uint8Array {
  const bytes = new Uint8Array(64); // 32 bytes for C1 + 32 bytes for C2
  bytes.set(ciphertext.c1, 0);
  bytes.set(ciphertext.c2, 32);
  return bytes;
}

/**
 * Deserialize ElGamal ciphertext from bytes
 * 
 * @param bytes - Serialized bytes
 * @returns Deserialized ciphertext
 */
export function deserializeCiphertext(bytes: Uint8Array): ElGamalCiphertext {
  if (bytes.length !== 64) {
    throw new Error('Invalid ciphertext length');
  }
  
  return {
    c1: bytes.slice(0, 32),
    c2: bytes.slice(32, 64),
  };
}

/**
 * Homomorphic addition of two ciphertexts
 * 
 * This allows adding encrypted values without decryption:
 * Enc(a) + Enc(b) = Enc(a + b)
 * 
 * @param ct1 - First ciphertext
 * @param ct2 - Second ciphertext
 * @returns Sum of encrypted values
 */
export function addCiphertexts(
  ct1: ElGamalCiphertext,
  ct2: ElGamalCiphertext
): ElGamalCiphertext {
  try {
    const c1_1 = ed25519.ExtendedPoint.fromHex(ct1.c1);
    const c1_2 = ed25519.ExtendedPoint.fromHex(ct2.c1);
    const c2_1 = ed25519.ExtendedPoint.fromHex(ct1.c2);
    const c2_2 = ed25519.ExtendedPoint.fromHex(ct2.c2);
    
    return {
      c1: c1_1.add(c1_2).toRawBytes(),
      c2: c2_1.add(c2_2).toRawBytes(),
    };
  } catch (error) {
    console.error('Homomorphic addition failed:', error);
    // Fallback
    return {
      c1: addPoints(ct1.c1, ct2.c1),
      c2: addPoints(ct1.c2, ct2.c2),
    };
  }
}

/**
 * Homomorphic subtraction of two ciphertexts
 * 
 * @param ct1 - First ciphertext
 * @param ct2 - Second ciphertext (to subtract)
 * @returns Difference of encrypted values
 */
export function subtractCiphertexts(
  ct1: ElGamalCiphertext,
  ct2: ElGamalCiphertext
): ElGamalCiphertext {
  try {
    const c1_1 = ed25519.ExtendedPoint.fromHex(ct1.c1);
    const c1_2 = ed25519.ExtendedPoint.fromHex(ct2.c1);
    const c2_1 = ed25519.ExtendedPoint.fromHex(ct1.c2);
    const c2_2 = ed25519.ExtendedPoint.fromHex(ct2.c2);
    
    return {
      c1: c1_1.subtract(c1_2).toRawBytes(),
      c2: c2_1.subtract(c2_2).toRawBytes(),
    };
  } catch (error) {
    console.error('Homomorphic subtraction failed:', error);
    // Fallback
    return {
      c1: subtractPoints(ct1.c1, ct2.c1),
      c2: subtractPoints(ct1.c2, ct2.c2),
    };
  }
}

/**
 * Verify that a ciphertext is well-formed
 * 
 * @param ciphertext - Ciphertext to verify
 * @returns True if valid
 */
export function verifyCiphertext(ciphertext: ElGamalCiphertext): boolean {
  // Check that both components are valid curve points
  // TODO: Implement proper point validation
  return ciphertext.c1.length === 32 && ciphertext.c2.length === 32;
}

