"use client";

export const dynamic = 'force-dynamic';

import { useState, useEffect } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import { validatePaymentLink } from "@exe-pay/utils";

export default function ScanPage() {
  const [scanning, setScanning] = useState(false);
  const [error, setError] = useState("");
  const [scannedUrl, setScannedUrl] = useState("");

  useEffect(() => {
    if (!scanning) return;

    const scanner = new Html5QrcodeScanner(
      "qr-reader",
      {
        fps: 10,
        qrbox: { width: 250, height: 250 },
        aspectRatio: 1.0
      },
      false
    );

    scanner.render(
      (decodedText) => {
        // Successfully scanned
        console.log("Scanned:", decodedText);
        
        // Validate if it's a payment link
        if (validatePaymentLink(decodedText)) {
          setScannedUrl(decodedText);
          scanner.clear();
          setScanning(false);
          
          // Redirect to payment page
          window.location.href = decodedText;
        } else {
          setError("This QR code is not a valid payment link");
          scanner.clear();
          setScanning(false);
        }
      },
      (errorMessage) => {
        // Scanning error (ignore most of these as they're normal)
        if (errorMessage.includes("NotFoundException")) {
          // No QR code found - this is normal, ignore
          return;
        }
        console.warn("QR scan error:", errorMessage);
      }
    );

    return () => {
      scanner.clear().catch(console.error);
    };
  }, [scanning]);

  const startScanning = () => {
    setError("");
    setScannedUrl("");
    setScanning(true);
  };

  const stopScanning = () => {
    setScanning(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Scan QR Code
          </h1>
          <p className="text-lg text-gray-600">
            Scan a payment QR code to pay instantly
          </p>
        </div>

        {/* Scanner Container */}
        <div className="bg-white rounded-lg shadow-xl p-6">
          {!scanning && !scannedUrl && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📱</div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Ready to Scan
              </h2>
              <p className="text-gray-600 mb-6">
                Click the button below to start scanning QR codes
              </p>
              <button
                onClick={startScanning}
                className="bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold py-3 px-8 rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-200 shadow-md hover:shadow-lg"
              >
                Start Scanning
              </button>
            </div>
          )}

          {scanning && (
            <div>
              <div id="qr-reader" className="mb-4"></div>
              <button
                onClick={stopScanning}
                className="w-full bg-red-600 text-white font-medium py-2 px-4 rounded-lg hover:bg-red-700 transition-colors"
              >
                Stop Scanning
              </button>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
              <button
                onClick={startScanning}
                className="mt-3 w-full bg-red-600 text-white font-medium py-2 px-4 rounded-lg hover:bg-red-700 transition-colors"
              >
                Try Again
              </button>
            </div>
          )}

          {scannedUrl && (
            <div className="text-center py-8">
              <div className="text-6xl mb-4">✅</div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                QR Code Scanned!
              </h2>
              <p className="text-gray-600 mb-6">
                Redirecting to payment page...
              </p>
            </div>
          )}
        </div>

        {/* Instructions */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="font-semibold text-blue-900 mb-3">How to Use</h3>
          <ol className="list-decimal list-inside space-y-2 text-sm text-blue-800">
            <li>Click "Start Scanning" to activate your camera</li>
            <li>Point your camera at a payment QR code</li>
            <li>The QR code will be automatically detected</li>
            <li>You'll be redirected to the payment page</li>
          </ol>
        </div>

        {/* Back Button */}
        <div className="mt-6 text-center">
          <a
            href="/"
            className="text-cyan-600 hover:text-cyan-700 font-medium"
          >
            ← Back to Home
          </a>
        </div>
      </div>
    </div>
  );
}

