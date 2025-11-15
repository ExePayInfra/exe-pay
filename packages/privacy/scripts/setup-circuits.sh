#!/bin/bash

# Circuit Setup Script
# This script downloads the powers of tau and sets up the circuits for proof generation

set -e

echo "🔐 Setting up ZK circuits..."

# Change to circuits directory
cd "$(dirname "$0")/../circuits"

# Download powers of tau (if not exists)
if [ ! -f "powersOfTau28_hez_final_12.ptau" ]; then
    echo "📥 Downloading powers of tau (this may take a few minutes)..."
    curl -L https://hermez.s3-eu-west-1.amazonaws.com/powersOfTau28_hez_final_12.ptau -o powersOfTau28_hez_final_12.ptau
    echo "✅ Powers of tau downloaded!"
else
    echo "✅ Powers of tau already exists"
fi

echo ""
echo "📝 Note: To compile circuits, you need circom installed."
echo "   Install with: cargo install --git https://github.com/iden3/circom.git"
echo ""
echo "   Or use Docker:"
echo "   docker run --rm -v $(pwd):/circuits iden3/circom:latest /circuits/range_proof.circom --r1cs --wasm --sym -o /circuits/"
echo ""
echo "🎯 Next steps:"
echo "   1. Install circom (see above)"
echo "   2. Run: ./compile-circuits.sh"
echo "   3. Run: ./generate-keys.sh"
echo ""
echo "✅ Setup complete!"

