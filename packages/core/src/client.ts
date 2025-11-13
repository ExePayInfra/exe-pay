import { Connection, PublicKey, sendAndConfirmTransaction, Transaction } from "@solana/web3.js";
import { decodeSettlement, proveSpend } from "@exe-pay/privacy";
import { commitmentToSolana } from "@exe-pay/utils";
import type { BuiltPayment, ExePayConfig, PaymentIntent, SettlementResult } from "./types.js";
import { buildPaymentInstructions, createPaymentIntent } from "./transactions.js";

export class ExePayClient {
  readonly connection: Connection;

  constructor(private readonly config: ExePayConfig) {
    this.connection = new Connection(
      config.clusterUrl,
      {
        commitment: commitmentToSolana(config.defaultCommitment ?? "confirmed"),
        httpHeaders: config.rpcHeaders
      }
    );
  }

  createIntent(input: Parameters<typeof createPaymentIntent>[0]): PaymentIntent {
    return createPaymentIntent(input);
  }

  async build(intent: PaymentIntent, opts?: { readonly feePayer?: PublicKey }): Promise<BuiltPayment> {
    return buildPaymentInstructions(intent, { feePayer: opts?.feePayer });
  }

  async settle(payment: BuiltPayment, signer: import("@solana/web3.js").Signer): Promise<SettlementResult> {
    const transaction = new Transaction().add(...payment.instructions);
    transaction.feePayer = signer.publicKey;

    const proof = await proveSpend(payment.note);
    transaction.add(proof.instruction);

    const signature = await sendAndConfirmTransaction(this.connection, transaction, [signer]);
    const status = await this.connection.getSignatureStatus(signature, { searchTransactionHistory: true });

    return decodeSettlement({
      signature,
      status: status.value,
      commitment: this.config.defaultCommitment ?? "confirmed"
    });
  }
}

