import { keccak_256 } from "@noble/hashes/sha3";
import { poseidon } from "@exe-pay/privacy";
import type { ShieldedNote } from "./types.js";

interface BuildNoteInput {
  readonly merchant: import("@solana/web3.js").PublicKey;
  readonly amountLamports: bigint;
  readonly memo: string;
  readonly nonce: Uint8Array;
}

export function buildShieldedNote(input: BuildNoteInput): ShieldedNote {
  const preimage = Buffer.concat([
    input.merchant.toBytes(),
    Buffer.from(input.amountLamports.toString(10)),
    Buffer.from(input.memo, "utf8"),
    Buffer.from(input.nonce)
  ]);

  const commitment = poseidon(preimage);
  const nullifier = keccak_256(preimage);
  const encryptedPayload = Buffer.from(preimage);

  return {
    commitment,
    nullifier,
    encryptedPayload
  };
}

