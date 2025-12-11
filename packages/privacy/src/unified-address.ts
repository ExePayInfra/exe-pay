/**
 * Unified Address System
 * 
 * A single address format that supports all ExePay privacy modes:
 * - Standard transparent payments
 * - Stealth addresses (one-time payments)
 * - Integrated addresses (with payment IDs)
 * - Subaddresses (multiple identities)
 * 
 * Format: exe1<base58_encoded_data>
 * 
 * The encoded data includes:
 * - Version byte (0x01)
 * - Address type (standard/stealth/integrated/subaddress)
 * - Public keys
 * - Optional payment ID
 * - Optional subaddress index
 * - Checksum
 */

import { PublicKey } from '@solana/web3.js';
import { sha256 } from '@noble/hashes/sha256';

// Base58 encoding/decoding utilities
const BASE58_ALPHABET = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';

function base58Encode(buffer: Buffer): string {
  const digits = [0];
  
  for (let i = 0; i < buffer.length; i++) {
    let carry = buffer[i];
    for (let j = 0; j < digits.length; j++) {
      carry += digits[j] << 8;
      digits[j] = carry % 58;
      carry = (carry / 58) | 0;
    }
    while (carry > 0) {
      digits.push(carry % 58);
      carry = (carry / 58) | 0;
    }
  }
  
  // Convert leading zeros
  for (let i = 0; i < buffer.length && buffer[i] === 0; i++) {
    digits.push(0);
  }
  
  return digits
    .reverse()
    .map(digit => BASE58_ALPHABET[digit])
    .join('');
}

function base58Decode(str: string): Buffer {
  const bytes = [0];
  
  for (let i = 0; i < str.length; i++) {
    const char = str[i];
    const value = BASE58_ALPHABET.indexOf(char);
    if (value < 0) {
      throw new Error(`Invalid base58 character: ${char}`);
    }
    
    let carry = value;
    for (let j = 0; j < bytes.length; j++) {
      carry += bytes[j] * 58;
      bytes[j] = carry & 0xff;
      carry >>= 8;
    }
    while (carry > 0) {
      bytes.push(carry & 0xff);
      carry >>= 8;
    }
  }
  
  // Convert leading '1's to leading zeros
  for (let i = 0; i < str.length && str[i] === '1'; i++) {
    bytes.push(0);
  }
  
  return Buffer.from(bytes.reverse());
}

/**
 * Address types supported by unified addresses
 */
export enum UnifiedAddressType {
  STANDARD = 0x00,      // Normal Solana address
  STEALTH = 0x01,       // Stealth address (view key + spend key)
  INTEGRATED = 0x02,    // Integrated address (stealth + payment ID)
  SUBADDRESS = 0x03,    // Subaddress (stealth + index)
}

/**
 * Unified address structure
 */
export interface UnifiedAddress {
  type: UnifiedAddressType;
  publicKey: PublicKey;
  viewKey?: PublicKey;      // For stealth addresses
  spendKey?: PublicKey;     // For stealth addresses
  paymentId?: string;       // For integrated addresses (8 bytes hex)
  subaddressIndex?: number; // For subaddresses
}

/**
 * Prefix for all unified addresses
 */
const UNIFIED_ADDRESS_PREFIX = 'exe1';

/**
 * Version byte for current unified address format
 */
const UNIFIED_ADDRESS_VERSION = 0x01;

/**
 * Generate a unified address from components
 */
export function generateUnifiedAddress(params: UnifiedAddress): string {
  const { type, publicKey, viewKey, spendKey, paymentId, subaddressIndex } = params;

  // Start with version and type
  const data: number[] = [UNIFIED_ADDRESS_VERSION, type];

  // Add public key (32 bytes)
  data.push(...publicKey.toBytes());

  // Add type-specific data
  switch (type) {
    case UnifiedAddressType.STANDARD:
      // Just the public key
      break;

    case UnifiedAddressType.STEALTH:
      if (!viewKey || !spendKey) {
        throw new Error('Stealth addresses require view key and spend key');
      }
      // Add view key (32 bytes)
      data.push(...viewKey.toBytes());
      // Add spend key (32 bytes)
      data.push(...spendKey.toBytes());
      break;

    case UnifiedAddressType.INTEGRATED:
      if (!viewKey || !spendKey || !paymentId) {
        throw new Error('Integrated addresses require view key, spend key, and payment ID');
      }
      // Add view key (32 bytes)
      data.push(...viewKey.toBytes());
      // Add spend key (32 bytes)
      data.push(...spendKey.toBytes());
      // Add payment ID (8 bytes)
      const paymentIdBytes = Buffer.from(paymentId, 'hex');
      if (paymentIdBytes.length !== 8) {
        throw new Error('Payment ID must be 8 bytes (16 hex characters)');
      }
      data.push(...paymentIdBytes);
      break;

    case UnifiedAddressType.SUBADDRESS:
      if (!viewKey || !spendKey || subaddressIndex === undefined) {
        throw new Error('Subaddresses require view key, spend key, and index');
      }
      // Add view key (32 bytes)
      data.push(...viewKey.toBytes());
      // Add spend key (32 bytes)
      data.push(...spendKey.toBytes());
      // Add subaddress index (4 bytes, big-endian)
      data.push(
        (subaddressIndex >> 24) & 0xff,
        (subaddressIndex >> 16) & 0xff,
        (subaddressIndex >> 8) & 0xff,
        subaddressIndex & 0xff
      );
      break;

    default:
      throw new Error(`Unknown address type: ${type}`);
  }

  // Add checksum (first 4 bytes of SHA256 hash)
  const dataBuffer = Buffer.from(data);
  const hash = sha256(dataBuffer);
  const checksum = hash.slice(0, 4);
  data.push(...checksum);

  // Encode to base58
  const encoded = base58Encode(Buffer.from(data));

  // Return with prefix
  return `${UNIFIED_ADDRESS_PREFIX}${encoded}`;
}

/**
 * Parse a unified address string
 */
export function parseUnifiedAddress(address: string): UnifiedAddress {
  // Check prefix
  if (!address.startsWith(UNIFIED_ADDRESS_PREFIX)) {
    throw new Error(`Invalid unified address prefix. Expected "${UNIFIED_ADDRESS_PREFIX}"`);
  }

  // Remove prefix and decode
  const encoded = address.slice(UNIFIED_ADDRESS_PREFIX.length);
  const decoded = base58Decode(encoded);

  // Minimum length: version(1) + type(1) + pubkey(32) + checksum(4) = 38 bytes
  if (decoded.length < 38) {
    throw new Error('Invalid unified address: too short');
  }

  // Extract checksum and verify
  const dataWithoutChecksum = decoded.slice(0, -4);
  const providedChecksum = decoded.slice(-4);
  const calculatedHash = sha256(dataWithoutChecksum);
  const calculatedChecksum = calculatedHash.slice(0, 4);

  if (!Buffer.from(providedChecksum).equals(Buffer.from(calculatedChecksum))) {
    throw new Error('Invalid unified address: checksum mismatch');
  }

  // Parse version
  const version = decoded[0];
  if (version !== UNIFIED_ADDRESS_VERSION) {
    throw new Error(`Unsupported unified address version: ${version}`);
  }

  // Parse type
  const type = decoded[1] as UnifiedAddressType;

  // Parse public key
  const publicKeyBytes = decoded.slice(2, 34);
  const publicKey = new PublicKey(publicKeyBytes);

  let offset = 34;
  const result: UnifiedAddress = { type, publicKey };

  // Parse type-specific data
  switch (type) {
    case UnifiedAddressType.STANDARD:
      // No additional data
      break;

    case UnifiedAddressType.STEALTH:
      if (decoded.length < 98) {
        // 2 + 32 + 32 + 32 + 4 = 102 bytes minimum
        throw new Error('Invalid stealth address: too short');
      }
      result.viewKey = new PublicKey(decoded.slice(offset, offset + 32));
      offset += 32;
      result.spendKey = new PublicKey(decoded.slice(offset, offset + 32));
      offset += 32;
      break;

    case UnifiedAddressType.INTEGRATED:
      if (decoded.length < 106) {
        // 2 + 32 + 32 + 32 + 8 + 4 = 110 bytes minimum
        throw new Error('Invalid integrated address: too short');
      }
      result.viewKey = new PublicKey(decoded.slice(offset, offset + 32));
      offset += 32;
      result.spendKey = new PublicKey(decoded.slice(offset, offset + 32));
      offset += 32;
      result.paymentId = Buffer.from(decoded.slice(offset, offset + 8)).toString('hex');
      offset += 8;
      break;

    case UnifiedAddressType.SUBADDRESS:
      if (decoded.length < 102) {
        // 2 + 32 + 32 + 32 + 4 + 4 = 106 bytes minimum
        throw new Error('Invalid subaddress: too short');
      }
      result.viewKey = new PublicKey(decoded.slice(offset, offset + 32));
      offset += 32;
      result.spendKey = new PublicKey(decoded.slice(offset, offset + 32));
      offset += 32;
      result.subaddressIndex =
        (decoded[offset] << 24) |
        (decoded[offset + 1] << 16) |
        (decoded[offset + 2] << 8) |
        decoded[offset + 3];
      offset += 4;
      break;

    default:
      throw new Error(`Unknown address type: ${type}`);
  }

  return result;
}

/**
 * Check if a string is a valid unified address
 */
export function isUnifiedAddress(address: string): boolean {
  try {
    parseUnifiedAddress(address);
    return true;
  } catch {
    return false;
  }
}

/**
 * Get address type name
 */
export function getAddressTypeName(type: UnifiedAddressType): string {
  switch (type) {
    case UnifiedAddressType.STANDARD:
      return 'Standard';
    case UnifiedAddressType.STEALTH:
      return 'Stealth';
    case UnifiedAddressType.INTEGRATED:
      return 'Integrated';
    case UnifiedAddressType.SUBADDRESS:
      return 'Subaddress';
    default:
      return 'Unknown';
  }
}

/**
 * Convert a standard Solana address to a unified address
 */
export function standardToUnified(publicKey: PublicKey): string {
  return generateUnifiedAddress({
    type: UnifiedAddressType.STANDARD,
    publicKey,
  });
}

/**
 * Convert stealth address components to unified address
 */
export function stealthToUnified(
  publicKey: PublicKey,
  viewKey: PublicKey,
  spendKey: PublicKey
): string {
  return generateUnifiedAddress({
    type: UnifiedAddressType.STEALTH,
    publicKey,
    viewKey,
    spendKey,
  });
}

/**
 * Convert integrated address components to unified address
 */
export function integratedToUnified(
  publicKey: PublicKey,
  viewKey: PublicKey,
  spendKey: PublicKey,
  paymentId: string
): string {
  return generateUnifiedAddress({
    type: UnifiedAddressType.INTEGRATED,
    publicKey,
    viewKey,
    spendKey,
    paymentId,
  });
}

/**
 * Convert subaddress components to unified address
 */
export function subaddressToUnified(
  publicKey: PublicKey,
  viewKey: PublicKey,
  spendKey: PublicKey,
  subaddressIndex: number
): string {
  return generateUnifiedAddress({
    type: UnifiedAddressType.SUBADDRESS,
    publicKey,
    viewKey,
    spendKey,
    subaddressIndex,
  });
}

