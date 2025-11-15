/**
 * Tests for Groth16 ZK-SNARK proofs
 */

import { describe, it, expect } from 'vitest';
import {
  generateRangeProof,
  generateBalanceProof,
  verifyRangeProof,
  verifyBalanceProof,
  generateCommitment,
  generateSalt,
  type RangeProofInputs,
  type BalanceProofInputs,
} from '../proofs/groth16.js';

describe('Groth16 ZK Proofs', () => {
  describe('Range Proof', () => {
    it('should generate valid proof for amount in range', async () => {
      const inputs: RangeProofInputs = {
        amount: 100n,
        maxAmount: 1000n,
      };
      
      const proof = await generateRangeProof(inputs);
      
      expect(proof).toBeDefined();
      expect(proof.proof).toBeDefined();
      expect(proof.publicSignals).toBeDefined();
      expect(proof.publicSignals.length).toBeGreaterThan(0);
    });
    
    it('should verify valid range proof', async () => {
      const inputs: RangeProofInputs = {
        amount: 500n,
        maxAmount: 1000n,
      };
      
      const proof = await generateRangeProof(inputs);
      const isValid = await verifyRangeProof(proof.proof, proof.publicSignals);
      
      expect(isValid).toBe(true);
    });
    
    it('should reject proof for zero amount', async () => {
      const inputs: RangeProofInputs = {
        amount: 0n,
        maxAmount: 1000n,
      };
      
      const proof = await generateRangeProof(inputs);
      const isValid = await verifyRangeProof(proof.proof, proof.publicSignals);
      
      expect(isValid).toBe(false);
    });
    
    it('should reject proof for amount >= max', async () => {
      const inputs: RangeProofInputs = {
        amount: 1000n,
        maxAmount: 1000n,
      };
      
      const proof = await generateRangeProof(inputs);
      const isValid = await verifyRangeProof(proof.proof, proof.publicSignals);
      
      expect(isValid).toBe(false);
    });
    
    it('should reject proof for amount > max', async () => {
      const inputs: RangeProofInputs = {
        amount: 1500n,
        maxAmount: 1000n,
      };
      
      const proof = await generateRangeProof(inputs);
      const isValid = await verifyRangeProof(proof.proof, proof.publicSignals);
      
      expect(isValid).toBe(false);
    });
    
    it('should handle edge case: amount = 1', async () => {
      const inputs: RangeProofInputs = {
        amount: 1n,
        maxAmount: 1000n,
      };
      
      const proof = await generateRangeProof(inputs);
      const isValid = await verifyRangeProof(proof.proof, proof.publicSignals);
      
      expect(isValid).toBe(true);
    });
    
    it('should handle edge case: amount = max - 1', async () => {
      const inputs: RangeProofInputs = {
        amount: 999n,
        maxAmount: 1000n,
      };
      
      const proof = await generateRangeProof(inputs);
      const isValid = await verifyRangeProof(proof.proof, proof.publicSignals);
      
      expect(isValid).toBe(true);
    });
  });
  
  describe('Balance Proof', () => {
    it('should generate valid proof for sufficient balance', async () => {
      const balanceSalt = generateSalt();
      const amountSalt = generateSalt();
      const balance = 5000n;
      const amount = 1000n;
      
      const inputs: BalanceProofInputs = {
        balance,
        amount,
        balanceSalt,
        amountSalt,
        balanceCommitment: generateCommitment(balance, balanceSalt),
        amountCommitment: generateCommitment(amount, amountSalt),
      };
      
      const proof = await generateBalanceProof(inputs);
      
      expect(proof).toBeDefined();
      expect(proof.proof).toBeDefined();
      expect(proof.publicSignals).toBeDefined();
      expect(proof.publicSignals.length).toBeGreaterThan(0);
    });
    
    it('should verify valid balance proof', async () => {
      const balanceSalt = generateSalt();
      const amountSalt = generateSalt();
      const balance = 5000n;
      const amount = 1000n;
      
      const inputs: BalanceProofInputs = {
        balance,
        amount,
        balanceSalt,
        amountSalt,
        balanceCommitment: generateCommitment(balance, balanceSalt),
        amountCommitment: generateCommitment(amount, amountSalt),
      };
      
      const proof = await generateBalanceProof(inputs);
      const isValid = await verifyBalanceProof(proof.proof, proof.publicSignals);
      
      expect(isValid).toBe(true);
    });
    
    it('should reject proof for insufficient balance', async () => {
      const balanceSalt = generateSalt();
      const amountSalt = generateSalt();
      const balance = 500n;
      const amount = 1000n;
      
      const inputs: BalanceProofInputs = {
        balance,
        amount,
        balanceSalt,
        amountSalt,
        balanceCommitment: generateCommitment(balance, balanceSalt),
        amountCommitment: generateCommitment(amount, amountSalt),
      };
      
      const proof = await generateBalanceProof(inputs);
      const isValid = await verifyBalanceProof(proof.proof, proof.publicSignals);
      
      expect(isValid).toBe(false);
    });
    
    it('should reject proof with wrong commitment', async () => {
      const balanceSalt = generateSalt();
      const amountSalt = generateSalt();
      const wrongSalt = generateSalt();
      const balance = 5000n;
      const amount = 1000n;
      
      const inputs: BalanceProofInputs = {
        balance,
        amount,
        balanceSalt,
        amountSalt,
        balanceCommitment: generateCommitment(balance, wrongSalt), // Wrong!
        amountCommitment: generateCommitment(amount, amountSalt),
      };
      
      const proof = await generateBalanceProof(inputs);
      const isValid = await verifyBalanceProof(proof.proof, proof.publicSignals);
      
      expect(isValid).toBe(false);
    });
    
    it('should handle edge case: balance = amount', async () => {
      const balanceSalt = generateSalt();
      const amountSalt = generateSalt();
      const balance = 1000n;
      const amount = 1000n;
      
      const inputs: BalanceProofInputs = {
        balance,
        amount,
        balanceSalt,
        amountSalt,
        balanceCommitment: generateCommitment(balance, balanceSalt),
        amountCommitment: generateCommitment(amount, amountSalt),
      };
      
      const proof = await generateBalanceProof(inputs);
      const isValid = await verifyBalanceProof(proof.proof, proof.publicSignals);
      
      expect(isValid).toBe(true);
    });
    
    it('should handle large amounts', async () => {
      const balanceSalt = generateSalt();
      const amountSalt = generateSalt();
      const balance = 1000000000n; // 1 billion
      const amount = 500000000n;   // 500 million
      
      const inputs: BalanceProofInputs = {
        balance,
        amount,
        balanceSalt,
        amountSalt,
        balanceCommitment: generateCommitment(balance, balanceSalt),
        amountCommitment: generateCommitment(amount, amountSalt),
      };
      
      const proof = await generateBalanceProof(inputs);
      const isValid = await verifyBalanceProof(proof.proof, proof.publicSignals);
      
      expect(isValid).toBe(true);
    });
  });
  
  describe('Commitment Generation', () => {
    it('should generate deterministic commitments', () => {
      const value = 1000n;
      const salt = 12345n;
      
      const commitment1 = generateCommitment(value, salt);
      const commitment2 = generateCommitment(value, salt);
      
      expect(commitment1).toBe(commitment2);
    });
    
    it('should generate different commitments for different values', () => {
      const salt = 12345n;
      
      const commitment1 = generateCommitment(1000n, salt);
      const commitment2 = generateCommitment(2000n, salt);
      
      expect(commitment1).not.toBe(commitment2);
    });
    
    it('should generate different commitments for different salts', () => {
      const value = 1000n;
      
      const commitment1 = generateCommitment(value, 12345n);
      const commitment2 = generateCommitment(value, 67890n);
      
      expect(commitment1).not.toBe(commitment2);
    });
  });
  
  describe('Salt Generation', () => {
    it('should generate random salts', () => {
      const salt1 = generateSalt();
      const salt2 = generateSalt();
      
      expect(salt1).not.toBe(salt2);
    });
    
    it('should generate 256-bit salts', () => {
      const salt = generateSalt();
      
      // Check that salt is within 256-bit range
      expect(salt).toBeGreaterThanOrEqual(0n);
      expect(salt).toBeLessThan(2n ** 256n);
    });
    
    it('should generate different salts each time', () => {
      const salts = new Set<bigint>();
      
      for (let i = 0; i < 10; i++) {
        salts.add(generateSalt());
      }
      
      // All salts should be unique
      expect(salts.size).toBe(10);
    });
  });
  
  describe('Integration Tests', () => {
    it('should work end-to-end for valid transfer', async () => {
      // Scenario: User wants to transfer 1000 tokens
      // They have 5000 tokens in their balance
      const transferAmount = 1000n;
      const userBalance = 5000n;
      const maxTransfer = 10000n;
      
      // Generate range proof
      const rangeProof = await generateRangeProof({
        amount: transferAmount,
        maxAmount: maxTransfer,
      });
      
      // Generate balance proof
      const balanceSalt = generateSalt();
      const amountSalt = generateSalt();
      const balanceProof = await generateBalanceProof({
        balance: userBalance,
        amount: transferAmount,
        balanceSalt,
        amountSalt,
        balanceCommitment: generateCommitment(userBalance, balanceSalt),
        amountCommitment: generateCommitment(transferAmount, amountSalt),
      });
      
      // Verify both proofs
      const rangeValid = await verifyRangeProof(rangeProof.proof, rangeProof.publicSignals);
      const balanceValid = await verifyBalanceProof(balanceProof.proof, balanceProof.publicSignals);
      
      expect(rangeValid).toBe(true);
      expect(balanceValid).toBe(true);
    });
    
    it('should reject invalid transfer (insufficient balance)', async () => {
      // Scenario: User wants to transfer 10000 tokens
      // But they only have 5000 tokens
      const transferAmount = 10000n;
      const userBalance = 5000n;
      const maxTransfer = 100000n;
      
      // Range proof should pass
      const rangeProof = await generateRangeProof({
        amount: transferAmount,
        maxAmount: maxTransfer,
      });
      
      // Balance proof should fail
      const balanceSalt = generateSalt();
      const amountSalt = generateSalt();
      const balanceProof = await generateBalanceProof({
        balance: userBalance,
        amount: transferAmount,
        balanceSalt,
        amountSalt,
        balanceCommitment: generateCommitment(userBalance, balanceSalt),
        amountCommitment: generateCommitment(transferAmount, amountSalt),
      });
      
      const rangeValid = await verifyRangeProof(rangeProof.proof, rangeProof.publicSignals);
      const balanceValid = await verifyBalanceProof(balanceProof.proof, balanceProof.publicSignals);
      
      expect(rangeValid).toBe(true);
      expect(balanceValid).toBe(false); // Should fail!
    });
  });
});

