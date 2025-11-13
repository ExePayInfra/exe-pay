"use client";

import { useEffect, useRef, useState } from "react";
import QRCode from "qrcode";

interface QRCodeDisplayProps {
  value: string;
  size?: number;
  level?: "L" | "M" | "Q" | "H";
  includeMargin?: boolean;
  className?: string;
}

export function QRCodeDisplay({
  value,
  size = 256,
  level = "H",
  includeMargin = true,
  className = ""
}: QRCodeDisplayProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !value) return;

    setError("");

    QRCode.toCanvas(
      canvas,
      value,
      {
        width: size,
        margin: includeMargin ? 4 : 0,
        errorCorrectionLevel: level,
        color: {
          dark: "#000000",
          light: "#FFFFFF"
        }
      },
      (err) => {
        if (err) {
          console.error("QR Code generation error:", err);
          setError("Failed to generate QR code");
        }
      }
    );
  }, [value, size, level, includeMargin]);

  if (error) {
    return (
      <div className={`flex items-center justify-center bg-red-50 border border-red-200 rounded-lg ${className}`} style={{ width: size, height: size }}>
        <p className="text-red-600 text-sm text-center px-4">{error}</p>
      </div>
    );
  }

  return (
    <div className={className}>
      <canvas
        ref={canvasRef}
        className="rounded-lg shadow-md"
        style={{ width: size, height: size }}
      />
    </div>
  );
}

/**
 * Download QR code as PNG
 */
export async function downloadQRCode(value: string, filename: string = "payment-qr.png"): Promise<void> {
  try {
    const dataUrl = await QRCode.toDataURL(value, {
      width: 512,
      margin: 4,
      errorCorrectionLevel: "H",
      color: {
        dark: "#000000",
        light: "#FFFFFF"
      }
    });

    const link = document.createElement("a");
    link.href = dataUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error) {
    console.error("Failed to download QR code:", error);
    throw new Error("Failed to download QR code");
  }
}

/**
 * Get QR code as data URL
 */
export async function getQRCodeDataURL(value: string, size: number = 512): Promise<string> {
  try {
    return await QRCode.toDataURL(value, {
      width: size,
      margin: 4,
      errorCorrectionLevel: "H",
      color: {
        dark: "#000000",
        light: "#FFFFFF"
      }
    });
  } catch (error) {
    console.error("Failed to generate QR code:", error);
    throw new Error("Failed to generate QR code");
  }
}

