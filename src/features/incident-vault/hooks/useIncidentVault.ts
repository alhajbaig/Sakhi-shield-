// SakhiShield — useIncidentVault Master React Hook
// Manages incidents, selection, evidence uploads, timeline, filtering, and export.

import { useState, useEffect, useCallback } from 'react';
import type {
  IncidentRecord,
  EvidenceMetadata,
  IncidentTimelineEvent,
  IncidentFilterOptions,
  IncidentCategory,
  IncidentSeverity,
  IncidentLocation,
  AssociatedSakhiShieldContext,
} from '../types';
import { incidentService } from '../services/incidentService';
import { evidenceService } from '../services/evidenceService';
import { sharingService } from '../services/sharingService';
import { buildIncidentExportData, downloadIncidentJson } from '../utils/export';
import { useAuth } from '../../../lib/AuthContext';

export function useIncidentVault() {
  const { user: authUser } = useAuth();
  const userId = authUser?.id || 'local_user';

  const [incidents, setIncidents] = useState<IncidentRecord[]>([]);
  const [selectedIncident, setSelectedIncident] = useState<IncidentRecord | null>(null);
  const [evidenceList, setEvidenceList] = useState<EvidenceMetadata[]>([]);
  const [timelineEvents, setTimelineEvents] = useState<IncidentTimelineEvent[]>([]);
  
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [filters, setFilters] = useState<IncidentFilterOptions>({
    status: 'ALL',
    category: 'ALL',
    severity: 'ALL',
    searchQuery: '',
    sortBy: 'NEWEST',
  });

  // Load all incidents
  const loadIncidents = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const records = await incidentService.getIncidents(userId, filters);
      setIncidents(records);
      if (selectedIncident) {
        const refreshedSelected = records.find((r) => r.id === selectedIncident.id);
        if (refreshedSelected) setSelectedIncident(refreshedSelected);
      }
    } catch (err: any) {
      setError(err?.message || 'Failed to load incidents.');
    } finally {
      setIsLoading(false);
    }
  }, [userId, filters, selectedIncident]);

  useEffect(() => {
    loadIncidents();
  }, [loadIncidents]);

  // Load evidence and timeline when an incident is selected
  useEffect(() => {
    if (!selectedIncident) {
      setEvidenceList([]);
      setTimelineEvents([]);
      return;
    }

    let isMounted = true;
    Promise.all([
      evidenceService.getEvidence(selectedIncident.id, userId),
      incidentService.getTimeline(selectedIncident.id, userId),
    ]).then(([evd, tml]) => {
      if (isMounted) {
        setEvidenceList(evd);
        setTimelineEvents(tml);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [selectedIncident, userId]);

  // Create incident action
  const createIncident = async (params: {
    title: string;
    description: string;
    category: IncidentCategory;
    severity: IncidentSeverity;
    incidentDate?: string;
    location?: IncidentLocation;
    associatedContext?: AssociatedSakhiShieldContext;
    notes?: string;
  }): Promise<IncidentRecord> => {
    const created = await incidentService.createIncident({
      ...params,
      userId,
    });
    setIncidents((prev) => [created, ...prev]);
    setSelectedIncident(created);
    return created;
  };

  // Update incident action
  const updateIncident = async (
    incidentId: string,
    updates: Partial<IncidentRecord>
  ): Promise<IncidentRecord> => {
    const updated = await incidentService.updateIncident(incidentId, userId, updates);
    setIncidents((prev) => prev.map((i) => (i.id === incidentId ? updated : i)));
    if (selectedIncident?.id === incidentId) {
      setSelectedIncident(updated);
    }
    return updated;
  };

  // Delete incident action
  const deleteIncident = async (incidentId: string): Promise<boolean> => {
    const success = await incidentService.deleteIncident(incidentId, userId);
    if (success) {
      setIncidents((prev) => prev.filter((i) => i.id !== incidentId));
      if (selectedIncident?.id === incidentId) {
        setSelectedIncident(null);
      }
    }
    return success;
  };

  // Attach evidence action
  const attachEvidence = async (file: File, description?: string): Promise<EvidenceMetadata> => {
    if (!selectedIncident) {
      throw new Error('No incident selected.');
    }
    setIsUploading(true);
    try {
      const metadata = await evidenceService.uploadEvidence({
        incidentId: selectedIncident.id,
        userId,
        file,
        description,
      });
      setEvidenceList((prev) => [metadata, ...prev]);
      // Update selected incident count
      setSelectedIncident((prev) => (prev ? { ...prev, evidenceCount: prev.evidenceCount + 1 } : null));
      // Refresh timeline
      const updatedTimeline = await incidentService.getTimeline(selectedIncident.id, userId);
      setTimelineEvents(updatedTimeline);
      return metadata;
    } finally {
      setIsUploading(false);
    }
  };

  // Delete evidence action
  const deleteEvidence = async (evidenceId: string): Promise<boolean> => {
    if (!selectedIncident) return false;
    const success = await evidenceService.deleteEvidence(selectedIncident.id, evidenceId, userId);
    if (success) {
      setEvidenceList((prev) => prev.filter((e) => e.id !== evidenceId));
      setSelectedIncident((prev) => (prev ? { ...prev, evidenceCount: Math.max(0, prev.evidenceCount - 1) } : null));
      const updatedTimeline = await incidentService.getTimeline(selectedIncident.id, userId);
      setTimelineEvents(updatedTimeline);
    }
    return success;
  };

  // Verify evidence integrity
  const verifyIntegrity = async (evidence: EvidenceMetadata): Promise<void> => {
    const status = await evidenceService.verifyIntegrity(evidence);
    setEvidenceList((prev) =>
      prev.map((e) => (e.id === evidence.id ? { ...e, integrityStatus: status, lastVerifiedAt: new Date().toISOString() } : e))
    );
  };

  // Create share link action
  const createShareLink = async (
    scope: 'SUMMARY_ONLY' | 'SELECTED_EVIDENCE' | 'FULL_INCIDENT',
    durationHours?: number,
    selectedEvidenceIds?: string[]
  ) => {
    if (!selectedIncident) throw new Error('No incident selected.');
    return sharingService.createShareLink({
      incidentId: selectedIncident.id,
      userId,
      scope,
      selectedEvidenceIds,
      durationHours,
    });
  };

  // Export incident JSON dossier
  const exportIncident = () => {
    if (!selectedIncident) return;
    const exportData = buildIncidentExportData(selectedIncident, evidenceList, timelineEvents);
    downloadIncidentJson(exportData, selectedIncident.title);
  };

  return {
    incidents,
    selectedIncident,
    setSelectedIncident,
    evidenceList,
    timelineEvents,
    filters,
    setFilters,
    isLoading,
    isUploading,
    error,
    createIncident,
    updateIncident,
    deleteIncident,
    attachEvidence,
    deleteEvidence,
    verifyIntegrity,
    createShareLink,
    exportIncident,
    reload: loadIncidents,
  };
}
