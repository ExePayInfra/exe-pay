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
 * Sleep utility for retry logic
 */
async function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Retry a function with exponential backoff
 */
async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries: number = 5,
  initialDelay: number = 2000
): Promise<T> {
  let lastError: Error | undefined;
  
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      
      // Don't retry on validation errors
      if (lastError.message.includes("Invalid") || lastError.message.includes("invalid")) {
        throw lastError;
      }
      
      // If this was the last retry, throw
      if (i === maxRetries - 1) {
        throw lastError;
      }
      
      // Wait with exponential backoff (longer delays for rate limits)
      const delay = initialDelay * Math.pow(2, i);
      console.log(`⏳ Retry ${i + 1}/${maxRetries} after ${delay}ms... (Rate limit protection)`);
      await sleep(delay);
    }
  }
  
  throw lastError || new Error("Max retries reached");
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

    // Get transaction signatures with retry
    const signatures = await retryWithBackoff(async () => {
      return await connection.getSignaturesForAddress(
        address,
        {
          limit,
          before,
          until
        },
        commitment === "processed" ? "confirmed" : commitment
      );
    });

    if (signatures.length === 0) {
      return [];
    }

    // Fetch full transaction details with retry
    // Fetch one at a time to avoid batch request limitation on free Helius tier
    const allTransactions: (ParsedTransactionWithMeta | null)[] = [];
    
    for (let i = 0; i < signatures.length; i++) {
      const sig = signatures[i];
      
      try {
        const transaction = await retryWithBackoff(async () => {
          return await connection.getParsedTransaction(
            sig.signature,
            {
              maxSupportedTransactionVersion: 0,
              commitment: commitment === "processed" ? "confirmed" : commitment
            }
          );
        });
        
        allTransactions.push(transaction);
        
        // Small delay between requests to avoid rate limiting
        if (i < signatures.length - 1) {
          await sleep(100);
        }
      } catch (error) {
        console.error(`Failed to fetch transaction ${sig.signature}:`, error);
        allTransactions.push(null);
      }
    }

    // Parse transactions into records
    const records: TransactionRecord[] = [];

    for (let i = 0; i < allTransactions.length; i++) {
      const tx = allTransactions[i];
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
    
    // Provide more helpful error messages
    if (error instanceof Error) {
      if (error.message.includes("429") || error.message.includes("Too Many Requests")) {
        throw new Error("Rate limit exceeded. Please use a dedicated RPC endpoint (Helius, QuickNode, etc.) or try again later.");
      } else if (error.message.includes("timeout")) {
        throw new Error("Request timed out. Please check your connection or try a different RPC endpoint.");
      } else if (error.message.includes("403") || error.message.includes("Batch requests")) {
        throw new Error("RPC endpoint does not support batch requests. Fetching transactions individually...");
      }
      throw error;
    }
    
    throw new Error("Failed to fetch transaction history. Please try again.");
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

