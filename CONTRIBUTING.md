# Contributing to ExePay

Thank you for your interest in contributing to ExePay! This document provides guidelines and instructions for contributing to the project.

## 🎯 Code of Conduct

Please read and follow our [Code of Conduct](./CODE_OF_CONDUCT.md). We are committed to providing a welcoming and inclusive environment for all contributors.

## 🚀 Getting Started

### Prerequisites

- Node.js 20 or higher
- pnpm 9.x (`corepack enable pnpm`)
- Git
- A Solana wallet (for testing)

### Development Setup

```bash
# Clone the repository
git clone https://github.com/ExePayInfra/exe-pay.git
cd exe-pay

# Install dependencies
pnpm install

# Build all packages
pnpm build

# Run tests
pnpm test

# Start development server
pnpm --filter @exe-pay/web dev
```

## 📋 Development Workflow

### 1. Create a Branch

```bash
git checkout -b feature/your-feature-name
# or
git checkout -b fix/bug-description
```

Use prefixes:
- `feature/` - New features
- `fix/` - Bug fixes
- `docs/` - Documentation updates
- `refactor/` - Code improvements
- `test/` - Test additions

### 2. Make Changes

- Write clear, concise code
- Follow the existing code style
- Add tests for new features
- Update documentation as needed

### 3. Test Your Changes

```bash
# Run linter
pnpm lint

# Run tests
pnpm test

# Build all packages
pnpm build

# Test locally
pnpm --filter @exe-pay/web dev
```

### 4. Commit Your Changes

We use conventional commits:

```bash
git commit -m "feat: add payment proof verification"
git commit -m "fix: resolve stealth address scanning issue"
git commit -m "docs: update API reference"
```

Commit message format:
- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation
- `refactor:` - Code refactoring
- `test:` - Adding tests
- `chore:` - Maintenance

### 5. Push and Create PR

```bash
git push origin feature/your-feature-name
```

Then create a Pull Request on GitHub with:
- Clear description of changes
- Link to related issues
- Screenshots (if UI changes)
- Test results

## 🏗️ Project Structure

### Packages

- `packages/core` - Core payment SDK
- `packages/privacy` - Privacy features (stealth addresses, proofs, subaddresses)
- `packages/react-hooks` - React integration
- `packages/utils` - Shared utilities

### Applications

- `apps/web` - Next.js web application
- `apps/docs` - Documentation site
- `apps/api` - REST API server
- `apps/demo` - CLI demo

### Scripts

- `scripts/dev-clean.sh` - Clean development start
- `scripts/switch-network.sh` - Network switching utility

## 📝 Coding Standards

### TypeScript

- Use TypeScript for all code
- Provide complete type definitions
- Avoid `any` types
- Use interface for public APIs

### Code Style

- Follow ESLint configuration
- Use Prettier for formatting
- Write descriptive variable names
- Add JSDoc comments for public APIs

### Testing

- Write tests for new features
- Maintain test coverage
- Test on both devnet and mainnet
- Include edge cases

## 🔒 Security

### Reporting Security Issues

If you discover a security vulnerability, please email **security@exepay.app** instead of creating a public issue.

### Security Guidelines

- Never commit private keys or secrets
- Use environment variables for sensitive data
- Follow Solana security best practices
- Test thoroughly on devnet first

## 📚 Documentation

### What to Document

- New features and APIs
- Breaking changes
- Configuration options
- Usage examples
- Migration guides

### Where to Document

- Code: JSDoc comments
- Package: README.md in package directory
- Project: `docs/` directory
- API: Update `apps/docs/src/app/api/`

## 🐛 Reporting Bugs

Use GitHub Issues with:
- Clear title
- Detailed description
- Steps to reproduce
- Expected vs actual behavior
- Environment details (OS, Node version, etc.)
- Error messages or screenshots

## 💡 Suggesting Features

We welcome feature suggestions! Please:
- Check existing issues first
- Provide clear use cases
- Explain the benefits
- Consider implementation complexity

## 🎯 Areas to Contribute

### High Priority

- Performance optimizations
- Mobile UI improvements
- Additional wallet integrations
- Documentation improvements

### Privacy Features (Advanced)

- Zero-knowledge proof implementations
- Additional cryptographic primitives
- Privacy protocol integrations

### Infrastructure

- CI/CD improvements
- Testing infrastructure
- Build optimizations

## ✅ Pull Request Checklist

Before submitting your PR, ensure:

- [ ] Code follows project style guidelines
- [ ] All tests pass (`pnpm test`)
- [ ] No linter errors (`pnpm lint`)
- [ ] Builds successfully (`pnpm build`)
- [ ] Documentation updated
- [ ] Commit messages follow conventions
- [ ] PR description is clear and complete

## 🤝 Review Process

1. **Automated Checks** - CI runs tests and linting
2. **Code Review** - Maintainers review code quality
3. **Testing** - Changes tested on devnet/mainnet
4. **Approval** - At least one maintainer approval required
5. **Merge** - Changes merged to main branch

## 📞 Questions?

- **GitHub Discussions**: For questions and discussions
- **GitHub Issues**: For bugs and feature requests  
- **Documentation**: https://docs.exepay.app
- **Email**: contact@exepay.app

## 📄 License

By contributing to ExePay, you agree that your contributions will be licensed under the MIT License.

---

**Thank you for contributing to ExePay!** 🎉

