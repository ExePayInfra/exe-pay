import { useMemo, useState, useCallback } from "react";
import type { PublicKey } from "@solana/web3.js";
import { ExePayClient, type PaymentIntent, type ExePayConfig, type BuiltPayment } from "@exe-pay/core";

export function useExePay(config: ExePayConfig) {
  const client = useMemo(() => new ExePayClient(config), [config.clusterUrl, config.defaultCommitment, config.relayerUrl]);
  return client;
}

export function usePaymentIntent(client: ExePayClient) {
  const [intent, setIntent] = useState<PaymentIntent | null>(null);
  const [payment, setPayment] = useState<BuiltPayment | null>(null);
  const [isBuilding, setIsBuilding] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const create = useCallback(async (params: Parameters<ExePayClient["createIntent"]>[0], signer: PublicKey) => {
    try {
      setError(null);
      setIsBuilding(true);
      const created = client.createIntent(params);
      setIntent(created);
      const built = await client.build(created, { feePayer: signer });
      setPayment(built);
      return built;
    } catch (err) {
      const error = err instanceof Error ? err : new Error("Failed to build payment");
      setError(error);
      throw error;
    } finally {
      setIsBuilding(false);
    }
  }, [client]);

  return {
    intent,
    payment,
    isBuilding,
    error,
    create
  };
}

