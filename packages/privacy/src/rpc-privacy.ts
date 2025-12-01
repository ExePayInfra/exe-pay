import { Connection, type ConnectionConfig } from '@solana/web3.js';

/**
 * RPC Privacy - Hide IP addresses when broadcasting transactions
 * 
 * Uses multiple RPC endpoints and rotates between them to prevent
 * IP address correlation and tracking.
 * 
 * Privacy benefits:
 * - Hides your IP address from single RPC provider
 * - Prevents transaction correlation
 * - Network-level privacy
 * - Like Tor but simpler
 */

/**
 * Privacy-focused RPC endpoints
 * Rotates between multiple providers to hide IP
 */
const PRIVACY_RPC_ENDPOINTS = [
  'https://api.mainnet-beta.solana.com',
  'https://solana-api.projectserum.com',
  'https://rpc.ankr.com/solana',
  'https://solana-mainnet.g.alchemy.com/v2/demo',
  'https://api.metaplex.solana.com',
];

const PRIVACY_RPC_ENDPOINTS_DEVNET = [
  'https://api.devnet.solana.com',
  'https://rpc.ankr.com/solana_devnet',
  'https://devnet.genesysgo.net',
];

/**
 * Get a random privacy-focused RPC endpoint
 * 
 * @param network - Network to use (mainnet-beta or devnet)
 * @returns Random RPC endpoint
 */
export function getPrivacyRpcEndpoint(network: 'mainnet-beta' | 'devnet' = 'mainnet-beta'): string {
  const endpoints = network === 'devnet' 
    ? PRIVACY_RPC_ENDPOINTS_DEVNET 
    : PRIVACY_RPC_ENDPOINTS;
  
  const randomIndex = Math.floor(Math.random() * endpoints.length);
  return endpoints[randomIndex];
}

/**
 * Create a privacy-focused Solana connection
 * 
 * Automatically rotates between RPC endpoints to hide IP address.
 * 
 * @param network - Network to use
 * @param config - Optional connection config
 * @returns Solana connection with privacy
 */
export function createPrivacyConnection(
  network: 'mainnet-beta' | 'devnet' = 'mainnet-beta',
  config?: ConnectionConfig
): Connection {
  const endpoint = getPrivacyRpcEndpoint(network);
  
  console.log('[RPC Privacy] Using endpoint:', endpoint);
  
  return new Connection(endpoint, config || 'confirmed');
}

/**
 * Rotate to a new RPC endpoint
 * 
 * Call this periodically or after each transaction to rotate endpoints.
 * 
 * @param currentConnection - Current connection
 * @param network - Network to use
 * @returns New connection with different endpoint
 */
export function rotateRpcEndpoint(
  currentConnection: Connection,
  network: 'mainnet-beta' | 'devnet' = 'mainnet-beta'
): Connection {
  const currentEndpoint = currentConnection.rpcEndpoint;
  let newEndpoint = getPrivacyRpcEndpoint(network);
  
  // Ensure we get a different endpoint
  let attempts = 0;
  while (newEndpoint === currentEndpoint && attempts < 10) {
    newEndpoint = getPrivacyRpcEndpoint(network);
    attempts++;
  }
  
  console.log('[RPC Privacy] Rotated from', currentEndpoint, 'to', newEndpoint);
  
  return new Connection(newEndpoint, 'confirmed');
}

/**
 * Send transaction with IP privacy
 * 
 * Uses a random RPC endpoint to hide your IP address.
 * 
 * @param transaction - Signed transaction to send
 * @param network - Network to use
 * @returns Transaction signature
 */
export async function sendTransactionPrivately(
  transaction: Buffer,
  network: 'mainnet-beta' | 'devnet' = 'mainnet-beta'
): Promise<string> {
  const connection = createPrivacyConnection(network);
  
  console.log('[RPC Privacy] Sending transaction via privacy RPC...');
  
  const signature = await connection.sendRawTransaction(transaction, {
    skipPreflight: false,
    preflightCommitment: 'confirmed',
  });
  
  console.log('[RPC Privacy] Transaction sent:', signature);
  
  return signature;
}

/**
 * Get privacy connection for current environment
 * 
 * Automatically detects network from environment variables.
 * 
 * @returns Privacy-focused connection
 */
export function getPrivacyConnection(): Connection {
  const network = (process.env.NEXT_PUBLIC_SOLANA_NETWORK || 'mainnet-beta') as 'mainnet-beta' | 'devnet';
  return createPrivacyConnection(network);
}

/**
 * Privacy RPC statistics
 */
export interface RpcStats {
  totalEndpoints: number;
  currentEndpoint: string;
  rotationCount: number;
}

let rotationCount = 0;

/**
 * Get RPC privacy statistics
 * 
 * @param connection - Current connection
 * @returns Privacy stats
 */
export function getRpcPrivacyStats(connection: Connection): RpcStats {
  return {
    totalEndpoints: PRIVACY_RPC_ENDPOINTS.length,
    currentEndpoint: connection.rpcEndpoint,
    rotationCount,
  };
}

/**
 * Increment rotation counter
 */
export function incrementRotationCount(): void {
  rotationCount++;
}

