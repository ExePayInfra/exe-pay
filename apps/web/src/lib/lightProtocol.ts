/**
 * Light Protocol Client Utilities
 * 
 * Manages Light Protocol RPC client initialization and configuration
 * for true on-chain privacy features.
 */

import { Connection } from '@solana/web3.js';
import { Rpc, createRpc } from '@lightprotocol/stateless.js';

/**
 * Light Protocol client singleton
 */
let lightRpcClient: Rpc | null = null;

/**
 * Get Light Protocol configuration from environment
 */
export function getLightProtocolConfig() {
  const config = {
    network: process.env.NEXT_PUBLIC_SOLANA_NETWORK || 'devnet',
    solanaRpc: process.env.NEXT_PUBLIC_SOLANA_RPC_URL || 'https://api.devnet.solana.com',
    lightRpc: process.env.NEXT_PUBLIC_LIGHT_RPC_URL || 'https://devnet.helius-rpc.com',
  };

  console.log('[Light Protocol] Configuration loaded:');
  console.log('[Light Protocol]   Network:', config.network);
  console.log('[Light Protocol]   Solana RPC:', config.solanaRpc);
  console.log('[Light Protocol]   Light RPC:', config.lightRpc);

  return config;
}

/**
 * Initialize Light Protocol RPC client
 * 
 * Creates a singleton RPC client for Light Protocol operations.
 * Uses environment variables for configuration.
 * 
 * @returns Light Protocol RPC client
 */
export function initializeLightProtocol(): Rpc {
  // Return existing client if already initialized
  if (lightRpcClient) {
    console.log('[Light Protocol] Using existing RPC client');
    return lightRpcClient;
  }

  const config = getLightProtocolConfig();

  try {
    console.log('[Light Protocol] Initializing RPC client...');

    // Create Light Protocol RPC client
    // This client supports ZK Compression operations
    lightRpcClient = createRpc(
      config.solanaRpc,
      config.lightRpc
    );

    console.log('[Light Protocol] ✅ RPC client initialized successfully');
    console.log('[Light Protocol] Ready for compressed accounts and shielded pool operations');

    return lightRpcClient;

  } catch (error: any) {
    console.error('[Light Protocol] ❌ Failed to initialize RPC client:', error);
    throw new Error(`Light Protocol initialization failed: ${error.message}`);
  }
}

/**
 * Get or initialize Light Protocol client
 * 
 * @returns Light Protocol RPC client
 */
export function getLightProtocolClient(): Rpc {
  if (!lightRpcClient) {
    return initializeLightProtocol();
  }
  return lightRpcClient;
}

/**
 * Test Light Protocol connection
 * 
 * Verifies that the Light Protocol RPC endpoint is accessible
 * and responding correctly.
 * 
 * @returns true if connection successful, false otherwise
 */
export async function testLightProtocolConnection(): Promise<boolean> {
  try {
    console.log('[Light Protocol] Testing connection...');

    const config = getLightProtocolConfig();
    const connection = new Connection(config.solanaRpc, 'confirmed');

    // Test basic Solana RPC connection
    const version = await connection.getVersion();
    console.log('[Light Protocol] Solana RPC version:', version['solana-core']);

    // Test Light Protocol RPC (if different from Solana RPC)
    if (config.lightRpc !== config.solanaRpc) {
      const lightConnection = new Connection(config.lightRpc, 'confirmed');
      const lightVersion = await lightConnection.getVersion();
      console.log('[Light Protocol] Light RPC version:', lightVersion['solana-core']);
    }

    console.log('[Light Protocol] ✅ Connection test successful');
    return true;

  } catch (error: any) {
    console.error('[Light Protocol] ❌ Connection test failed:', error);
    console.error('[Light Protocol] Please check your RPC endpoints in .env.local');
    return false;
  }
}

/**
 * Check if Light Protocol is available
 * 
 * @returns true if Light Protocol is configured and available
 */
export function isLightProtocolAvailable(): boolean {
  const config = getLightProtocolConfig();
  return !!(config.solanaRpc && config.lightRpc);
}

/**
 * Get Light Protocol network info
 * 
 * @returns Network information
 */
export function getLightProtocolNetworkInfo() {
  const config = getLightProtocolConfig();
  
  return {
    network: config.network,
    isDevnet: config.network === 'devnet',
    isMainnet: config.network === 'mainnet-beta',
    solanaExplorer: config.network === 'devnet' 
      ? 'https://explorer.solana.com/?cluster=devnet'
      : 'https://explorer.solana.com',
    solscanUrl: config.network === 'devnet'
      ? 'https://solscan.io/?cluster=devnet'
      : 'https://solscan.io',
  };
}

