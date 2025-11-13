import { SystemProgram, TransactionInstruction, PublicKey } from "@solana/web3.js";
import { keccak_256 } from "@noble/hashes/sha3";
import { randomBytes } from "@noble/hashes/utils";
import type { BuiltPayment, PaymentIntent, BuildTransactionOptions } from "./types.js";
import { buildShieldedNote } from "./merkle.js";

const EXE_PAY_PROGRAM_ID = new PublicKey("ExEPaY1111111111111111111111111111111111");

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

export function buildPaymentInstructions(intent: PaymentIntent, opts: BuildTransactionOptions = {}): BuiltPayment {
  const feePayer = opts.feePayer ?? intent.merchant;

  const data = keccak_256.create()
    .update(intent.nonce)
    .update(feePayer.toBytes())
    .update(intent.merchant.toBytes())
    .digest();

  const instruction = new TransactionInstruction({
    programId: EXE_PAY_PROGRAM_ID,
    keys: [
      { pubkey: feePayer, isSigner: true, isWritable: true },
      { pubkey: intent.merchant, isSigner: false, isWritable: true }
    ],
    data: Buffer.from(data)
  });

  const solTransfer = SystemProgram.transfer({
    fromPubkey: feePayer,
    toPubkey: intent.merchant,
    lamports: Number(intent.amountLamports)
  });

  const note = buildShieldedNote({
    merchant: intent.merchant,
    amountLamports: intent.amountLamports,
    memo: intent.memo ?? "",
    nonce: intent.nonce
  });

  return {
    instructions: [instruction, solTransfer],
    signers: [],
    note
  };
}

