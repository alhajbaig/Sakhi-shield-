// Walk With Me - Production Hardened Journey Persistence Service
// Integrates Supabase with IndexedDB Offline Queue, Database Health Checks, and Idempotent Multi-Table Sync

import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { offlineQueueService } from './offlineQueueService';
import { monitoringHealthService } from './monitoringHealthService';
import { generateSecureId } from '../lib/securityUtils';
import type { Journey, JourneyEvent, JourneyStatus, QueuedSafetyEvent } from '../types/journey';
import type { RiskEvent, DatabaseHealth } from '../types/safety';

export interface DatabaseCapabilityStatus {
  status: DatabaseHealth;
  isCloudSyncActive: boolean;
  hasTables: boolean;
  message: string;
}

// 1. Explicit Database Capability Verification (Section 8, 11, 12)
export const verifyDatabaseCapabilities = async (): Promise<DatabaseCapabilityStatus> => {
  if (typeof navigator !== 'undefined' && !navigator.onLine) {
    monitoringHealthService.updateDatabase('OFFLINE');
    return {
      status: 'OFFLINE',
      isCloudSyncActive: false,
      hasTables: false,
      message: 'Network offline — local safety buffering active',
    };
  }

  if (!isSupabaseConfigured()) {
    monitoringHealthService.updateDatabase('BUFFERED_LOCAL');
    return {
      status: 'BUFFERED_LOCAL',
      isCloudSyncActive: false,
      hasTables: false,
      message: 'Supabase credentials not configured — on-device storage active',
    };
  }

  try {
    // Probe 'journeys' table to test table existence and RLS availability
    const { error } = await supabase.from('journeys').select('id').limit(1);

    if (error) {
      if (error.code === 'PGRST205' || error.message?.includes('relation "public.journeys" does not exist')) {
        monitoringHealthService.updateDatabase('BUFFERED_LOCAL');
        return {
          status: 'BUFFERED_LOCAL',
          isCloudSyncActive: false,
          hasTables: false,
          message: 'Database migration pending in Supabase — events safely queued on-device',
        };
      }

      if (error.code === 'PGRST301' || error.message?.includes('JWT expired')) {
        monitoringHealthService.updateDatabase('AUTH_EXPIRED');
        return {
          status: 'AUTH_EXPIRED',
          isCloudSyncActive: false,
          hasTables: false,
          message: 'Session expired — re-authentication required for cloud sync',
        };
      }

      monitoringHealthService.updateDatabase('BUFFERED_LOCAL');
      return {
        status: 'BUFFERED_LOCAL',
        isCloudSyncActive: false,
        hasTables: false,
        message: 'Cloud sync unavailable — events buffered locally',
      };
    }

    monitoringHealthService.updateDatabase('HEALTHY');
    return {
      status: 'HEALTHY',
      isCloudSyncActive: true,
      hasTables: true,
      message: 'Cloud sync active and encrypted',
    };
  } catch {
    monitoringHealthService.updateDatabase('BUFFERED_LOCAL');
    return {
      status: 'BUFFERED_LOCAL',
      isCloudSyncActive: false,
      hasTables: false,
      message: 'Cloud connection error — local safety buffering active',
    };
  }
};

// 2. Create a new journey record
export const createJourneyRecord = async (
  journey: Omit<Journey, 'created_at' | 'updated_at'>
): Promise<Journey> => {
  const now = new Date().toISOString();
  const fullJourney: Journey = {
    ...journey,
    route_version: journey.route_version || 1,
    created_at: now,
    updated_at: now,
  };

  const dbHealth = await verifyDatabaseCapabilities();

  if (dbHealth.isCloudSyncActive) {
    try {
      const { data, error } = await supabase
        .from('journeys')
        .insert({
          id: fullJourney.id,
          user_id: fullJourney.user_id,
          destination_name: fullJourney.destination_name,
          destination_lat: fullJourney.destination_lat,
          destination_lng: fullJourney.destination_lng,
          start_lat: fullJourney.start_lat,
          start_lng: fullJourney.start_lng,
          route_geometry: fullJourney.route_geometry,
          distance_meters: fullJourney.distance_meters,
          expected_arrival: fullJourney.expected_arrival,
          estimated_arrival: fullJourney.estimated_arrival,
          status: fullJourney.status,
          risk_score: fullJourney.risk_score,
          risk_level: fullJourney.risk_level,
          monitoring_started_at: fullJourney.monitoring_started_at,
          started_at: fullJourney.started_at,
        })
        .select()
        .single();

      if (!error && data) {
        return data as Journey;
      }
      if (error) {
        console.warn('[journeyService] Cloud insert error, falling back to offline queue:', error.message);
      }
    } catch (err) {
      console.warn('[journeyService] Cloud insert exception, falling back to offline queue:', err);
    }
  }

  // Buffer in IndexedDB offline queue with explicit operationType & entityType
  await offlineQueueService.enqueueEvent({
    event_id: 'create_' + fullJourney.id,
    operationType: 'CREATE_JOURNEY',
    eventType: 'JOURNEY_STARTED',
    entityType: 'journey',
    entityId: fullJourney.id,
    journey_id: fullJourney.id,
    user_id: fullJourney.user_id,
    client_timestamp: Date.now(),
    payload: fullJourney as unknown as Record<string, unknown>,
    retry_count: 0,
    created_at: now,
    sync_status: 'PENDING',
    idempotency_key: 'idempotent_create_' + fullJourney.id,
  });

  return fullJourney;
};

// 3. Update active journey record (e.g. ETA, risk score, route version)
export const updateJourneyRecord = async (
  journeyId: string,
  updates: Partial<Journey>
): Promise<void> => {
  const updatedPayload = {
    ...updates,
    updated_at: new Date().toISOString(),
  };

  if (isSupabaseConfigured() && navigator.onLine) {
    try {
      const { error } = await supabase
        .from('journeys')
        .update(updatedPayload)
        .eq('id', journeyId);

      if (!error) return;
      console.warn('[journeyService] Update journey error, buffering to offline queue:', error.message);
    } catch (err) {
      console.warn('[journeyService] Update journey exception, buffering to offline queue:', err);
    }
  }

  // Buffer update in IndexedDB
  await offlineQueueService.enqueueEvent({
    event_id: 'update_' + journeyId + '_' + Date.now(),
    operationType: 'UPDATE_JOURNEY',
    eventType: 'LOCATION_UPDATE',
    entityType: 'journey',
    entityId: journeyId,
    journey_id: journeyId,
    user_id: updates.user_id || 'anonymous',
    client_timestamp: Date.now(),
    payload: updatedPayload as unknown as Record<string, unknown>,
    retry_count: 0,
    created_at: new Date().toISOString(),
    sync_status: 'PENDING',
    idempotency_key: 'idempotent_update_' + journeyId + '_' + Date.now(),
  });
};

// 4. Record an audit journey event (deviation, stop, arrival, etc.)
export const recordJourneyEvent = async (
  event: Omit<JourneyEvent, 'id' | 'timestamp'> & { id?: string }
): Promise<void> => {
  const eventId = event.id || generateSecureId('evt');
  const timestamp = new Date().toISOString();

  const payload: JourneyEvent = {
    id: eventId,
    journey_id: event.journey_id,
    user_id: event.user_id,
    event_type: event.event_type,
    timestamp,
    latitude: event.latitude,
    longitude: event.longitude,
    accuracy: event.accuracy,
    metadata: event.metadata,
  };

  if (isSupabaseConfigured() && navigator.onLine) {
    try {
      const { error } = await supabase.from('journey_events').insert(payload);
      if (!error) return;
      console.warn('[journeyService] Insert journey event error, buffering:', error.message);
    } catch (err) {
      console.warn('[journeyService] Insert journey event exception, buffering:', err);
    }
  }

  // Buffer in IndexedDB
  await offlineQueueService.enqueueEvent({
    event_id: eventId,
    operationType: 'CREATE_JOURNEY_EVENT',
    eventType: event.event_type,
    entityType: 'journey_event',
    entityId: eventId,
    journey_id: event.journey_id,
    user_id: event.user_id,
    client_timestamp: Date.now(),
    payload: payload as unknown as Record<string, unknown>,
    retry_count: 0,
    created_at: timestamp,
    sync_status: 'PENDING',
    idempotency_key: 'idempotent_jevt_' + eventId,
  });
};

// 5. Record a deterministic risk event
export const recordRiskEvent = async (
  riskEvent: Omit<RiskEvent, 'id' | 'timestamp'> & { id?: string; user_id?: string }
): Promise<void> => {
  const eventId = riskEvent.id || generateSecureId('risk');
  const timestamp = new Date().toISOString();

  const payload: RiskEvent = {
    id: eventId,
    journey_id: riskEvent.journey_id,
    event_type: riskEvent.event_type,
    severity: riskEvent.severity,
    score_delta: riskEvent.score_delta,
    reason: riskEvent.reason,
    metadata: riskEvent.metadata,
    timestamp,
  };

  if (isSupabaseConfigured() && navigator.onLine) {
    try {
      const { error } = await supabase.from('risk_events').insert(payload);
      if (!error) return;
      console.warn('[journeyService] Insert risk event error, buffering:', error.message);
    } catch (err) {
      console.warn('[journeyService] Insert risk event exception, buffering:', err);
    }
  }

  // Buffer in IndexedDB correctly routed to risk_events table
  await offlineQueueService.enqueueEvent({
    event_id: eventId,
    operationType: 'CREATE_RISK_EVENT',
    eventType: 'ROUTE_DEVIATION',
    entityType: 'risk_event',
    entityId: eventId,
    journey_id: riskEvent.journey_id,
    user_id: riskEvent.user_id || 'anonymous',
    client_timestamp: Date.now(),
    payload: payload as unknown as Record<string, unknown>,
    retry_count: 0,
    created_at: timestamp,
    sync_status: 'PENDING',
    idempotency_key: 'idempotent_risk_' + eventId,
  });
};

// 6. Complete a journey and flush queue
export const completeJourneyRecord = async (
  journeyId: string,
  finalStatus: JourneyStatus = 'COMPLETED'
): Promise<void> => {
  const endedAt = new Date().toISOString();
  await updateJourneyRecord(journeyId, {
    status: finalStatus,
    ended_at: endedAt,
  });

  // Flush pending events if online
  if (navigator.onLine && isSupabaseConfigured()) {
    await syncOfflineQueue();
  }
};

// 7. Flush and synchronize offline events with multi-table routing and idempotency
export const syncOfflineQueue = async (): Promise<{ synced: number; failed: number }> => {
  return offlineQueueService.flushQueue(async (queuedEvent: QueuedSafetyEvent) => {
    try {
      const op = queuedEvent.operationType;

      if (op === 'CREATE_JOURNEY') {
        const { error } = await supabase.from('journeys').upsert(queuedEvent.payload, { onConflict: 'id' });
        return { success: !error, error: error?.message };
      }

      if (op === 'UPDATE_JOURNEY' || op === 'UPDATE_JOURNEY_STATUS') {
        const targetId = queuedEvent.entityId || queuedEvent.journey_id;
        const { error } = await supabase.from('journeys').update(queuedEvent.payload).eq('id', targetId);
        return { success: !error, error: error?.message };
      }

      if (op === 'CREATE_RISK_EVENT') {
        const { error } = await supabase.from('risk_events').upsert(queuedEvent.payload, { onConflict: 'id' });
        return { success: !error, error: error?.message };
      }

      if (op === 'CREATE_ALERT') {
        const { error } = await supabase.from('trusted_circle_alerts').upsert(queuedEvent.payload, { onConflict: 'id' });
        return { success: !error, error: error?.message };
      }

      // Default: CREATE_JOURNEY_EVENT
      const { error } = await supabase.from('journey_events').upsert(queuedEvent.payload, { onConflict: 'id' });
      return { success: !error, error: error?.message };
    } catch (err: any) {
      return { success: false, error: err?.message || 'Sync operation failed' };
    }
  });
};

// Listen for network reconnection to auto-sync
if (typeof window !== 'undefined') {
  window.addEventListener('online', () => {
    syncOfflineQueue().catch(() => {});
  });
}

export const journeyService = {
  createJourneyRecord,
  updateJourneyRecord,
  recordJourneyEvent,
  recordRiskEvent,
  completeJourneyRecord,
  syncOfflineQueue,
  verifyDatabaseCapabilities,
};
