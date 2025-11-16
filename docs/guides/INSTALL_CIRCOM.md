# Install circom Compiler - Step by Step Guide

**For macOS ARM64 (M1/M2/M3)**

---

## Option 1: Install via Homebrew (Easiest - Recommended)

```bash
# Install circom
brew install circom

# Verify installation
circom --version
```

**Expected output**: `circom compiler 2.1.x`

---

## Option 2: Install via Rust (Most Reliable)

### Step 1: Install Rust (if not already installed)

```bash
# Install Rust
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh

# Follow the prompts, then:
source $HOME/.cargo/env

# Verify Rust installation
rustc --version
cargo --version
```

### Step 2: Clone and Build circom

```bash
# Clone circom repository
cd /tmp
git clone https://github.com/iden3/circom.git
cd circom

# Build circom (this will take 5-10 minutes)
cargo build --release

# Install circom
cargo install --path circom

# Verify installation
circom --version
```

**Expected output**: `circom compiler 2.1.x`

---

## Option 3: Download Pre-built Binary (Manual)

### Step 1: Download

Visit: https://github.com/iden3/circom/releases/latest

Download: `circom-macos-arm64`

### Step 2: Install

```bash
# Move to Downloads
cd ~/Downloads

# Make executable
chmod +x circom-macos-arm64

# Move to /usr/local/bin (requires password)
sudo mv circom-macos-arm64 /usr/local/bin/circom

# Verify
circom --version
```

---

## After Installing circom

Once circom is installed, come back and run:

```bash
cd /Users/kingchief/Documents/EXE

# Install snarkjs
pnpm add -D snarkjs

# Run the setup script
cd packages/privacy/circuits
./setup-circuits.sh
```

---

## Quick Test

To verify circom is working:

```bash
# Create a test circuit
echo 'template Multiplier() {
    signal input a;
    signal input b;
    signal output c;
    c <== a * b;
}
component main = Multiplier();' > test.circom

# Compile it
circom test.circom --r1cs --wasm

# If successful, you'll see output files
ls test.r1cs test.wasm test_js/

# Clean up
rm -rf test.circom test.r1cs test.wasm test_js/ test.sym
```

---

## Troubleshooting

### "circom: command not found"
- Make sure `/usr/local/bin` is in your PATH
- Try: `echo $PATH | grep /usr/local/bin`
- If not, add to `~/.zshrc`: `export PATH="/usr/local/bin:$PATH"`

### "Permission denied"
- Use `sudo` when moving to `/usr/local/bin`
- Or install via Homebrew (no sudo needed)

### Homebrew install fails
- Update Homebrew: `brew update`
- Try: `brew install --HEAD circom`

---

**Recommended**: Use Option 1 (Homebrew) - it's the fastest and easiest!

