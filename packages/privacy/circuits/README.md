# ZK Circuits

This directory contains the Groth16 ZK-SNARK circuits for ExePay privacy features.

## Circuits

### 1. Range Proof (`range_proof.circom`)
Proves that an amount is within a valid range without revealing the amount.

**Proves:** `0 < amount < max_amount`

**Inputs:**
- `amount` (private): The amount to prove
- `max_amount` (public): Maximum allowed amount

**Output:**
- `valid` (public): 1 if proof is valid, 0 otherwise

### 2. Balance Proof (`balance_proof.circom`)
Proves that a sender has sufficient balance without revealing the balance or amount.

**Proves:** `balance >= amount`

**Inputs:**
- `balance` (private): Sender's balance
- `amount` (private): Transfer amount
- `balance_salt` (private): Random salt for commitment
- `amount_salt` (private): Random salt for commitment
- `balance_commitment` (public): Pedersen commitment to balance
- `amount_commitment` (public): Pedersen commitment to amount

**Output:**
- `valid` (public): 1 if proof is valid, 0 otherwise

## Setup

### Prerequisites
- circom compiler
- snarkjs
- Powers of tau ceremony file

### Installation

#### Option 1: Install circom via Rust
```bash
cargo install --git https://github.com/iden3/circom.git
```

#### Option 2: Use Docker
```bash
docker pull iden3/circom:latest
```

### Compile Circuits

```bash
# Download powers of tau
./scripts/setup-circuits.sh

# Compile range proof
circom range_proof.circom --r1cs --wasm --sym -o ./

# Compile balance proof
circom balance_proof.circom --r1cs --wasm --sym -o ./
```

### Generate Keys

```bash
# Range proof
snarkjs groth16 setup range_proof.r1cs powersOfTau28_hez_final_12.ptau range_proof_0000.zkey
snarkjs zkey contribute range_proof_0000.zkey range_proof.zkey --name="Contribution" -v
snarkjs zkey export verificationkey range_proof.zkey range_proof_verification_key.json

# Balance proof
snarkjs groth16 setup balance_proof.r1cs powersOfTau28_hez_final_12.ptau balance_proof_0000.zkey
snarkjs zkey contribute balance_proof_0000.zkey balance_proof.zkey --name="Contribution" -v
snarkjs zkey export verificationkey balance_proof.zkey balance_proof_verification_key.json
```

## Testing

For development and testing, we use mock proofs that simulate the circuit behavior without requiring full compilation.

To use real proofs:
1. Compile circuits (see above)
2. Generate keys (see above)
3. Update `USE_MOCK_PROOFS` in `src/proofs/groth16.ts` to `false`

## Production

For production deployment:
1. Use a secure trusted setup ceremony
2. Compile circuits with optimization flags
3. Generate production keys
4. Audit circuits and implementation
5. Deploy verification contracts to Solana

## Resources

- [Circom Documentation](https://docs.circom.io/)
- [snarkjs Documentation](https://github.com/iden3/snarkjs)
- [Groth16 Paper](https://eprint.iacr.org/2016/260.pdf)
- [Powers of Tau Ceremony](https://github.com/iden3/snarkjs#7-prepare-phase-2)

