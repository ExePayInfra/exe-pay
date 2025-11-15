pragma circom 2.0.0;

/**
 * Range Proof Circuit
 * 
 * Proves that a value is within a valid range without revealing the value.
 * Specifically, proves that: 0 < amount < max_amount
 * 
 * This is essential for confidential transfers to ensure:
 * - Amount is positive (not zero or negative)
 * - Amount doesn't overflow
 * 
 * Inputs:
 * - amount: The secret amount to prove (private)
 * - max_amount: Maximum allowed amount (public)
 * 
 * Outputs:
 * - valid: 1 if amount is in range, 0 otherwise (public)
 */

include "../node_modules/circomlib/circuits/comparators.circom";

template RangeProof(n) {
    // Private input: the amount to prove
    signal input amount;
    
    // Public input: maximum allowed amount
    signal input max_amount;
    
    // Public output: whether the amount is valid
    signal output valid;
    
    // Check that amount > 0
    component greaterThanZero = GreaterThan(n);
    greaterThanZero.in[0] <== amount;
    greaterThanZero.in[1] <== 0;
    
    // Check that amount < max_amount
    component lessThanMax = LessThan(n);
    lessThanMax.in[0] <== amount;
    lessThanMax.in[1] <== max_amount;
    
    // Both conditions must be true
    valid <== greaterThanZero.out * lessThanMax.out;
}

// Instantiate with 64-bit numbers (supports amounts up to 2^64 - 1)
component main {public [max_amount]} = RangeProof(64);

