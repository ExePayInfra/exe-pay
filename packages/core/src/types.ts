import type { PublicKey, TransactionInstruction } from "@solana/web3.js";

export type Commitment = "processed" | "confirmed" | "finalized";

export interface ExePayConfig {
  readonly clusterUrl: string;
  readonly defaultCommitment?: Commitment;
  readonly rpcHeaders?: Record<string, string>;
  readonly relayerUrl?: string;
}

export interface PaymentIntent {
  readonly amountLamports: bigint;
  readonly merchant: PublicKey;
  readonly tokenMint?: PublicKey;
  readonly nonce: Uint8Array;
  readonly memo?: string;
}

export interface ShieldedNote {
  readonly commitment: Uint8Array;
  readonly nullifier: Uint8Array;
  readonly encryptedPayload: Uint8Array;
}

export interface SettlementResult {
  readonly signature: string;
  readonly slot: number;
  readonly finalized: boolean;
}

export interface BuildTransactionOptions {
  readonly feePayer?: PublicKey;
  readonly commitment?: Commitment;
}

export interface BuiltPayment {
  readonly instructions: readonly TransactionInstruction[];
  readonly signers: readonly import("@solana/web3.js").Signer[];
  readonly note: ShieldedNote;
}

