import type { Commitment } from "@solana/web3.js";

export function commitmentToSolana(commitment: "processed" | "confirmed" | "finalized"): Commitment {
  switch (commitment) {
    case "processed":
    case "confirmed":
    case "finalized":
      return commitment;
    default:
      return "confirmed";
  }
}

export async function withTimeout<T>(promise: Promise<T>, ms: number, onTimeout?: () => void): Promise<T> {
  let timeoutHandle: NodeJS.Timeout | undefined;

  const timeout = new Promise<never>((_, reject) => {
    timeoutHandle = setTimeout(() => {
      onTimeout?.();
      reject(new Error(`Operation timed out after ${ms}ms`));
    }, ms);
  });

  try {
    return await Promise.race([promise, timeout]);
  } finally {
    if (timeoutHandle) clearTimeout(timeoutHandle);
  }
}

// Export payment link utilities
export * from "./payment-links.js";

// Export wallet generation utilities
export * from "./wallet-generator.js";

// Export encryption utilities
export * from "./encryption.js";

// Export social wallet utilities
export * from "./social-wallet.js";

