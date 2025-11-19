import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ClientWalletProvider } from "@/components/ClientWalletProvider";
import { WalletConnectionGuard } from "@/components/WalletConnectionGuard";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ExePay - Privacy-Preserving Payments on Solana",
  description: "Send and receive private payments on Solana with zero-knowledge proofs",
  icons: {
    icon: '/exepay-logo.png',
    apple: '/exepay-logo.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Temporary mobile console for debugging */}
        <script src="https://cdn.jsdelivr.net/npm/eruda"></script>
        <script dangerouslySetInnerHTML={{ __html: `
          if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
            eruda.init();
          }
        ` }} />
      </head>
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

