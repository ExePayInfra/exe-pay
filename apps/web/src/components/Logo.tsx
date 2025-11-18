'use client';

import Image from 'next/image';

interface LogoProps {
  size?: number;
  className?: string;
  animated?: boolean;
  variant?: 'transparent' | 'full';
}

export function Logo({ size = 40, className = '', animated = false, variant = 'transparent' }: LogoProps) {
  const logoSrc = variant === 'full' ? '/exepay-logo-full.png' : '/exepay-logo.png';
  
  return (
    <div className={`relative ${className} ${animated ? 'hover:scale-105 transition-transform duration-300' : ''}`} style={{ width: size, height: size }}>
      <Image
        src={logoSrc}
        alt="ExePay Logo"
        fill
        className="object-contain"
        priority
      />
    </div>
  );
}

export function LogoText({ className = '' }: { className?: string }) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <Logo size={40} animated />
      <span className="text-2xl font-bold text-gray-900 tracking-tight">
        Exe<span className="text-blue-600">Pay</span>
      </span>
    </div>
  );
}

export function LogoIcon({ size = 24, className = '' }: { size?: number; className?: string }) {
  return (
    <div className={`relative ${className}`} style={{ width: size, height: size }}>
      <Image
        src="/exepay-logo.png"
        alt="ExePay Icon"
        fill
        className="object-contain"
      />
    </div>
  );
}

