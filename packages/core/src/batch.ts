import {
  Connection,
  PublicKey,
  Transaction,
  SystemProgram,
  LAMPORTS_PER_SOL,
  TransactionInstruction,
} from "@solana/web3.js";
import type { SendOptions } from "@solana/web3.js";
import {
  getAssociatedTokenAddress,
  createTransferInstruction,
  TOKEN_PROGRAM_ID,
} from "@solana/spl-token";

export interface BatchRecipient {
  address: string;
  amount: number; // In token units (e.g., SOL, not lamports)
  memo?: string;
}

export interface BatchPaymentParams {
  connection: Connection;
  senderPublicKey: PublicKey;
  recipients: BatchRecipient[];
  tokenMint?: PublicKey; // undefined for native SOL
  tokenDecimals?: number; // Required for SPL tokens
  signTransaction: (transaction: Transaction) => Promise<Transaction>;
}

export interface BatchPaymentResult {
  success: boolean;
  signature?: string;
  successCount: number;
  failCount: number;
  results: Array<{
    recipient: string;
    success: boolean;
    signature?: string;
    error?: string;
  }>;
}

/**
 * Send payments to multiple recipients in a single transaction (for SOL)
 * or multiple transactions (for SPL tokens due to account creation requirements)
 */
export async function sendBatchPayment(
  params: BatchPaymentParams
): Promise<BatchPaymentResult> {
  const {
    connection,
    senderPublicKey,
    recipients,
    tokenMint,
    tokenDecimals,
    signTransaction,
  } = params;

  // Validate recipients
  if (recipients.length === 0) {
    throw new Error("No recipients provided");
  }

  if (recipients.length > 20) {
    throw new Error("Maximum 20 recipients per batch");
  }

  // For native SOL, we can batch all transfers in a single transaction
  if (!tokenMint) {
    return await sendBatchSOL(
      connection,
      senderPublicKey,
      recipients,
      signTransaction
    );
  }

  // For SPL tokens, send sequentially (required due to account creation)
  return await sendBatchSPL(
    connection,
    senderPublicKey,
    recipients,
    tokenMint,
    tokenDecimals!,
    signTransaction
  );
}

/**
 * Send SOL to multiple recipients in a single transaction
 * This is the most efficient method for batch payments
 */
async function sendBatchSOL(
  connection: Connection,
  senderPublicKey: PublicKey,
  recipients: BatchRecipient[],
  signTransaction: (transaction: Transaction) => Promise<Transaction>
): Promise<BatchPaymentResult> {
  try {
    const transaction = new Transaction();

    // Add all transfer instructions to a single transaction
    for (const recipient of recipients) {
      const recipientPubkey = new PublicKey(recipient.address);
      const lamports = Math.floor(recipient.amount * LAMPORTS_PER_SOL);

      transaction.add(
        SystemProgram.transfer({
          fromPubkey: senderPublicKey,
          toPubkey: recipientPubkey,
          lamports,
        })
      );
    }

    // Get recent blockhash
    const { blockhash, lastValidBlockHeight } =
      await connection.getLatestBlockhash("confirmed");
    transaction.recentBlockhash = blockhash;
    transaction.feePayer = senderPublicKey;

    // Sign transaction
    const signedTransaction = await signTransaction(transaction);

    // Send transaction
    const signature = await connection.sendRawTransaction(
      signedTransaction.serialize(),
      {
        skipPreflight: false,
        preflightCommitment: "confirmed",
      }
    );

    // Confirm transaction
    await connection.confirmTransaction(
      {
        signature,
        blockhash,
        lastValidBlockHeight,
      },
      "confirmed"
    );

    console.log(`[Batch Payment] SOL batch sent successfully: ${signature}`);

    return {
      success: true,
      signature,
      successCount: recipients.length,
      failCount: 0,
      results: recipients.map((r) => ({
        recipient: r.address,
        success: true,
        signature,
      })),
    };
  } catch (error: any) {
    console.error("[Batch Payment] SOL batch failed:", error);

    return {
      success: false,
      successCount: 0,
      failCount: recipients.length,
      results: recipients.map((r) => ({
        recipient: r.address,
        success: false,
        error: error.message || "Transfer failed",
      })),
    };
  }
}

/**
 * Send SPL tokens to multiple recipients sequentially
 * Sequential is required because each recipient may need an associated token account created
 */
async function sendBatchSPL(
  connection: Connection,
  senderPublicKey: PublicKey,
  recipients: BatchRecipient[],
  tokenMint: PublicKey,
  tokenDecimals: number,
  signTransaction: (transaction: Transaction) => Promise<Transaction>
): Promise<BatchPaymentResult> {
  const results: Array<{
    recipient: string;
    success: boolean;
    signature?: string;
    error?: string;
  }> = [];

  let successCount = 0;
  let failCount = 0;

  // Get sender's token account
  const senderTokenAccount = await getAssociatedTokenAddress(
    tokenMint,
    senderPublicKey
  );

  // Send to each recipient sequentially
  for (const recipient of recipients) {
    try {
      const recipientPubkey = new PublicKey(recipient.address);
      const tokenAmount = Math.floor(
        recipient.amount * Math.pow(10, tokenDecimals)
      );

      // Get recipient's token account
      const recipientTokenAccount = await getAssociatedTokenAddress(
        tokenMint,
        recipientPubkey
      );

      // Create transaction
      const transaction = new Transaction().add(
        createTransferInstruction(
          senderTokenAccount,
          recipientTokenAccount,
          senderPublicKey,
          tokenAmount,
          [],
          TOKEN_PROGRAM_ID
        )
      );

      // Get recent blockhash
      const { blockhash, lastValidBlockHeight } =
        await connection.getLatestBlockhash("confirmed");
      transaction.recentBlockhash = blockhash;
      transaction.feePayer = senderPublicKey;

      // Sign transaction
      const signedTransaction = await signTransaction(transaction);

      // Send transaction
      const signature = await connection.sendRawTransaction(
        signedTransaction.serialize(),
        {
          skipPreflight: false,
          preflightCommitment: "confirmed",
        }
      );

      // Confirm transaction
      await connection.confirmTransaction(
        {
          signature,
          blockhash,
          lastValidBlockHeight,
        },
        "confirmed"
      );

      console.log(
        `[Batch Payment] SPL transfer to ${recipient.address} successful: ${signature}`
      );

      results.push({
        recipient: recipient.address,
        success: true,
        signature,
      });

      successCount++;

      // Small delay between transactions to avoid rate limiting
      if (recipients.indexOf(recipient) < recipients.length - 1) {
        await new Promise((resolve) => setTimeout(resolve, 500));
      }
    } catch (error: any) {
      console.error(
        `[Batch Payment] SPL transfer to ${recipient.address} failed:`,
        error
      );

      results.push({
        recipient: recipient.address,
        success: false,
        error: error.message || "Transfer failed",
      });

      failCount++;
    }
  }

  return {
    success: successCount > 0,
    successCount,
    failCount,
    results,
  };
}

/**
 * Calculate total amount and estimated fees for a batch payment
 */
export function calculateBatchTotal(
  recipients: BatchRecipient[],
  isNativeSOL: boolean = true
): {
  totalAmount: number;
  estimatedFee: number;
  totalWithFees: number;
} {
  const totalAmount = recipients.reduce(
    (sum, recipient) => sum + recipient.amount,
    0
  );

  // Estimate fees (5000 lamports base + 5000 per instruction)
  const baseFee = 5000 / LAMPORTS_PER_SOL;
  const perInstructionFee = 5000 / LAMPORTS_PER_SOL;

  let estimatedFee: number;
  if (isNativeSOL) {
    // Single transaction with multiple instructions
    estimatedFee = baseFee + perInstructionFee * recipients.length;
  } else {
    // Multiple transactions for SPL tokens
    estimatedFee = (baseFee + perInstructionFee) * recipients.length;
  }

  return {
    totalAmount,
    estimatedFee,
    totalWithFees: totalAmount + estimatedFee,
  };
}

/**
 * Validate batch payment recipients
 */
export function validateBatchRecipients(
  recipients: BatchRecipient[]
): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (recipients.length === 0) {
    errors.push("At least one recipient is required");
  }

  if (recipients.length > 20) {
    errors.push("Maximum 20 recipients allowed per batch");
  }

  recipients.forEach((recipient, index) => {
    // Validate address
    try {
      new PublicKey(recipient.address);
    } catch {
      errors.push(`Invalid address for recipient ${index + 1}`);
    }

    // Validate amount
    if (isNaN(recipient.amount) || recipient.amount <= 0) {
      errors.push(`Invalid amount for recipient ${index + 1}`);
    }
  });

  return {
    valid: errors.length === 0,
    errors,
  };
}

