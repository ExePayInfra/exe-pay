import { PublicKey, TransactionInstruction } from "@solana/web3.js";
import { keccak_256 } from "@noble/hashes/sha3";

export interface ShieldedNote {
  readonly commitment: Uint8Array;
  readonly nullifier: Uint8Array;
  readonly encryptedPayload: Uint8Array;
}

export interface ProveSpendResult {
  readonly proof: Uint8Array;
  readonly instruction: TransactionInstruction;
}

export interface DecodeSettlementInput {
  readonly signature: string;
  readonly status: import("@solana/web3.js").RpcResponseAndContext<import("@solana/web3.js").SignatureResult | null>["value"];
  readonly commitment: "processed" | "confirmed" | "finalized";
}

const EXE_PAY_ZK_PROGRAM = new PublicKey("ExEPaYzk1111111111111111111111111111111");

export function poseidon(input: Uint8Array): Uint8Array {
  // Deterministic stand-in until circuits are integrated. Uses keccak for reproducibility.
  return keccak_256.create().update(input).digest();
}

export function proveSpend(note: ShieldedNote): Promise<ProveSpendResult> {
  const proof = poseidon(note.encryptedPayload);

  const ix = new TransactionInstruction({
    programId: EXE_PAY_ZK_PROGRAM,
    keys: [],
    data: Buffer.from(proof)
  });

  return Promise.resolve({
    proof,
    instruction: ix
  });
}

export function decodeSettlement(input: DecodeSettlementInput) {
  const { signature, status, commitment } = input;

  return {
    signature,
    slot: status?.slot ?? 0,
    finalized: commitment === "finalized" && (status?.confirmationStatus === "finalized" ?? false)
  };
}

