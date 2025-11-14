import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ClientWalletProvider } from "@/components/ClientWalletProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ExePay - Privacy-Preserving Payments on Solana",
  description: "Send and receive private payments on Solana with zero-knowledge proofs",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ClientWalletProvider>{children}</ClientWalletProvider>
      </body>
    </html>
  );
}

