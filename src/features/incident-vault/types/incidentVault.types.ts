// SakhiShield — Incident Vault Types & Data Contracts
// Defines strict schemas for incidents, evidence, metadata, integrity hashes, audit logs, and secure shares.

export type IncidentCategory =
  | 'HARASSMENT'
  | 'THREAT'
  | 'SUSPICIOUS_ACTIVITY'
  | 'STALKING'
  | 'TRAVEL_INCIDENT'
  | 'EMERGENCY'
  | 'PHYSICAL_SAFETY'
  | 'DIGITAL_SAFETY'
  | 'OTHER';

export type IncidentSeverity = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export type IncidentStatus =
  | 'DRAFT'
  | 'ACTIVE'
  | 'DOCUMENTED'
  | 'RESOLVED'
  | 'ARCHIVED';

export type EvidenceCategory =
  | 'IMAGE'
  | 'AUDIO'
  | 'VIDEO'
  | 'DOCUMENT'
  | 'SCREENSHOT'
  | 'OTHER';

export type IntegrityStatus = 'VERIFIED' | 'MODIFIED' | 'UNKNOWN';

export type UploadState =
  | 'IDLE'
  | 'CALCULATING_HASH'
  | 'UPLOADING'
  | 'SAVED'
  | 'QUEUED_OFFLINE'
  | 'FAILED';

export interface IncidentLocation {
  name?: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  accuracyMeters?: number;
  isApproximate?: boolean;
}

export interface AssociatedSakhiShieldContext {
  journeyId?: string;
  journeyDestination?: string;
  alertId?: string;
  alertType?: string;
  riskScore?: number;
  riskLevel?: string;
  safetyHistoryId?: string;
}

export interface IncidentRecord {
  id: string;
  userId: string;
  title: string;
  description: string;
  category: IncidentCategory;
  severity: IncidentSeverity;
  status: IncidentStatus;
  incidentDate: string; // ISO-8601
  location?: IncidentLocation;
  associatedContext?: AssociatedSakhiShieldContext;
  notes?: string;
  isDraft?: boolean;
  evidenceCount: number;
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string;
  archivedAt?: string;
}

export interface EvidenceMetadata {
  id: string;
  incidentId: string;
  userId: string;
  fileName: string;
  sanitizedFileName: string;
  fileSizeBytes: number;
  mimeType: string;
  category: EvidenceCategory;
  storagePath: string;
  sha256Hash: string; // 0x-prefixed 64-char hex
  integrityStatus: IntegrityStatus;
  description?: string;
  capturedAt?: string; // ISO
  uploadedAt: string;
  lastVerifiedAt?: string;
  downloadUrl?: string; // Transient signed URL, never persisted
}

export interface IncidentTimelineEvent {
  id: string;
  incidentId: string;
  userId: string;
  eventType:
    | 'INCIDENT_CREATED'
    | 'INCIDENT_UPDATED'
    | 'STATUS_CHANGED'
    | 'EVIDENCE_ATTACHED'
    | 'EVIDENCE_VERIFIED'
    | 'EVIDENCE_DELETED'
    | 'SHARE_LINK_CREATED'
    | 'SHARE_LINK_REVOKED'
    | 'INCIDENT_EXPORTED';
  title: string;
  description: string;
  timestamp: string;
  metadata?: Record<string, unknown>;
}

export interface IncidentShare {
  id: string;
  incidentId: string;
  userId: string;
  shareTokenHash: string; // Cryptographic hash of token
  scope: 'SUMMARY_ONLY' | 'SELECTED_EVIDENCE' | 'FULL_INCIDENT';
  selectedEvidenceIds?: string[];
  expiresAt: string;
  isRevoked: boolean;
  revokedAt?: string;
  accessCount: number;
  lastAccessedAt?: string;
  createdAt: string;
}

export interface IncidentAuditEntry {
  id: string;
  userId: string;
  incidentId?: string;
  action: string;
  timestamp: string;
  ipAddress?: string;
  userAgent?: string;
  status: 'SUCCESS' | 'FAILED' | 'DENIED';
  metadata?: Record<string, unknown>;
}

export interface IncidentFilterOptions {
  status?: IncidentStatus | 'ALL';
  category?: IncidentCategory | 'ALL';
  severity?: IncidentSeverity | 'ALL';
  searchQuery?: string;
  sortBy?: 'NEWEST' | 'OLDEST' | 'SEVERITY' | 'RECENTLY_UPDATED';
}

export interface IncidentExportData {
  exportVersion: string;
  exportedAt: string;
  incident: IncidentRecord;
  evidence: Array<Omit<EvidenceMetadata, 'downloadUrl'>>;
  timeline: IncidentTimelineEvent[];
  integrityVerification: {
    verifiedAt: string;
    allFilesIntact: boolean;
    hashAlgorithm: string;
  };
  disclaimer: string;
}
