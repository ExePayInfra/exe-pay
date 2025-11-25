/**
 * Light Protocol Client Utilities
 * 
 * Manages Light Protocol RPC client initialization and configuration
 * for true on-chain privacy features.
 */

import { Connection } from '@solana/web3.js';
import { Rpc, createRpc } from '@lightprotocol/stateless.js';

console.log('[Light Protocol] 📚 Module loaded');

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
 * Check if a wallet has a compressed account
 * 
 * @param rpc - Light Protocol RPC client
 * @param walletPublicKey - User's wallet public key
 * @returns true if compressed account exists
 */
export async function hasCompressedAccount(
  rpc: Rpc,
  walletPublicKey: import('@solana/web3.js').PublicKey
): Promise<boolean> {
  try {
    // Import the function from the privacy package
    const { hasCompressedAccount: checkAccount } = await import('@exe-pay/privacy');
    return await checkAccount(rpc, walletPublicKey);
  } catch (error) {
    console.error('[Light Protocol] Error checking compressed account:', error);
    return false;
  }
}

/**
 * Create a compressed account for the user
 * 
 * @param rpc - Light Protocol RPC client
 * @param connection - Solana connection
 * @param walletPublicKey - User's wallet public key
 * @param signTransaction - Function to sign transactions
 * @returns Compressed account result
 */
export async function createCompressedAccount(
  rpc: Rpc,
  connection: import('@solana/web3.js').Connection,
  walletPublicKey: import('@solana/web3.js').PublicKey,
  signTransaction: (tx: import('@solana/web3.js').Transaction) => Promise<import('@solana/web3.js').Transaction>
): Promise<{ account: import('@solana/web3.js').PublicKey; signature: string }> {
  try {
    // Import the function from the privacy package
    const { createCompressedAccount: createAccount } = await import('@exe-pay/privacy');
    return await createAccount(rpc, connection, walletPublicKey, signTransaction);
  } catch (error: any) {
    console.error('[Light Protocol] Error creating compressed account:', error);
    throw new Error(`Failed to create compressed account: ${error.message}`);
  }
}

/**
 * Deposit funds to shielded pool
 * 
 * @param rpc - Light Protocol RPC client
 * @param connection - Solana connection
 * @param walletPublicKey - User's wallet public key
 * @param signTransaction - Function to sign transactions
 * @param amount - Amount to deposit (in lamports)
 * @returns Transaction signature
 */
export async function depositToShieldedPool(
  rpc: Rpc,
  connection: import('@solana/web3.js').Connection,
  walletPublicKey: import('@solana/web3.js').PublicKey,
  signTransaction: (tx: import('@solana/web3.js').Transaction) => Promise<import('@solana/web3.js').Transaction>,
  amount: bigint
): Promise<string> {
  try {
    // Import the function from the privacy package
    const { depositToShieldedPool: deposit } = await import('@exe-pay/privacy');
    return await deposit(rpc, connection, walletPublicKey, signTransaction, amount);
  } catch (error: any) {
    console.error('[Light Protocol] Error depositing to shielded pool:', error);
    throw new Error(`Failed to deposit: ${error.message}`);
  }
}

/**
 * Get shielded balance for a wallet
 * 
 * @param rpc - Light Protocol RPC client
 * @param walletPublicKey - User's wallet public key
 * @returns Shielded balance information
 */
export async function getShieldedBalance(
  rpc: Rpc,
  walletPublicKey: import('@solana/web3.js').PublicKey
): Promise<{ amount: bigint; compressedAccount: string; commitment: string }> {
  try {
    // Import the function from the privacy package
    const { getShieldedBalance: getBalance } = await import('@exe-pay/privacy');
    return await getBalance(rpc, walletPublicKey);
  } catch (error: any) {
    console.error('[Light Protocol] Error getting shielded balance:', error);
    return {
      amount: 0n,
      compressedAccount: walletPublicKey.toString(),
      commitment: '',
    };
  }
}

/**
 * Update demonstration mode shielded balance
 * 
 * @param walletPublicKey - User's wallet public key
 * @param amount - Amount to add/subtract
 */
export function updateDemoShieldedBalance(
  walletPublicKey: import('@solana/web3.js').PublicKey,
  amount: bigint
): void {
  try {
    // Import the function from the privacy package
    import('@exe-pay/privacy').then(({ updateDemoShieldedBalance: update }) => {
      update(walletPublicKey, amount);
    });
  } catch (error) {
    console.error('[Light Protocol] Error updating demo balance:', error);
  }
}

/**
 * Create a Light Protocol shielded transfer (TRUE private payment)
 * 
 * @param rpc - Light Protocol RPC client
 * @param connection - Solana connection
 * @param senderPublicKey - Sender's wallet public key
 * @param signTransaction - Function to sign transactions
 * @param recipientPublicKey - Recipient's public key
 * @param amount - Amount to transfer (in lamports)
 * @returns Transaction signature
 */
export async function createLightShieldedTransfer(
  rpc: Rpc,
  connection: import('@solana/web3.js').Connection,
  senderPublicKey: import('@solana/web3.js').PublicKey,
  signTransaction: (tx: import('@solana/web3.js').Transaction) => Promise<import('@solana/web3.js').Transaction>,
  recipientPublicKey: import('@solana/web3.js').PublicKey,
  amount: bigint
): Promise<string> {
  try {
    // Import the function from the privacy package
    const { createLightShieldedTransfer: transfer } = await import('@exe-pay/privacy');
    return await transfer(rpc, connection, senderPublicKey, signTransaction, recipientPublicKey, amount);
  } catch (error: any) {
    console.error('[Light Protocol] Error creating shielded transfer:', error);
    throw new Error(`Failed to create private transfer: ${error.message}`);
  }
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

