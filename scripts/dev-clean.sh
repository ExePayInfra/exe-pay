#!/bin/bash

# ExePay Clean Dev Start Script
# Prevents cache and 404 errors after adding new features

echo "🧹 Cleaning caches..."

# Kill any existing dev servers
lsof -ti:3000 | xargs kill -9 2>/dev/null || true

# Clean Next.js cache
rm -rf apps/web/.next

# Clean Turbo cache
rm -rf .turbo

# Clean node_modules/.cache
rm -rf node_modules/.cache

echo "✅ Cache cleaned"
echo ""
echo "🚀 Starting dev server..."
echo ""

# Start dev server
pnpm dev

