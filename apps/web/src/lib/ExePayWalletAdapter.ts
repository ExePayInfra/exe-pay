/**
 * ExePay Built-in Wallet Adapter
 * Integrates built-in wallet with Solana Wallet Adapter
 */

import {
  BaseMessageSignerWalletAdapter,
  WalletReadyState,
  WalletNotConnectedError,
  WalletName,
  WalletConnectionError,
} from '@solana/wallet-adapter-base';
import { PublicKey, Transaction, VersionedTransaction } from '@solana/web3.js';
import { getWalletSession, hasStoredWallet, getPublicKey as getStoredPublicKey } from './wallet-storage';

export const ExePayWalletName = 'ExePay' as WalletName<'ExePay'>;

export class ExePayWalletAdapter extends BaseMessageSignerWalletAdapter {
  name = ExePayWalletName;
  url = 'https://exepay.app';
  icon = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxkZWZzPgo8bGluZWFyR3JhZGllbnQgaWQ9ImJnR3JhZGllbnQiIHgxPSIwJSIgeTE9IjAlIiB4Mj0iMTAwJSIgeTI9IjEwMCUiPgo8c3RvcCBvZmZzZXQ9IjAlIiBzdHlsZT0ic3RvcC1jb2xvcjojNEY0NkU1O3N0b3Atb3BhY2l0eToxIiAvPgo8c3RvcCBvZmZzZXQ9IjUwJSIgc3R5bGU9InN0b3AtY29sb3I6IzYzNjZGMTtzdG9wLW9wYWNpdHk6MSIgLz4KPHN0b3Agb2Zmc2V0PSIxMDAlIiBzdHlsZT0ic3RvcC1jb2xvcjojODE4Q0Y4O3N0b3Atb3BhY2l0eToxIiAvPgo8L2xpbmVhckdyYWRpZW50Pgo8ZmlsdGVyIGlkPSJzaGFkb3ciIHg9Ii01MCUiIHk9Ii01MCUiIHdpZHRoPSIyMDAlIiBoZWlnaHQ9IjIwMCUiPgo8ZmVHYXVzc2lhbkJsdXIgaW49IlNvdXJjZUFscGhhIiBzdGREZXZpYXRpb249IjMiLz4KPGZlT2Zmc2V0IGR4PSIwIiBkeT0iMiIgcmVzdWx0PSJvZmZzZXRibHVyIi8+CjxmZUNvbXBvbmVudFRyYW5zZmVyPgo8ZmVGdW5jQSB0eXBlPSJsaW5lYXIiIHNsb3BlPSIwLjMiLz4KPC9mZUNvbXBvbmVudFRyYW5zZmVyPgo8ZmVNZXJnZT4KPGZlTWVyZ2VOb2RlLz4KPGZlTWVyZ2VOb2RlIGluPSJTb3VyY2VHcmFwaGljIi8+CjwvZmVNZXJnZT4KPC9maWx0ZXI+CjwvZGVmcz4KPHJlY3Qgd2lkdGg9IjEwMCIgaGVpZ2h0PSIxMDAiIHJ4PSIyMCIgZmlsbD0idXJsKCNiZ0dyYWRpZW50KSIvPgo8ZyBmaWx0ZXI9InVybCgjc2hhZG93KSI+CjxwYXRoIGQ9Ik0zNSwyNSBMNjUsMjUgTDY1LDM1IEwzNSwzNSBaIE0zNSw0NSBMNjUsNDUgTDY1LDU1IEwzNSw1NSBaIE0zNSw2NSBMNTUNSA1NTVsNjUsNzUgTDM1LDc1IFoiIGZpbGw9IndoaXRlIi8+CjwvZz4KPC9zdmc+';
  supportedTransactionVersions = new Set(['legacy', 0] as const);

  private _connecting: boolean;
  private _publicKey: PublicKey | null;
  private _readyState: WalletReadyState;

  constructor() {
    super();
    this._connecting = false;
    this._publicKey = null;
    this._readyState = hasStoredWallet()
      ? WalletReadyState.Installed
      : WalletReadyState.NotDetected;
  }

  get publicKey() {
    return this._publicKey;
  }

  get connecting() {
    return this._connecting;
  }

  get connected() {
    return !!this._publicKey;
  }

  get readyState() {
    return this._readyState;
  }

  async connect(): Promise<void> {
    try {
      if (this.connected || this.connecting) return;
      if (!hasStoredWallet()) {
        throw new WalletConnectionError('No ExePay wallet found. Please create or import a wallet first.');
      }

      this._connecting = true;

      // Check if wallet is unlocked (has active session)
      const session = getWalletSession();
      if (!session) {
        throw new WalletConnectionError('Wallet is locked. Please unlock your wallet first.');
      }

      this._publicKey = session.publicKey;

      this.emit('connect', this._publicKey);
      console.log('[ExePay Wallet] Connected:', this._publicKey.toBase58());
    } catch (error: any) {
      this.emit('error', error);
      throw error;
    } finally {
      this._connecting = false;
    }
  }

  async disconnect(): Promise<void> {
    if (this._publicKey) {
      this._publicKey = null;
      this.emit('disconnect');
      console.log('[ExePay Wallet] Disconnected');
    }
  }

  async signTransaction<T extends Transaction | VersionedTransaction>(
    transaction: T
  ): Promise<T> {
    try {
      if (!this.connected) throw new WalletNotConnectedError();

      const session = getWalletSession();
      if (!session) {
        throw new WalletNotConnectedError('Wallet session expired. Please unlock your wallet.');
      }

      // Sign the transaction
      if (transaction instanceof VersionedTransaction) {
        transaction.sign([session]);
      } else {
        transaction.partialSign(session);
      }

      return transaction;
    } catch (error: any) {
      this.emit('error', error);
      throw error;
    }
  }

  async signAllTransactions<T extends Transaction | VersionedTransaction>(
    transactions: T[]
  ): Promise<T[]> {
    try {
      if (!this.connected) throw new WalletNotConnectedError();

      const session = getWalletSession();
      if (!session) {
        throw new WalletNotConnectedError('Wallet session expired. Please unlock your wallet.');
      }

      // Sign all transactions
      return transactions.map((transaction) => {
        if (transaction instanceof VersionedTransaction) {
          transaction.sign([session]);
        } else {
          transaction.partialSign(session);
        }
        return transaction;
      });
    } catch (error: any) {
      this.emit('error', error);
      throw error;
    }
  }

  async signMessage(message: Uint8Array): Promise<Uint8Array> {
    try {
      if (!this.connected) throw new WalletNotConnectedError();

      const session = getWalletSession();
      if (!session) {
        throw new WalletNotConnectedError('Wallet session expired. Please unlock your wallet.');
      }

      // Sign the message using nacl
      const { sign } = await import('tweetnacl');
      return sign.detached(message, session.secretKey);
    } catch (error: any) {
      this.emit('error', error);
      throw error;
    }
  }
}

