import { ExePayClient } from "@exe-pay/core";
import { Keypair } from "@solana/web3.js";

async function main() {
  const client = new ExePayClient({
    clusterUrl: process.env.SOLANA_RPC_URL ?? "https://api.devnet.solana.com",
    defaultCommitment: "confirmed"
  });

  const merchant = Keypair.generate();
  const intent = client.createIntent({
    amount: 1_000_000,
    merchant: merchant.publicKey,
    memo: "Demo payment"
  });

  const payment = await client.build(intent, { feePayer: merchant.publicKey });

  console.log("Built payment:", {
    instructions: payment.instructions.length,
    note: {
      commitment: Buffer.from(payment.note.commitment).toString("base64")
    }
  });
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

