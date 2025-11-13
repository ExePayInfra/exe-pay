import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { z } from "zod";
import { ExePayClient } from "@exe-pay/core";
import { Keypair, PublicKey } from "@solana/web3.js";

const app = new Hono();

const paymentSchema = z.object({
  amount: z.number().positive(),
  merchant: z.string(),
  memo: z.string().max(140).optional()
});

const client = new ExePayClient({
  clusterUrl: process.env.SOLANA_RPC_URL ?? "https://api.devnet.solana.com",
  defaultCommitment: "processed",
  relayerUrl: process.env.EXE_PAY_RELAYER_URL
});

app.get("/health", (c) => c.json({ status: "ok" }));

app.post("/payments", async (c) => {
  const json = await c.req.json();
  const parsed = paymentSchema.safeParse(json);

  if (!parsed.success) {
    return c.json({ error: parsed.error.flatten() }, 400);
  }

  const merchant = new PublicKey(parsed.data.merchant);
  const intent = client.createIntent({
    amount: parsed.data.amount,
    merchant,
    memo: parsed.data.memo
  });

  const feePayer = Keypair.generate();
  const payment = await client.build(intent, { feePayer: feePayer.publicKey });

  return c.json({
    instructions: payment.instructions.map((ix) => ({
      programId: ix.programId.toBase58(),
      data: Buffer.from(ix.data).toString("base64")
    })),
    note: {
      commitment: Buffer.from(payment.note.commitment).toString("base64"),
      nullifier: Buffer.from(payment.note.nullifier).toString("base64")
    }
  });
});

const port = Number(process.env.PORT ?? 8787);

serve({
  fetch: app.fetch,
  port
});

console.log(`exe-pay API ready on http://localhost:${port}`);

