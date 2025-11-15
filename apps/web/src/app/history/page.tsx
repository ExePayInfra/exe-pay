"use client";

import { useState } from "react";
import { Connection, PublicKey } from "@solana/web3.js";
import { fetchTransactionHistory, exportTransactionsToCSV, downloadCSV } from "@exe-pay/core";
import type { TransactionRecord } from "@exe-pay/core";
import { TransactionList } from "@/components/TransactionList";
import { Navigation, Footer } from '@/components/Navigation';

export default function HistoryPage() {
  const [address, setAddress] = useState("");
  const [transactions, setTransactions] = useState<TransactionRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleFetch = async () => {
    if (!address.trim()) {
      setError("Please enter a wallet address");
      return;
    }

    setLoading(true);
    setError("");
    setTransactions([]);

    try {
      // Validate address
      let publicKey: PublicKey;
      try {
        publicKey = new PublicKey(address.trim());
      } catch {
        throw new Error("Invalid Solana wallet address");
      }

      // Connect to Solana using environment variable or default
      const rpcUrl = process.env.NEXT_PUBLIC_SOLANA_RPC_URL || "https://api.devnet.solana.com";
      
      console.log('🔍 Using RPC URL:', rpcUrl.includes('helius') ? 'Helius RPC ✅' : rpcUrl); // Debug log
      const connection = new Connection(rpcUrl, "confirmed");

      // Fetch transactions
      const history = await fetchTransactionHistory(connection, publicKey, {
        limit: 50
      });

      setTransactions(history);

      if (history.length === 0) {
        setError("No transactions found for this address");
      }
    } catch (err) {
      console.error("Failed to fetch transactions:", err);
      
      let errorMessage = "Failed to fetch transactions";
      if (err instanceof Error) {
        errorMessage = err.message;
        
        // Add helpful hints for common errors
        if (err.message.includes("Rate limit")) {
          errorMessage += " 💡 Tip: Set up a free Helius RPC endpoint for better reliability.";
        }
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = () => {
    if (transactions.length === 0) return;

    const csv = exportTransactionsToCSV(transactions);
    const filename = `transactions-${address.substring(0, 8)}-${Date.now()}.csv`;
    downloadCSV(csv, filename);
  };

  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-8 animate-fade-in">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            Transaction <span className="text-gradient-brand">History</span>
          </h1>
          <p className="text-lg sm:text-xl text-gray-600">
            View your payment history on Solana
          </p>
        </div>

        {/* Address Input */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="space-y-4">
            <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
                Wallet Address
              </label>
              <input
                id="address"
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Enter Solana wallet address..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    handleFetch();
                  }
                }}
              />
            </div>

            <button
              onClick={handleFetch}
              disabled={loading}
              className="w-full btn-primary py-3 px-6 rounded-lg font-semibold hover-lift disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></span>
                  Loading Transactions...
                </span>
              ) : (
                "Fetch Transaction History"
              )}
            </button>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}
          </div>
        </div>

        {/* Transaction List */}
        {transactions.length > 0 && (
          <TransactionList
            transactions={transactions}
            onExport={handleExport}
          />
        )}

        {/* Info Box */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="font-semibold text-blue-900 mb-3">💡 How to Use</h3>
          <ul className="list-disc list-inside space-y-2 text-sm text-blue-800">
            <li>Enter any Solana wallet address to view its transaction history</li>
            <li>Filter transactions by type (sent/received)</li>
            <li>Search by signature, address, or memo</li>
            <li>Export your history to CSV for record-keeping</li>
            <li>Click on signatures to view on Solana Explorer</li>
          </ul>
        </div>

        {/* Privacy Notice */}
        <div className="mt-6 bg-purple-50 border border-cyan-200 rounded-lg p-6">
          <div className="flex items-start gap-2">
            <span className="text-cyan-600 text-xl">🔒</span>
            <div>
              <p className="text-sm font-medium text-cyan-900 mb-1">
                Privacy Note
              </p>
              <p className="text-xs text-cyan-700">
                While ExePay payments use zero-knowledge proofs for privacy, this history viewer shows all public Solana transactions. Private payment details are not revealed.
              </p>
            </div>
          </div>
        </div>

        {/* Back Button */}
        <div className="mt-8 text-center">
          <a
            href="/"
            className="text-indigo-600 hover:text-indigo-700 font-medium hover-scale inline-block"
          >
            ← Back to Home
          </a>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}

