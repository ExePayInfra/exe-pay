import { Connection, PublicKey, sendAndConfirmTransaction, Transaction } from "@solana/web3.js";
import { Rpc, createRpc } from "@lightprotocol/stateless.js";
import { decodeSettlement, proveSpend } from "@exe-pay/privacy";
import { commitmentToSolana } from "@exe-pay/utils";
import type { 
  BuiltPayment, 
  ExePayConfig, 
  PaymentIntent, 
  SettlementResult,
  BatchPaymentIntent,
  BatchPaymentRecipient 
} from "./types.js";
import { 
  buildPaymentInstructions, 
  createPaymentIntent,
  createBatchPaymentIntent,
  buildBatchPaymentInstructions 
} from "./transactions.js";

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

  /**
   * Create a batch payment intent for multiple recipients
   * Efficient for sending to many addresses at once
   */
  createBatchIntent(params: {
    readonly recipients: readonly BatchPaymentRecipient[];
    readonly tokenMint?: PublicKey;
  }): BatchPaymentIntent {
    return createBatchPaymentIntent(params);
  }

  /**
   * Build a batch payment transaction
   * Includes privacy-preserving compressed transfers for all recipients
   */
  async buildBatch(intent: BatchPaymentIntent, opts?: { readonly feePayer?: PublicKey }): Promise<BuiltPayment> {
    return buildBatchPaymentInstructions(intent, { feePayer: opts?.feePayer });
  }

  /**
   * Execute a batch payment to multiple recipients
   * All transfers are privacy-preserving using Light Protocol
   */
  async settleBatch(payment: BuiltPayment, signer: import("@solana/web3.js").Signer): Promise<SettlementResult> {
    return this.settle(payment, signer);
  }
}

