import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ClientWalletProvider } from "@/components/ClientWalletProvider";
import { WalletConnectionGuard } from "@/components/WalletConnectionGuard";

const inter = Inter({ subsets: ["latin"] });

// Force all pages to use dynamic rendering - required for wallet adapter
export const dynamic = 'force-dynamic';
export const dynamicParams = true;

export const metadata: Metadata = {
  title: "ExePay - Privacy-Preserving Payments on Solana",
  description: "Send and receive private payments on Solana with zero-knowledge proofs. Stealth addresses, ZK compression, and batch payments.",
  keywords: ["Solana", "Privacy", "Payments", "Zero-Knowledge", "ZK-SNARKs", "Cryptocurrency", "Blockchain", "Stealth Addresses"],
  authors: [{ name: "ExePay" }],
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 5,
    userScalable: true,
  },
  themeColor: "#6366f1",
  manifest: "/manifest.json",
  icons: {
    icon: '/exepay-logo.png',
    apple: '/exepay-logo.png',
  },
  openGraph: {
    title: "ExePay - Privacy-Preserving Payments on Solana",
    description: "Send and receive private payments on Solana with zero-knowledge proofs",
    type: "website",
    url: "https://exepay.app",
    siteName: "ExePay",
  },
  twitter: {
    card: "summary_large_image",
    title: "ExePay - Privacy-Preserving Payments",
    description: "Private payments on Solana with zero-knowledge proofs",
    creator: "@exeinfra",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ClientWalletProvider>
          <WalletConnectionGuard>
            {children}
          </WalletConnectionGuard>
        </ClientWalletProvider>
      </body>
    </html>
  );
}

