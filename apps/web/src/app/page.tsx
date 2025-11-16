'use client';

import { Navigation, Footer } from '@/components/Navigation';
import { motion } from 'framer-motion';
import {
  ShieldCheckIcon,
  BoltIcon,
  CurrencyDollarIcon,
  CubeTransparentIcon,
  FingerPrintIcon,
  LockClosedIcon,
  CodeBracketIcon,
  SparklesIcon,
  ArrowPathIcon,
  CheckCircleIcon,
} from '@heroicons/react/24/outline';

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

export default function Home() {
  return (
    <main className="min-h-screen bg-white text-gray-900 overflow-hidden">
      <Navigation />

      {/* Animated Background Elements */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-10 w-72 h-72 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-40 left-10 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      {/* Hero Section */}
      <section className="relative pt-20 pb-32 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center"
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
          >
            <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 rounded-full mb-8 border border-indigo-100">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              <span className="text-sm font-semibold text-indigo-900">Production Ready • Zero-Knowledge Privacy</span>
            </motion.div>

            <motion.h1
              variants={fadeInUp}
              className="text-5xl sm:text-6xl lg:text-7xl font-extrabold mb-6 leading-tight"
            >
              Private payments
              <br />
              <span className="text-gradient-brand">made simple</span>
            </motion.h1>

            <motion.p
              variants={fadeInUp}
              className="text-xl text-gray-600 mb-10 max-w-3xl mx-auto"
            >
              Send SOL and tokens with complete privacy. Hide amounts, shield identities, and protect your financial data with zero-knowledge proofs on Solana.
            </motion.p>

            <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href="/wallet"
                className="btn-primary px-10 py-5 rounded-xl font-semibold text-lg inline-flex items-center gap-3 hover-lift group"
              >
                <span>Launch App</span>
                <SparklesIcon className="w-5 h-5 group-hover:rotate-12 transition-transform" />
              </a>
              <a
                href="https://docs.exepay.app"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-outline px-10 py-5 rounded-xl font-semibold text-lg inline-flex items-center gap-3 hover-scale"
              >
                <CodeBracketIcon className="w-5 h-5" />
                <span>View Docs</span>
              </a>
            </motion.div>

            {/* Trust Badges */}
            <motion.div variants={fadeInUp} className="mt-16 flex flex-wrap items-center justify-center gap-8 opacity-70">
              {['Light Protocol', 'Solana', 'ZK-SNARKs', 'ElGamal'].map((tech) => (
                <div key={tech} className="flex items-center gap-2">
                  <CheckCircleIcon className="w-5 h-5 text-green-600" />
                  <span className="text-sm font-medium text-gray-700">{tech}</span>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Code Snippet Showcase */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-50 to-indigo-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left: Text */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Developer-first privacy SDK
              </h2>
              <p className="text-xl text-gray-600 mb-8">
                Integrate private payments into your dApp with just a few lines of code. TypeScript SDK with React hooks included.
              </p>
              <div className="space-y-4">
                {[
                  { icon: BoltIcon, text: 'One-line integration' },
                  { icon: ShieldCheckIcon, text: 'Production-ready ZK proofs' },
                  { icon: CodeBracketIcon, text: 'Full TypeScript support' },
                ].map((feature) => (
                  <div key={feature.text} className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                      <feature.icon className="w-5 h-5 text-indigo-600" />
                    </div>
                    <span className="text-lg text-gray-700">{feature.text}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Right: Code Card */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative"
            >
              <div className="glass-card p-6 rounded-2xl shadow-2xl hover-lift">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <span className="ml-auto text-xs text-gray-500 font-mono">app.tsx</span>
                </div>
                <pre className="text-sm font-mono overflow-x-auto">
                  <code className="text-gray-800">
{`import { useSendTransaction } from '@exe-pay/react-hooks';

function PrivatePayment() {
  const { sendTransaction } = useSendTransaction();

  const sendPrivate = async () => {
    await sendTransaction({
      recipient: '7xKXt...9rX',
      amount: 0.1 * LAMPORTS_PER_SOL,
      privacyLevel: 'private' // ✨ That's it!
    });
  };

  return <button onClick={sendPrivate}>
    Send Private Payment
  </button>;
}`}
                  </code>
                </pre>
              </div>
              {/* Floating badge */}
              <div className="absolute -top-4 -right-4 bg-green-500 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg animate-bounce">
                Production Ready!
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Digital Card Visual Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Three levels of privacy
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Choose the right balance between transparency and anonymity for each transaction
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: 'Public',
                desc: 'Standard Solana transfers',
                icon: CurrencyDollarIcon,
                gradient: 'from-gray-400 to-gray-500',
                features: ['Visible amounts', 'Visible addresses', 'Instant & cheap'],
              },
              {
                title: 'Shielded',
                desc: 'Hidden amounts',
                icon: LockClosedIcon,
                gradient: 'from-indigo-500 to-purple-600',
                features: ['Hidden amounts', 'Visible addresses', 'ZK-SNARK proofs'],
                badge: 'Popular',
              },
              {
                title: 'Private',
                desc: 'Fully anonymous',
                icon: FingerPrintIcon,
                gradient: 'from-purple-600 to-pink-600',
                features: ['Hidden amounts', 'Anonymous addresses', 'Maximum privacy'],
                badge: 'Recommended',
              },
            ].map((mode, idx) => (
              <motion.div
                key={mode.title}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                className="relative group"
              >
                {mode.badge && (
                  <div className="absolute -top-3 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-semibold z-10">
                    {mode.badge}
                  </div>
                )}
                <div className={`glass-card p-8 rounded-3xl hover-lift h-full bg-gradient-to-br ${mode.gradient} text-white`}>
                  <mode.icon className="w-12 h-12 mb-6 opacity-90" />
                  <h3 className="text-2xl font-bold mb-2">{mode.title}</h3>
                  <p className="text-sm opacity-90 mb-6">{mode.desc}</p>
                  <ul className="space-y-3">
                    {mode.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-2 text-sm">
                        <CheckCircleIcon className="w-5 h-5 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Cryptographic Visual Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-indigo-50 to-purple-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Powered by cryptography
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Military-grade encryption meets blockchain speed
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: CubeTransparentIcon, title: 'ZK-SNARKs', desc: 'Succinct proofs' },
              { icon: LockClosedIcon, title: 'ElGamal', desc: 'Homomorphic encryption' },
              { icon: FingerPrintIcon, title: 'Poseidon', desc: 'ZK-friendly hashing' },
              { icon: ShieldCheckIcon, title: 'Groth16', desc: 'Proof system' },
            ].map((tech, idx) => (
              <motion.div
                key={tech.title}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="glass-card p-6 rounded-2xl text-center hover-lift group"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <tech.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-1">{tech.title}</h3>
                <p className="text-sm text-gray-600">{tech.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            {[
              { value: '<1s', label: 'Transaction Time' },
              { value: '$0.0001', label: 'Average Fee' },
              { value: '100%', label: 'Private' },
              { value: '5+', label: 'Tokens Supported' },
            ].map((stat, idx) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
              >
                <div className="text-5xl font-bold text-gradient-brand mb-2">{stat.value}</div>
                <div className="text-gray-600">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-indigo-600 to-purple-600 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl font-bold mb-6">
              Ready to experience true financial privacy?
            </h2>
            <p className="text-xl mb-10 opacity-90">
              Join ExePay and take control of your digital transactions on Solana.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href="/wallet"
                className="bg-white text-indigo-600 px-10 py-5 rounded-xl font-semibold text-lg inline-flex items-center gap-3 hover-lift"
              >
                <span>Get Started Now</span>
                <ArrowPathIcon className="w-5 h-5" />
              </a>
              <a
                href="https://docs.exepay.app"
                target="_blank"
                rel="noopener noreferrer"
                className="border-2 border-white text-white px-10 py-5 rounded-xl font-semibold text-lg inline-flex items-center gap-3 hover-scale"
              >
                <CodeBracketIcon className="w-5 h-5" />
                <span>Read Documentation</span>
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

