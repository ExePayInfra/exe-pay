pragma circom 2.0.0;

/**
 * Balance Proof Circuit
 * 
 * Proves that a sender has sufficient balance to make a transfer
 * without revealing the actual balance or transfer amount.
 * 
 * Proves: balance >= amount
 * 
 * This prevents double-spending in confidential transfers by ensuring
 * the sender has enough funds before the transfer is executed.
 * 
 * Inputs:
 * - balance: Sender's current balance (private)
 * - amount: Transfer amount (private)
 * - balance_commitment: Pedersen commitment to balance (public)
 * - amount_commitment: Pedersen commitment to amount (public)
 * 
 * Outputs:
 * - valid: 1 if balance >= amount, 0 otherwise (public)
 */

include "../node_modules/circomlib/circuits/comparators.circom";
include "../node_modules/circomlib/circuits/pedersen.circom";

template BalanceProof(n) {
    // Private inputs
    signal input balance;
    signal input amount;
    signal input balance_salt;  // Random salt for Pedersen commitment
    signal input amount_salt;   // Random salt for Pedersen commitment
    
    // Public inputs (commitments)
    signal input balance_commitment;
    signal input amount_commitment;
    
    // Public output
    signal output valid;
    
    // Verify balance commitment
    // commitment = Pedersen(balance, balance_salt)
    component balanceCommit = Pedersen(256);
    balanceCommit.in[0] <== balance;
    balanceCommit.in[1] <== balance_salt;
    balance_commitment === balanceCommit.out[0];
    
    // Verify amount commitment
    // commitment = Pedersen(amount, amount_salt)
    component amountCommit = Pedersen(256);
    amountCommit.in[0] <== amount;
    amountCommit.in[1] <== amount_salt;
    amount_commitment === amountCommit.out[0];
    
    // Check that balance >= amount
    component greaterOrEqual = GreaterEqThan(n);
    greaterOrEqual.in[0] <== balance;
    greaterOrEqual.in[1] <== amount;
    
    valid <== greaterOrEqual.out;
}

// Instantiate with 64-bit numbers
component main {public [balance_commitment, amount_commitment]} = BalanceProof(64);

