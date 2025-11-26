'use client';

import { useState } from 'react';

export type PrivacyMode = 'public' | 'stealth' | 'relayer' | 'maximum' | 'auto';

interface PrivacyModeSelectorProps {
  value: PrivacyMode;
  onChange: (mode: PrivacyMode) => void;
  amount?: number;
  showExplanation?: boolean;
}

interface ModeInfo {
  mode: PrivacyMode;
  icon: string;
  label: string;
  description: string;
  features: string[];
  recommended?: boolean;
  fee: string;
}

const PRIVACY_MODES: ModeInfo[] = [
  {
    mode: 'public',
    icon: '🔓',
    label: 'Public',
    description: 'Standard Solana transaction',
    features: [
      'Fastest transaction',
      'Lowest fees',
      'All details visible',
      'Like regular Solana'
    ],
    fee: 'Standard'
  },
  {
    mode: 'stealth',
    icon: '🔒',
    label: 'Stealth',
    description: 'Hides recipient identity',
    features: [
      'Recipient address hidden',
      'One-time address used',
      'Cannot link to recipient',
      'Sender visible'
    ],
    fee: 'Standard + small'
  },
  {
    mode: 'relayer',
    icon: '🔐',
    label: 'Relayer',
    description: 'Hides sender identity',
    features: [
      'Sender address hidden',
      'Routed through relayer',
      'Cannot link to sender',
      'Recipient visible'
    ],
    fee: 'Standard + relayer'
  },
  {
    mode: 'maximum',
    icon: '🔒🔐',
    label: 'Maximum Privacy',
    description: 'Full anonymity',
    features: [
      'Sender hidden (relayer)',
      'Recipient hidden (stealth)',
      'Maximum privacy',
      'Amount still visible'
    ],
    fee: 'Standard + both'
  },
  {
    mode: 'auto',
    icon: '✨',
    label: 'Auto',
    description: 'Wallet decides best mode',
    features: [
      'Automatic selection',
      'Based on amount',
      'Optimizes privacy/cost',
      'Recommended for most'
    ],
    recommended: true,
    fee: 'Varies'
  }
];

export function PrivacyModeSelector({
  value,
  onChange,
  amount,
  showExplanation = true
}: PrivacyModeSelectorProps) {
  const [showDetails, setShowDetails] = useState(false);

  // Auto mode logic
  const getAutoMode = (amt: number): PrivacyMode => {
    if (amt < 0.1) return 'public';      // Small: save fees
    if (amt < 10) return 'stealth';      // Medium: hide recipient
    return 'maximum';                     // Large: full privacy
  };

  const effectiveMode = value === 'auto' && amount !== undefined 
    ? getAutoMode(amount) 
    : value;

  const selectedMode = PRIVACY_MODES.find(m => m.mode === value);

  return (
    <div className="space-y-4">
      {/* Mode Selection */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Privacy Mode
        </label>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {PRIVACY_MODES.map((mode) => (
            <button
              key={mode.mode}
              type="button"
              onClick={() => onChange(mode.mode)}
              className={`
                relative p-4 rounded-xl border-2 transition-all
                ${value === mode.mode
                  ? 'border-indigo-500 bg-indigo-50 shadow-md'
                  : 'border-gray-200 bg-white hover:border-indigo-300'
                }
              `}
            >
              {/* Recommended Badge */}
              {mode.recommended && (
                <div className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full font-semibold">
                  Recommended
                </div>
              )}

              {/* Icon */}
              <div className="text-3xl mb-2">{mode.icon}</div>

              {/* Label */}
              <div className="font-semibold text-gray-900 text-sm mb-1">
                {mode.label}
              </div>

              {/* Fee */}
              <div className="text-xs text-gray-500">
                {mode.fee}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Selected Mode Details */}
      {selectedMode && (
        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-4 border border-indigo-200">
          <div className="flex items-start gap-3">
            <div className="text-3xl">{selectedMode.icon}</div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 mb-1">
                {selectedMode.label}
              </h3>
              <p className="text-sm text-gray-600 mb-3">
                {selectedMode.description}
              </p>

              {/* Auto mode preview */}
              {value === 'auto' && amount !== undefined && (
                <div className="bg-white rounded-lg p-3 mb-3 border border-indigo-200">
                  <div className="flex items-center gap-2 text-sm">
                    <span className="font-medium text-gray-700">
                      For {amount} SOL:
                    </span>
                    <span className="text-indigo-600 font-semibold">
                      {PRIVACY_MODES.find(m => m.mode === effectiveMode)?.icon}{' '}
                      {PRIVACY_MODES.find(m => m.mode === effectiveMode)?.label}
                    </span>
                  </div>
                </div>
              )}

              {/* Features */}
              <ul className="space-y-1">
                {selectedMode.features.map((feature, idx) => (
                  <li key={idx} className="text-sm text-gray-700 flex items-start gap-2">
                    <span className="text-indigo-500 mt-0.5">✓</span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Privacy Explanation */}
      {showExplanation && (
        <div className="space-y-3">
          <button
            type="button"
            onClick={() => setShowDetails(!showDetails)}
            className="flex items-center gap-2 text-sm text-indigo-600 hover:text-indigo-700 font-medium"
          >
            {showDetails ? '▼' : '▶'} Learn about privacy modes
          </button>

          {showDetails && (
            <div className="bg-gray-50 rounded-xl p-4 space-y-4 text-sm">
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">
                  🔓 Public Mode
                </h4>
                <p className="text-gray-600">
                  Standard Solana transaction. Everyone can see sender, recipient, and amount.
                  Fastest and cheapest option. Use for small amounts or when privacy isn't needed.
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 mb-2">
                  🔒 Stealth Mode (Recipient Privacy)
                </h4>
                <p className="text-gray-600">
                  Uses one-time addresses to hide the recipient. Observers cannot link the payment
                  to the recipient's main address. Inspired by Monero's stealth addresses.
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 mb-2">
                  🔐 Relayer Mode (Sender Privacy)
                </h4>
                <p className="text-gray-600">
                  Routes payment through a relayer network. The relayer's address appears on-chain,
                  not yours. Observers cannot link the payment to you.
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 mb-2">
                  🔒🔐 Maximum Privacy
                </h4>
                <p className="text-gray-600">
                  Combines stealth addresses and relayer network for full anonymity. Both sender
                  and recipient are hidden. Best privacy available on Solana.
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 mb-2">
                  ✨ Auto Mode (Recommended)
                </h4>
                <p className="text-gray-600">
                  Let the wallet choose the best privacy mode based on the amount:
                </p>
                <ul className="mt-2 space-y-1 text-gray-600 ml-4">
                  <li>• Small amounts (&lt;0.1 SOL): Public mode (save fees)</li>
                  <li>• Medium amounts (0.1-10 SOL): Stealth mode (hide recipient)</li>
                  <li>• Large amounts (&gt;10 SOL): Maximum privacy (full anonymity)</li>
                </ul>
              </div>

              <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
                <p className="text-sm text-blue-800">
                  <strong>Note:</strong> Transaction amounts are always visible on Solana.
                  Privacy modes hide sender/recipient identities, not amounts.
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// Export helper function for use in other components
export function getPrivacyModeLabel(mode: PrivacyMode): string {
  const modeInfo = PRIVACY_MODES.find(m => m.mode === mode);
  return modeInfo ? `${modeInfo.icon} ${modeInfo.label}` : mode;
}

export function getPrivacyModeFee(mode: PrivacyMode): string {
  const modeInfo = PRIVACY_MODES.find(m => m.mode === mode);
  return modeInfo?.fee || 'Unknown';
}

