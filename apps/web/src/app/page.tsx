'use client';

import { Navigation, Footer } from '@/components/Navigation';
import { useEffect, useState } from 'react';

export default function Home() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <main className="min-h-screen bg-white text-gray-900 overflow-hidden">
      <Navigation />

      {/* Animated Background Blobs */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-10 w-96 h-96 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-40 left-10 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-20 left-1/2 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      {/* Hero Section */}
      <section className="relative pt-20 pb-32 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center animate-fade-in-up">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 rounded-full mb-8 border border-indigo-100 animate-scale-in">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              <span className="text-sm font-semibold text-indigo-900">Powered by Light Protocol & Solana</span>
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold mb-6 leading-tight animate-fade-in-up stagger-1">
              Instant, Invisible Payments.
              <br />
              <span className="text-gradient-brand animate-gradient">Built for Privacy.</span>
            </h1>

            <p className="text-xl text-gray-600 mb-10 max-w-3xl mx-auto animate-fade-in-up stagger-2">
              Send SOL and tokens with complete privacy. Hide amounts, shield identities, and protect your financial data with zero-knowledge proofs on Solana.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up stagger-3">
              <a
                href="/wallet"
                className="btn-primary px-10 py-5 rounded-xl font-semibold text-lg inline-flex items-center gap-3 hover-lift group"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <span>Launch App</span>
              </a>
              <a
                href="https://docs.exepay.app"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-outline px-10 py-5 rounded-xl font-semibold text-lg inline-flex items-center gap-3 hover-scale"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span>Documentation</span>
              </a>
            </div>

            {/* Live Badge */}
            <div className="mt-12 inline-flex items-center gap-2 px-4 py-2 bg-green-50 rounded-full border border-green-200 animate-fade-in-up stagger-4">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
              </span>
              <span className="text-sm font-semibold text-green-900">✨ LIVE on Mainnet</span>
            </div>
          </div>
        </div>
      </section>

      {/* Ecosystem Partners - Sliding Carousel */}
      <section className="py-16 bg-gradient-to-r from-indigo-50 via-purple-50 to-blue-50 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
          <h3 className="text-center text-sm font-semibold text-gray-500 uppercase tracking-wider mb-8">
            Ecosystem & Partners
          </h3>
        </div>
        
        {/* Infinite Scroll Animation */}
        <div className="relative">
          <div className="flex animate-scroll-left">
            {/* First set */}
            <div className="flex items-center gap-16 px-8">
              <div className="flex flex-col items-center gap-2 min-w-[200px]">
                <div className="text-4xl font-bold text-indigo-600">Light Protocol</div>
                <span className="text-xs text-gray-500">ZK Compression</span>
              </div>
              <div className="flex flex-col items-center gap-2 min-w-[200px]">
                <div className="text-4xl font-bold text-purple-600">Solana</div>
                <span className="text-xs text-gray-500">Blockchain</span>
              </div>
              <div className="flex flex-col items-center gap-2 min-w-[200px]">
                <div className="text-4xl font-bold text-green-600">Pump.fun</div>
                <span className="text-xs text-gray-500">Token Launch</span>
              </div>
              <div className="flex flex-col items-center gap-2 min-w-[200px]">
                <div className="text-4xl font-bold text-blue-600">Helius</div>
                <span className="text-xs text-gray-500">RPC Provider</span>
              </div>
            </div>
            {/* Duplicate for seamless loop */}
            <div className="flex items-center gap-16 px-8">
              <div className="flex flex-col items-center gap-2 min-w-[200px]">
                <div className="text-4xl font-bold text-indigo-600">Light Protocol</div>
                <span className="text-xs text-gray-500">ZK Compression</span>
              </div>
              <div className="flex flex-col items-center gap-2 min-w-[200px]">
                <div className="text-4xl font-bold text-purple-600">Solana</div>
                <span className="text-xs text-gray-500">Blockchain</span>
              </div>
              <div className="flex flex-col items-center gap-2 min-w-[200px]">
                <div className="text-4xl font-bold text-green-600">Pump.fun</div>
                <span className="text-xs text-gray-500">Token Launch</span>
              </div>
              <div className="flex flex-col items-center gap-2 min-w-[200px]">
                <div className="text-4xl font-bold text-blue-600">Helius</div>
                <span className="text-xs text-gray-500">RPC Provider</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Code Demo Section - Sliding from Left */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left: Terminal Demo */}
            <div 
              className="relative animate-slide-in-left"
              style={{ transform: `translateX(${Math.min(scrollY / 10, 0)}px)` }}
            >
              <div className="glass-card p-6 rounded-2xl shadow-2xl hover-lift bg-gray-900">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <span className="ml-auto text-xs text-gray-400 font-mono">Terminal</span>
                </div>
                <pre className="text-sm font-mono overflow-x-auto text-green-400">
                  <code>
{`$ curl -X POST localhost:3000/pay
{
  "amount": "0.001",
  "token": "SOL",
  "recipient": "agent_wallet"
}

✓ Payment processed successfully
→ Transaction ID: 3x7f9...

$ _`}
                  </code>
                </pre>
              </div>
              <div className="absolute -bottom-4 -right-4 bg-green-500 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg animate-bounce">
                Live on Mainnet!
              </div>
            </div>

            {/* Right: Text */}
            <div className="animate-slide-in-right">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-purple-50 rounded-full mb-4 border border-purple-200">
                <span className="text-xs font-semibold text-purple-900">✨ LIVE</span>
              </div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Test X402 Payments, Zero Cost
              </h2>
              <p className="text-xl text-gray-600 mb-8">
                Run real X402 transactions against a live merchant—for free. Get 100% of your payment refunded, with ExePay covering the network fees.
              </p>
              <div className="space-y-4">
                {[
                  { icon: '⚡', text: 'Pay in <1 second' },
                  { icon: '💰', text: 'As little as $0.000001' },
                  { icon: '🔒', text: 'Fully private payments' },
                ].map((feature) => (
                  <div key={feature.text} className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center text-xl">
                      {feature.icon}
                    </div>
                    <span className="text-lg text-gray-700">{feature.text}</span>
                  </div>
                ))}
              </div>
              <div className="mt-8 flex gap-4">
                <a href="/wallet" className="btn-primary px-6 py-3 rounded-lg font-semibold hover-lift">
                  Try Now
                </a>
                <a href="https://docs.exepay.app" target="_blank" rel="noopener noreferrer" className="btn-outline px-6 py-3 rounded-lg font-semibold hover-scale">
                  Docs
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Digital Bank Cards Showcase */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-10 left-10 w-64 h-64 bg-white rounded-full filter blur-3xl animate-blob"></div>
          <div className="absolute bottom-10 right-10 w-64 h-64 bg-white rounded-full filter blur-3xl animate-blob animation-delay-2000"></div>
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16 animate-fade-in-up">
            <h2 className="text-4xl font-bold text-white mb-4">
              Your Private Digital Wallet
            </h2>
            <p className="text-xl text-white opacity-90 max-w-2xl mx-auto">
              Send, receive, and manage crypto with complete privacy. Like a Swiss bank account, but on-chain.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 items-center">
            {/* Card 1 - SOL Card */}
            <div className="animate-fade-in-up stagger-1 hover-lift">
              <div className="relative w-full h-56 rounded-3xl overflow-hidden shadow-2xl transform transition-all duration-300 hover:scale-105">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500 via-indigo-600 to-blue-700"></div>
                <div className="absolute inset-0 backdrop-blur-sm bg-white/10"></div>
                
                {/* Card Content */}
                <div className="relative h-full p-6 flex flex-col justify-between text-white">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="text-xs font-semibold opacity-75 mb-1">ExePay Private</div>
                      <div className="text-2xl font-bold">Solana</div>
                    </div>
                    <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center">
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z"/>
                      </svg>
                    </div>
                  </div>
                  
                  <div>
                    <div className="text-xs opacity-75 mb-2">Balance (Hidden)</div>
                    <div className="text-3xl font-bold mb-4">••••• SOL</div>
                    <div className="flex justify-between items-end">
                      <div>
                        <div className="text-xs opacity-75">Wallet</div>
                        <div className="text-sm font-mono">7xKX...9rX</div>
                      </div>
                      <div className="text-xs opacity-75">🔒 Private</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Card 2 - USDC Card */}
            <div className="animate-fade-in-up stagger-2 hover-lift">
              <div className="relative w-full h-56 rounded-3xl overflow-hidden shadow-2xl transform transition-all duration-300 hover:scale-105">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500 via-cyan-600 to-teal-700"></div>
                <div className="absolute inset-0 backdrop-blur-sm bg-white/10"></div>
                
                {/* Card Content */}
                <div className="relative h-full p-6 flex flex-col justify-between text-white">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="text-xs font-semibold opacity-75 mb-1">ExePay Stablecoin</div>
                      <div className="text-2xl font-bold">USDC</div>
                    </div>
                    <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center">
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                        <circle cx="12" cy="12" r="10"/>
                        <path fill="currentColor" d="M12 6v12m6-6H6"/>
                      </svg>
                    </div>
                  </div>
                  
                  <div>
                    <div className="text-xs opacity-75 mb-2">Balance (Shielded)</div>
                    <div className="text-3xl font-bold mb-4">$•••.••</div>
                    <div className="flex justify-between items-end">
                      <div>
                        <div className="text-xs opacity-75">Token Account</div>
                        <div className="text-sm font-mono">9pQ2...4sL</div>
                      </div>
                      <div className="text-xs opacity-75">🛡️ Shielded</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Card 3 - Multi-Token Card */}
            <div className="animate-fade-in-up stagger-3 hover-lift md:col-span-2 lg:col-span-1">
              <div className="relative w-full h-56 rounded-3xl overflow-hidden shadow-2xl transform transition-all duration-300 hover:scale-105">
                <div className="absolute inset-0 bg-gradient-to-br from-pink-500 via-rose-600 to-orange-700"></div>
                <div className="absolute inset-0 backdrop-blur-sm bg-white/10"></div>
                
                {/* Card Content */}
                <div className="relative h-full p-6 flex flex-col justify-between text-white">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="text-xs font-semibold opacity-75 mb-1">ExePay Multi-Token</div>
                      <div className="text-2xl font-bold">Portfolio</div>
                    </div>
                    <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center">
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z"/>
                      </svg>
                    </div>
                  </div>
                  
                  <div>
                    <div className="text-xs opacity-75 mb-2">Total Value (Anonymous)</div>
                    <div className="text-3xl font-bold mb-4">$••,•••.••</div>
                    <div className="flex justify-between items-end">
                      <div className="flex gap-2">
                        <span className="text-xs bg-white/20 px-2 py-1 rounded-full">SOL</span>
                        <span className="text-xs bg-white/20 px-2 py-1 rounded-full">USDC</span>
                        <span className="text-xs bg-white/20 px-2 py-1 rounded-full">+3</span>
                      </div>
                      <div className="text-xs opacity-75">🕶️ Anonymous</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Features below cards */}
          <div className="mt-16 grid md:grid-cols-3 gap-8 text-white">
            <div className="text-center animate-fade-in-up stagger-4">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold mb-2">Bank-Level Security</h3>
              <p className="text-sm opacity-90">Military-grade encryption protects every transaction</p>
            </div>
            <div className="text-center animate-fade-in-up stagger-5">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold mb-2">Instant Settlements</h3>
              <p className="text-sm opacity-90">Transactions confirm in under 1 second</p>
            </div>
            <div className="text-center animate-fade-in-up stagger-6">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold mb-2">Global Access</h3>
              <p className="text-sm opacity-90">Send anywhere, anytime, with no borders</p>
            </div>
          </div>
        </div>
      </section>

      {/* Privacy Modes - Cards sliding in */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-50 to-indigo-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 animate-fade-in-up">
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
                gradient: 'from-gray-400 to-gray-500',
                features: ['Visible amounts', 'Visible addresses', 'Instant & cheap'],
                delay: '0s',
              },
              {
                title: 'Shielded',
                desc: 'Hidden amounts',
                gradient: 'from-indigo-500 to-purple-600',
                features: ['Hidden amounts', 'Visible addresses', 'ZK-SNARK proofs'],
                badge: 'Popular',
                delay: '0.1s',
              },
              {
                title: 'Private',
                desc: 'Fully anonymous',
                gradient: 'from-purple-600 to-pink-600',
                features: ['Hidden amounts', 'Anonymous addresses', 'Maximum privacy'],
                badge: 'Recommended',
                delay: '0.2s',
              },
            ].map((mode) => (
              <div
                key={mode.title}
                className="relative group animate-fade-in-up"
                style={{ animationDelay: mode.delay }}
              >
                {mode.badge && (
                  <div className="absolute -top-3 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-semibold z-10 animate-bounce">
                    {mode.badge}
                  </div>
                )}
                <div className={`glass-card p-8 rounded-3xl hover-lift h-full bg-gradient-to-br ${mode.gradient} text-white transform transition-all duration-300 group-hover:scale-105`}>
                  <div className="w-16 h-16 bg-white bg-opacity-20 rounded-2xl flex items-center justify-center mb-6 text-3xl">
                    {mode.title === 'Public' && '👁️'}
                    {mode.title === 'Shielded' && '🔒'}
                    {mode.title === 'Private' && '🕶️'}
                  </div>
                  <h3 className="text-2xl font-bold mb-2">{mode.title}</h3>
                  <p className="text-sm opacity-90 mb-6">{mode.desc}</p>
                  <ul className="space-y-3">
                    {mode.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-2 text-sm">
                        <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Cryptography Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 animate-fade-in-up">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Powered by cryptography
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Military-grade encryption meets blockchain speed
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: '🔐', title: 'ZK-SNARKs', desc: 'Succinct proofs', delay: '0s' },
              { icon: '🔑', title: 'ElGamal', desc: 'Homomorphic encryption', delay: '0.1s' },
              { icon: '🌊', title: 'Poseidon', desc: 'ZK-friendly hashing', delay: '0.2s' },
              { icon: '🛡️', title: 'Groth16', desc: 'Proof system', delay: '0.3s' },
            ].map((tech) => (
              <div
                key={tech.title}
                className="glass-card p-6 rounded-2xl text-center hover-lift group animate-fade-in-up"
                style={{ animationDelay: tech.delay }}
              >
                <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform text-3xl">
                  {tech.icon}
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-1">{tech.title}</h3>
                <p className="text-sm text-gray-600">{tech.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-indigo-50 to-purple-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            {[
              { value: '<1s', label: 'Transaction Time', delay: '0s' },
              { value: '$0.0001', label: 'Average Fee', delay: '0.1s' },
              { value: '100%', label: 'Private', delay: '0.2s' },
              { value: '5+', label: 'Tokens Supported', delay: '0.3s' },
            ].map((stat) => (
              <div
                key={stat.label}
                className="animate-fade-in-up"
                style={{ animationDelay: stat.delay }}
              >
                <div className="text-5xl font-bold text-gradient-brand mb-2">{stat.value}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-indigo-600 to-purple-600 text-white">
        <div className="max-w-4xl mx-auto text-center animate-fade-in-up">
          <h2 className="text-4xl font-bold mb-6">
            Ready for true financial privacy?
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
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </a>
            <a
              href="https://docs.exepay.app"
              target="_blank"
              rel="noopener noreferrer"
              className="border-2 border-white text-white px-10 py-5 rounded-xl font-semibold text-lg inline-flex items-center gap-3 hover-scale"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span>Read Documentation</span>
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
