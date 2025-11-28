/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@exe-pay/core', '@exe-pay/privacy', '@exe-pay/react-hooks', '@exe-pay/utils'],
  // Disable static optimization for wallet-dependent pages
  output: 'standalone',
  experimental: {
    isrMemoryCacheSize: 0, // Disable ISR caching
  },
  eslint: {
    // Disable ESLint during production builds
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Disable TypeScript errors during production builds
    ignoreBuildErrors: true,
  },
  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
    };
    return config;
  },
};

module.exports = nextConfig;

