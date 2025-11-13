"use client";

import { useState } from "react";
import { PublicKey } from "@solana/web3.js";
import { generatePaymentLink, formatPaymentAmount } from "@exe-pay/utils";

export function PaymentLinkGenerator() {
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [memo, setMemo] = useState("");
  const [label, setLabel] = useState("");
  const [generatedLink, setGeneratedLink] = useState("");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const handleGenerate = () => {
    setError("");
    setGeneratedLink("");
    setCopied(false);

    try {
      // Validate recipient
      if (!recipient.trim()) {
        throw new Error("Recipient address is required");
      }

      let recipientPubkey: PublicKey;
      try {
        recipientPubkey = new PublicKey(recipient.trim());
      } catch {
        throw new Error("Invalid recipient address");
      }

      // Validate amount
      if (!amount.trim()) {
        throw new Error("Amount is required");
      }

      const amountNum = parseFloat(amount);
      if (isNaN(amountNum) || amountNum <= 0) {
        throw new Error("Amount must be a positive number");
      }

      // Convert SOL to lamports
      const lamports = Math.floor(amountNum * 1_000_000_000);

      // Generate link
      const link = generatePaymentLink({
        recipient: recipientPubkey,
        amount: lamports,
        memo: memo.trim() || undefined,
        label: label.trim() || undefined
      });

      setGeneratedLink(link);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to generate link");
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(generatedLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      setError("Failed to copy to clipboard");
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: label || "Payment Request",
          text: memo || "Pay with ExePay",
          url: generatedLink
        });
      } catch (err) {
        // User cancelled or share failed
        console.log("Share cancelled");
      }
    } else {
      handleCopy();
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        Generate Payment Link
      </h2>

      <div className="space-y-4">
        {/* Recipient Address */}
        <div>
          <label htmlFor="recipient" className="block text-sm font-medium text-gray-700 mb-2">
            Recipient Address *
          </label>
          <input
            id="recipient"
            type="text"
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            placeholder="7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>

        {/* Amount */}
        <div>
          <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-2">
            Amount (SOL) *
          </label>
          <input
            id="amount"
            type="number"
            step="0.000001"
            min="0"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.001"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
          {amount && !isNaN(parseFloat(amount)) && (
            <p className="mt-1 text-sm text-gray-500">
              = {formatPaymentAmount(Math.floor(parseFloat(amount) * 1_000_000_000))}
            </p>
          )}
        </div>

        {/* Label */}
        <div>
          <label htmlFor="label" className="block text-sm font-medium text-gray-700 mb-2">
            Label (optional)
          </label>
          <input
            id="label"
            type="text"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            placeholder="Coffee Payment"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>

        {/* Memo */}
        <div>
          <label htmlFor="memo" className="block text-sm font-medium text-gray-700 mb-2">
            Memo (optional)
          </label>
          <textarea
            id="memo"
            value={memo}
            onChange={(e) => setMemo(e.target.value)}
            placeholder="Thank you for your purchase!"
            rows={3}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>

        {/* Generate Button */}
        <button
          onClick={handleGenerate}
          className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold py-3 px-6 rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-200 shadow-md hover:shadow-lg"
        >
          Generate Payment Link
        </button>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {/* Generated Link */}
        {generatedLink && (
          <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <h3 className="text-sm font-medium text-green-900 mb-2">
              Payment Link Generated! 🎉
            </h3>
            
            <div className="bg-white p-3 rounded border border-green-300 mb-3 break-all text-sm">
              {generatedLink}
            </div>

            <div className="flex gap-2">
              <button
                onClick={handleCopy}
                className="flex-1 bg-green-600 text-white font-medium py-2 px-4 rounded-lg hover:bg-green-700 transition-colors"
              >
                {copied ? "✓ Copied!" : "Copy Link"}
              </button>
              
              <button
                onClick={handleShare}
                className="flex-1 bg-blue-600 text-white font-medium py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Share
              </button>
            </div>

            <div className="mt-3 text-xs text-gray-600">
              <p>Share this link to receive payments privately!</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

