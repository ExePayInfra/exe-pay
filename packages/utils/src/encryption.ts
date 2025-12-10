/**
 * Wallet Encryption Utilities
 * Uses Web Crypto API for secure password-based encryption
 */

export interface EncryptedData {
  ciphertext: string; // Base64 encoded
  iv: string; // Base64 encoded
  salt: string; // Base64 encoded
}

/**
 * Derive encryption key from password using PBKDF2
 */
async function deriveKey(password: string, salt: Uint8Array): Promise<CryptoKey> {
  // Convert password to key material
  const encoder = new TextEncoder();
  const passwordBuffer = encoder.encode(password);
  
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    passwordBuffer,
    'PBKDF2',
    false,
    ['deriveBits', 'deriveKey']
  );
  
  // Derive AES-GCM key using PBKDF2
  return crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: salt as BufferSource,
      iterations: 100000, // High iteration count for security
      hash: 'SHA-256',
    },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  );
}

/**
 * Encrypt data with password
 * @param data Plain text data to encrypt
 * @param password Encryption password
 * @returns Encrypted data with IV and salt
 */
export async function encryptData(data: string, password: string): Promise<EncryptedData> {
  // Generate random salt and IV
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const iv = crypto.getRandomValues(new Uint8Array(12));
  
  // Derive encryption key
  const key = await deriveKey(password, salt);
  
  // Encrypt data
  const encoder = new TextEncoder();
  const dataBuffer = encoder.encode(data);
  
  const ciphertext = await crypto.subtle.encrypt(
    {
      name: 'AES-GCM',
      iv: iv as BufferSource,
    },
    key,
    dataBuffer
  );
  
  // Convert to base64 for storage
  return {
    ciphertext: bufferToBase64(ciphertext),
    iv: bufferToBase64(iv),
    salt: bufferToBase64(salt),
  };
}

/**
 * Decrypt data with password
 * @param encryptedData Encrypted data object
 * @param password Decryption password
 * @returns Decrypted plain text
 * @throws Error if password is incorrect or data is corrupted
 */
export async function decryptData(
  encryptedData: EncryptedData,
  password: string
): Promise<string> {
  try {
    // Convert from base64
    const ciphertext = base64ToBuffer(encryptedData.ciphertext);
    const iv = base64ToBuffer(encryptedData.iv);
    const salt = base64ToBuffer(encryptedData.salt);
    
    // Derive decryption key
    const key = await deriveKey(password, new Uint8Array(salt));
    
    // Decrypt data
    const decryptedBuffer = await crypto.subtle.decrypt(
      {
        name: 'AES-GCM',
        iv: new Uint8Array(iv) as BufferSource,
      },
      key,
      ciphertext
    );
    
    // Convert to string
    const decoder = new TextDecoder();
    return decoder.decode(decryptedBuffer);
  } catch (error) {
    throw new Error('Decryption failed. Incorrect password or corrupted data.');
  }
}

/**
 * Helper: Convert ArrayBuffer to Base64 string
 */
function bufferToBase64(buffer: ArrayBuffer | Uint8Array): string {
  const bytes = buffer instanceof Uint8Array ? buffer : new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

/**
 * Helper: Convert Base64 string to ArrayBuffer
 */
function base64ToBuffer(base64: string): ArrayBuffer {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes.buffer;
}

/**
 * Validate password strength
 * @param password Password to validate
 * @returns Object with validation result and message
 */
export function validatePassword(password: string): {
  valid: boolean;
  message: string;
} {
  if (password.length < 8) {
    return {
      valid: false,
      message: 'Password must be at least 8 characters long',
    };
  }
  
  if (password.length < 12) {
    return {
      valid: true,
      message: 'Password strength: Weak. Consider using 12+ characters.',
    };
  }
  
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  
  const strengthCount = [hasUpperCase, hasLowerCase, hasNumbers, hasSpecialChar].filter(Boolean).length;
  
  if (strengthCount >= 3) {
    return {
      valid: true,
      message: 'Password strength: Strong',
    };
  }
  
  return {
    valid: true,
    message: 'Password strength: Medium. Consider adding uppercase, numbers, or special characters.',
  };
}

