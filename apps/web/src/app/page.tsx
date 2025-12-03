'use client';

import { Navigation, Footer } from '@/components/Navigation';
import { Stats } from '@/components/Stats';
import { useEffect, useState } from 'react';
import Image from 'next/image';

// Production v1.0.6 - Nov 30, 2025

// Partner logo configuration
const partners = [
  { name: 'Light Protocol', file: 'light-protocol', gradient: 'from-indigo-500 to-purple-600' },
  { name: 'Solana', file: 'solana', gradient: 'from-purple-600 to-cyan-400' },
  { name: 'Phantom', file: 'phantom', gradient: 'from-purple-500 to-indigo-600' },
  { name: 'Helius', file: 'helius', gradient: 'from-blue-500 to-cyan-500' },
  { name: 'Raydium', file: 'raydium', gradient: 'from-cyan-500 to-blue-600' },
  { name: 'Jupiter', file: 'jupiter', gradient: 'from-orange-500 to-yellow-500' },
  { name: 'Magic Eden', file: 'magic-eden', gradient: 'from-pink-500 to-purple-600' },
  { name: 'Pump.fun', file: 'pump-fun', gradient: 'from-green-500 to-emerald-600' },
];

// Partner Logo Component with fallback
function PartnerLogo({ partner, onError }: { partner: typeof partners[0]; onError: (file: string) => void }) {
  const [imageError, setImageError] = useState(false);
  const [pngError, setPngError] = useState(false);
  
  const handleSvgError = () => {
    setImageError(true);
    onError(partner.file);
  };

  const handlePngError = () => {
    setPngError(true);
  };

  // Use text-based logo for Light Protocol (no logo file available)
  const useTextLogo = partner.file === 'light-protocol' || (imageError && pngError);

  return (
    <div className="group cursor-pointer flex flex-col items-center gap-3" title={partner.name}>
      <div className="w-20 h-20 flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
        {useTextLogo ? (
          <div className={`w-full h-full rounded-full bg-gradient-to-br ${partner.gradient} shadow-lg flex items-center justify-center`}>
            <div className="text-white font-bold text-sm text-center px-2">
              {partner.name.split(' ').map(word => word[0]).join('')}
            </div>
          </div>
        ) : !imageError ? (
          <div className="relative w-full h-full">
            <Image
              src={`/logos/${partner.file}.svg`}
              alt={partner.name}
              fill
              className="object-contain"
              onError={handleSvgError}
              unoptimized
            />
          </div>
        ) : (
          <div className="relative w-full h-full">
            <Image
              src={`/logos/${partner.file}.png`}
              alt={partner.name}
              fill
              className="object-contain"
              onError={handlePngError}
              unoptimized
            />
          </div>
        )}
      </div>
      <span className="text-xs font-semibold text-gray-600 whitespace-nowrap group-hover:text-gray-800 transition-colors">
        {partner.name}
      </span>
    </div>
  );
}

export default function Home() {
  const [scrollY, setScrollY] = useState(0);
  const [logoErrors, setLogoErrors] = useState<Record<string, boolean>>({});

  const handleLogoError = (file: string) => {
    setLogoErrors(prev => ({ ...prev, [file]: true }));
  };

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

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold mb-6 leading-tight animate-fade-in-up stagger-1 animate-float-slow">
              Privacy-first payments
              <br />
              <span className="text-gradient-brand animate-gradient inline-block">with zero-knowledge proofs</span>
            </h1>

            <p className="text-xl text-gray-600 mb-10 max-w-3xl mx-auto animate-fade-in-up stagger-2">
              Send completely private payments on Solana. Hide amounts, shield identities, and protect your financial privacy with cutting-edge cryptography.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up stagger-3">
              <a
                href="/wallet"
                className="btn-primary px-10 py-5 rounded-xl font-semibold text-lg inline-flex items-center gap-3 group transition-all duration-300 hover:scale-105 hover:shadow-2xl"
              >
                <svg className="w-5 h-5 transition-transform duration-300 group-hover:rotate-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <span>Launch App</span>
              </a>
              <a
                href="https://docs.exepay.app"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-outline px-10 py-5 rounded-xl font-semibold text-lg inline-flex items-center gap-3 group transition-all duration-300 hover:scale-105 hover:border-indigo-600 hover:text-indigo-700"
              >
                <svg className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span>Documentation</span>
              </a>
            </div>

            {/* Live Badge and Token Link */}
            <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-3 animate-fade-in-up stagger-4">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-50 rounded-full border border-green-200">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                </span>
                <span className="text-sm font-semibold text-green-900">Live on Mainnet</span>
              </div>
              
              <a
                href="https://dexscreener.com/solana/6iguzmhnkhnzehesmznacpvtrwffsyjdjbhviij1fucr"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 rounded-full border border-purple-700 shadow-lg transition-all duration-300 hover:scale-105 group"
                title="Trade $EXE Token"
              >
                <span className="text-xl">🪙</span>
                <span className="text-sm font-semibold text-white">$EXE Token</span>
                <svg className="w-4 h-4 text-white transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Powered By - Clean Marquee with Official Partner Logos */}
      <section className="py-20 bg-gray-50 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
          <h3 className="text-center text-sm font-semibold text-gray-400 uppercase tracking-wider">
            Powered By Leading Protocols
          </h3>
        </div>
        
        {/* Infinite Marquee */}
        <div className="relative">
          {/* Fade overlays */}
          <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-gray-50 to-transparent z-10"></div>
          <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-gray-50 to-transparent z-10"></div>
          
          <div className="flex animate-scroll-left">
            {/* Set 1 */}
            <div className="flex items-center gap-16 px-8 shrink-0">
              {partners.map((partner) => (
                <PartnerLogo key={`set1-${partner.file}`} partner={partner} onError={handleLogoError} />
              ))}
            </div>
            
            {/* Set 2 - Duplicate for seamless scroll */}
            <div className="flex items-center gap-16 px-8 shrink-0">
              {partners.map((partner) => (
                <PartnerLogo key={`set2-${partner.file}`} partner={partner} onError={handleLogoError} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Overview Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-900 via-indigo-900 to-purple-900 relative overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-96 h-96 bg-blue-500 rounded-full filter blur-3xl animate-blob"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500 rounded-full filter blur-3xl animate-blob animation-delay-2000"></div>
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16 animate-fade-in-up">
            <h2 className="text-4xl font-bold text-white mb-4">
              Everything you need for private payments
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Built on Solana for speed, powered by cryptography for privacy.
            </p>
          </div>

          {/* Feature Cards */}
          <div className="grid md:grid-cols-3 gap-8 text-white">
            <div className="text-center animate-fade-in-up stagger-4 group cursor-pointer">
              <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:shadow-2xl group-hover:rotate-6">
                <svg className="w-8 h-8 transition-transform duration-300 group-hover:scale-110" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold mb-2 transition-colors duration-300 group-hover:text-indigo-300">Zero-Knowledge Proofs</h3>
              <p className="text-sm text-gray-300 transition-colors duration-300 group-hover:text-gray-200">Cryptographic privacy without compromising security</p>
            </div>
            <div className="text-center animate-fade-in-up stagger-5 group cursor-pointer">
              <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:shadow-2xl group-hover:rotate-6">
                <svg className="w-8 h-8 transition-transform duration-300 group-hover:scale-110" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold mb-2 transition-colors duration-300 group-hover:text-cyan-300">Lightning Fast</h3>
              <p className="text-sm text-gray-300 transition-colors duration-300 group-hover:text-gray-200">Transactions confirm in under 1 second on Solana</p>
            </div>
            <div className="text-center animate-fade-in-up stagger-6 group cursor-pointer">
              <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-rose-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:shadow-2xl group-hover:rotate-6">
                <svg className="w-8 h-8 transition-transform duration-300 group-hover:scale-110" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold mb-2 transition-colors duration-300 group-hover:text-pink-300">Multi-Token Support</h3>
              <p className="text-sm text-gray-300 transition-colors duration-300 group-hover:text-gray-200">SOL, USDC, USDT, and custom SPL tokens</p>
            </div>
          </div>
        </div>
      </section>

      {/* Code Demo Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-50 to-indigo-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left: Text */}
            <div className="animate-slide-in-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 rounded-full mb-4 border border-indigo-200">
                <span className="text-xs font-semibold text-indigo-900">Developer SDK</span>
              </div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Privacy in three lines of code
              </h2>
              <p className="text-xl text-gray-600 mb-8">
                Integrate private payments into your dApp with our TypeScript SDK. Full React hooks support included.
              </p>
              <div className="space-y-4">
                {[
                  { title: 'TypeScript SDK', desc: 'Fully typed for better DX' },
                  { title: 'React Hooks', desc: 'Drop-in components' },
                  { title: 'Light Protocol', desc: 'Built on audited infrastructure' },
                ].map((feature) => (
                  <div key={feature.title} className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                      <svg className="w-5 h-5 text-indigo-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{feature.title}</h3>
                      <p className="text-sm text-gray-600">{feature.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-8 flex gap-4">
                <a href="/wallet" className="btn-primary px-6 py-3 rounded-lg font-semibold hover-lift">
                  Try Now
                </a>
                <a href="https://docs.exepay.app" target="_blank" rel="noopener noreferrer" className="btn-outline px-6 py-3 rounded-lg font-semibold hover-scale">
                  Read Docs
                </a>
              </div>
            </div>

            {/* Right: Code Card */}
            <div className="animate-slide-in-right">
              <div className="glass-card p-6 rounded-2xl shadow-2xl hover-lift bg-gray-900">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <span className="ml-auto text-xs text-gray-400 font-mono">app.tsx</span>
                </div>
                <pre className="text-sm font-mono overflow-x-auto">
                  <code>
<span className="text-purple-400">import</span> <span className="text-yellow-300">{'{ useSendTransaction }'}</span> <span className="text-purple-400">from</span> <span className="text-green-400">'@exe-pay/react-hooks'</span><span className="text-gray-400">;</span>

<span className="text-purple-400">function</span> <span className="text-blue-400">PrivatePayment</span><span className="text-gray-400">() {'{'}</span>
  <span className="text-purple-400">const</span> <span className="text-gray-400">{'{'}</span> <span className="text-blue-300">sendTransaction</span> <span className="text-gray-400">{'}'} =</span> <span className="text-blue-400">useSendTransaction</span><span className="text-gray-400">();</span>

  <span className="text-purple-400">const</span> <span className="text-blue-400">sendPrivate</span> <span className="text-purple-400">=</span> <span className="text-purple-400">async</span> <span className="text-gray-400">() {'=>'} {'{'}</span>
    <span className="text-purple-400">await</span> <span className="text-blue-300">sendTransaction</span><span className="text-gray-400">({'{'}</span>
      <span className="text-blue-300">recipient</span><span className="text-gray-400">:</span> <span className="text-green-400">'7xKXt...9rX'</span><span className="text-gray-400">,</span>
      <span className="text-blue-300">amount</span><span className="text-gray-400">:</span> <span className="text-orange-400">0.1</span> <span className="text-gray-400">*</span> <span className="text-blue-300">LAMPORTS_PER_SOL</span><span className="text-gray-400">,</span>
      <span className="text-blue-300">privacyLevel</span><span className="text-gray-400">:</span> <span className="text-green-400">'private'</span> <span className="text-gray-500">// ✨ That's it!</span>
    <span className="text-gray-400">{'}'});</span>
  <span className="text-gray-400">{'}'}</span>

  <span className="text-purple-400">return</span> <span className="text-gray-400">&lt;</span><span className="text-pink-400">button</span> <span className="text-blue-300">onClick</span><span className="text-gray-400">={'{'}</span><span className="text-blue-300">sendPrivate</span><span className="text-gray-400">{'}'}&gt;</span>
    <span className="text-gray-300">Send Private Payment</span>
  <span className="text-gray-400">&lt;/</span><span className="text-pink-400">button</span><span className="text-gray-400">&gt;;</span>
<span className="text-gray-400">{'}'}</span>
                  </code>
                </pre>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Privacy Modes */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gray-900">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 animate-fade-in-up">
            <h2 className="text-4xl font-bold text-white mb-4">
              Choose your privacy level
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              From transparent to completely anonymous. You decide how much privacy you need.
            </p>
          </div>

          {/* Key Features Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {/* ExePay Logo Card - Blue */}
            <div className="p-6 rounded-2xl animate-fade-in-up text-center perspective-1000 bg-gradient-to-br from-blue-600 to-indigo-600 shadow-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl group cursor-pointer" style={{ animationDelay: '0s' }}>
              <div className="relative w-full h-20 mb-3 transition-all duration-700 group-hover:scale-110" style={{ transformStyle: 'preserve-3d' }}>
                <Image
                  src="/exepay-logo.png"
                  alt="ExePay"
                  fill
                  className="object-contain"
                  style={{ 
                    filter: 'brightness(0) saturate(100%) invert(100%) drop-shadow(0 10px 20px rgba(255, 255, 255, 0.3))'
                  }}
                />
              </div>
              <h3 className="font-bold text-black mb-2">ExePay Platform</h3>
              <p className="text-sm text-black">Privacy-first payment infrastructure</p>
            </div>
            
            {/* Instant Settlement - Purple Gradient */}
            <div className="p-6 rounded-2xl animate-fade-in-up text-center bg-gradient-to-br from-indigo-600 to-purple-600 shadow-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl group cursor-pointer" style={{ animationDelay: '0.1s' }}>
              <div className="text-4xl mb-3 transition-transform duration-300 group-hover:scale-125">⚡</div>
              <h3 className="font-bold text-white mb-2">Instant Settlement</h3>
              <p className="text-sm text-white/90">Transactions confirm in &lt;1 second</p>
            </div>
            
            {/* Ultra-Low Fees - White */}
            <div className="glass-card p-6 rounded-2xl animate-fade-in-up text-center shadow-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl group cursor-pointer" style={{ animationDelay: '0.2s' }}>
              <div className="text-4xl mb-3 transition-transform duration-300 group-hover:scale-125">💰</div>
              <h3 className="font-bold text-gray-900 mb-2">Ultra-Low Fees</h3>
              <p className="text-sm text-gray-600">Average cost: $0.0001 per transaction</p>
            </div>
            
            {/* Zero-Knowledge - Indigo Gradient */}
            <div className="p-6 rounded-2xl animate-fade-in-up text-center bg-gradient-to-br from-purple-600 to-indigo-600 shadow-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl group cursor-pointer" style={{ animationDelay: '0.3s' }}>
              <div className="text-4xl mb-3 transition-transform duration-300 group-hover:scale-125">🔒</div>
              <h3 className="font-bold text-white mb-2">Zero-Knowledge</h3>
              <p className="text-sm text-white/90">Prove without revealing data</p>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: 'ExePay Wallet',
                desc: 'Multi-token digital wallet',
                gradient: 'from-slate-700 to-slate-900',
                features: null,
                delay: '0s',
                isWalletCard: true,
              },
              {
                title: 'Light Protocol',
                desc: 'On-chain ZK privacy',
                gradient: 'from-indigo-500 to-purple-600',
                features: ['ZK compression', 'Hidden amounts', 'Beta on Devnet'],
                badge: 'Popular',
                delay: '0.1s',
                visualDesc: 'On-chain privacy with ZK-SNARKs - Complete transaction compression',
              },
              {
                title: 'Stealth Addresses',
                desc: 'Off-chain privacy',
                gradient: 'from-purple-600 to-pink-600',
                features: ['One-time addresses', 'Hidden recipients', 'Live on Mainnet'],
                badge: 'Recommended',
                delay: '0.2s',
                visualDesc: 'Monero-style stealth addresses - Complete recipient anonymity',
              },
            ].map((mode) => (
              <div
                key={mode.title}
                className="relative group animate-fade-in-up"
                style={{ animationDelay: mode.delay }}
              >
                <div className={`p-8 rounded-3xl hover-lift h-full bg-gradient-to-br ${mode.gradient} text-white transform transition-all duration-300 group-hover:scale-105 relative overflow-hidden shadow-2xl`}>
                  {mode.isWalletCard ? (
                    // Wallet Card with Mini Stacked Cards
                    <div className="relative h-full flex flex-col">
                      <h3 className="text-2xl font-bold mb-2">{mode.title}</h3>
                      <p className="text-sm opacity-90 mb-6">{mode.desc}</p>
                      
                      {/* Mini Stacked Cards */}
                      <div className="relative flex-1 min-h-[280px]">
                        {/* Card 3 - Back */}
                        <div className="absolute top-12 left-1/2 -translate-x-1/2 w-[90%] h-32 rounded-2xl shadow-xl transition-all duration-300 hover:z-30 hover:scale-105 hover:rotate-0" style={{ transform: 'translateX(-50%) rotate(-4deg)', zIndex: 1 }}>
                          <div className="absolute inset-0 bg-gradient-to-br from-pink-500 to-orange-600 rounded-2xl"></div>
                          <div className="relative h-full p-4 flex flex-col justify-between text-white text-xs">
                            <div className="flex justify-between items-start">
                              <div>
                                <div className="opacity-75 mb-1">Portfolio</div>
                                <div className="text-sm font-bold">Multi-Token</div>
                              </div>
                              <div className="w-6 h-6 rounded bg-white/20 backdrop-blur-md flex items-center justify-center">
                                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                              </div>
                            </div>
                            <div className="text-xs">
                              <div className="opacity-75 mb-1">Balance</div>
                              <div className="font-mono blur-sm">$12,847</div>
                            </div>
                          </div>
                        </div>
                        
                        {/* Card 2 - Middle */}
                        <div className="absolute top-6 left-1/2 -translate-x-1/2 w-[90%] h-32 rounded-2xl shadow-xl transition-all duration-300 hover:z-30 hover:scale-105 hover:rotate-0" style={{ transform: 'translateX(-50%) rotate(2deg)', zIndex: 2 }}>
                          <div className="absolute inset-0 bg-gradient-to-br from-cyan-500 to-indigo-600 rounded-2xl"></div>
                          <div className="relative h-full p-4 flex flex-col justify-between text-white text-xs">
                            <div className="flex justify-between items-start">
                              <div>
                                <div className="opacity-75 mb-1">Stablecoin</div>
                                <div className="text-sm font-bold">USDC</div>
                              </div>
                              <div className="w-6 h-6 rounded bg-white/20 backdrop-blur-md flex items-center justify-center">
                                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2" />
                                </svg>
                              </div>
                            </div>
                            <div className="flex justify-between items-end">
                              <div className="font-mono blur-sm text-sm">$5,234</div>
                              <div className="text-xs bg-white/20 px-2 py-0.5 rounded-full">Shielded</div>
                            </div>
                          </div>
                        </div>
                        
                        {/* Card 1 - Front (with ExePay branding) */}
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[90%] h-32 rounded-2xl shadow-xl transition-all duration-300" style={{ zIndex: 3 }}>
                          <div className="absolute inset-0 bg-gradient-to-br from-purple-500 via-indigo-600 to-blue-600 rounded-2xl"></div>
                          <div className="relative h-full p-4 flex flex-col justify-between text-white text-xs">
                            <div className="flex justify-between items-start">
                              <div>
                                <div className="opacity-75 mb-1">ExePay Private</div>
                                <div className="text-sm font-bold">Solana</div>
                              </div>
                              <div className="w-6 h-6 rounded bg-white/20 backdrop-blur-md flex items-center justify-center">
                                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                </svg>
                              </div>
                            </div>
                            <div className="flex justify-between items-end">
                              <div>
                                <div className="opacity-75 mb-1">Private Balance</div>
                                <div className="font-mono blur-sm text-sm">2.47 SOL</div>
                              </div>
                              <div className="text-xs bg-white/20 px-2 py-0.5 rounded-full">Private</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    // Regular Privacy Mode Card
                    <>
                      {/* Animated background pattern */}
                      <div className="absolute inset-0 opacity-10">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-full filter blur-3xl animate-pulse"></div>
                        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white rounded-full filter blur-2xl animate-pulse animation-delay-2000"></div>
                      </div>
                      
                      {/* Icon with graphic */}
                      <div className="relative mb-6">
                        <div className={`w-20 h-20 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center mx-auto group-hover:rotate-12 transition-transform duration-300`}>
                          {mode.title === 'Light Protocol' && (
                            <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z"/>
                            </svg>
                          )}
                          {mode.title === 'Stealth Addresses' && (
                            <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zM9 6c0-1.66 1.34-3 3-3s3 1.34 3 3v2H9V6zm9 14H6V10h12v10zm-6-3c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2z"/>
                            </svg>
                          )}
                        </div>
                        {/* Decorative circles */}
                        <div className="absolute -top-2 -right-2 w-6 h-6 bg-white/30 rounded-full animate-ping"></div>
                        <div className="absolute -bottom-2 -left-2 w-4 h-4 bg-white/30 rounded-full animate-ping animation-delay-2000"></div>
                      </div>
                      
                      <div className="relative z-10">
                        <h3 className="text-2xl font-bold mb-2">{mode.title}</h3>
                        <p className="text-sm opacity-90 mb-4">{mode.desc}</p>
                        
                        {/* Visual Description Box */}
                        <div className="mb-6 p-3 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20">
                          <p className="text-xs font-semibold opacity-90">{mode.visualDesc}</p>
                        </div>
                        
                        <ul className="space-y-3">
                          {mode.features.map((feature, idx) => (
                            <li key={feature} className="flex items-center gap-2 text-sm animate-fade-in-up" style={{ animationDelay: `${idx * 0.1}s` }}>
                              <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                              </svg>
                              <span>{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Cryptography Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-indigo-50 to-purple-50">
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
              { gradient: 'from-purple-500 to-indigo-600', title: 'ZK-SNARKs', desc: 'Zero-knowledge proofs', delay: '0s' },
              { gradient: 'from-cyan-500 to-blue-600', title: 'Keccak-256', desc: 'Cryptographic hashing', delay: '0.1s' },
              { gradient: 'from-pink-500 to-rose-600', title: 'Pedersen', desc: 'Commitment scheme', delay: '0.2s' },
              { gradient: 'from-indigo-500 to-purple-600', title: 'Nullifiers', desc: 'Double-spend prevention', delay: '0.3s' },
            ].map((tech) => (
              <div
                key={tech.title}
                className="glass-card p-6 rounded-2xl text-center hover-lift group animate-fade-in-up"
                style={{ animationDelay: tech.delay }}
              >
                <div className={`w-16 h-16 bg-gradient-to-br ${tech.gradient} rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform shadow-lg`}>
                  <span className="text-2xl font-bold text-white">{tech.title[0]}</span>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-1">{tech.title}</h3>
                <p className="text-sm text-gray-600">{tech.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section - Compact & Animated */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-indigo-50 to-purple-50">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { value: '<1s', label: 'Speed', icon: '⚡', delay: '0s' },
              { value: '$0.0001', label: 'Fee', icon: '💰', delay: '0.1s' },
              { value: '100%', label: 'Private', icon: '🔒', delay: '0.2s' },
              { value: '5+', label: 'Tokens', icon: '🪙', delay: '0.3s' },
            ].map((stat) => (
              <div
                key={stat.label}
                className="glass-card p-4 rounded-xl text-center hover-lift animate-fade-in-up group"
                style={{ animationDelay: stat.delay }}
              >
                <div className="text-2xl mb-2 group-hover:scale-110 transition-transform">{stat.icon}</div>
                <div className="text-3xl font-bold text-gradient-brand mb-1">{stat.value}</div>
                <div className="text-xs text-gray-600 font-medium">{stat.label}</div>
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

      {/* Stats Section */}
      <Stats />

      <Footer />
    </main>
  );
}
