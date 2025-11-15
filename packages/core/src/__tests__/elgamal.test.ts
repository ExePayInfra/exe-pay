/**
 * Tests for ElGamal encryption
 */

import { describe, it, expect } from 'vitest';
import {
  generateElGamalKeypair,
  encryptAmount,
  decryptAmount,
  addCiphertexts,
  subtractCiphertexts,
  serializeCiphertext,
  deserializeCiphertext,
} from '../crypto/elgamal.js';

describe('ElGamal Encryption', () => {
  describe('Keypair Generation', () => {
    it('should generate a valid keypair', () => {
      const keypair = generateElGamalKeypair();
      
      expect(keypair.publicKey).toBeInstanceOf(Uint8Array);
      expect(keypair.privateKey).toBeInstanceOf(Uint8Array);
      expect(keypair.publicKey.length).toBe(32);
      expect(keypair.privateKey.length).toBe(32);
    });

    it('should generate different keypairs each time', () => {
      const keypair1 = generateElGamalKeypair();
      const keypair2 = generateElGamalKeypair();
      
      expect(keypair1.publicKey).not.toEqual(keypair2.publicKey);
      expect(keypair1.privateKey).not.toEqual(keypair2.privateKey);
    });
  });

  describe('Encryption and Decryption', () => {
    it('should encrypt and decrypt small amounts correctly', () => {
      const keypair = generateElGamalKeypair();
      const amount = 100n;
      
      const ciphertext = encryptAmount(amount, keypair.publicKey);
      const decrypted = decryptAmount(ciphertext, keypair.privateKey);
      
      expect(decrypted).toBe(amount);
    });

    it('should handle zero amount', () => {
      const keypair = generateElGamalKeypair();
      const amount = 0n;
      
      const ciphertext = encryptAmount(amount, keypair.publicKey);
      const decrypted = decryptAmount(ciphertext, keypair.privateKey);
      
      expect(decrypted).toBe(amount);
    });

    it('should encrypt different amounts differently', () => {
      const keypair = generateElGamalKeypair();
      
      const ct1 = encryptAmount(100n, keypair.publicKey);
      const ct2 = encryptAmount(200n, keypair.publicKey);
      
      expect(ct1.c1).not.toEqual(ct2.c1);
      expect(ct1.c2).not.toEqual(ct2.c2);
    });

    it('should produce different ciphertexts for same amount (randomness)', () => {
      const keypair = generateElGamalKeypair();
      const amount = 100n;
      
      const ct1 = encryptAmount(amount, keypair.publicKey);
      const ct2 = encryptAmount(amount, keypair.publicKey);
      
      // Different due to random nonce
      expect(ct1.c1).not.toEqual(ct2.c1);
      expect(ct1.c2).not.toEqual(ct2.c2);
      
      // But both decrypt to same value
      const dec1 = decryptAmount(ct1, keypair.privateKey);
      const dec2 = decryptAmount(ct2, keypair.privateKey);
      expect(dec1).toBe(amount);
      expect(dec2).toBe(amount);
    });
  });

  describe('Serialization', () => {
    it('should serialize and deserialize ciphertext', () => {
      const keypair = generateElGamalKeypair();
      const amount = 500n;
      
      const ciphertext = encryptAmount(amount, keypair.publicKey);
      const serialized = serializeCiphertext(ciphertext);
      const deserialized = deserializeCiphertext(serialized);
      
      expect(deserialized.c1).toEqual(ciphertext.c1);
      expect(deserialized.c2).toEqual(ciphertext.c2);
      
      // Should still decrypt correctly
      const decrypted = decryptAmount(deserialized, keypair.privateKey);
      expect(decrypted).toBe(amount);
    });

    it('should produce 64-byte serialization', () => {
      const keypair = generateElGamalKeypair();
      const ciphertext = encryptAmount(100n, keypair.publicKey);
      const serialized = serializeCiphertext(ciphertext);
      
      expect(serialized.length).toBe(64);
    });
  });

  describe('Homomorphic Operations', () => {
    it('should add encrypted values homomorphically', () => {
      const keypair = generateElGamalKeypair();
      
      const amount1 = 100n;
      const amount2 = 200n;
      
      const ct1 = encryptAmount(amount1, keypair.publicKey);
      const ct2 = encryptAmount(amount2, keypair.publicKey);
      
      const sum = addCiphertexts(ct1, ct2);
      const decrypted = decryptAmount(sum, keypair.privateKey);
      
      expect(decrypted).toBe(amount1 + amount2);
    });

    it('should subtract encrypted values homomorphically', () => {
      const keypair = generateElGamalKeypair();
      
      const amount1 = 500n;
      const amount2 = 200n;
      
      const ct1 = encryptAmount(amount1, keypair.publicKey);
      const ct2 = encryptAmount(amount2, keypair.publicKey);
      
      const difference = subtractCiphertexts(ct1, ct2);
      const decrypted = decryptAmount(difference, keypair.privateKey);
      
      expect(decrypted).toBe(amount1 - amount2);
    });

    it('should handle multiple additions', () => {
      const keypair = generateElGamalKeypair();
      
      const amounts = [10n, 20n, 30n, 40n];
      const ciphertexts = amounts.map(a => encryptAmount(a, keypair.publicKey));
      
      let sum = ciphertexts[0];
      for (let i = 1; i < ciphertexts.length; i++) {
        sum = addCiphertexts(sum, ciphertexts[i]);
      }
      
      const decrypted = decryptAmount(sum, keypair.privateKey);
      const expected = amounts.reduce((a, b) => a + b, 0n);
      
      expect(decrypted).toBe(expected);
    });
  });

  describe('Edge Cases', () => {
    it('should handle amounts up to 1000', () => {
      const keypair = generateElGamalKeypair();
      
      for (let amount = 0; amount <= 1000; amount += 100) {
        const ct = encryptAmount(BigInt(amount), keypair.publicKey);
        const decrypted = decryptAmount(ct, keypair.privateKey);
        expect(decrypted).toBe(BigInt(amount));
      }
    });

    it('should not decrypt with wrong private key', () => {
      const keypair1 = generateElGamalKeypair();
      const keypair2 = generateElGamalKeypair();
      
      const amount = 100n;
      const ciphertext = encryptAmount(amount, keypair1.publicKey);
      
      // Decrypt with wrong key
      const decrypted = decryptAmount(ciphertext, keypair2.privateKey);
      
      // Should not match original amount
      expect(decrypted).not.toBe(amount);
    });
  });

  describe('Performance', () => {
    it('should encrypt/decrypt 100 times in reasonable time', () => {
      const keypair = generateElGamalKeypair();
      const amount = 500n;
      
      const start = Date.now();
      
      for (let i = 0; i < 100; i++) {
        const ct = encryptAmount(amount, keypair.publicKey);
        const decrypted = decryptAmount(ct, keypair.privateKey);
        expect(decrypted).toBe(amount);
      }
      
      const elapsed = Date.now() - start;
      console.log(`100 encrypt/decrypt cycles: ${elapsed}ms`);
      
      // Should complete in under 5 seconds
      expect(elapsed).toBeLessThan(5000);
    });
  });
});

