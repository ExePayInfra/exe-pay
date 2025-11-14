#!/bin/bash

# ExePay Network Switcher
# Easily switch between devnet and mainnet

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
ENV_FILE="$PROJECT_ROOT/apps/web/.env.local"

echo "🔄 ExePay Network Switcher"
echo "=========================="
echo ""

# Check if .env.local exists
if [ ! -f "$ENV_FILE" ]; then
    echo "❌ Error: .env.local not found at $ENV_FILE"
    echo "Creating a new .env.local file..."
    touch "$ENV_FILE"
fi

# Show current network
if grep -q "NEXT_PUBLIC_SOLANA_NETWORK=mainnet-beta" "$ENV_FILE" 2>/dev/null; then
    CURRENT="mainnet"
else
    CURRENT="devnet"
fi

echo "Current network: $CURRENT"
echo ""
echo "Select network:"
echo "1) Devnet (test network, free SOL)"
echo "2) Mainnet (production, real SOL)"
echo ""
read -p "Enter choice (1 or 2): " choice

case $choice in
    1)
        echo ""
        echo "🔧 Switching to DEVNET..."
        
        # Update or add network setting
        if grep -q "NEXT_PUBLIC_SOLANA_NETWORK=" "$ENV_FILE"; then
            sed -i '' 's/NEXT_PUBLIC_SOLANA_NETWORK=.*/NEXT_PUBLIC_SOLANA_NETWORK=devnet/' "$ENV_FILE"
        else
            echo "NEXT_PUBLIC_SOLANA_NETWORK=devnet" >> "$ENV_FILE"
        fi
        
        # Update or add RPC URL
        if grep -q "NEXT_PUBLIC_SOLANA_RPC_URL=" "$ENV_FILE"; then
            # Keep existing RPC if it's already set
            echo "✅ Keeping existing RPC URL"
        else
            echo "# Using default devnet RPC (you can set your own Helius devnet URL)" >> "$ENV_FILE"
            echo "# NEXT_PUBLIC_SOLANA_RPC_URL=https://devnet.helius-rpc.com/?api-key=YOUR_KEY" >> "$ENV_FILE"
        fi
        
        echo ""
        echo "✅ Switched to DEVNET!"
        echo "📝 Remember to restart your dev server: pnpm --filter @exe-pay/web dev"
        ;;
        
    2)
        echo ""
        echo "⚠️  WARNING: Switching to MAINNET (real money!)"
        echo ""
        read -p "Are you sure? (yes/no): " confirm
        
        if [ "$confirm" != "yes" ]; then
            echo "❌ Cancelled"
            exit 0
        fi
        
        echo ""
        echo "🔧 Switching to MAINNET..."
        
        # Update or add network setting
        if grep -q "NEXT_PUBLIC_SOLANA_NETWORK=" "$ENV_FILE"; then
            sed -i '' 's/NEXT_PUBLIC_SOLANA_NETWORK=.*/NEXT_PUBLIC_SOLANA_NETWORK=mainnet-beta/' "$ENV_FILE"
        else
            echo "NEXT_PUBLIC_SOLANA_NETWORK=mainnet-beta" >> "$ENV_FILE"
        fi
        
        # Check if RPC URL is set
        if ! grep -q "NEXT_PUBLIC_SOLANA_RPC_URL=https://mainnet" "$ENV_FILE"; then
            echo ""
            echo "⚠️  You need a mainnet RPC endpoint!"
            echo ""
            echo "Options:"
            echo "1) Helius (recommended): https://www.helius.dev/"
            echo "2) QuickNode: https://www.quicknode.com/"
            echo "3) Public RPC (not recommended): https://api.mainnet-beta.solana.com"
            echo ""
            read -p "Enter your mainnet RPC URL: " rpc_url
            
            if [ -z "$rpc_url" ]; then
                echo "❌ No RPC URL provided. Using public RPC (may be rate limited)"
                rpc_url="https://api.mainnet-beta.solana.com"
            fi
            
            if grep -q "NEXT_PUBLIC_SOLANA_RPC_URL=" "$ENV_FILE"; then
                sed -i '' "s|NEXT_PUBLIC_SOLANA_RPC_URL=.*|NEXT_PUBLIC_SOLANA_RPC_URL=$rpc_url|" "$ENV_FILE"
            else
                echo "NEXT_PUBLIC_SOLANA_RPC_URL=$rpc_url" >> "$ENV_FILE"
            fi
        fi
        
        echo ""
        echo "✅ Switched to MAINNET!"
        echo "⚠️  Remember: This uses REAL SOL!"
        echo "📝 Restart your dev server: pnpm --filter @exe-pay/web dev"
        echo "📖 Read MAINNET_DEPLOY.md for full deployment guide"
        ;;
        
    *)
        echo "❌ Invalid choice"
        exit 1
        ;;
esac

echo ""
echo "Current .env.local contents:"
echo "----------------------------"
cat "$ENV_FILE"
echo "----------------------------"
echo ""
echo "Done! 🎉"

