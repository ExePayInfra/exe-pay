# `@exe-pay/utils`

Shared utilities for exe-pay packages (commitment helpers, timing utilities, etc.).

```ts
import { commitmentToSolana, withTimeout } from "@exe-pay/utils";

await withTimeout(runRpcCall(), 5000);
console.log(commitmentToSolana("finalized"));
```

