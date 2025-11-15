# Contributing to ExePay

Thank you for your interest in contributing to ExePay! This document provides guidelines for contributing to the project.

## 🚀 Getting Started

1. **Fork the repository**
2. **Clone your fork:**
   ```bash
   git clone https://github.com/YOUR_USERNAME/exe-pay.git
   cd exe-pay
   ```
3. **Install dependencies:**
   ```bash
   pnpm install
   ```
4. **Create a branch:**
   ```bash
   git checkout -b feature/your-feature-name
   ```

## 📋 Development Workflow

### Running the Project

```bash
# Run all packages in development mode
pnpm dev

# Run specific package
pnpm --filter @exe-pay/web dev

# Build all packages
pnpm build

# Run tests
pnpm test

# Lint code
pnpm lint
```

### Code Style

- We use **ESLint** and **Prettier** for code formatting
- Run `pnpm lint` before committing
- Follow TypeScript best practices
- Write meaningful commit messages

### Commit Messages

We follow [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: add new payment feature
fix: resolve wallet connection issue
docs: update API documentation
chore: update dependencies
```

## 🧪 Testing

- Write tests for new features
- Ensure all tests pass before submitting PR
- Test on both devnet and mainnet-beta (when applicable)

## 📝 Pull Request Process

1. **Update documentation** if needed
2. **Add tests** for new features
3. **Ensure CI passes** (linting, tests, build)
4. **Request review** from maintainers
5. **Address feedback** promptly

## 🔒 Security

- Never commit private keys or sensitive data
- Use environment variables for configuration
- Report security issues privately to: exechainlink@outlook.com

## 📚 Documentation

- Update `docs/` for new features
- Keep README.md current
- Add JSDoc comments for public APIs

## 🤝 Code of Conduct

- Be respectful and inclusive
- Provide constructive feedback
- Help others learn and grow

## 📞 Questions?

- Open an issue for bugs or feature requests
- Join our Discord for discussions
- Check `docs/` for detailed guides

---

**Thank you for contributing to ExePay!** 🎉

