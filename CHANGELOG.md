# Changelog

All notable changes to ExePay will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Mobile wallet deep-linking support (Phantom, Solflare, Coinbase, Trust Wallet)
- Enhanced wallet page UI with 2-column layout and balance display
- Visual token selector with SOL, USDC, USDT, and custom token support
- Professional homepage design with partner logos and animations
- Privacy level descriptions with visual indicators
- Glassmorphism effects and smooth animations throughout UI

### Fixed
- Invalid public key input error on wallet page initialization
- Infinite loading state on wallet page
- Mobile wallet connection issues with browser redirects
- Transaction history RPC batch request rate limiting

### Changed
- Updated to lazy PublicKey initialization for better performance
- Improved error handling in privacy module imports
- Enhanced mobile responsiveness across all pages
- Updated partner carousel to use icons instead of text

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

