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
  icon = '/exepay-logo.png';
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

