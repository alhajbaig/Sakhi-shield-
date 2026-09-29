// SakhiShield — Incident Vault Core Service
// Handles incident creation, retrieval, updates, timeline tracking, and offline persistence.

import { supabase, isSupabaseConfigured } from '../../../lib/supabase';
import { generateSecureId } from '../../../lib/securityUtils';
import type {
  IncidentRecord,
  IncidentTimelineEvent,
  IncidentFilterOptions,
  IncidentCategory,
  IncidentSeverity,
  IncidentLocation,
  AssociatedSakhiShieldContext,
} from '../types';
import { incidentVaultQueue } from '../offline/incidentVaultQueue';

const LOCAL_INCIDENTS_KEY = 'sakhishield_incident_vault_local_records_v1';
const LOCAL_TIMELINE_KEY = 'sakhishield_incident_vault_local_timeline_v1';

const memoryIncidents = new Map<string, string>();
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
    return memoryIncidents.get(key) || null;
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
    memoryIncidents.set(key, val);
  },
};

export class IncidentService {
  private getLocalIncidents(): IncidentRecord[] {
    try {
      const data = safeStorage.getItem(LOCAL_INCIDENTS_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  private saveLocalIncidents(records: IncidentRecord[]): void {
    try {
      safeStorage.setItem(LOCAL_INCIDENTS_KEY, JSON.stringify(records));
    } catch {}
  }

  private getLocalTimeline(incidentId: string): IncidentTimelineEvent[] {
    try {
      const data = safeStorage.getItem(`${LOCAL_TIMELINE_KEY}_${incidentId}`);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  private saveLocalTimeline(incidentId: string, events: IncidentTimelineEvent[]): void {
    try {
      safeStorage.setItem(`${LOCAL_TIMELINE_KEY}_${incidentId}`, JSON.stringify(events));
    } catch {}
  }

  /**
   * Fetches user incidents with optional filtering & sorting
   */
  public async getIncidents(
    userId: string,
    filters?: IncidentFilterOptions
  ): Promise<IncidentRecord[]> {
    let incidents: IncidentRecord[] = [];

    if (isSupabaseConfigured() && navigator.onLine) {
      try {
        let query = supabase
          .from('incidents')
          .select('*')
          .eq('user_id', userId);

        if (filters?.status && filters.status !== 'ALL') {
          query = query.eq('status', filters.status);
        }
        if (filters?.category && filters.category !== 'ALL') {
          query = query.eq('category', filters.category);
        }
        if (filters?.severity && filters.severity !== 'ALL') {
          query = query.eq('severity', filters.severity);
        }

        const { data, error } = await query.order('incident_date', { ascending: false });

        if (!error && data) {
          incidents = data.map((row: any) => ({
            id: row.id,
            userId: row.user_id,
            title: row.title,
            description: row.description,
            category: row.category,
            severity: row.severity,
            status: row.status,
            incidentDate: row.incident_date,
            location: row.location,
            associatedContext: row.associated_context,
            notes: row.notes,
            evidenceCount: row.evidence_count || 0,
            createdAt: row.created_at,
            updatedAt: row.updated_at,
            resolvedAt: row.resolved_at,
            archivedAt: row.archived_at,
          }));

          // Sync local storage cache
          this.saveLocalIncidents(incidents);
          return incidents;
        }
      } catch (err) {
        console.warn('[incidentService] Supabase query failed, falling back to local:', err);
      }
    }

    // Local / Offline fallback
    incidents = this.getLocalIncidents().filter((inc) => inc.userId === userId);

    if (filters?.status && filters.status !== 'ALL') {
      incidents = incidents.filter((i) => i.status === filters.status);
    }
    if (filters?.category && filters.category !== 'ALL') {
      incidents = incidents.filter((i) => i.category === filters.category);
    }
    if (filters?.severity && filters.severity !== 'ALL') {
      incidents = incidents.filter((i) => i.severity === filters.severity);
    }
    if (filters?.searchQuery) {
      const q = filters.searchQuery.toLowerCase();
      incidents = incidents.filter(
        (i) => i.title.toLowerCase().includes(q) || i.description.toLowerCase().includes(q)
      );
    }

    return incidents;
  }

  /**
   * Creates a new incident with initial timeline event
   */
  public async createIncident(params: {
    userId: string;
    title: string;
    description: string;
    category: IncidentCategory;
    severity: IncidentSeverity;
    incidentDate?: string;
    location?: IncidentLocation;
    associatedContext?: AssociatedSakhiShieldContext;
    notes?: string;
  }): Promise<IncidentRecord> {
    const id = generateSecureId('inc');
    const now = new Date().toISOString();

    const newIncident: IncidentRecord = {
      id,
      userId: params.userId,
      title: params.title.trim(),
      description: params.description.trim(),
      category: params.category,
      severity: params.severity,
      status: 'ACTIVE',
      incidentDate: params.incidentDate || now,
      location: params.location,
      associatedContext: params.associatedContext,
      notes: params.notes?.trim(),
      evidenceCount: 0,
      createdAt: now,
      updatedAt: now,
    };

    const initialEvent: IncidentTimelineEvent = {
      id: generateSecureId('evt'),
      incidentId: id,
      userId: params.userId,
      eventType: 'INCIDENT_CREATED',
      title: 'Incident Record Created',
      description: `Opened ${params.severity.toLowerCase()} severity incident record in category: ${params.category}.`,
      timestamp: now,
    };

    // Save locally immediately
    const local = this.getLocalIncidents();
    local.unshift(newIncident);
    this.saveLocalIncidents(local);
    this.saveLocalTimeline(id, [initialEvent]);

    if (isSupabaseConfigured() && navigator.onLine) {
      try {
        const { error: incErr } = await supabase.from('incidents').insert({
          id,
          user_id: params.userId,
          title: newIncident.title,
          description: newIncident.description,
          category: newIncident.category,
          severity: newIncident.severity,
          status: newIncident.status,
          incident_date: newIncident.incidentDate,
          location: newIncident.location,
          associated_context: newIncident.associatedContext,
          notes: newIncident.notes,
          evidence_count: 0,
          created_at: now,
          updated_at: now,
        });

        if (incErr) throw incErr;

        await supabase.from('incident_timeline_events').insert({
          id: initialEvent.id,
          incident_id: id,
          user_id: params.userId,
          event_type: initialEvent.eventType,
          title: initialEvent.title,
          description: initialEvent.description,
          timestamp: now,
        });
      } catch (err) {
        console.warn('[incidentService] Network insert failed, queued for sync:', err);
        incidentVaultQueue.enqueue({
          operationType: 'CREATE_INCIDENT',
          entityId: id,
          payload: newIncident,
        });
      }
    } else {
      incidentVaultQueue.enqueue({
        operationType: 'CREATE_INCIDENT',
        entityId: id,
        payload: newIncident,
      });
    }

    return newIncident;
  }

  /**
   * Fetches an incident by ID
   */
  public async getIncidentById(incidentId: string, userId: string): Promise<IncidentRecord | null> {
    if (isSupabaseConfigured() && navigator.onLine) {
      try {
        const { data, error } = await supabase
          .from('incidents')
          .select('*')
          .eq('id', incidentId)
          .eq('user_id', userId)
          .single();

        if (!error && data) {
          return {
            id: data.id,
            userId: data.user_id,
            title: data.title,
            description: data.description,
            category: data.category,
            severity: data.severity,
            status: data.status,
            incidentDate: data.incident_date,
            location: data.location,
            associatedContext: data.associated_context,
            notes: data.notes,
            evidenceCount: data.evidence_count || 0,
            createdAt: data.created_at,
            updatedAt: data.updated_at,
            resolvedAt: data.resolved_at,
            archivedAt: data.archived_at,
          };
        }
      } catch {}
    }

    const local = this.getLocalIncidents();
    return local.find((i) => i.id === incidentId && i.userId === userId) || null;
  }

  /**
   * Updates incident fields (status, notes, severity)
   */
  public async updateIncident(
    incidentId: string,
    userId: string,
    updates: Partial<IncidentRecord>
  ): Promise<IncidentRecord> {
    const existing = await this.getIncidentById(incidentId, userId);
    if (!existing) {
      throw new Error('Incident not found or unauthorized.');
    }

    const now = new Date().toISOString();
    const updated: IncidentRecord = {
      ...existing,
      ...updates,
      updatedAt: now,
      resolvedAt: updates.status === 'RESOLVED' ? now : existing.resolvedAt,
      archivedAt: updates.status === 'ARCHIVED' ? now : existing.archivedAt,
    };

    // Update local cache
    const local = this.getLocalIncidents().map((i) => (i.id === incidentId ? updated : i));
    this.saveLocalIncidents(local);

    // Record timeline update event if status changed
    if (updates.status && updates.status !== existing.status) {
      await this.recordTimelineEvent(incidentId, userId, {
        eventType: 'STATUS_CHANGED',
        title: `Status Changed to ${updates.status}`,
        description: `Incident transitioned from ${existing.status} to ${updates.status}.`,
      });
    }

    if (isSupabaseConfigured() && navigator.onLine) {
      try {
        await supabase
          .from('incidents')
          .update({
            title: updated.title,
            description: updated.description,
            category: updated.category,
            severity: updated.severity,
            status: updated.status,
            notes: updated.notes,
            updated_at: now,
            resolved_at: updated.resolvedAt,
            archived_at: updated.archivedAt,
          })
          .eq('id', incidentId)
          .eq('user_id', userId);
      } catch (err) {
        incidentVaultQueue.enqueue({
          operationType: 'UPDATE_INCIDENT',
          entityId: incidentId,
          payload: updates,
        });
      }
    }

    return updated;
  }

  /**
   * Deletes an incident record
   */
  public async deleteIncident(incidentId: string, userId: string): Promise<boolean> {
    const local = this.getLocalIncidents().filter((i) => !(i.id === incidentId && i.userId === userId));
    this.saveLocalIncidents(local);

    if (isSupabaseConfigured() && navigator.onLine) {
      try {
        const { error } = await supabase
          .from('incidents')
          .delete()
          .eq('id', incidentId)
          .eq('user_id', userId);

        if (error) throw error;
      } catch (err) {
        incidentVaultQueue.enqueue({
          operationType: 'DELETE_INCIDENT',
          entityId: incidentId,
          payload: { incidentId, userId },
        });
      }
    }

    return true;
  }

  /**
   * Fetches timeline events for an incident
   */
  public async getTimeline(incidentId: string, userId: string): Promise<IncidentTimelineEvent[]> {
    if (isSupabaseConfigured() && navigator.onLine) {
      try {
        const { data, error } = await supabase
          .from('incident_timeline_events')
          .select('*')
          .eq('incident_id', incidentId)
          .eq('user_id', userId)
          .order('timestamp', { ascending: true });

        if (!error && data) {
          const events: IncidentTimelineEvent[] = data.map((r: any) => ({
            id: r.id,
            incidentId: r.incident_id,
            userId: r.user_id,
            eventType: r.event_type,
            title: r.title,
            description: r.description,
            timestamp: r.timestamp,
            metadata: r.metadata,
          }));
          this.saveLocalTimeline(incidentId, events);
          return events;
        }
      } catch {}
    }

    return this.getLocalTimeline(incidentId);
  }

  /**
   * Adds an event to the incident timeline
   */
  public async recordTimelineEvent(
    incidentId: string,
    userId: string,
    event: {
      eventType: IncidentTimelineEvent['eventType'];
      title: string;
      description: string;
      metadata?: Record<string, unknown>;
    }
  ): Promise<IncidentTimelineEvent> {
    const newEvent: IncidentTimelineEvent = {
      id: generateSecureId('evt'),
      incidentId,
      userId,
      eventType: event.eventType,
      title: event.title,
      description: event.description,
      timestamp: new Date().toISOString(),
      metadata: event.metadata,
    };

    const currentTimeline = this.getLocalTimeline(incidentId);
    currentTimeline.push(newEvent);
    this.saveLocalTimeline(incidentId, currentTimeline);

    if (isSupabaseConfigured() && navigator.onLine) {
      try {
        await supabase.from('incident_timeline_events').insert({
          id: newEvent.id,
          incident_id: incidentId,
          user_id: userId,
          event_type: newEvent.eventType,
          title: newEvent.title,
          description: newEvent.description,
          timestamp: newEvent.timestamp,
          metadata: newEvent.metadata,
        });
      } catch {}
    }

    return newEvent;
  }
}

export const incidentService = new IncidentService();
