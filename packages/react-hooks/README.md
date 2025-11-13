# `@exe-pay/react-hooks`

React integration for exe-pay.

```tsx
import { useMemo } from "react";
import { useExePay, usePaymentIntent } from "@exe-pay/react-hooks";
import { Keypair } from "@solana/web3.js";

export function Checkout() {
  const client = useExePay({ clusterUrl: "https://api.devnet.solana.com" });
  const { create, payment, isBuilding } = usePaymentIntent(client);
  const merchant = useMemo(() => Keypair.generate(), []);

  return (
    <button
      disabled={isBuilding}
      onClick={() => create({ amount: 1_000_000, merchant: merchant.publicKey }, merchant.publicKey)}
    >
      Build shielded payment
    </button>
  );
}
```

