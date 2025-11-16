#!/bin/bash

# ExePay ZK Circuits Setup Script
# This script sets up the environment and compiles the ZK circuits

set -e  # Exit on error

echo "🚀 ExePay ZK Circuits Setup"
echo "=============================="
echo ""

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if circom is installed
echo "📦 Checking dependencies..."
if ! command -v circom &> /dev/null; then
    echo -e "${RED}❌ circom not found${NC}"
    echo ""
    echo "Please install circom first:"
    echo ""
    echo "Option 1: Install via Rust (recommended)"
    echo "  git clone https://github.com/iden3/circom.git"
    echo "  cd circom"
    echo "  cargo build --release"
    echo "  cargo install --path circom"
    echo ""
    echo "Option 2: Use pre-built binary"
    echo "  Visit: https://docs.circom.io/getting-started/installation/"
    echo ""
    exit 1
fi

# Check if snarkjs is installed globally
if ! command -v snarkjs &> /dev/null; then
    echo -e "${YELLOW}⚠️  snarkjs not found globally${NC}"
    echo "Installing snarkjs locally..."
    cd ../../..
    pnpm add -D snarkjs
    cd packages/privacy/circuits
    SNARKJS="npx snarkjs"
else
    SNARKJS="snarkjs"
fi

echo -e "${GREEN}✅ Dependencies OK${NC}"
echo ""

# Check if powers of tau file exists
echo "📥 Checking Powers of Tau file..."
if [ ! -f "powersOfTau28_hez_final_12.ptau" ]; then
    echo -e "${YELLOW}⚠️  Powers of Tau file not found${NC}"
    echo "Downloading powersOfTau28_hez_final_12.ptau (this may take a while)..."
    curl -o powersOfTau28_hez_final_12.ptau https://hermez.s3-eu-west-1.amazonaws.com/powersOfTau28_hez_final_12.ptau
    echo -e "${GREEN}✅ Downloaded Powers of Tau${NC}"
else
    echo -e "${GREEN}✅ Powers of Tau file exists${NC}"
fi
echo ""

# Compile Range Proof Circuit
echo "🔨 Compiling range_proof.circom..."
circom range_proof.circom --r1cs --wasm --sym -o ./
echo -e "${GREEN}✅ Range proof circuit compiled${NC}"
echo ""

# Compile Balance Proof Circuit
echo "🔨 Compiling balance_proof.circom..."
circom balance_proof.circom --r1cs --wasm --sym -o ./
echo -e "${GREEN}✅ Balance proof circuit compiled${NC}"
echo ""

# Generate Range Proof Keys
echo "🔑 Generating range proof keys..."
$SNARKJS groth16 setup range_proof.r1cs powersOfTau28_hez_final_12.ptau range_proof_0000.zkey
echo "Contributing to range proof ceremony..."
echo "exepay-contribution" | $SNARKJS zkey contribute range_proof_0000.zkey range_proof.zkey --name="ExePay" -v
$SNARKJS zkey export verificationkey range_proof.zkey range_proof_verification_key.json
echo -e "${GREEN}✅ Range proof keys generated${NC}"
echo ""

# Generate Balance Proof Keys
echo "🔑 Generating balance proof keys..."
$SNARKJS groth16 setup balance_proof.r1cs powersOfTau28_hez_final_12.ptau balance_proof_0000.zkey
echo "Contributing to balance proof ceremony..."
echo "exepay-contribution" | $SNARKJS zkey contribute balance_proof_0000.zkey balance_proof.zkey --name="ExePay" -v
$SNARKJS zkey export verificationkey balance_proof.zkey balance_proof_verification_key.json
echo -e "${GREEN}✅ Balance proof keys generated${NC}"
echo ""

# Clean up intermediate files
echo "🧹 Cleaning up..."
rm -f range_proof_0000.zkey balance_proof_0000.zkey
echo -e "${GREEN}✅ Cleanup complete${NC}"
echo ""

# Verify files were created
echo "📋 Verifying generated files..."
FILES=(
    "range_proof.r1cs"
    "range_proof.wasm"
    "range_proof.zkey"
    "range_proof_verification_key.json"
    "range_proof_js/range_proof.wasm"
    "balance_proof.r1cs"
    "balance_proof.wasm"
    "balance_proof.zkey"
    "balance_proof_verification_key.json"
    "balance_proof_js/balance_proof.wasm"
)

ALL_GOOD=true
for file in "${FILES[@]}"; do
    if [ -f "$file" ]; then
        echo -e "${GREEN}✅${NC} $file"
    else
        echo -e "${RED}❌${NC} $file (missing)"
        ALL_GOOD=false
    fi
done
echo ""

if [ "$ALL_GOOD" = true ]; then
    echo -e "${GREEN}🎉 Setup complete! All circuits compiled and keys generated.${NC}"
    echo ""
    echo "Next steps:"
    echo "1. Update USE_MOCK_PROOFS to false in src/proofs/groth16.ts"
    echo "2. Run tests: pnpm test"
    echo "3. Test in web app"
    echo ""
else
    echo -e "${RED}❌ Setup incomplete. Some files are missing.${NC}"
    exit 1
fi

