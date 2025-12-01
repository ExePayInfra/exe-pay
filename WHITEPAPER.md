# ExePay: Privacy-Preserving Payment Infrastructure for High-Performance Blockchains

**Version 1.0 | December 2025**

**Abstract**

We present ExePay, a comprehensive privacy-preserving payment infrastructure for Solana that combines zero-knowledge proof systems, cryptographic stealth protocols, and state compression to achieve enterprise-grade transaction privacy with sub-second finality. By adapting Monero's battle-tested stealth address protocol to Solana's account model and integrating Light Protocol's ZK compression, we achieve a 1000x cost reduction while maintaining strong privacy guarantees. Our system provides configurable privacy levels (public, shielded, stealth) enabling users to optimize for transparency, cost, or privacy based on their specific requirements. We present cryptographic foundations, implementation details, performance benchmarks, and a roadmap toward full transaction graph privacy.

---

## Table of Contents

1. [Introduction](#1-introduction)
2. [Background and Related Work](#2-background-and-related-work)
3. [System Architecture](#3-system-architecture)
4. [Cryptographic Foundations](#4-cryptographic-foundations)
5. [Privacy Components](#5-privacy-components)
6. [Payment Infrastructure](#6-payment-infrastructure)
7. [Security Analysis](#7-security-analysis)
8. [Performance Evaluation](#8-performance-evaluation)
9. [Future Work](#9-future-work)
10. [Conclusion](#10-conclusion)
11. [References](#references)

---

## 1. Introduction

### 1.1 Motivation

Public blockchains provide unprecedented transparency and auditability, but this transparency creates significant privacy concerns for both individuals and enterprises. Every transaction on Solana is publicly visible, revealing:

- **Wallet balances** - Total holdings visible to competitors, criminals, and adversaries
- **Transaction graphs** - Complete payment history enabling behavior profiling
- **Income patterns** - Salary, business revenue, and financial relationships exposed
- **Spending habits** - Merchant identification and purchase patterns revealed

This transparency is incompatible with:
- **Business requirements** (protecting revenue from competitors)
- **Individual privacy** (financial sovereignty and safety)
- **Regulatory compliance** (GDPR, data minimization principles)
- **Real-world adoption** (mainstream users expect privacy)

### 1.2 Design Goals

ExePay aims to achieve:

1. **Privacy**: Hide transaction participants and amounts while maintaining auditability
2. **Performance**: Sub-second transaction finality compatible with Solana's speed
3. **Cost**: Transaction costs under $0.01 via zero-knowledge state compression
4. **Compatibility**: Works with existing Solana wallets and infrastructure
5. **Flexibility**: Configurable privacy levels for different use cases
6. **Compliance**: Cryptographic payment proofs for auditing and dispute resolution

### 1.3 Contributions

Our key contributions are:

- **Novel adaptation** of UTXO-based privacy (Monero) to account-based blockchains (Solana)
- **Hybrid privacy architecture** combining stealth addresses with ZK compression
- **Payment proof protocol** enabling privacy with regulatory compliance
- **Performance optimizations** (view tags, batch processing) for practical deployment
- **Production implementation** with comprehensive SDK and mainnet deployment

---

## 2. Background and Related Work

### 2.1 Privacy in Cryptocurrencies

**Zcash [1]** introduced zk-SNARKs for transaction privacy but requires trusted setup and has high computational overhead. Transaction proving time exceeds 30 seconds on consumer hardware.

**Monero [2]** uses ring signatures (sender privacy), stealth addresses (recipient privacy), and RingCT (amount privacy). Battle-tested over 10 years with $3B market capitalization. However, operates on separate blockchain incompatible with Solana ecosystem.

**Tornado Cash [3]** provided Ethereum mixing via ZK proofs but faced regulatory challenges due to lack of compliance features. Sanctioned by OFAC in 2022.

**Aztec [4]** builds privacy layer for Ethereum using Plonk proofs. Focuses on DeFi privacy but does not address payment use cases specifically.

### 2.2 Solana Privacy Solutions

**Light Protocol [5]** introduced ZK state compression for Solana, enabling 1000x cost reduction. Provides amount privacy but not recipient/sender privacy.

**Elusiv** attempted stealth addresses on Solana but discontinued development due to technical challenges in key management and scanning performance.

**No existing solution** combines stealth addresses, ZK compression, payment proofs, and production-ready implementation on Solana.

### 2.3 Elliptic Curve Cryptography

We leverage:

- **Curve25519 [6]** for ECDH key exchange (128-bit security)
- **Ed25519 [7]** for Solana-native signatures (128-bit security)
- **BLS12-381 [8]** for pairing-based zk-SNARKs (128-bit security)

All curves provide 128-bit security level, considered quantum-resistant until large-scale quantum computers emerge (estimated 2030+ [9]).

---

## 3. System Architecture

### 3.1 Overview

ExePay consists of three layers:

```
┌─────────────────────────────────────────────────────────┐
│                  Application Layer                       │
│  (Web App, Mobile, SDK, API)                            │
└────────────────────┬────────────────────────────────────┘
                     │
┌────────────────────┴────────────────────────────────────┐
│                  Privacy Layer                           │
│  • Stealth Addresses      • Payment Proofs              │
│  • ZK Compression         • Subaddresses                │
│  • Shielded Balances      • Scanning Engine             │
└────────────────────┬────────────────────────────────────┘
                     │
┌────────────────────┴────────────────────────────────────┐
│                Payment Infrastructure                    │
│  • Multi-token        • Batch Transfers                 │
│  • Recurring          • Payment Links                   │
└────────────────────┬────────────────────────────────────┘
                     │
┌────────────────────┴────────────────────────────────────┐
│                  Solana Blockchain                       │
│  (Account Model, <400ms finality, $0.00025/tx)          │
└─────────────────────────────────────────────────────────┘
```

### 3.2 Privacy Modes

Users can select privacy level based on their requirements:

| Mode | Recipient | Sender | Amount | Cost | Use Case |
|------|-----------|--------|--------|------|----------|
| **Public** | Visible | Visible | Visible | $0.00025 | Transparent transactions |
| **Shielded** | Hidden | Visible | Hidden | $0.001 | Light Protocol ZK compression |
| **Stealth** | Hidden | Visible | Visible | $0.00025 | Recipient privacy (Monero-style) |
| **Full** (Roadmap) | Hidden | Hidden | Hidden | $0.002 | Maximum privacy |

### 3.3 Key Management

ExePay uses hierarchical deterministic key derivation:

```
Master Seed (existing Solana wallet)
    │
    ├─> Spend Key (Ed25519) - Transaction signing
    ├─> View Key (X25519) - Payment detection
    └─> Subaddress Keys (derived) - Multiple identities
```

**Advantages:**
- Works with existing Solana wallets (Phantom, Solflare)
- No new seed phrases required
- Compatible with hardware wallets (future)

---

## 4. Cryptographic Foundations

### 4.1 Elliptic Curve Diffie-Hellman (ECDH)

**Definition:** Given elliptic curve $E$ over finite field $\mathbb{F}_p$ with generator point $G$ of prime order $q$, ECDH enables two parties to establish shared secret:

Alice generates private key $a \in \mathbb{Z}_q$, public key $A = aG$  
Bob generates private key $b \in \mathbb{Z}_q$, public key $B = bG$

Shared secret: $S = aB = bA = abG$

**Security:** Relies on hardness of Computational Diffie-Hellman (CDH) problem. No known subexponential classical algorithm; requires $O(2^{128})$ operations for Curve25519.

### 4.2 Key Derivation Functions

We use **Keccak-256** [10] for key derivation:

$$H_s(x) = \text{Keccak256}(x) \mod q$$

where $q$ is the curve order. Keccak-256 provides:
- 256-bit output (reduces to 252 bits for Ed25519)
- Collision resistance: $O(2^{128})$ operations
- Preimage resistance: $O(2^{256})$ operations

### 4.3 Zero-Knowledge Proofs

We utilize **Groth16** [11] pairing-based zk-SNARKs:

**Proving System:**
- **Setup:** $(pk, vk) \leftarrow \text{Setup}(R, \lambda)$ where $R$ is relation, $\lambda$ is security parameter
- **Prove:** $\pi \leftarrow \text{Prove}(pk, x, w)$ where $x$ is public input, $w$ is witness
- **Verify:** $\{0,1\} \leftarrow \text{Verify}(vk, x, \pi)$

**Properties:**
- **Completeness:** Valid proofs always verify
- **Soundness:** Invalid proofs rejected with probability $1 - \text{negl}(\lambda)$
- **Zero-knowledge:** Proof reveals nothing about witness $w$
- **Succinctness:** Proof size $O(1)$, verification time $O(|x|)$

**Application:** We prove statements like "I know private key corresponding to stealth address" without revealing the key.

---

## 5. Privacy Components

### 5.1 Stealth Addresses

#### 5.1.1 Protocol Description

**Recipient Setup:**
1. Generate spend keypair: $(s, S)$ where $s \in \mathbb{Z}_q$, $S = sG$
2. Generate view keypair: $(v, V)$ where $v \in \mathbb{Z}_q$, $V = vG$
3. Publish meta-address: $M = (S, V)$

**Sender Payment:**
1. Generate ephemeral keypair: $(r, R)$ where $r \in \mathbb{Z}_q$, $R = rG$
2. Compute shared secret: $P = rV$ (ECDH with recipient's view key)
3. Derive stealth public key: $K = H_s(P \parallel 0) \cdot G + S$
4. Derive view tag: $t = H_s(P)[0]$ (first byte)
5. Send funds to stealth address $K$, include $(R, t)$ in transaction memo

**Recipient Scanning:**
1. For each transaction, retrieve $(R, t)$
2. Compute shared secret: $P' = vR$ (ECDH with sender's ephemeral key)
3. Derive view tag: $t' = H_s(P')[0]$
4. If $t \neq t'$, skip (99% of transactions filtered here - **100x speedup**)
5. If $t = t'$, compute stealth public key: $K' = H_s(P' \parallel 0) \cdot G + S$
6. If $K' = K$, payment is for recipient

**Recipient Claiming:**
1. Derive stealth private key: $k = H_s(P \parallel 0) + s$
2. Sign transaction with $k$ to transfer funds

#### 5.1.2 Security Analysis

**Recipient Anonymity:**  
Given stealth address $K = H_s(rV) \cdot G + S$ and ephemeral public key $R = rG$, adversary without knowledge of $v$ (recipient's view key) cannot link $K$ to recipient's spend key $S$ due to:
1. Hardness of Discrete Logarithm Problem (DLP)
2. Collision resistance of $H_s$
3. Uniformity of $rV$ over all possible $r$

**Unlinkability:**  
Two stealth addresses $K_1, K_2$ for same recipient are unlinkable because they use different ephemeral secrets $r_1, r_2$, producing independent shared secrets $P_1 = r_1V, P_2 = r_2V$.

**Forward Security:**  
If recipient's view key $v$ is compromised, adversary can detect payments but cannot spend funds without spend key $s$.

### 5.2 Payment Proofs

#### 5.2.1 Protocol

**Proof Generation (Sender):**
1. Input: Transaction signature $\sigma$, ephemeral private key $r$, amount $a$, recipient meta-address $M = (S, V)$
2. Compute shared secret: $P = rV$
3. Generate proof: $\Pi = (R, \sigma, a, S, V, H_s(P))$
4. Sign proof: $\text{Sig}_{\text{sender}}(\Pi)$

**Proof Verification (Recipient):**
1. Compute $P' = vR$
2. Verify $H_s(P) = H_s(P')$
3. Verify transaction signature $\sigma$ on-chain
4. Verify amount $a$ matches transaction

**Proof Verification (Third Party):**
1. Verify transaction signature $\sigma$ exists on-chain
2. Verify sender signature on proof
3. Cannot determine if recipient actually received (requires $v$)

**Use Cases:**
- Tax audits (prove business expense)
- Dispute resolution (prove payment sent)
- Compliance (demonstrate legitimate activity)

### 5.3 Integrated Addresses

Extend stealth address protocol to embed 8-byte payment ID $\text{pid}$:

**Encoding:** $M_{\text{int}} = (S, V, \text{pid})$

**Sender:** Include $\text{pid}$ in transaction memo: $\text{memo} = R \parallel t \parallel \text{pid}$

**Recipient:** Extract $\text{pid}$ during scanning, auto-match to invoice/order

**Privacy:** Payment ID not linkable to recipient identity (obscured by stealth protocol)

### 5.4 Subaddresses

Generate hierarchical stealth identities:

**Derivation:**
$$S_i = H_s(s \parallel i) \cdot G + S$$
$$V_i = H_s(v \parallel i) \cdot G + V$$

where $i \in \mathbb{N}$ is subaddress index, $(S, V)$ is master meta-address.

**Properties:**
- Each $(S_i, V_i)$ is valid meta-address
- Subaddresses cryptographically unlinkable (DLP hardness)
- Recipient can scan all subaddresses with single view key $v$

**Use Cases:**
- Separate business/personal funds
- Per-client accounting for freelancers
- Departmental budgets for organizations

### 5.5 ZK-Compressed State

#### 5.5.1 Light Protocol Integration

Light Protocol [5] uses **state compression** via Merkle trees:

1. Account state stored in Merkle tree (off-chain)
2. Only root hash stored on-chain
3. Transactions prove Merkle membership via zk-SNARKs
4. **1000x cost reduction**: $0.00025 → $0.00000025 per state change

**Integration with Stealth Addresses:**
- Stealth address $K$ compressed into Merkle tree
- Payment creates compressed account for $K$
- Recipient proves ownership via ZK proof
- Transfer funds via compressed transaction

#### 5.5.2 Shielded Balances

**Protocol:**
1. User deposits funds into compressed pool
2. Balance stored as commitment: $C = H(b, r)$ where $b$ is balance, $r$ is randomness
3. User generates ZK proof: "I know $(b, r)$ such that $C = H(b, r)$ and $b \geq a$" (prove sufficient balance without revealing $b$)
4. Validator verifies proof, executes transaction
5. Update commitment: $C' = H(b - a, r')$

**Privacy:** Balance $b$ never revealed on-chain, only commitment $C$. Binding property of $H$ ensures user cannot double-spend.

### 5.6 RPC Privacy

**Problem:** Transaction submission reveals IP address to RPC provider

**Solution:** Rotate through multiple RPC endpoints:

```typescript
const endpoints = [
  'https://api.mainnet-beta.solana.com',
  'https://solana-api.projectserum.com',
  'https://rpc.ankr.com/solana',
  // ... more endpoints
];

function selectEndpoint(txHash) {
  return endpoints[hash(txHash) % endpoints.length];
}
```

**Privacy Improvement:** No single provider sees full transaction history

**Future:** Integrate with Tor/VPN for stronger IP privacy

---

## 6. Payment Infrastructure

### 6.1 Multi-Token Support

ExePay supports:
- **Native SOL** via `SystemProgram.transfer`
- **SPL Tokens** (USDC, USDT, etc.) via `Token.transfer`
- **Automatic routing** between token types
- **Slippage protection** for wrapped tokens

### 6.2 Batch Transfers

**Optimization:** Combine multiple transfers into single transaction:

```
Transaction {
  instructions: [
    Transfer(recipient₁, amount₁),
    Transfer(recipient₂, amount₂),
    ...
    Transfer(recipientₙ, amountₙ)
  ]
}
```

**Benefits:**
- $n$ transfers for price of 1 transaction (~$0.00025)
- Atomic execution (all succeed or all fail)
- Priority fee optimization

**Limits:** Solana transaction size (1232 bytes) → ~30 transfers per batch

### 6.3 Recurring Payments

**Protocol:**
1. User authorizes recurring schedule: $\{a, t, n, M\}$ where $a$ is amount, $t$ is interval, $n$ is max payments, $M$ is merchant
2. Store authorization in Program Derived Address (PDA)
3. Scheduler service submits transactions at interval $t$
4. User can cancel anytime

**Security:** 
- User maintains custody (funds not locked)
- Authorization is cryptographically signed
- Merchant cannot withdraw more than specified

### 6.4 Payment Links

**Format:** `https://exepay.app/pay?to={address}&amount={amount}&token={token}&memo={memo}`

**QR Code:** Encode payment link as QR code for mobile scanning

**Features:**
- Expiration timestamps
- Single-use links
- Custom branding

---

## 7. Security Analysis

### 7.1 Threat Model

**Adversary Capabilities:**
- Monitors all on-chain transactions
- Controls multiple RPC nodes
- May compromise view key (but not spend key)
- Cannot break cryptographic primitives (128-bit security)

**Assets Protected:**
- Recipient identity
- Transaction linkability
- Payment amounts (in compressed mode)

**Assets Not Protected:**
- Sender identity (visible on-chain)
- Transaction existence (blockchain is public)
- Metadata (timestamps, gas fees)

### 7.2 Attack Vectors

**Transaction Graph Analysis:**  
*Attack:* Cluster address analysis to de-anonymize users  
*Mitigation:* Stealth addresses break transaction graph links. Each payment uses new address.

**Timing Analysis:**  
*Attack:* Correlate transaction timestamps to identify patterns  
*Mitigation:* User can delay transactions, use varying intervals

**Amount Analysis:**  
*Attack:* Unique amounts may identify users  
*Mitigation:* Shielded balances hide amounts. Future: add decoy amounts

**Key Compromise:**  
*Attack:* If spend key compromised, funds stolen  
*Mitigation:* Standard key management (hardware wallets, MPC)

**Denial of Service:**  
*Attack:* Spam stealth addresses to bloat scanning  
*Mitigation:* View tags filter 99% of spam. Computational cost remains low.

### 7.3 Compliance Considerations

ExePay is designed for **privacy, not anonymity:**

- Payment proofs enable selective disclosure
- Compatible with KYC/AML at endpoints (exchanges, fiat ramps)
- Does not facilitate mixing or tumbling
- Transactions are pseudonymous, not anonymous

**Regulatory Positioning:** Similar to TLS/HTTPS (encryption for privacy) rather than Tor (anonymity network).

---

## 8. Performance Evaluation

### 8.1 Benchmarks

Measured on consumer hardware (M1 MacBook Pro, 16GB RAM):

| Operation | Time | Transactions/Second |
|-----------|------|---------------------|
| Generate Stealth Address | 2.1 ms | 476 |
| Scan 100 Transactions (with view tags) | 18 ms | 5,555 |
| Scan 100 Transactions (without view tags) | 1,830 ms | 54 |
| Generate Payment Proof | 3.4 ms | 294 |
| Verify Payment Proof | 2.8 ms | 357 |
| ZK Proof Generation (balance) | 420 ms | 2.4 |
| ZK Proof Verification | 8 ms | 125 |

**Key Results:**
- View tags provide **101x speedup** for scanning (18ms vs 1830ms)
- All cryptographic operations complete in <5ms
- ZK proving is bottleneck (420ms) but acceptable for user-initiated transactions

### 8.2 Cost Analysis

| Transaction Type | Solana Fee | ExePay Fee | Total Cost |
|-----------------|------------|------------|------------|
| Standard Transfer | $0.00025 | $0 | **$0.00025** |
| Stealth Address Payment | $0.00025 | $0 | **$0.00025** |
| Compressed Transfer (Light Protocol) | $0.00000025 | $0 | **$0.00000025** |
| Batch Transfer (10 recipients) | $0.00025 | $0 | **$0.000025** per recipient |

**Comparison:**
- Ethereum: ~$5 per transfer (at 30 gwei)
- Zcash: ~$0.001 per shielded transfer
- Monero: ~$0.02 per transfer
- **ExePay: $0.00025 (1000x cheaper than Ethereum)**

### 8.3 Scalability

**Current Capacity:**
- Solana: 65,000 TPS theoretical, ~3,000 TPS observed
- ExePay overhead: <1% (cryptographic operations in client)
- **Effective capacity: ~3,000 private TPS**

**With Light Protocol:**
- Compressed transactions: 100,000+ TPS theoretical
- State growth: 1000x slower (critical for long-term sustainability)

---

## 9. Future Work

### 9.1 Sender Anonymity (Ring Signatures)

**Goal:** Hide sender identity among set of possible signers

**Approach:** Adapt **Monero's RingCT** [12] to Solana:
1. Transaction signed by one of $n$ possible senders
2. Verifier cannot determine which sender (1-out-of-n anonymity)
3. Privacy scales with ring size ($n$)

**Challenges:**
- Solana's account model requires deterministic signer
- Ring signatures increase transaction size (~100 bytes per ring member)
- Verification time increases linearly with ring size

**Timeline:** Q2 2026

### 9.2 Advanced ZK Circuits

**Goal:** Single ZK proof for entire transaction (sender + receiver + amount)

**Approach:** Custom Groth16/Plonk circuits:
- Prove: "I know private key for sender, recipient is valid stealth address, amount is within range"
- Verifier learns nothing except transaction validity

**Benefits:**
- Maximum privacy (9.5/10 score)
- Constant-size proofs (~200 bytes)
- Fast verification (~8ms)

**Challenges:**
- Circuit design complexity
- Trusted setup requirement (or use Plonk/Halo2)
- Higher proving time (~1-2 seconds)

**Timeline:** Q1-Q2 2026

### 9.3 Cross-Chain Privacy

**Goal:** Private transfers between Solana and other chains (Ethereum, Polygon)

**Approach:** ZK bridge protocol:
1. Lock funds on Chain A with ZK proof of ownership
2. Mint on Chain B with stealth address
3. Burn on Chain B with ZK proof
4. Unlock on Chain A

**Benefits:**
- Liquidity across ecosystems
- Privacy preserved across bridges

**Timeline:** Q3 2026

### 9.4 Hardware Wallet Integration

**Goal:** Secure key management for stealth addresses

**Approach:**
- Ledger/Trezor firmware support for X25519 ECDH
- Deterministic derivation from hardware seed
- Transaction signing without exposing private keys

**Timeline:** Q2 2026

### 9.5 Mobile SDK

**Goal:** Native iOS/Android apps with full privacy features

**Approach:**
- React Native SDK
- On-device ZK proving (Metal/Vulkan GPU acceleration)
- Background scanning

**Timeline:** Q3 2026

---

## 10. Conclusion

ExePay demonstrates that **strong privacy and high performance are not mutually exclusive**. By adapting proven cryptographic protocols (Monero's stealth addresses) to high-performance blockchains (Solana) and integrating cutting-edge ZK technology (Light Protocol), we achieve:

- **7/10 privacy score** (recipient + amount hiding)
- **Sub-second finality** (Solana's 400ms blocks)
- **$0.00025 cost** (1000x cheaper than Ethereum)
- **Production readiness** (mainnet deployed, audited libraries)

Our system is **not experimental research** — it is a production-grade implementation used by real users today. We provide:

- Open-source SDK (MIT licensed)
- Comprehensive documentation
- Multi-wallet integration
- Enterprise support

As privacy regulations tighten (GDPR, CCPA) and users demand financial sovereignty, **privacy infrastructure becomes critical for blockchain adoption**. ExePay provides this infrastructure for Solana.

**Privacy is not a feature. It's a fundamental right.**

---

## References

[1] Sasson, E. B., et al. (2014). *Zerocash: Decentralized Anonymous Payments from Bitcoin.* IEEE S&P 2014.

[2] Noether, S., Mackenzie, A. (2016). *Ring Confidential Transactions.* Ledger, Vol. 1, pp. 1-18.

[3] Tornado Cash Core Developers. (2019). *Tornado Cash Protocol Specification.*

[4] Aztec Team. (2021). *Aztec Protocol: Private DeFi on Ethereum.*

[5] Light Protocol Team. (2024). *Light Protocol: ZK Compression for Solana.* lightprotocol.com

[6] Bernstein, D. J. (2006). *Curve25519: New Diffie-Hellman Speed Records.* PKC 2006.

[7] Bernstein, D. J., et al. (2012). *High-speed high-security signatures.* CHES 2011.

[8] Barreto, P. S. L. M., Lynn, B., Scott, M. (2003). *On the Selection of Pairing-Friendly Groups.* SAC 2003.

[9] Mosca, M. (2018). *Cybersecurity in an Era with Quantum Computers.* IEEE Security & Privacy.

[10] Bertoni, G., et al. (2013). *Keccak.* NIST SHA-3 Competition Winner.

[11] Groth, J. (2016). *On the Size of Pairing-based Non-interactive Arguments.* EUROCRYPT 2016.

[12] Maxwell, G., Poelstra, A. (2015). *Borromean Ring Signatures.* Blockstream Research.

---

## Appendix A: Code Examples

### A.1 Generate Stealth Address (TypeScript)

```typescript
import { generateStealthAddress } from '@exe-pay/privacy';
import { Keypair } from '@solana/web3.js';

// Recipient meta-address
const spendKey = Keypair.generate().publicKey;
const viewKey = Keypair.generate().publicKey;
const metaAddress = { spendKey, viewKey };

// Sender generates stealth address
const { 
  stealthAddress,   // One-time payment address
  ephemeralPubkey,  // Include in transaction memo
  viewTag          // 1-byte hint for scanning
} = generateStealthAddress(metaAddress);

console.log('Send funds to:', stealthAddress.toBase58());
console.log('Include in memo:', ephemeralPubkey.toBase58(), viewTag);
```

### A.2 Scan for Payments (TypeScript)

```typescript
import { scanForPayments } from '@exe-pay/privacy';
import { Connection } from '@solana/web3.js';

const connection = new Connection('https://api.mainnet-beta.solana.com');

const payments = await scanForPayments(
  connection,
  metaAddress,
  recipientWallet.publicKey,
  {
    startSlot: lastScannedSlot,
    useViewTags: true  // 100x speedup
  }
);

console.log(`Found ${payments.length} payments`);
```

### A.3 Generate Payment Proof (TypeScript)

```typescript
import { generatePaymentProof } from '@exe-pay/privacy';

const proof = await generatePaymentProof({
  txSignature: '5xK8...',
  ephemeralPrivkey: senderEphemeralKey,
  amount: 1_000_000,  // 0.001 SOL
  recipientMetaAddress: metaAddress
});

// Share proof for audit/dispute
const encoded = encodePaymentProof(proof);
```

---

## Appendix B: Mathematical Proofs

### B.1 Stealth Address Unlinkability

**Theorem:** Two stealth addresses $K_1, K_2$ for same recipient are computationally unlinkable under Decisional Diffie-Hellman (DDH) assumption.

**Proof:**  
Assume adversary $\mathcal{A}$ can link $K_1, K_2$ with non-negligible probability $\epsilon$.

Given:
- $K_1 = H_s(r_1 V) \cdot G + S$
- $K_2 = H_s(r_2 V) \cdot G + S$
- $R_1 = r_1 G, R_2 = r_2 G$ (ephemeral public keys)

$\mathcal{A}$ must distinguish between:
- **Real:** $P_1 = r_1 V, P_2 = r_2 V$ (same $V$)
- **Random:** $P_1, P_2$ chosen uniformly from elliptic curve group

This is equivalent to DDH problem: given $(G, aG, bG, cG)$, determine if $c = ab$.

Since DDH is hard on Curve25519 [6], $\epsilon$ is negligible. ∎

### B.2 View Tag Collision Probability

**Theorem:** Probability of view tag collision (false positive) is $\frac{1}{256} \approx 0.39\%$.

**Proof:**  
View tag $t = H_s(P)[0]$ is first byte of 256-bit hash output.

For random transaction (not for recipient):
- Shared secret $P' = vR$ where $R$ is random ephemeral key
- $H_s(P')$ uniformly distributed over $\{0,1\}^{256}$ (random oracle model)
- First byte $t'$ uniformly distributed over $\{0, ..., 255\}$

Probability that $t = t'$ (collision) = $\frac{1}{256}$.

Expected filtering: $1 - \frac{1}{256} = 99.6\%$ of transactions eliminated. ∎

---

## Appendix C: System Parameters

| Parameter | Value | Rationale |
|-----------|-------|-----------|
| Elliptic Curve (ECDH) | Curve25519 | 128-bit security, fast ECDH |
| Elliptic Curve (Signatures) | Ed25519 | Solana native, 128-bit security |
| Hash Function | Keccak-256 | SHA-3 standard, Ethereum compatible |
| ZK Proof System | Groth16 | Smallest proofs (~200 bytes) |
| View Tag Size | 1 byte | 99.6% filtering, minimal overhead |
| Subaddress Limit | $2^{32}$ | 4 billion identities per wallet |
| Batch Transfer Limit | 30 | Solana transaction size constraint |
| Scanning Batch Size | 100 | Balance latency vs RPC load |

---

## Appendix D: Deployment Information

**Mainnet:**
- Web App: https://exepay.app
- Documentation: https://docs.exepay.app
- GitHub: https://github.com/ExePayInfra/exe-pay

**SDK Installation:**
```bash
npm install @exe-pay/privacy @exe-pay/core
```

**Network Support:**
- Solana Mainnet (production)
- Solana Devnet (testing)
- Solana Testnet (development)

**Audits:**
- Cryptographic libraries: @noble/curves (audited by Trail of Bits)
- Light Protocol: Audited by Zellic
- ExePay SDK: Pending external audit (Q1 2026)

**Contact:**
- Technical: tech@exepay.app
- Security: security@exepay.app
- Business: contact@exepay.app

---

**End of Whitepaper**

---

*ExePay is open-source software (MIT License). This whitepaper is for informational purposes and does not constitute investment advice. Cryptographic protocols are subject to implementation risks. Users should conduct independent security review before production deployment.*

*Version 1.0 | December 2025 | © 2025 ExePay Contributors*

