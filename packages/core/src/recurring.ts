import { PublicKey } from "@solana/web3.js";
import { randomBytes } from "@noble/hashes/utils";
import type { RecurringPaymentSchedule, RecurringPaymentState, PaymentIntent } from "./types.js";

/**
 * Create a recurring payment schedule
 * Enables automated periodic payments with privacy
 */
export function createRecurringSchedule(params: {
  readonly merchant: PublicKey;
  readonly amount: number;
  readonly interval: "daily" | "weekly" | "monthly";
  readonly startTime?: number;
  readonly endTime?: number;
  readonly maxPayments?: number;
  readonly tokenMint?: PublicKey;
}): RecurringPaymentSchedule {
  if (params.amount <= 0) {
    throw new Error("Amount must be positive");
  }

  const startTime = params.startTime ?? Date.now();
  
  if (params.endTime && params.endTime <= startTime) {
    throw new Error("End time must be after start time");
  }

  if (params.maxPayments && params.maxPayments <= 0) {
    throw new Error("Max payments must be positive");
  }

  return {
    merchant: params.merchant,
    amount: params.amount,
    interval: params.interval,
    startTime,
    endTime: params.endTime,
    maxPayments: params.maxPayments,
    tokenMint: params.tokenMint
  };
}

/**
 * Initialize the state for a recurring payment schedule
 */
export function initializeRecurringState(schedule: RecurringPaymentSchedule): RecurringPaymentState {
  return {
    schedule,
    paymentsExecuted: 0,
    lastPaymentTime: 0,
    isActive: true
  };
}

/**
 * Check if a recurring payment is due
 */
export function isPaymentDue(state: RecurringPaymentState, currentTime: number = Date.now()): boolean {
  if (!state.isActive) {
    return false;
  }

  // Check if we've reached max payments
  if (state.schedule.maxPayments && state.paymentsExecuted >= state.schedule.maxPayments) {
    return false;
  }

  // Check if we've passed the end time
  if (state.schedule.endTime && currentTime > state.schedule.endTime) {
    return false;
  }

  // Check if we haven't started yet
  if (currentTime < state.schedule.startTime) {
    return false;
  }

  // If this is the first payment
  if (state.paymentsExecuted === 0) {
    return currentTime >= state.schedule.startTime;
  }

  // Calculate interval in milliseconds
  const intervalMs = getIntervalMs(state.schedule.interval);
  const nextPaymentTime = state.lastPaymentTime + intervalMs;

  return currentTime >= nextPaymentTime;
}

/**
 * Get the next payment intent for a recurring schedule
 */
export function getNextPaymentIntent(state: RecurringPaymentState): PaymentIntent | null {
  if (!isPaymentDue(state)) {
    return null;
  }

  return {
    amountLamports: BigInt(Math.trunc(state.schedule.amount)),
    merchant: state.schedule.merchant,
    tokenMint: state.schedule.tokenMint,
    nonce: randomBytes(32),
    memo: `Recurring payment ${state.paymentsExecuted + 1}`
  };
}

/**
 * Update state after a successful payment
 */
export function recordPaymentExecution(
  state: RecurringPaymentState,
  currentTime: number = Date.now()
): RecurringPaymentState {
  const newState: RecurringPaymentState = {
    ...state,
    paymentsExecuted: state.paymentsExecuted + 1,
    lastPaymentTime: currentTime
  };

  // Check if we should deactivate
  if (state.schedule.maxPayments && newState.paymentsExecuted >= state.schedule.maxPayments) {
    return { ...newState, isActive: false };
  }

  if (state.schedule.endTime && currentTime >= state.schedule.endTime) {
    return { ...newState, isActive: false };
  }

  return newState;
}

/**
 * Cancel a recurring payment schedule
 */
export function cancelRecurringSchedule(state: RecurringPaymentState): RecurringPaymentState {
  return {
    ...state,
    isActive: false
  };
}

/**
 * Get interval in milliseconds
 */
function getIntervalMs(interval: "daily" | "weekly" | "monthly"): number {
  const MS_PER_DAY = 24 * 60 * 60 * 1000;
  
  switch (interval) {
    case "daily":
      return MS_PER_DAY;
    case "weekly":
      return 7 * MS_PER_DAY;
    case "monthly":
      return 30 * MS_PER_DAY; // Approximate
    default:
      throw new Error(`Unknown interval: ${interval}`);
  }
}

/**
 * Get time until next payment
 */
export function getTimeUntilNextPayment(state: RecurringPaymentState, currentTime: number = Date.now()): number {
  if (!state.isActive) {
    return -1;
  }

  if (state.paymentsExecuted === 0) {
    return Math.max(0, state.schedule.startTime - currentTime);
  }

  const intervalMs = getIntervalMs(state.schedule.interval);
  const nextPaymentTime = state.lastPaymentTime + intervalMs;
  
  return Math.max(0, nextPaymentTime - currentTime);
}

