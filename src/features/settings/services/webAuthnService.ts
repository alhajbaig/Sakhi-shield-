// SakhiShield — WebAuthn & Passkey Authentication Service
// Implements real browser credential creation, platform authenticator inspection, and local key management.

import { generateSecureId } from '../../../lib/securityUtils';
import type { PasskeyCredentialInfo } from '../types/settings.types';
import { SETTINGS_STORAGE_KEYS } from '../constants/settings.constants';

const memoryPasskeys = new Map<string, string>();
const safeStorage = {
  getItem: (key: string): string | null => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        return window.localStorage.getItem(key);
      }
      if (typeof localStorage !== 'undefined') {
        const val = localStorage.getItem(key);
        if (val !== undefined && val !== null) return val;
      }
    } catch {}
    return memoryPasskeys.get(key) || null;
  },
  setItem: (key: string, val: string): void => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem(key, val);
      }
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(key, val);
      }
    } catch {}
    memoryPasskeys.set(key, val);
  },
};

export class WebAuthnService {
  /**
   * Checks whether the current browser supports WebAuthn / Passkeys
   */
  isSupported(): boolean {
    return Boolean(
      typeof window !== 'undefined' &&
      window.PublicKeyCredential &&
      navigator.credentials &&
      navigator.credentials.create
    );
  }

  /**
   * Checks if user-verifying platform biometric authenticator is present
   */
  async isPlatformAuthenticatorAvailable(): Promise<boolean> {
    if (!this.isSupported()) return false;
    try {
      if (window.PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable) {
        return await window.PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
      }
    } catch {
      return false;
    }
    return false;
  }

  /**
   * Retrieves all registered passkeys for the user
   */
  getRegisteredPasskeys(userId: string): PasskeyCredentialInfo[] {
    try {
      const data = safeStorage.getItem(`${SETTINGS_STORAGE_KEYS.PASSKEYS}_${userId || 'usr_current'}`);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  /**
   * Prompts the browser authenticator to create a new WebAuthn credential
   */
  async registerPasskey(
    userId: string,
    userName: string,
    passkeyLabel: string = 'Personal Device Passkey'
  ): Promise<{ success: boolean; passkey?: PasskeyCredentialInfo; error?: string }> {
    if (!this.isSupported()) {
      return {
        success: false,
        error: 'WebAuthn is not supported by this browser. Modern Chromium, Safari, or Firefox required.',
      };
    }

    try {
      // Generate a cryptographic 32-byte challenge
      const challenge = new Uint8Array(32);
      if (window.crypto && window.crypto.getRandomValues) {
        window.crypto.getRandomValues(challenge);
      }

      const userUuid = userId || generateSecureId('usr');
      const encoder = new TextEncoder();
      const userHandle = encoder.encode(userUuid);

      const credentialCreationOptions: CredentialCreationOptions = {
        publicKey: {
          challenge,
          rp: {
            name: 'SakhiShield Sovereign Safety',
            id: window.location.hostname || 'localhost',
          },
          user: {
            id: userHandle,
            name: userName || 'user@sakhishield.org',
            displayName: userName || 'SakhiShield User',
          },
          pubKeyCredParams: [
            { alg: -7, type: 'public-key' }, // ES256
            { alg: -257, type: 'public-key' }, // RS256
          ],
          authenticatorSelection: {
            authenticatorAttachment: 'platform',
            userVerification: 'preferred',
            residentKey: 'preferred',
          },
          timeout: 60000,
          attestation: 'none',
        },
      };

      const credential = (await navigator.credentials.create(
        credentialCreationOptions
      )) as PublicKeyCredential | null;

      if (!credential) {
        return { success: false, error: 'Passkey registration cancelled by user.' };
      }

      const rawIdHex = Array.from(new Uint8Array(credential.rawId))
        .map((b) => b.toString(16).padStart(2, '0'))
        .join('');

      const newPasskey: PasskeyCredentialInfo = {
        id: credential.id || generateSecureId('psk'),
        name: passkeyLabel.trim() || 'Biometric Passkey',
        createdAt: new Date().toISOString(),
        authenticatorType: 'Platform Biometric / FIDO2',
        rawIdHex: rawIdHex.slice(0, 16) + '...',
      };

      const existing = this.getRegisteredPasskeys(userId);
      const updated = [newPasskey, ...existing];
      safeStorage.setItem(
        `${SETTINGS_STORAGE_KEYS.PASSKEYS}_${userId || 'usr_current'}`,
        JSON.stringify(updated)
      );

      return { success: true, passkey: newPasskey };
    } catch (err: any) {
      if (err.name === 'NotAllowedError') {
        return { success: false, error: 'Passkey request dismissed or biometric verification timed out.' };
      }
      return { success: false, error: err.message || 'Unable to register passkey on this device.' };
    }
  }

  /**
   * Removes a registered passkey by ID
   */
  removePasskey(userId: string, passkeyId: string): boolean {
    const existing = this.getRegisteredPasskeys(userId);
    const filtered = existing.filter((p) => p.id !== passkeyId);
    safeStorage.setItem(
      `${SETTINGS_STORAGE_KEYS.PASSKEYS}_${userId || 'usr_current'}`,
      JSON.stringify(filtered)
    );
    return true;
  }
}

export const webAuthnService = new WebAuthnService();
