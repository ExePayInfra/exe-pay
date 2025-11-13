import { PublicKey } from "@solana/web3.js";

/**
 * Payment link parameters
 */
export interface PaymentLinkParams {
  readonly recipient: PublicKey | string;
  readonly amount: number; // lamports
  readonly memo?: string;
  readonly label?: string;
  readonly message?: string;
  readonly reference?: PublicKey | string;
  readonly tokenMint?: PublicKey | string;
}

/**
 * Parsed payment link data
 */
export interface ParsedPaymentLink {
  readonly recipient: PublicKey;
  readonly amount: number;
  readonly memo?: string;
  readonly label?: string;
  readonly message?: string;
  readonly reference?: PublicKey;
  readonly tokenMint?: PublicKey;
}

/**
 * Generate a payment link URL
 * 
 * @example
 * ```typescript
 * const link = generatePaymentLink({
 *   recipient: merchantPublicKey,
 *   amount: 1000000,
 *   memo: "Coffee payment"
 * });
 * // Returns: https://exeapp.app/pay?r=7xKX...&a=1000000&m=Coffee%20payment
 * ```
 */
export function generatePaymentLink(
  params: PaymentLinkParams,
  baseUrl: string = typeof window !== "undefined" ? window.location.origin : "https://exeapp.app"
): string {
  const url = new URL("/pay", baseUrl);
  
  // Recipient (required)
  const recipient = typeof params.recipient === "string" 
    ? params.recipient 
    : params.recipient.toBase58();
  url.searchParams.set("r", recipient);
  
  // Amount (required)
  url.searchParams.set("a", params.amount.toString());
  
  // Optional parameters
  if (params.memo) {
    url.searchParams.set("m", params.memo);
  }
  
  if (params.label) {
    url.searchParams.set("l", params.label);
  }
  
  if (params.message) {
    url.searchParams.set("msg", params.message);
  }
  
  if (params.reference) {
    const ref = typeof params.reference === "string"
      ? params.reference
      : params.reference.toBase58();
    url.searchParams.set("ref", ref);
  }
  
  if (params.tokenMint) {
    const mint = typeof params.tokenMint === "string"
      ? params.tokenMint
      : params.tokenMint.toBase58();
    url.searchParams.set("token", mint);
  }
  
  return url.toString();
}

/**
 * Parse a payment link URL
 * 
 * @example
 * ```typescript
 * const params = parsePaymentLink("https://exeapp.app/pay?r=7xKX...&a=1000000");
 * console.log(params.recipient); // PublicKey
 * console.log(params.amount); // 1000000
 * ```
 */
export function parsePaymentLink(url: string | URL): ParsedPaymentLink {
  const urlObj = typeof url === "string" ? new URL(url) : url;
  const params = urlObj.searchParams;
  
  // Recipient (required)
  const recipientStr = params.get("r");
  if (!recipientStr) {
    throw new Error("Missing required parameter: recipient (r)");
  }
  
  let recipient: PublicKey;
  try {
    recipient = new PublicKey(recipientStr);
  } catch (error) {
    throw new Error(`Invalid recipient address: ${recipientStr}`);
  }
  
  // Amount (required)
  const amountStr = params.get("a");
  if (!amountStr) {
    throw new Error("Missing required parameter: amount (a)");
  }
  
  const amount = parseInt(amountStr, 10);
  if (isNaN(amount) || amount <= 0) {
    throw new Error(`Invalid amount: ${amountStr}`);
  }
  
  // Optional parameters
  const memo = params.get("m") || undefined;
  const label = params.get("l") || undefined;
  const message = params.get("msg") || undefined;
  
  let reference: PublicKey | undefined;
  const refStr = params.get("ref");
  if (refStr) {
    try {
      reference = new PublicKey(refStr);
    } catch (error) {
      console.warn(`Invalid reference address: ${refStr}`);
    }
  }
  
  let tokenMint: PublicKey | undefined;
  const mintStr = params.get("token");
  if (mintStr) {
    try {
      tokenMint = new PublicKey(mintStr);
    } catch (error) {
      console.warn(`Invalid token mint address: ${mintStr}`);
    }
  }
  
  return {
    recipient,
    amount,
    memo,
    label,
    message,
    reference,
    tokenMint
  };
}

/**
 * Validate a payment link
 */
export function validatePaymentLink(url: string | URL): boolean {
  try {
    parsePaymentLink(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * Generate a shortened payment link (for future implementation with URL shortener)
 */
export async function generateShortLink(
  params: PaymentLinkParams,
  baseUrl?: string
): Promise<string> {
  const fullLink = generatePaymentLink(params, baseUrl);
  
  // TODO: Integrate with URL shortener service (bit.ly, tinyurl, etc.)
  // For now, return full link
  return fullLink;
}

/**
 * Format amount for display
 */
export function formatPaymentAmount(lamports: number): string {
  const sol = lamports / 1_000_000_000;
  return `${sol.toFixed(sol < 0.01 ? 6 : 4)} SOL`;
}

/**
 * Generate payment link with QR code data
 */
export function generatePaymentLinkData(params: PaymentLinkParams): {
  url: string;
  qrData: string;
  displayAmount: string;
} {
  const url = generatePaymentLink(params);
  
  return {
    url,
    qrData: url, // QR code will encode the full URL
    displayAmount: formatPaymentAmount(params.amount)
  };
}

