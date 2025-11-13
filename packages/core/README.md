# `@exe-pay/core`

Core TypeScript SDK for constructing privacy-preserving Solana payments.

```ts
import { ExePayClient } from "@exe-pay/core";
import { Keypair } from "@solana/web3.js";

const client = new ExePayClient({
  clusterUrl: "https://api.devnet.solana.com",
  defaultCommitment: "confirmed"
});

const merchant = Keypair.generate().publicKey;
const intent = client.createIntent({
  amount: 5_000_000,
  merchant
});

const payment = await client.build(intent, { feePayer: merchant });
// send payment.settle(...)
```

