import { Connection, PublicKey, sendAndConfirmTransaction, Transaction } from "@solana/web3.js";
import { Rpc, createRpc } from "@lightprotocol/stateless.js";
import { decodeSettlement, proveSpend } from "@exe-pay/privacy";
import { commitmentToSolana } from "@exe-pay/utils";
import type { BuiltPayment, ExePayConfig, PaymentIntent, SettlementResult } from "./types.js";
import { buildPaymentInstructions, createPaymentIntent } from "./transactions.js";

export class ExePayClient {
  readonly connection: Connection;
  readonly lightRpc: Rpc;

  constructor(private readonly config: ExePayConfig) {
    this.connection = new Connection(
      config.clusterUrl,
      {
        commitment: commitmentToSolana(config.defaultCommitment ?? "confirmed"),
        httpHeaders: config.rpcHeaders
      }
    );
    
    // Initialize Light Protocol RPC for compressed accounts
    this.lightRpc = createRpc(config.clusterUrl, config.clusterUrl);
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

    // Generate ZK proof for the spend using Light Protocol
    const proof = await proveSpend(payment.note, this.lightRpc);
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

