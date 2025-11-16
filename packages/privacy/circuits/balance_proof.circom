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
 * - balance_salt: Random salt for commitment (private)
 * - amount_salt: Random salt for commitment (private)
 * - balance_commitment: Hash commitment to balance (public)
 * - amount_commitment: Hash commitment to amount (public)
 * 
 * Outputs:
 * - valid: 1 if balance >= amount, 0 otherwise (public)
 */

include "../node_modules/circomlib/circuits/comparators.circom";
include "../node_modules/circomlib/circuits/poseidon.circom";

template BalanceProof(n) {
    // Private inputs
    signal input balance;
    signal input amount;
    signal input balance_salt;  // Random salt for commitment
    signal input amount_salt;   // Random salt for commitment
    
    // Public inputs (commitments)
    signal input balance_commitment;
    signal input amount_commitment;
    
    // Public output
    signal output valid;
    
    // Verify balance commitment using Poseidon hash
    // commitment = Poseidon(balance, balance_salt)
    component balanceCommit = Poseidon(2);
    balanceCommit.inputs[0] <== balance;
    balanceCommit.inputs[1] <== balance_salt;
    balance_commitment === balanceCommit.out;
    
    // Verify amount commitment using Poseidon hash
    // commitment = Poseidon(amount, amount_salt)
    component amountCommit = Poseidon(2);
    amountCommit.inputs[0] <== amount;
    amountCommit.inputs[1] <== amount_salt;
    amount_commitment === amountCommit.out;
    
    // Check that balance >= amount
    component greaterOrEqual = GreaterEqThan(n);
    greaterOrEqual.in[0] <== balance;
    greaterOrEqual.in[1] <== amount;
    
    valid <== greaterOrEqual.out;
}

// Instantiate with 64-bit numbers
component main {public [balance_commitment, amount_commitment]} = BalanceProof(64);

