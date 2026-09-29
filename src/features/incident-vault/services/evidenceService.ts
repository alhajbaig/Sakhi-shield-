// SakhiShield — Evidence Management Service
// Handles file validation, SHA-256 integrity calculation, private upload, and download URL generation.

import { supabase, isSupabaseConfigured } from '../../../lib/supabase';
import { generateSecureId } from '../../../lib/securityUtils';
import type { EvidenceMetadata, IntegrityStatus } from '../types';
import { INCIDENT_VAULT_CONFIG } from '../constants/incidentVault.constants';
import { validateEvidenceFile } from '../utils/fileValidation';
import { computeFileSha256, verifyEvidenceIntegrity } from '../utils/hashing';
import { incidentService } from './incidentService';

const LOCAL_EVIDENCE_KEY = 'sakhishield_incident_vault_local_evidence_v1';

const memoryEvidence = new Map<string, string>();
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
    return memoryEvidence.get(key) || null;
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
    memoryEvidence.set(key, val);
  },
};

export class EvidenceService {
  private getLocalEvidence(incidentId: string): EvidenceMetadata[] {
    try {
      const data = safeStorage.getItem(`${LOCAL_EVIDENCE_KEY}_${incidentId}`);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  private saveLocalEvidence(incidentId: string, items: EvidenceMetadata[]): void {
    try {
      safeStorage.setItem(`${LOCAL_EVIDENCE_KEY}_${incidentId}`, JSON.stringify(items));
    } catch {}
  }

  /**
   * Fetches all evidence items attached to an incident
   */
  public async getEvidence(incidentId: string, userId: string): Promise<EvidenceMetadata[]> {
    if (isSupabaseConfigured() && navigator.onLine) {
      try {
        const { data, error } = await supabase
          .from('incident_evidence')
          .select('*')
          .eq('incident_id', incidentId)
          .eq('user_id', userId)
          .order('uploaded_at', { ascending: false });

        if (!error && data) {
          const mapped: EvidenceMetadata[] = await Promise.all(
            data.map(async (row: any) => {
              // Generate short-lived signed URL for authenticated user
              let downloadUrl: string | undefined;
              try {
                const { data: signData } = await supabase.storage
                  .from(INCIDENT_VAULT_CONFIG.storage.bucketName)
                  .createSignedUrl(row.storage_path, 3600); // 1 hour
                downloadUrl = signData?.signedUrl;
              } catch {}

              return {
                id: row.id,
                incidentId: row.incident_id,
                userId: row.user_id,
                fileName: row.file_name,
                sanitizedFileName: row.sanitized_file_name,
                fileSizeBytes: row.file_size_bytes,
                mimeType: row.mime_type,
                category: row.category,
                storagePath: row.storage_path,
                sha256Hash: row.sha256_hash,
                integrityStatus: row.integrity_status,
                description: row.description,
                capturedAt: row.captured_at,
                uploadedAt: row.uploaded_at,
                lastVerifiedAt: row.last_verified_at,
                downloadUrl,
              };
            })
          );

          this.saveLocalEvidence(incidentId, mapped);
          return mapped;
        }
      } catch (err) {
        console.warn('[evidenceService] Supabase query failed, falling back to local:', err);
      }
    }

    return this.getLocalEvidence(incidentId);
  }

  /**
   * Validates, hashes with SHA-256, and uploads an evidence file to private storage
   */
  public async uploadEvidence(params: {
    incidentId: string;
    userId: string;
    file: File;
    description?: string;
  }): Promise<EvidenceMetadata> {
    const { incidentId, userId, file, description } = params;

    // 1. Strict File & MIME Validation
    const validation = validateEvidenceFile(file);
    if (!validation.valid) {
      throw new Error(validation.error || 'Invalid evidence file.');
    }

    // 2. Real SHA-256 Cryptographic Hash Calculation
    const sha256Hash = await computeFileSha256(file);

    const evidenceId = generateSecureId('evd');
    const storagePath = `user/${userId}/incidents/${incidentId}/evidence/${evidenceId}_${validation.sanitizedName}`;
    const now = new Date().toISOString();

    const metadata: EvidenceMetadata = {
      id: evidenceId,
      incidentId,
      userId,
      fileName: file.name,
      sanitizedFileName: validation.sanitizedName,
      fileSizeBytes: file.size,
      mimeType: file.type || 'application/octet-stream',
      category: validation.category,
      storagePath,
      sha256Hash,
      integrityStatus: 'VERIFIED',
      description: description?.trim(),
      uploadedAt: now,
      lastVerifiedAt: now,
    };

    // 3. Upload to Supabase Storage if online
    if (isSupabaseConfigured() && navigator.onLine) {
      try {
        const { error: uploadError } = await supabase.storage
          .from(INCIDENT_VAULT_CONFIG.storage.bucketName)
          .upload(storagePath, file, {
            contentType: file.type,
            upsert: false,
          });

        if (uploadError) {
          console.warn('[evidenceService] Bucket upload failed, caching locally:', uploadError.message);
        } else {
          // Get short-lived signed URL
          const { data: signData } = await supabase.storage
            .from(INCIDENT_VAULT_CONFIG.storage.bucketName)
            .createSignedUrl(storagePath, 3600);
          metadata.downloadUrl = signData?.signedUrl;
        }

        // Insert database record
        const { error: dbErr } = await supabase.from('incident_evidence').insert({
          id: metadata.id,
          incident_id: incidentId,
          user_id: userId,
          file_name: metadata.fileName,
          sanitized_file_name: metadata.sanitizedFileName,
          file_size_bytes: metadata.fileSizeBytes,
          mime_type: metadata.mimeType,
          category: metadata.category,
          storage_path: metadata.storagePath,
          sha256_hash: metadata.sha256Hash,
          integrity_status: metadata.integrityStatus,
          description: metadata.description,
          uploaded_at: now,
          last_verified_at: now,
        });

        if (dbErr) {
          console.warn('[evidenceService] DB metadata record insert failed:', dbErr.message);
        }
      } catch (err: any) {
        console.warn('[evidenceService] Remote upload error:', err?.message);
      }
    }

    // 4. Update local storage cache
    const currentList = this.getLocalEvidence(incidentId);
    currentList.unshift(metadata);
    this.saveLocalEvidence(incidentId, currentList);

    // 5. Update incident evidence count & timeline
    await incidentService.recordTimelineEvent(incidentId, userId, {
      eventType: 'EVIDENCE_ATTACHED',
      title: `Attached ${validation.category.toLowerCase()}: ${validation.sanitizedName}`,
      description: `Cryptographic SHA-256 fingerprint: ${sha256Hash.substring(0, 16)}...`,
      metadata: { evidenceId, sha256Hash },
    });

    return metadata;
  }

  /**
   * Re-verifies an existing evidence file's cryptographic integrity
   */
  public async verifyIntegrity(
    evidence: EvidenceMetadata,
    fileBlob?: Blob
  ): Promise<IntegrityStatus> {
    if (!evidence.sha256Hash) return 'UNKNOWN';

    try {
      let blob = fileBlob;
      if (!blob && evidence.downloadUrl) {
        const res = await fetch(evidence.downloadUrl);
        if (res.ok) blob = await res.blob();
      }

      if (!blob) return 'UNKNOWN';

      const matches = await verifyEvidenceIntegrity(await blob.arrayBuffer(), evidence.sha256Hash);
      return matches ? 'VERIFIED' : 'MODIFIED';
    } catch {
      return 'UNKNOWN';
    }
  }

  /**
   * Deletes an evidence item and removes storage object
   */
  public async deleteEvidence(
    incidentId: string,
    evidenceId: string,
    userId: string
  ): Promise<boolean> {
    const list = this.getLocalEvidence(incidentId);
    const item = list.find((e) => e.id === evidenceId);
    const updated = list.filter((e) => e.id !== evidenceId);
    this.saveLocalEvidence(incidentId, updated);

    if (item && isSupabaseConfigured() && navigator.onLine) {
      try {
        await supabase.storage
          .from(INCIDENT_VAULT_CONFIG.storage.bucketName)
          .remove([item.storagePath]);

        await supabase
          .from('incident_evidence')
          .delete()
          .eq('id', evidenceId)
          .eq('user_id', userId);
      } catch {}
    }

    await incidentService.recordTimelineEvent(incidentId, userId, {
      eventType: 'EVIDENCE_DELETED',
      title: 'Evidence Item Removed',
      description: `Removed item: ${item?.sanitizedFileName || evidenceId}.`,
      metadata: { evidenceId },
    });

    return true;
  }
}

export const evidenceService = new EvidenceService();
