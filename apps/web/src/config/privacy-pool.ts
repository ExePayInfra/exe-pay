import { PublicKey } from '@solana/web3.js';

export const PRIVACY_POOL_CONFIG = {
  // Deployed program on Solana Devnet
  programId: new PublicKey('8NpLjXrc8qJMkVirPU2eCBCCMzzn8LcVzdEWphMGcQGk'),
  
  // Network configuration
  network: 'devnet' as const,
  rpcEndpoint: 'https://api.devnet.solana.com',
  
  // Pool PDAs (derived deterministically)
  poolSeed: 'privacy_pool',
  vaultSeed: 'pool_vault',
  
  // Known PDAs (for reference, but should be derived)
  poolPDA: new PublicKey('4YggebdF8QD1ANsxKYzyJM7jqyoLvybmbwLxXqDh7cTf'),
  vaultPDA: new PublicKey('4hkjeLr5TApBj5a75u7oCjNWcvhyNKVd1c1M83wBKCbU'),
  
  // Pool settings
  minAnonymitySet: 10,
};

// Helper function to derive PDAs
export function derivePrivacyPoolPDAs(programId: PublicKey) {
  const [poolPDA, poolBump] = PublicKey.findProgramAddressSync(
    [Buffer.from(PRIVACY_POOL_CONFIG.poolSeed)],
    programId
  );
  
  const [vaultPDA, vaultBump] = PublicKey.findProgramAddressSync(
    [Buffer.from(PRIVACY_POOL_CONFIG.vaultSeed), poolPDA.toBuffer()],
    programId
  );
  
  return {
    poolPDA,
    poolBump,
    vaultPDA,
    vaultBump,
  };
}

