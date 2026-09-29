// SakhiShield — Incident Vault Secure Sharing Service
// Generates cryptographically secure, time-limited, revocable share links.

import { supabase, isSupabaseConfigured } from '../../../lib/supabase';
import { generateSecureId, computeSha256 } from '../../../lib/securityUtils';
import type { IncidentShare } from '../types';
import { INCIDENT_VAULT_CONFIG } from '../constants/incidentVault.constants';
import { incidentService } from './incidentService';

const LOCAL_SHARES_KEY = 'sakhishield_incident_vault_local_shares_v1';

const memoryShares = new Map<string, string>();
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
    return memoryShares.get(key) || null;
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
    memoryShares.set(key, val);
  },
};

export class SharingService {
  private getLocalShares(incidentId: string): IncidentShare[] {
    try {
      const data = safeStorage.getItem(`${LOCAL_SHARES_KEY}_${incidentId}`);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  private saveLocalShares(incidentId: string, shares: IncidentShare[]): void {
    try {
      safeStorage.setItem(`${LOCAL_SHARES_KEY}_${incidentId}`, JSON.stringify(shares));
    } catch {}
  }

  /**
   * Generates a new secure, expiring share link for an incident
   */
  public async createShareLink(params: {
    incidentId: string;
    userId: string;
    scope: IncidentShare['scope'];
    selectedEvidenceIds?: string[];
    durationHours?: number;
  }): Promise<{ share: IncidentShare; rawShareToken: string; shareUrl: string }> {
    const { incidentId, userId, scope, selectedEvidenceIds, durationHours = 24 } = params;

    // 1. Generate 32-byte cryptographic random token (NEVER Math.random())
    const rawTokenBytes = new Uint8Array(INCIDENT_VAULT_CONFIG.sharing.tokenLengthBytes);
    if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
      crypto.getRandomValues(rawTokenBytes);
    } else {
      for (let i = 0; i < rawTokenBytes.length; i++) rawTokenBytes[i] = Math.floor(Math.random() * 256);
    }

    const rawShareToken = Array.from(rawTokenBytes)
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('');

    // 2. Compute SHA-256 hash of token to store in database (never store raw token in cleartext)
    const shareTokenHash = await computeSha256(rawShareToken);

    const shareId = generateSecureId('shr');
    const now = new Date();
    const expiresAt = new Date(now.getTime() + durationHours * 3600 * 1000).toISOString();

    const share: IncidentShare = {
      id: shareId,
      incidentId,
      userId,
      shareTokenHash,
      scope,
      selectedEvidenceIds,
      expiresAt,
      isRevoked: false,
      accessCount: 0,
      createdAt: now.toISOString(),
    };

    // Save locally
    const current = this.getLocalShares(incidentId);
    current.unshift(share);
    this.saveLocalShares(incidentId, current);

    // Save remotely
    if (isSupabaseConfigured() && navigator.onLine) {
      try {
        await supabase.from('incident_shares').insert({
          id: shareId,
          incident_id: incidentId,
          user_id: userId,
          share_token_hash: shareTokenHash,
          scope,
          selected_evidence_ids: selectedEvidenceIds,
          expires_at: expiresAt,
          is_revoked: false,
          access_count: 0,
          created_at: share.createdAt,
        });
      } catch (err) {
        console.warn('[sharingService] Remote share record failed to insert:', err);
      }
    }

    // Build user-facing share URL
    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    const shareUrl = `${origin}/incident-vault/share?id=${incidentId}&token=${rawShareToken}`;

    await incidentService.recordTimelineEvent(incidentId, userId, {
      eventType: 'SHARE_LINK_CREATED',
      title: 'Created Expiring Share Link',
      description: `Scope: ${scope.replace(/_/g, ' ').toLowerCase()}, valid for ${durationHours} hours.`,
      metadata: { shareId, expiresAt },
    });

    return { share, rawShareToken, shareUrl };
  }

  /**
   * Fetches active and revoked shares for an incident
   */
  public async getShares(incidentId: string, userId: string): Promise<IncidentShare[]> {
    if (isSupabaseConfigured() && navigator.onLine) {
      try {
        const { data, error } = await supabase
          .from('incident_shares')
          .select('*')
          .eq('incident_id', incidentId)
          .eq('user_id', userId)
          .order('created_at', { ascending: false });

        if (!error && data) {
          const mapped: IncidentShare[] = data.map((r: any) => ({
            id: r.id,
            incidentId: r.incident_id,
            userId: r.user_id,
            shareTokenHash: r.share_token_hash,
            scope: r.scope,
            selectedEvidenceIds: r.selected_evidence_ids,
            expiresAt: r.expires_at,
            isRevoked: r.is_revoked,
            revokedAt: r.revoked_at,
            accessCount: r.access_count || 0,
            lastAccessedAt: r.last_accessed_at,
            createdAt: r.created_at,
          }));
          this.saveLocalShares(incidentId, mapped);
          return mapped;
        }
      } catch {}
    }

    return this.getLocalShares(incidentId);
  }

  /**
   * Immediately revokes an active share
   */
  public async revokeShare(
    incidentId: string,
    shareId: string,
    userId: string
  ): Promise<boolean> {
    const list = this.getLocalShares(incidentId);
    const updated = list.map((s) => {
      if (s.id === shareId) {
        return { ...s, isRevoked: true, revokedAt: new Date().toISOString() };
      }
      return s;
    });
    this.saveLocalShares(incidentId, updated);

    if (isSupabaseConfigured() && navigator.onLine) {
      try {
        await supabase
          .from('incident_shares')
          .update({ is_revoked: true, revoked_at: new Date().toISOString() })
          .eq('id', shareId)
          .eq('user_id', userId);
      } catch {}
    }

    await incidentService.recordTimelineEvent(incidentId, userId, {
      eventType: 'SHARE_LINK_REVOKED',
      title: 'Revoked Share Link',
      description: 'Access immediately disabled for recipients.',
      metadata: { shareId },
    });

    return true;
  }
}

export const sharingService = new SharingService();
