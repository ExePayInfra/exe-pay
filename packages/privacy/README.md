# `@exe-pay/privacy`

Deterministic privacy helpers for exe-pay. Provides placeholder Poseidon hashing, proof generation, and settlement decoding that can be swapped with production-grade circuits.

```ts
import { poseidon, proveSpend } from "@exe-pay/privacy";

const note = {
  commitment: new Uint8Array(32),
  nullifier: new Uint8Array(32),
  encryptedPayload: new Uint8Array([1, 2, 3])
};

const proof = await proveSpend(note);
console.log(poseidon(note.encryptedPayload), proof.instruction);
```

