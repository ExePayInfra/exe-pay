/**
 * Claim/Spend functionality for Stealth Payments
 * 
 * Allows recipients to claim funds from stealth addresses by:
 * 1. Deriving the private key for the stealth address
 * 2. Creating a transaction to transfer funds to main wallet
 * 3. Signing with the derived keypair
 */

import { 
  Connection, 
  PublicKey, 
  Transaction, 
  SystemProgram, 
  Keypair,
  LAMPORTS_PER_SOL,
  sendAndConfirmTransaction
} from '@solana/web3.js';
import { ed25519 } from '@noble/curves/ed25519';
import type { DetectedPayment } from './scanner.js';

/**
 * Create a Keypair from a derived private key
 */
function createKeypairFromPrivateKey(privateKey: Uint8Array): Keypair {
  // Ed25519 keypair needs 64 bytes (32 secret + 32 public)
  // We have 32 bytes, need to derive the public key
  
  // Use ed25519 to get the full keypair
  const publicKey = ed25519.getPublicKey(privateKey);
  
  // Combine into 64-byte secret key format
  const secretKey = new Uint8Array(64);
  secretKey.set(privateKey, 0);
  secretKey.set(publicKey, 32);
  
  return Keypair.fromSecretKey(secretKey);
}

export interface ClaimOptions {
  // Destination address (defaults to user's main wallet)
  destination?: PublicKey;
  
  // Whether to claim all funds or leave some for rent
  leaveRent?: boolean;
  
  // Custom fee payer (defaults to destination)
  feePayer?: PublicKey;
}

export interface ClaimResult {
  signature: string;
  amount: number;
  destination: string;
  success: boolean;
}

/**
 * Claim funds from a stealth address
 */
export async function claimPayment(
  connection: Connection,
  payment: DetectedPayment,
  userPublicKey: PublicKey,
  options: ClaimOptions = {}
): Promise<ClaimResult> {
  const {
    destination = userPublicKey,
    leaveRent = true,
    feePayer = userPublicKey
  } = options;
  
  if (!payment.privateKey) {
    throw new Error('Payment does not have derived private key');
  }
  
  console.log('[Claim] Starting claim process...');
  console.log('[Claim] From:', payment.address.toBase58());
  console.log('[Claim] To:', destination.toBase58());
  console.log('[Claim] Amount:', payment.amount / LAMPORTS_PER_SOL, 'SOL');
  
  try {
    // Create keypair for the stealth address
    const stealthKeypair = createKeypairFromPrivateKey(payment.privateKey);
    
    // Verify the derived address matches
    if (!stealthKeypair.publicKey.equals(payment.address)) {
      throw new Error('Derived keypair does not match stealth address');
    }
    
    console.log('[Claim] ✓ Keypair derived successfully');
    
    // Get balance of stealth address
    const balance = await connection.getBalance(payment.address);
    
    if (balance === 0) {
      throw new Error('Stealth address has zero balance');
    }
    
    console.log('[Claim] Current balance:', balance / LAMPORTS_PER_SOL, 'SOL');
    
    // Calculate amount to transfer
    // Leave minimum rent-exempt amount if requested
    const minRent = leaveRent ? await connection.getMinimumBalanceForRentExemption(0) : 0;
    const transferAmount = balance - minRent - 5000; // 5000 lamports for transaction fee
    
    if (transferAmount <= 0) {
      throw new Error('Insufficient balance after rent and fees');
    }
    
    console.log('[Claim] Transferring:', transferAmount / LAMPORTS_PER_SOL, 'SOL');
    
    // Create transaction
    const transaction = new Transaction();
    
    transaction.add(
      SystemProgram.transfer({
        fromPubkey: payment.address,
        toPubkey: destination,
        lamports: transferAmount,
      })
    );
    
    // Get recent blockhash
    const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash();
    transaction.recentBlockhash = blockhash;
    transaction.lastValidBlockHeight = lastValidBlockHeight;
    
    // The stealth address pays for itself (no external fee payer needed)
    transaction.feePayer = payment.address;
    
    // Sign with stealth keypair
    transaction.sign(stealthKeypair);
    
    console.log('[Claim] Transaction signed, sending...');
    
    // Send transaction
    const signature = await connection.sendRawTransaction(transaction.serialize(), {
      skipPreflight: false,
      preflightCommitment: 'confirmed',
    });
    
    console.log('[Claim] Transaction sent:', signature);
    
    // Wait for confirmation
    const confirmation = await connection.confirmTransaction({
      signature,
      blockhash,
      lastValidBlockHeight,
    }, 'confirmed');
    
    if (confirmation.value.err) {
      throw new Error(`Transaction failed: ${JSON.stringify(confirmation.value.err)}`);
    }
    
    console.log('[Claim] ✓ Transaction confirmed!');
    
    return {
      signature,
      amount: transferAmount,
      destination: destination.toBase58(),
      success: true,
    };
  } catch (err: any) {
    console.error('[Claim] Failed:', err);
    throw new Error(`Claim failed: ${err.message}`);
  }
}

/**
 * Claim multiple payments in batch
 */
export async function claimMultiplePayments(
  connection: Connection,
  payments: DetectedPayment[],
  userPublicKey: PublicKey,
  options: ClaimOptions = {}
): Promise<ClaimResult[]> {
  console.log(`[Claim] Claiming ${payments.length} payments...`);
  
  const results: ClaimResult[] = [];
  
  for (const payment of payments) {
    try {
      const result = await claimPayment(connection, payment, userPublicKey, options);
      results.push(result);
    } catch (err: any) {
      console.error('[Claim] Failed to claim payment:', payment.signature, err);
      results.push({
        signature: payment.signature,
        amount: 0,
        destination: userPublicKey.toBase58(),
        success: false,
      });
    }
  }
  
  const successful = results.filter(r => r.success).length;
  console.log(`[Claim] Claimed ${successful}/${payments.length} payments successfully`);
  
  return results;
}

/**
 * Estimate fees for claiming a payment
 */
export async function estimateClaimFee(
  connection: Connection,
  payment: DetectedPayment
): Promise<number> {
  try {
    // Get current fee for a simple transfer
    const { feeCalculator } = await connection.getRecentBlockhash();
    
    // Simple transfer = 1 signature
    const fee = feeCalculator ? feeCalculator.lamportsPerSignature : 5000;
    
    return fee;
  } catch (err) {
    // Default to 5000 lamports if we can't estimate
    return 5000;
  }
}

/**
 * Check if a payment can be claimed
 */
export async function canClaimPayment(
  connection: Connection,
  payment: DetectedPayment
): Promise<{ canClaim: boolean; reason?: string }> {
  try {
    // Check if we have the private key
    if (!payment.privateKey) {
      return { canClaim: false, reason: 'Missing private key' };
    }
    
    // Check if already claimed
    if (payment.claimed) {
      return { canClaim: false, reason: 'Already claimed' };
    }
    
    // Check balance
    const balance = await connection.getBalance(payment.address);
    
    if (balance === 0) {
      return { canClaim: false, reason: 'Zero balance' };
    }
    
    // Check if balance is sufficient after fees
    const fee = await estimateClaimFee(connection, payment);
    const minRent = await connection.getMinimumBalanceForRentExemption(0);
    
    if (balance <= fee + minRent) {
      return { canClaim: false, reason: 'Insufficient balance after fees' };
    }
    
    return { canClaim: true };
  } catch (err: any) {
    return { canClaim: false, reason: err.message };
  }
}

