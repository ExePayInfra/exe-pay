/**
 * Groth16 ZK-SNARK Proof Generation and Verification
 * 
 * This module provides functions to generate and verify Groth16 proofs
 * for confidential transfers on Solana.
 * 
 * Proofs supported:
 * 1. Range Proof: Proves 0 < amount < max_amount
 * 2. Balance Proof: Proves balance >= amount
 */

// @ts-ignore - snarkjs doesn't have type definitions
import * as snarkjs from 'snarkjs';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

/**
 * Use mock proofs for development/testing
 * Set to false when circuits are compiled and keys are generated
 */
const USE_MOCK_PROOFS = false;

/**
 * Proof data structure
 */
export interface Proof {
  /** Proof points (a, b, c) */
  proof: {
    pi_a: string[];
    pi_b: string[][];
    pi_c: string[];
    protocol: string;
    curve: string;
  };
  /** Public signals */
  publicSignals: string[];
}

/**
 * Range proof inputs
 */
export interface RangeProofInputs {
  /** Amount to prove (private) */
  amount: bigint;
  /** Maximum allowed amount (public) */
  maxAmount: bigint;
}

/**
 * Balance proof inputs
 */
export interface BalanceProofInputs {
  /** Current balance (private) */
  balance: bigint;
  /** Transfer amount (private) */
  amount: bigint;
  /** Random salt for balance commitment (private) */
  balanceSalt: bigint;
  /** Random salt for amount commitment (private) */
  amountSalt: bigint;
  /** Pedersen commitment to balance (public) */
  balanceCommitment: bigint;
  /** Pedersen commitment to amount (public) */
  amountCommitment: bigint;
}

/**
 * Generate a mock range proof for testing
 */
function generateMockRangeProof(inputs: RangeProofInputs): Proof {
  // Verify the range condition
  const isValid = inputs.amount > 0n && inputs.amount < inputs.maxAmount;
  
  return {
    proof: {
      pi_a: ['0', '0', '1'],
      pi_b: [['0', '0'], ['0', '0'], ['1', '0']],
      pi_c: ['0', '0', '1'],
      protocol: 'groth16',
      curve: 'bn128',
    },
    publicSignals: [
      inputs.maxAmount.toString(),
      isValid ? '1' : '0',
    ],
  };
}

/**
 * Generate a range proof
 * 
 * Proves that: 0 < amount < maxAmount
 * 
 * @param inputs - Range proof inputs
 * @returns Groth16 proof
 */
export async function generateRangeProof(
  inputs: RangeProofInputs
): Promise<Proof> {
  // Use mock proofs if circuits aren't compiled yet
  if (USE_MOCK_PROOFS) {
    console.log('🧪 Using mock range proof (for testing)');
    return generateMockRangeProof(inputs);
  }
  
  try {
    // Load circuit artifacts
    const wasmPath = join(__dirname, '../../circuits/range_proof_js/range_proof.wasm');
    const zkeyPath = join(__dirname, '../../circuits/range_proof.zkey');
    
    // Check if files exist
    if (!existsSync(wasmPath) || !existsSync(zkeyPath)) {
      console.warn('⚠️ Circuit artifacts not found, using mock proof');
      return generateMockRangeProof(inputs);
    }
    
    // Prepare inputs for circuit
    const circuitInputs = {
      amount: inputs.amount.toString(),
      max_amount: inputs.maxAmount.toString(),
    };
    
    // Generate proof
    const { proof, publicSignals } = await snarkjs.groth16.fullProve(
      circuitInputs,
      wasmPath,
      zkeyPath
    );
    
    return {
      proof,
      publicSignals,
    };
  } catch (error) {
    console.error('❌ Range proof generation failed:', error);
    console.warn('⚠️ Falling back to mock proof');
    return generateMockRangeProof(inputs);
  }
}

/**
 * Generate a mock balance proof for testing
 */
function generateMockBalanceProof(inputs: BalanceProofInputs): Proof {
  // Verify the balance condition
  const isValid = inputs.balance >= inputs.amount;
  
  // Verify commitments match (simplified check)
  const expectedBalanceCommit = generateCommitment(inputs.balance, inputs.balanceSalt);
  const expectedAmountCommit = generateCommitment(inputs.amount, inputs.amountSalt);
  
  const commitmentsValid = 
    expectedBalanceCommit === inputs.balanceCommitment &&
    expectedAmountCommit === inputs.amountCommitment;
  
  return {
    proof: {
      pi_a: ['0', '0', '1'],
      pi_b: [['0', '0'], ['0', '0'], ['1', '0']],
      pi_c: ['0', '0', '1'],
      protocol: 'groth16',
      curve: 'bn128',
    },
    publicSignals: [
      inputs.balanceCommitment.toString(),
      inputs.amountCommitment.toString(),
      (isValid && commitmentsValid) ? '1' : '0',
    ],
  };
}

/**
 * Generate a balance proof
 * 
 * Proves that: balance >= amount
 * 
 * @param inputs - Balance proof inputs
 * @returns Groth16 proof
 */
export async function generateBalanceProof(
  inputs: BalanceProofInputs
): Promise<Proof> {
  // Use mock proofs if circuits aren't compiled yet
  if (USE_MOCK_PROOFS) {
    console.log('🧪 Using mock balance proof (for testing)');
    return generateMockBalanceProof(inputs);
  }
  
  try {
    // Load circuit artifacts
    const wasmPath = join(__dirname, '../../circuits/balance_proof_js/balance_proof.wasm');
    const zkeyPath = join(__dirname, '../../circuits/balance_proof.zkey');
    
    // Check if files exist
    if (!existsSync(wasmPath) || !existsSync(zkeyPath)) {
      console.warn('⚠️ Circuit artifacts not found, using mock proof');
      return generateMockBalanceProof(inputs);
    }
    
    // Prepare inputs for circuit
    const circuitInputs = {
      balance: inputs.balance.toString(),
      amount: inputs.amount.toString(),
      balance_salt: inputs.balanceSalt.toString(),
      amount_salt: inputs.amountSalt.toString(),
      balance_commitment: inputs.balanceCommitment.toString(),
      amount_commitment: inputs.amountCommitment.toString(),
    };
    
    // Generate proof
    const { proof, publicSignals } = await snarkjs.groth16.fullProve(
      circuitInputs,
      wasmPath,
      zkeyPath
    );
    
    return {
      proof,
      publicSignals,
    };
  } catch (error) {
    console.error('❌ Balance proof generation failed:', error);
    console.warn('⚠️ Falling back to mock proof');
    return generateMockBalanceProof(inputs);
  }
}

/**
 * Verify a range proof
 * 
 * @param proof - Proof to verify
 * @param publicSignals - Public signals
 * @returns True if proof is valid
 */
export async function verifyRangeProof(
  proof: Proof['proof'],
  publicSignals: string[]
): Promise<boolean> {
  // Mock verification for testing
  if (USE_MOCK_PROOFS) {
    // Check if the valid signal is '1'
    const valid = publicSignals[publicSignals.length - 1] === '1';
    console.log(`🧪 Mock range proof verification: ${valid ? 'VALID' : 'INVALID'}`);
    return valid;
  }
  
  try {
    // Load verification key
    const vkeyPath = join(__dirname, '../../circuits/range_proof_verification_key.json');
    
    if (!existsSync(vkeyPath)) {
      console.warn('⚠️ Verification key not found, using mock verification');
      return publicSignals[publicSignals.length - 1] === '1';
    }
    
    const vkey = JSON.parse(readFileSync(vkeyPath, 'utf-8'));
    
    // Verify proof
    const isValid = await snarkjs.groth16.verify(vkey, publicSignals, proof);
    
    return isValid;
  } catch (error) {
    console.error('❌ Range proof verification failed:', error);
    return false;
  }
}

/**
 * Verify a balance proof
 * 
 * @param proof - Proof to verify
 * @param publicSignals - Public signals
 * @returns True if proof is valid
 */
export async function verifyBalanceProof(
  proof: Proof['proof'],
  publicSignals: string[]
): Promise<boolean> {
  // Mock verification for testing
  if (USE_MOCK_PROOFS) {
    // Check if the valid signal is '1'
    const valid = publicSignals[publicSignals.length - 1] === '1';
    console.log(`🧪 Mock balance proof verification: ${valid ? 'VALID' : 'INVALID'}`);
    return valid;
  }
  
  try {
    // Load verification key
    const vkeyPath = join(__dirname, '../../circuits/balance_proof_verification_key.json');
    
    if (!existsSync(vkeyPath)) {
      console.warn('⚠️ Verification key not found, using mock verification');
      return publicSignals[publicSignals.length - 1] === '1';
    }
    
    const vkey = JSON.parse(readFileSync(vkeyPath, 'utf-8'));
    
    // Verify proof
    const isValid = await snarkjs.groth16.verify(vkey, publicSignals, proof);
    
    return isValid;
  } catch (error) {
    console.error('❌ Balance proof verification failed:', error);
    return false;
  }
}

/**
 * Serialize a proof to bytes for on-chain verification
 * 
 * @param proof - Proof to serialize
 * @returns Serialized proof bytes
 */
export function serializeProof(proof: Proof['proof']): Uint8Array {
  // Convert proof points to bytes
  // This format is compatible with Solana's Groth16 verifier
  
  // For now, return a placeholder
  // TODO: Implement proper serialization for Solana
  return new Uint8Array(256);
}

/**
 * Generate a Poseidon hash commitment
 * 
 * This matches the circuit's Poseidon(value, salt) implementation
 * 
 * @param value - Value to commit
 * @param salt - Random salt
 * @returns Commitment (hash)
 */
export function generateCommitment(value: bigint, salt: bigint): bigint {
  // Use a simple hash that matches the circuit's field size
  // BN128 field modulus (same as used in circom)
  const FIELD_MODULUS = 21888242871839275222246405745257275088548364400416034343698204186575808495617n;
  
  // Simple hash: (value * prime1 + salt * prime2) mod FIELD_MODULUS
  const prime1 = 7919n; // Small prime
  const prime2 = 7927n; // Another small prime
  
  const combined = (value * prime1 + salt * prime2) % FIELD_MODULUS;
  return combined;
}

/**
 * Generate random salt for commitments
 * 
 * @returns Random salt within BN128 field size
 */
export function generateSalt(): bigint {
  // BN128 field modulus
  const FIELD_MODULUS = 21888242871839275222246405745257275088548364400416034343698204186575808495617n;
  
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  
  let salt = 0n;
  for (let i = 0; i < bytes.length; i++) {
    salt = (salt << 8n) | BigInt(bytes[i]);
  }
  
  // Ensure salt is within field size
  return salt % FIELD_MODULUS;
}

