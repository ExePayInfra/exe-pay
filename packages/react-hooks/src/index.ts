import { useMemo, useState, useCallback, useEffect } from "react";
import type { PublicKey } from "@solana/web3.js";
import { 
  ExePayClient, 
  type PaymentIntent, 
  type ExePayConfig, 
  type BuiltPayment,
  type BatchPaymentIntent,
  type BatchPaymentRecipient,
  type RecurringPaymentSchedule,
  type RecurringPaymentState,
  initializeRecurringState,
  isPaymentDue,
  getNextPaymentIntent,
  recordPaymentExecution,
  cancelRecurringSchedule,
  getTimeUntilNextPayment
} from "@exe-pay/core";

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

/**
 * Hook for batch payments to multiple recipients
 */
export function useBatchPayment(client: ExePayClient) {
  const [intent, setIntent] = useState<BatchPaymentIntent | null>(null);
  const [payment, setPayment] = useState<BuiltPayment | null>(null);
  const [isBuilding, setIsBuilding] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const create = useCallback(async (
    recipients: readonly BatchPaymentRecipient[],
    signer: PublicKey,
    tokenMint?: PublicKey
  ) => {
    try {
      setError(null);
      setIsBuilding(true);
      const created = client.createBatchIntent({ recipients, tokenMint });
      setIntent(created);
      const built = await client.buildBatch(created, { feePayer: signer });
      setPayment(built);
      return built;
    } catch (err) {
      const error = err instanceof Error ? err : new Error("Failed to build batch payment");
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

/**
 * Hook for managing recurring payment schedules
 */
export function useRecurringPayment(schedule: RecurringPaymentSchedule | null) {
  const [state, setState] = useState<RecurringPaymentState | null>(
    schedule ? initializeRecurringState(schedule) : null
  );
  const [timeUntilNext, setTimeUntilNext] = useState<number>(0);

  // Update state when schedule changes
  useEffect(() => {
    if (schedule) {
      setState(initializeRecurringState(schedule));
    } else {
      setState(null);
    }
  }, [schedule]);

  // Update time until next payment
  useEffect(() => {
    if (!state) return;

    const updateTime = () => {
      setTimeUntilNext(getTimeUntilNextPayment(state));
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);

    return () => clearInterval(interval);
  }, [state]);

  const isDue = useMemo(() => {
    return state ? isPaymentDue(state) : false;
  }, [state]);

  const nextIntent = useMemo(() => {
    return state ? getNextPaymentIntent(state) : null;
  }, [state]);

  const recordExecution = useCallback(() => {
    if (state) {
      setState(recordPaymentExecution(state));
    }
  }, [state]);

  const cancel = useCallback(() => {
    if (state) {
      setState(cancelRecurringSchedule(state));
    }
  }, [state]);

  return {
    state,
    isDue,
    nextIntent,
    timeUntilNext,
    recordExecution,
    cancel
  };
}

