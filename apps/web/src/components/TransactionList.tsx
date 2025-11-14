"use client";

import { useState, useMemo } from "react";
import type { TransactionRecord } from "@exe-pay/core";
import { formatTransactionAmount, formatTransactionDate } from "@exe-pay/core";

interface TransactionListProps {
  transactions: TransactionRecord[];
  onExport?: () => void;
}

export function TransactionList({ transactions, onExport }: TransactionListProps) {
  const [filter, setFilter] = useState<"all" | "send" | "receive">("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<"date" | "amount">("date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  // Filter and sort transactions
  const filteredTransactions = useMemo(() => {
    let filtered = transactions;

    // Apply type filter
    if (filter !== "all") {
      filtered = filtered.filter(tx => tx.type === filter);
    }

    // Apply search
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(tx =>
        tx.signature.toLowerCase().includes(term) ||
        tx.from.toLowerCase().includes(term) ||
        tx.to.toLowerCase().includes(term) ||
        tx.memo?.toLowerCase().includes(term)
      );
    }

    // Sort
    filtered = [...filtered].sort((a, b) => {
      let comparison = 0;
      
      if (sortBy === "date") {
        comparison = a.timestamp - b.timestamp;
      } else {
        comparison = a.amount - b.amount;
      }

      return sortOrder === "asc" ? comparison : -comparison;
    });

    return filtered;
  }, [transactions, filter, searchTerm, sortBy, sortOrder]);

  const toggleSort = (newSortBy: "date" | "amount") => {
    if (sortBy === newSortBy) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(newSortBy);
      setSortOrder("desc");
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
      case "finalized":
        return "text-green-600 bg-green-50";
      case "failed":
        return "text-red-600 bg-red-50";
      case "pending":
        return "text-yellow-600 bg-yellow-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "send":
        return "↗️";
      case "receive":
        return "↙️";
      default:
        return "↔️";
    }
  };

  if (transactions.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-12 text-center">
        <div className="text-6xl mb-4">📭</div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          No Transactions Yet
        </h3>
        <p className="text-gray-600">
          Your transaction history will appear here once you make your first payment.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          Transaction History
        </h2>
        {onExport && (
          <button
            onClick={onExport}
            className="bg-purple-600 text-white font-medium py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors"
          >
            📥 Export CSV
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="mb-6 space-y-4">
        {/* Search */}
        <input
          type="text"
          placeholder="Search by signature, address, or memo..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
        />

        {/* Filter buttons */}
        <div className="flex gap-2">
          <button
            onClick={() => setFilter("all")}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === "all"
                ? "bg-purple-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            All ({transactions.length})
          </button>
          <button
            onClick={() => setFilter("send")}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === "send"
                ? "bg-purple-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Sent ({transactions.filter(tx => tx.type === "send").length})
          </button>
          <button
            onClick={() => setFilter("receive")}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === "receive"
                ? "bg-purple-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Received ({transactions.filter(tx => tx.type === "receive").length})
          </button>
        </div>
      </div>

      {/* Results count */}
      <div className="mb-4 text-sm text-gray-600">
        Showing {filteredTransactions.length} of {transactions.length} transactions
      </div>

      {/* Transaction list */}
      <div className="space-y-3">
        {filteredTransactions.map((tx) => (
          <div
            key={tx.signature}
            className="border border-gray-200 rounded-lg p-4 hover:border-purple-300 hover:shadow-md transition-all"
          >
            <div className="flex items-start justify-between">
              {/* Left side */}
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">{getTypeIcon(tx.type)}</span>
                  <span className="font-semibold text-gray-900 capitalize">
                    {tx.type}
                  </span>
                  <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(tx.status)}`}>
                    {tx.status}
                  </span>
                </div>

                <div className="space-y-1 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="text-gray-600">Amount:</span>
                    <span className="font-mono font-semibold text-gray-900">
                      {formatTransactionAmount(tx.amount)}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-gray-600">Date:</span>
                    <span className="text-gray-900">
                      {formatTransactionDate(tx.timestamp)}
                    </span>
                  </div>

                  {tx.memo && (
                    <div className="flex items-center gap-2">
                      <span className="text-gray-600">Memo:</span>
                      <span className="text-gray-900 italic">{tx.memo}</span>
                    </div>
                  )}

                  <div className="flex items-center gap-2">
                    <span className="text-gray-600">Signature:</span>
                    <a
                      href={`https://explorer.solana.com/tx/${tx.signature}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-mono text-xs text-purple-600 hover:text-purple-700 hover:underline"
                    >
                      {tx.signature.substring(0, 8)}...{tx.signature.substring(tx.signature.length - 8)}
                    </a>
                  </div>
                </div>
              </div>

              {/* Right side - Amount highlight */}
              <div className="text-right">
                <div className={`text-2xl font-bold ${
                  tx.type === "send" ? "text-red-600" : "text-green-600"
                }`}>
                  {tx.type === "send" ? "-" : "+"}{formatTransactionAmount(tx.amount)}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  Fee: {formatTransactionAmount(tx.fee)}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredTransactions.length === 0 && searchTerm && (
        <div className="text-center py-8 text-gray-500">
          No transactions found matching "{searchTerm}"
        </div>
      )}
    </div>
  );
}

