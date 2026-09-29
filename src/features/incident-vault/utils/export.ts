// SakhiShield — Incident Export Generator (JSON & Formatted Dossier)
// Prepares privacy-respecting, integrity-verified incident export packages.

import type { IncidentRecord, EvidenceMetadata, IncidentTimelineEvent, IncidentExportData } from '../types';
import { INCIDENT_VAULT_DISCLAIMERS } from '../constants/incidentVault.constants';

/**
 * Builds a structured export object for an incident
 */
export function buildIncidentExportData(
  incident: IncidentRecord,
  evidence: EvidenceMetadata[],
  timeline: IncidentTimelineEvent[]
): IncidentExportData {
  const sanitizedEvidence = evidence.map((e) => {
    // Strip transient download URLs from exported metadata
    const { downloadUrl: _, ...rest } = e;
    return rest;
  });

  return {
    exportVersion: '1.0.0',
    exportedAt: new Date().toISOString(),
    incident,
    evidence: sanitizedEvidence,
    timeline,
    integrityVerification: {
      verifiedAt: new Date().toISOString(),
      allFilesIntact: evidence.every((e) => e.integrityStatus === 'VERIFIED'),
      hashAlgorithm: 'SHA-256 (FIPS 180-4)',
    },
    disclaimer: INCIDENT_VAULT_DISCLAIMERS.INTEGRITY_NOTICE,
  };
}

/**
 * Triggers client-side browser download of export data as formatted JSON
 */
export function downloadIncidentJson(exportData: IncidentExportData, incidentTitle: string): void {
  const jsonStr = JSON.stringify(exportData, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  const cleanTitle = (incidentTitle || 'incident').replace(/[^a-zA-Z0-9_-]/g, '_');
  const filename = `sakhishield_incident_${cleanTitle}_${Date.now()}.json`;

  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
