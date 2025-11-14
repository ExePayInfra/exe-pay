import { Connection, PublicKey } from "@solana/web3.js";
import type { ParsedTransactionWithMeta, ConfirmedSignatureInfo } from "@solana/web3.js";
import type { Commitment } from "./types.js";

/**
 * Transaction status
 */
export type TransactionStatus = "confirmed" | "finalized" | "failed" | "pending";

/**
 * Transaction type
 */
export type TransactionType = "send" | "receive" | "unknown";

/**
 * Transaction record
 */
export interface TransactionRecord {
  readonly signature: string;
  readonly timestamp: number;
  readonly status: TransactionStatus;
  readonly type: TransactionType;
  readonly amount: number; // lamports
  readonly fee: number; // lamports
  readonly from: string;
  readonly to: string;
  readonly memo?: string;
  readonly slot: number;
  readonly blockTime: number | null;
}

/**
 * Transaction history options
 */
export interface TransactionHistoryOptions {
  readonly limit?: number;
  readonly before?: string; // signature
  readonly until?: string; // signature
  readonly commitment?: Commitment;
}

/**
 * Fetch transaction history for a wallet
 */
export async function fetchTransactionHistory(
  connection: Connection,
  address: PublicKey,
  options: TransactionHistoryOptions = {}
): Promise<TransactionRecord[]> {
  try {
    const { limit = 50, before, until, commitment = "confirmed" } = options;

    // Get transaction signatures
    const signatures = await connection.getSignaturesForAddress(
      address,
      {
        limit,
        before,
        until
      },
      commitment === "processed" ? "confirmed" : commitment
    );

    if (signatures.length === 0) {
      return [];
    }

    // Fetch full transaction details
    const transactions = await connection.getParsedTransactions(
      signatures.map(sig => sig.signature),
      {
        maxSupportedTransactionVersion: 0,
        commitment: commitment === "processed" ? "confirmed" : commitment
      }
    );

    // Parse transactions into records
    const records: TransactionRecord[] = [];

    for (let i = 0; i < transactions.length; i++) {
      const tx = transactions[i];
      const sigInfo = signatures[i];

      if (!tx || !tx.meta) continue;

      const record = parseTransaction(tx, sigInfo, address);
      if (record) {
        records.push(record);
      }
    }

    return records;
  } catch (error) {
    console.error("Failed to fetch transaction history:", error);
    throw new Error("Failed to fetch transaction history");
  }
}

/**
 * Parse a transaction into a record
 */
function parseTransaction(
  tx: ParsedTransactionWithMeta,
  sigInfo: ConfirmedSignatureInfo,
  userAddress: PublicKey
): TransactionRecord | null {
  try {
    const { meta, transaction, blockTime, slot } = tx;

    if (!meta) return null;

    // Determine status
    const status: TransactionStatus = meta.err ? "failed" : "finalized";

    // Get fee
    const fee = meta.fee;

    // Find amount and direction
    const userAddressStr = userAddress.toBase58();
    let amount = 0;
    let type: TransactionType = "unknown";
    let from = "";
    let to = "";

    // Check pre and post balances
    const accountKeys = transaction.message.accountKeys;
    
    for (let i = 0; i < accountKeys.length; i++) {
      const account = accountKeys[i];
      const accountStr = account.pubkey.toBase58();
      
      if (accountStr === userAddressStr) {
        const preBalance = meta.preBalances[i];
        const postBalance = meta.postBalances[i];
        const diff = postBalance - preBalance;

        if (diff < 0) {
          // User sent money
          type = "send";
          amount = Math.abs(diff) - fee;
          from = userAddressStr;
          
          // Try to find recipient
          for (let j = 0; j < accountKeys.length; j++) {
            if (j !== i && meta.postBalances[j] > meta.preBalances[j]) {
              to = accountKeys[j].pubkey.toBase58();
              break;
            }
          }
        } else if (diff > 0) {
          // User received money
          type = "receive";
          amount = diff;
          to = userAddressStr;
          
          // Try to find sender
          for (let j = 0; j < accountKeys.length; j++) {
            if (j !== i && meta.postBalances[j] < meta.preBalances[j]) {
              from = accountKeys[j].pubkey.toBase58();
              break;
            }
          }
        }
        break;
      }
    }

    // Extract memo if present
    let memo: string | undefined;
    const instructions = transaction.message.instructions;
    
    for (const ix of instructions) {
      if ('parsed' in ix && ix.parsed && typeof ix.parsed === 'object') {
        const parsed = ix.parsed as any;
        if (parsed.type === 'memo' || parsed.info?.memo) {
          memo = parsed.info?.memo || parsed.memo;
          break;
        }
      }
    }

    return {
      signature: sigInfo.signature,
      timestamp: blockTime ? blockTime * 1000 : Date.now(),
      status,
      type,
      amount,
      fee,
      from: from || "Unknown",
      to: to || "Unknown",
      memo,
      slot: slot || 0,
      blockTime: blockTime || null
    };
  } catch (error) {
    console.error("Failed to parse transaction:", error);
    return null;
  }
}

/**
 * Format transaction amount for display
 */
export function formatTransactionAmount(lamports: number): string {
  const sol = lamports / 1_000_000_000;
  return `${sol.toFixed(sol < 0.01 ? 6 : 4)} SOL`;
}

/**
 * Format transaction date
 */
export function formatTransactionDate(timestamp: number): string {
  const date = new Date(timestamp);
  return date.toLocaleDateString() + " " + date.toLocaleTimeString();
}

/**
 * Export transactions to CSV
 */
export function exportTransactionsToCSV(transactions: TransactionRecord[]): string {
  const headers = ["Signature", "Date", "Type", "Amount", "Fee", "From", "To", "Status", "Memo"];
  
  const rows = transactions.map(tx => [
    tx.signature,
    formatTransactionDate(tx.timestamp),
    tx.type,
    formatTransactionAmount(tx.amount),
    formatTransactionAmount(tx.fee),
    tx.from,
    tx.to,
    tx.status,
    tx.memo || ""
  ]);

  const csvContent = [
    headers.join(","),
    ...rows.map(row => row.map(cell => `"${cell}"`).join(","))
  ].join("\n");

  return csvContent;
}

/**
 * Download CSV file
 */
export function downloadCSV(content: string, filename: string = "transactions.csv"): void {
  const blob = new Blob([content], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  
  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  link.style.visibility = "hidden";
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  URL.revokeObjectURL(url);
}

