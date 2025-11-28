# Changelog

All notable changes to ExePay will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Planned

- Light Protocol mainnet integration
- On-chain encrypted viewing keys for stealth addresses
- Progressive Web App (PWA) with offline support
- Advanced analytics dashboard

---

## [0.2.0] - 2025-11-28

### 🎉 Major Features

#### **Stealth Address System (Mainnet Ready)**

- Complete Monero-inspired stealth address implementation
- X25519 ECDH for secure shared secret derivation
- View tag optimization for efficient payment scanning
- Full claiming functionality with automatic fund transfer
- Message signing for key derivation (no secret key exposure)
- One-time payment addresses for maximum privacy

#### **Light Protocol Integration (Beta)**

- ZK compression infrastructure on devnet
- Shielded pool management
- Compressed account support
- Privacy packages (Bronze, Silver, Gold, Platinum)

#### **Enhanced Payment Features**

- Batch payments with optimized SOL transfers
- Sequential SPL token batch processing
- Recurring payments with flexible intervals
- Payment links with QR code generation and scanning
- Multi-token support (SOL, USDC, USDT, BONK, JUP, RAY, ORCA)

### 🎨 UI/UX Improvements

- **Dynamic Rendering**: Force-dynamic rendering for all wallet-dependent pages
- **Smooth Transitions**: Global CSS transitions for seamless page navigation
- **Mobile Optimization**: Fully responsive design across all devices
- **Smart Notifications**: Non-intrusive slide-in notifications for transaction status
- **Privacy Page**: Dual-tab interface for Stealth System and Light Protocol
- **Logo Refinement**: Professional ExePay logo with consistent styling
- **Odometer Stats**: Realistic, conservative statistics on homepage

### 🔧 Technical Improvements

- **Monorepo Optimization**: Proper `transpilePackages` configuration for Next.js
- **Build System**: Resolved static generation issues with dynamic pages
- **RPC Handling**: Improved error handling for rate limiting
- **Wallet Integration**: Enhanced multi-wallet support (6 wallets)
- **TypeScript**: Full type safety across all packages
- **Performance**: Optimized bundle size and load times

### 🐛 Bug Fixes

- Fixed WalletContext errors during production builds
- Resolved static generation conflicts with client-side hooks
- Fixed stealth address view tag calculation mismatch
- Corrected ECDH key conversion for payment scanning
- Fixed claiming functionality with proper transaction signing
- Resolved Next.js dev server static asset 404 errors
- Fixed duplicate `dynamic` export naming conflict

### 🔒 Security

- Implemented message signing for viewing key derivation
- No wallet secret key exposure required
- Cryptographically secure shared secret generation
- Proper nullifier handling for double-spend prevention

### 📚 Documentation

- Updated README with accurate feature descriptions
- Comprehensive stealth address documentation
- Light Protocol integration guides
- Deployment troubleshooting documentation
- Professional roadmap for 2026

---

## [0.1.0] - 2024-11-16

## [0.1.0] - 2024-11-16

### Added

- Initial public release
- Core payment SDK with batch and recurring support
- Light Protocol integration for ZK privacy
- Web interface with Solana wallet adapter
- Multi-token support (SOL, USDC, USDT, BONK, JUP)
- Transaction history and QR code generation
- Comprehensive documentation site
- Mainnet deployment on Vercel

### Security

- Integrated Light Protocol's audited ZK compression
- Implemented nullifier protection against double-spending
- Added secure wallet connection with official Solana adapters

---

## Release Notes

### Version 0.1.0 - Initial Release

ExePay launches as a production-ready privacy-first payment SDK for Solana, featuring:

**Core Features:**

- Three privacy levels: Public, Shielded (hidden amounts), and Private (fully anonymous)
- Multi-token support with automatic SPL token handling
- Batch payments for efficient multi-recipient transfers
- Recurring payments with pause/resume/cancel functionality
- Transaction history with on-chain data fetching

**Developer Experience:**

- TypeScript SDK with full type safety
- React hooks for one-line integration
- Comprehensive documentation and examples
- Turborepo monorepo architecture for optimal DX

**Production Ready:**

- Deployed on Solana mainnet
- Integrated with Light Protocol's audited privacy infrastructure
- Professional UI/UX with mobile support
- Multi-wallet compatibility

---

**View the [Roadmap](./ROADMAP.md) for upcoming features and development phases.**
