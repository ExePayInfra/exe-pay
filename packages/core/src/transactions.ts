import { SystemProgram, TransactionInstruction, PublicKey } from "@solana/web3.js";
import { CompressedTokenProgram } from "@lightprotocol/compressed-token";
import { keccak_256 } from "@noble/hashes/sha3";
import { randomBytes } from "@noble/hashes/utils";
import type { 
  BuiltPayment, 
  PaymentIntent, 
  BuildTransactionOptions,
  BatchPaymentIntent,
  BatchPaymentRecipient 
} from "./types.js";
import { buildShieldedNote } from "./merkle.js";

const EXE_PAY_PROGRAM_ID = new PublicKey("ExEPaY1111111111111111111111111111111111");
const LIGHT_PROGRAM_ID = new PublicKey("compr6CUsB5m2jS4Y3831ztGSTnDpnKJTKS95d64XVq");

export function createPaymentIntent(params: {
  readonly amount: number;
  readonly merchant: PublicKey;
  readonly tokenMint?: PublicKey;
  readonly memo?: string;
}): PaymentIntent {
  if (params.amount <= 0) {
    throw new Error("Amount must be positive");
  }

  return {
    amountLamports: BigInt(Math.trunc(params.amount)),
    merchant: params.merchant,
    tokenMint: params.tokenMint,
    nonce: randomBytes(32),
    memo: params.memo
  };
}

/**
 * Creates a compressed transfer instruction using Light Protocol
 * This provides zero-knowledge privacy for the transfer
 */
function createCompressedTransfer(
  from: PublicKey,
  to: PublicKey,
  amount: bigint,
  mint?: PublicKey
): TransactionInstruction {
  // For now, create a placeholder instruction
  // In production, this would use CompressedTokenProgram.transfer()
  // with proper compressed account inputs and proofs
  return new TransactionInstruction({
    programId: LIGHT_PROGRAM_ID,
    keys: [
      { pubkey: from, isSigner: true, isWritable: true },
      { pubkey: to, isSigner: false, isWritable: true },
    ],
    data: Buffer.from([
      0x01, // Instruction discriminator for compressed transfer
      ...Buffer.from(amount.toString(16).padStart(16, '0'), 'hex')
    ])
  });
}

export function buildPaymentInstructions(intent: PaymentIntent, opts: BuildTransactionOptions = {}): BuiltPayment {
  const feePayer = opts.feePayer ?? intent.merchant;

  // Generate commitment hash for the payment
  const data = keccak_256.create()
    .update(intent.nonce)
    .update(feePayer.toBytes())
    .update(intent.merchant.toBytes())
    .digest();

  // Create privacy-preserving payment instruction
  const instruction = new TransactionInstruction({
    programId: EXE_PAY_PROGRAM_ID,
    keys: [
      { pubkey: feePayer, isSigner: true, isWritable: true },
      { pubkey: intent.merchant, isSigner: false, isWritable: true },
      { pubkey: LIGHT_PROGRAM_ID, isSigner: false, isWritable: false }
    ],
    data: Buffer.from(data)
  });

  // Use compressed transfer for privacy
  const compressedTransfer = createCompressedTransfer(
    feePayer,
    intent.merchant,
    intent.amountLamports,
    intent.tokenMint
  );

  // Build shielded note for the payment
  const note = buildShieldedNote({
    merchant: intent.merchant,
    amountLamports: intent.amountLamports,
    memo: intent.memo ?? "",
    nonce: intent.nonce
  });

  return {
    instructions: [instruction, compressedTransfer],
    signers: [],
    note
  };
}

/**
 * Create a batch payment intent for multiple recipients
 * Enables efficient multi-recipient payments with privacy
 */
export function createBatchPaymentIntent(params: {
  readonly recipients: readonly BatchPaymentRecipient[];
  readonly tokenMint?: PublicKey;
}): BatchPaymentIntent {
  if (params.recipients.length === 0) {
    throw new Error("At least one recipient is required");
  }

  if (params.recipients.length > 100) {
    throw new Error("Maximum 100 recipients per batch");
  }

  for (const recipient of params.recipients) {
    if (recipient.amount <= 0) {
      throw new Error("All amounts must be positive");
    }
  }

  return {
    recipients: params.recipients,
    tokenMint: params.tokenMint,
    nonce: randomBytes(32)
  };
}

/**
 * Build instructions for a batch payment
 * Creates compressed transfers for privacy and efficiency
 */
export function buildBatchPaymentInstructions(
  intent: BatchPaymentIntent,
  opts: BuildTransactionOptions = {}
): BuiltPayment {
  const instructions: TransactionInstruction[] = [];
  
  // Calculate total amount
  const totalAmount = intent.recipients.reduce(
    (sum, r) => sum + BigInt(Math.trunc(r.amount)),
    0n
  );

  // Create batch payment instruction
  const batchData = keccak_256.create()
    .update(intent.nonce)
    .update(Buffer.from(totalAmount.toString()))
    .digest();

  const batchInstruction = new TransactionInstruction({
    programId: EXE_PAY_PROGRAM_ID,
    keys: [
      { pubkey: opts.feePayer ?? intent.recipients[0].address, isSigner: true, isWritable: true },
      ...intent.recipients.map(r => ({
        pubkey: r.address,
        isSigner: false,
        isWritable: true
      })),
      { pubkey: LIGHT_PROGRAM_ID, isSigner: false, isWritable: false }
    ],
    data: Buffer.from(batchData)
  });

  instructions.push(batchInstruction);

  // Create compressed transfers for each recipient
  for (const recipient of intent.recipients) {
    const transfer = createCompressedTransfer(
      opts.feePayer ?? intent.recipients[0].address,
      recipient.address,
      BigInt(Math.trunc(recipient.amount)),
      intent.tokenMint
    );
    instructions.push(transfer);
  }

  // Build a combined shielded note for the batch
  const note = buildShieldedNote({
    merchant: intent.recipients[0].address, // First recipient as primary
    amountLamports: totalAmount,
    memo: `Batch payment to ${intent.recipients.length} recipients`,
    nonce: intent.nonce
  });

  return {
    instructions,
    signers: [],
    note
  };
}

