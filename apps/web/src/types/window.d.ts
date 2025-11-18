// Type declarations for wallet extensions on window object

interface PhantomProvider {
  isPhantom?: boolean;
  isConnected: boolean;
  connect(): Promise<{ publicKey: { toString(): string } }>;
  disconnect(): Promise<void>;
  signTransaction(transaction: any): Promise<any>;
  signAllTransactions(transactions: any[]): Promise<any[]>;
  publicKey?: { toString(): string };
}

interface SolflareProvider {
  isSolflare?: boolean;
  isConnected: boolean;
  connect(): Promise<{ publicKey: { toString(): string } }>;
  disconnect(): Promise<void>;
  signTransaction(transaction: any): Promise<any>;
  signAllTransactions(transactions: any[]): Promise<any[]>;
  publicKey?: { toString(): string };
}

declare global {
  interface Window {
    solana?: PhantomProvider;
    solflare?: SolflareProvider;
  }
}

export {};

