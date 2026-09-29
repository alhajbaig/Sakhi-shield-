// SakhiShield — Trusted Circle Alert Service (Production Resilient Architecture)
// Real-time multi-recipient alert dispatch, idempotency deduplication, acknowledgement, and resolution

import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { generateSecureId } from '../lib/securityUtils';
import { trustedCircleService } from './trustedCircleService';
import { emergencyAudioManager } from './emergencyAudioManager';
import type {
  TrustedCircleAlert,
  TrustedCircleAlertRecipient,
  AlertType,
  AlertSeverity,
} from '../types/trustedCircle';

const LOCAL_ALERTS_KEY = 'sakhishield_trusted_alerts';
const LOCAL_RECIPIENTS_KEY = 'sakhishield_trusted_alert_recipients';

// BroadcastChannel for instantaneous cross-tab alert relay
let alertChannel: BroadcastChannel | null = null;
if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
  try {
    alertChannel = new BroadcastChannel('sakhishield_trusted_circle_alerts');
  } catch {}
}

const notifyAlertSync = (event: { type: string; payload: any }) => {
  try {
    alertChannel?.postMessage(event);
  } catch {}
};

const memoryStore = new Map<string, string>();

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
    return memoryStore.get(key) || null;
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
    memoryStore.set(key, val);
  },
};

// Local storage helpers
const getStoredAlerts = (): TrustedCircleAlert[] => {
  try {
    const raw = safeStorage.getItem(LOCAL_ALERTS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const saveStoredAlerts = (alerts: TrustedCircleAlert[]) => {
  try {
    safeStorage.setItem(LOCAL_ALERTS_KEY, JSON.stringify(alerts));
  } catch {}
};

const getStoredRecipients = (): TrustedCircleAlertRecipient[] => {
  try {
    const raw = safeStorage.getItem(LOCAL_RECIPIENTS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const saveStoredRecipients = (recipients: TrustedCircleAlertRecipient[]) => {
  try {
    safeStorage.setItem(LOCAL_RECIPIENTS_KEY, JSON.stringify(recipients));
  } catch {}
};

export const trustedCircleAlertService = {
  /**
   * Subscribe to real-time alerts and acknowledgement events across tabs & Supabase
   */
  subscribeToAlerts(callback: (event: { type: string; alert?: TrustedCircleAlert; recipient?: TrustedCircleAlertRecipient }) => void): () => void {
    const handlers: (() => void)[] = [];

    // 1. Cross-tab BroadcastChannel listener
    if (alertChannel) {
      const bHandler = (e: MessageEvent) => {
        if (e.data && e.data.type) {
          // Immediately sync local storage on ALERT_RESOLVED across all open tabs
          if (e.data.type === 'ALERT_RESOLVED') {
            const resAlertId = e.data.payload?.alertId;
            const resUserId = e.data.payload?.resolvedBy;
            const local = getStoredAlerts();
            let mod = false;
            for (const a of local) {
              if (
                (resAlertId && a.id === resAlertId) ||
                (resUserId && a.triggered_by_user_id === resUserId)
              ) {
                if (a.status !== 'RESOLVED') {
                  a.status = 'RESOLVED';
                  a.resolved_at = e.data.payload?.resolvedAt || new Date().toISOString();
                  mod = true;
                }
              }
            }
            if (mod) saveStoredAlerts(local);
          }
          callback(e.data);
        }
      };
      alertChannel.addEventListener('message', bHandler);
      handlers.push(() => alertChannel?.removeEventListener('message', bHandler));
    }

    // 2. Supabase Realtime channel listener
    if (isSupabaseConfigured()) {
      try {
        const channelId = generateSecureId('tc_alerts');
        const channel = supabase
          .channel(channelId)
          .on(
            'postgres_changes',
            { event: '*', schema: 'public', table: 'trusted_circle_alerts' },
            (payload) => {
              callback({ type: 'ALERT_UPDATED', alert: payload.new as any });
            }
          )
          .on(
            'postgres_changes',
            { event: '*', schema: 'public', table: 'trusted_circle_alert_recipients' },
            (payload) => {
              callback({ type: 'RECIPIENT_UPDATED', recipient: payload.new as any });
            }
          )
          .subscribe();

        handlers.push(() => {
          try {
            supabase.removeChannel(channel);
          } catch {}
        });
      } catch (err) {
        console.warn('[trustedCircleAlertService] Realtime subscription fallback:', err);
      }
    }

    return () => {
      handlers.forEach((h) => h());
    };
  },

  /**
   * Trigger high-priority emergency alert to all approved members in user's circle(s)
   */
  async triggerAlert(params: {
    circleId?: string;
    triggeredByUserId: string;
    triggeredByUserName: string;
    alertType: AlertType;
    severity?: AlertSeverity;
    message: string;
    locationShared: boolean;
    latitude?: number | null;
    longitude?: number | null;
    locationAccuracy?: number | null;
    sourceEventId?: string;
  }): Promise<TrustedCircleAlert | null> {
    const now = new Date().toISOString();
    const severity = params.severity || 'CRITICAL';

    // 1. Identify destination circle
    let targetCircleId = params.circleId;
    if (!targetCircleId) {
      const userCircles = await trustedCircleService.getUserCircles(params.triggeredByUserId);
      if (userCircles.length > 0) {
        targetCircleId = userCircles[0].id;
      }
    }

    if (!targetCircleId) {
      console.warn('[trustedCircleAlertService] No active circle found for user to notify');
      return null;
    }

    // 2. Compute idempotency key to prevent duplicate alerts
    const idempotencyKey = `${targetCircleId}:${params.triggeredByUserId}:${params.sourceEventId || 'manual'}:${params.alertType}`;

    // Active emergency session reuse: In production safety systems, a user has at most ONE active emergency alert.
    // If an alert is already active for this user, reuse and refresh it rather than spawning duplicate zombie alerts.
    const existingAlerts = getStoredAlerts();
    const activeExisting = existingAlerts.find(
      (a) => a.triggered_by_user_id === params.triggeredByUserId && a.status !== 'RESOLVED'
    );
    if (activeExisting) {
      activeExisting.message = params.message;
      if (params.locationShared && params.latitude && params.longitude) {
        activeExisting.location_shared = true;
        activeExisting.latitude = params.latitude;
        activeExisting.longitude = params.longitude;
        activeExisting.location_accuracy = params.locationAccuracy || activeExisting.location_accuracy;
      }
      activeExisting.updated_at = now;
      saveStoredAlerts(existingAlerts);
      notifyAlertSync({ type: 'ALERT_UPDATED', payload: activeExisting });

      if (typeof fetch !== 'undefined') {
        try {
          await fetch('/api/trusted-circle/alert', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ alert: activeExisting }),
          });
        } catch {}
      }
      return activeExisting;
    }

    // 3. Fetch circle members to dispatch recipient records
    const members = await trustedCircleService.getCircleMembers(targetCircleId);
    const eligibleRecipients = members.filter(
      (m) => m.user_id !== params.triggeredByUserId && m.status === 'APPROVED'
    );

    const alertId = generateSecureId('alt');

    // 4. Construct recipient delivery records
    const recipients: TrustedCircleAlertRecipient[] = eligibleRecipients.map((m) => ({
      id: generateSecureId('rcp'),
      alert_id: alertId,
      user_id: m.user_id,
      user_name: m.user_name || 'Guardian',
      user_phone: m.user_phone,
      status: 'SENT',
      sent_at: now,
    }));

    const newAlert: TrustedCircleAlert = {
      id: alertId,
      circle_id: targetCircleId,
      triggered_by_user_id: params.triggeredByUserId,
      triggered_by_user_name: params.triggeredByUserName,
      source_event_id: params.sourceEventId || null,
      idempotency_key: idempotencyKey,
      alert_type: params.alertType,
      severity,
      message: params.message,
      location_shared: params.locationShared,
      latitude: params.latitude || null,
      longitude: params.longitude || null,
      location_accuracy: params.locationAccuracy || null,
      status: 'ACTIVE',
      created_at: now,
      updated_at: now,
      recipients,
    };

    // 5. Save locally (immediate reliability)
    existingAlerts.push(newAlert);
    saveStoredAlerts(existingAlerts);

    const allRecipients = getStoredRecipients();
    recipients.forEach((r) => allRecipients.push(r));
    saveStoredRecipients(allRecipients);

    // 6. Broadcast across tabs immediately
    notifyAlertSync({ type: 'ALERT_CREATED', payload: newAlert });

    // Sync to shared server (cross-browser / incognito / multi-device sync)
    if (typeof fetch !== 'undefined') {
      try {
        await fetch('/api/trusted-circle/alert', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ alert: newAlert, recipients }),
        });
      } catch {}
    }

    // 7. System notification if recipient tab is backgrounded
    if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
      try {
        new Notification(`🚨 SAFETY ALERT: ${params.triggeredByUserName}`, {
          body: params.message,
          icon: '/icons/sakhishield-icon.png',
          tag: 'sakhishield-emergency-alert',
        });
      } catch {}
    }

    // 8. Remote Supabase persistence if available
    if (isSupabaseConfigured() && navigator.onLine) {
      try {
        const { error: aErr } = await supabase.from('trusted_circle_alerts').insert({
          id: newAlert.id,
          circle_id: newAlert.circle_id,
          triggered_by_user_id: newAlert.triggered_by_user_id,
          source_event_id: newAlert.source_event_id,
          idempotency_key: newAlert.idempotency_key,
          alert_type: newAlert.alert_type,
          severity: newAlert.severity,
          message: newAlert.message,
          location_shared: newAlert.location_shared,
          latitude: newAlert.latitude,
          longitude: newAlert.longitude,
          location_accuracy: newAlert.location_accuracy,
          status: newAlert.status,
          created_at: newAlert.created_at,
          updated_at: newAlert.updated_at,
        });

        if (!aErr && recipients.length > 0) {
          const { error: rErr } = await supabase.from('trusted_circle_alert_recipients').insert(
            recipients.map((r) => ({
              id: r.id,
              alert_id: r.alert_id,
              user_id: r.user_id,
              status: r.status,
              sent_at: r.sent_at,
            }))
          );
          if (rErr) {
            console.warn('[trustedCircleAlertService] Failed to insert alert recipients to Supabase:', rErr);
          }
        } else if (aErr) {
          console.warn('[trustedCircleAlertService] Failed to insert alert to Supabase:', aErr);
        }
      } catch (err) {
        console.warn('[trustedCircleAlertService] Supabase alert insert buffered locally:', err);
      }
    }

    return newAlert;
  },

  /**
   * Fetch unresolved active alerts relevant to the current user (survives reload & navigation)
   */
  async getActiveAlertsForUser(userId: string): Promise<{
    incomingAlerts: TrustedCircleAlert[];
    outgoingAlerts: TrustedCircleAlert[];
  }> {
    const allAlerts = getStoredAlerts();
    const allRecipients = getStoredRecipients();

    // 1. Fetch from Supabase if online
    if (isSupabaseConfigured() && navigator.onLine) {
      try {
        // Query active outgoing alerts
        const { data: outData } = await supabase
          .from('trusted_circle_alerts')
          .select('*, profiles(name, phone)')
          .eq('triggered_by_user_id', userId)
          .neq('status', 'RESOLVED')
          .order('created_at', { ascending: false });

        // Query active incoming alerts where user is a recipient
        const { data: inRecipData } = await supabase
          .from('trusted_circle_alert_recipients')
          .select('*, trusted_circle_alerts(*, profiles(name, phone))')
          .eq('user_id', userId);

        if (outData || inRecipData) {
          const outgoing: TrustedCircleAlert[] = (outData || []).map((a: any) => ({
            ...a,
            triggered_by_user_name: a.profiles?.name || 'You',
            recipients: allRecipients.filter((r) => r.alert_id === a.id),
          }));

          const incoming: TrustedCircleAlert[] = (inRecipData || [])
            .map((r: any) => r.trusted_circle_alerts)
            .filter((a: any) => a && a.status !== 'RESOLVED')
            .map((a: any) => ({
              ...a,
              triggered_by_user_name: a.profiles?.name || 'Circle Member',
              recipients: allRecipients.filter((rec) => rec.alert_id === a.id),
            }));

          if (outgoing.length > 0 || incoming.length > 0) {
            return { incomingAlerts: incoming, outgoingAlerts: outgoing };
          }
        }
      } catch (err) {
        console.warn('[trustedCircleAlertService] Remote active alerts fallback to local:', err);
      }
    }

    // 2. Shared dev server fallback (cross-browser / incognito sync)
    if (typeof fetch !== 'undefined') {
      try {
        const res = await fetch(`/api/trusted-circle/active-alerts?userId=${encodeURIComponent(userId)}`);
        if (res.ok) {
          const body = await res.json();
          if (Array.isArray(body.incomingAlerts) && Array.isArray(body.outgoingAlerts)) {
            // Server response is authoritative truth. Reconcile local storage to prevent zombie state.
            const local = getStoredAlerts();
            let mod = false;

            if (body.outgoingAlerts.length === 0) {
              for (const a of local) {
                if (a.triggered_by_user_id === userId && a.status !== 'RESOLVED') {
                  a.status = 'RESOLVED';
                  mod = true;
                }
              }
            }

            if (body.incomingAlerts.length === 0) {
              for (const a of local) {
                if (a.triggered_by_user_id !== userId && a.status !== 'RESOLVED') {
                  a.status = 'RESOLVED';
                  mod = true;
                }
              }
            }

            if (mod) saveStoredAlerts(local);
            return body;
          }
        }
      } catch {}
    }

    // 3. Local store fallback
    const outgoing = allAlerts
      .filter((a) => a.triggered_by_user_id === userId && a.status !== 'RESOLVED')
      .map((a) => ({
        ...a,
        recipients: allRecipients.filter((r) => r.alert_id === a.id),
      }));

    const incoming = allAlerts
      .filter((a) => a.triggered_by_user_id !== userId && a.status !== 'RESOLVED')
      .filter((a) => {
        const myRecip = allRecipients.find((r) => r.alert_id === a.id && r.user_id === userId);
        return Boolean(myRecip);
      })
      .map((a) => ({
        ...a,
        recipients: allRecipients.filter((r) => r.alert_id === a.id),
      }));

    return {
      incomingAlerts: incoming,
      outgoingAlerts: outgoing,
    };
  },

  /**
   * Retrieve a specific alert by ID with its recipients
   */
  getAlertById(alertId: string): TrustedCircleAlert | null {
    const allAlerts = getStoredAlerts();
    const allRecipients = getStoredRecipients();
    const alert = allAlerts.find((a) => a.id === alertId);
    if (!alert) return null;
    return {
      ...alert,
      recipients: allRecipients.filter((r) => r.alert_id === alertId),
    };
  },

  /**
   * Recipient acknowledges the emergency alert
   */
  async acknowledgeAlert(alertId: string, recipientUserId: string, recipientUserName?: string): Promise<void> {
    const now = new Date().toISOString();

    // 1. Stop local siren immediately on acknowledgement
    emergencyAudioManager.stopSiren();

    // 2. Update recipient status locally
    const allRecipients = getStoredRecipients();
    let updatedRecipient: TrustedCircleAlertRecipient | null = null;

    const modifiedRecipients = allRecipients.map((r) => {
      if (r.alert_id === alertId && r.user_id === recipientUserId) {
        updatedRecipient = {
          ...r,
          status: 'ACKNOWLEDGED' as const,
          acknowledged_at: now,
          user_name: recipientUserName || r.user_name,
        };
        return updatedRecipient;
      }
      return r;
    });
    saveStoredRecipients(modifiedRecipients);

    // 3. Update alert status to ACKNOWLEDGED locally
    const allAlerts = getStoredAlerts();
    let updatedAlert: TrustedCircleAlert | null = null;

    const modifiedAlerts = allAlerts.map((a) => {
      if (a.id === alertId) {
        updatedAlert = {
          ...a,
          status: 'ACKNOWLEDGED' as const,
          acknowledged_at: a.acknowledged_at || now,
          recipients: modifiedRecipients.filter((r) => r.alert_id === alertId),
        };
        return updatedAlert;
      }
      return a;
    });
    saveStoredAlerts(modifiedAlerts);

    // 4. Broadcast acknowledgement so person in danger sees it live
    notifyAlertSync({
      type: 'ALERT_ACKNOWLEDGED',
      payload: {
        alertId,
        recipientUserId,
        recipientUserName: recipientUserName || 'Guardian',
        acknowledgedAt: now,
        alert: updatedAlert,
      },
    });

    if (typeof fetch !== 'undefined') {
      try {
        await fetch('/api/trusted-circle/acknowledge', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ alertId, userId: recipientUserId }),
        });
      } catch {}
    }

    // 5. Update Supabase if available
    if (isSupabaseConfigured() && navigator.onLine) {
      try {
        await supabase
          .from('trusted_circle_alert_recipients')
          .update({ status: 'ACKNOWLEDGED', acknowledged_at: now })
          .eq('alert_id', alertId)
          .eq('user_id', recipientUserId);

        await supabase
          .from('trusted_circle_alerts')
          .update({ status: 'ACKNOWLEDGED', acknowledged_at: now, updated_at: now })
          .eq('id', alertId);
      } catch (err) {
        console.warn('[trustedCircleAlertService] Remote acknowledge sync error:', err);
      }
    }
  },

  /**
   * Share/update real-time emergency GPS location for an active alert
   */
  async shareLocation(
    alertIdOrCircleId: string,
    latitude: number,
    longitude: number,
    accuracy?: number
  ): Promise<void> {
    const now = new Date().toISOString();
    const allAlerts = getStoredAlerts();
    let targetAlert: TrustedCircleAlert | null = null;

    const updatedAlerts = allAlerts.map((a) => {
      if ((a.id === alertIdOrCircleId || a.circle_id === alertIdOrCircleId) && a.status !== 'RESOLVED') {
        targetAlert = {
          ...a,
          location_shared: true,
          latitude,
          longitude,
          location_accuracy: accuracy,
          updated_at: now,
        };
        return targetAlert;
      }
      return a;
    });

    saveStoredAlerts(updatedAlerts);

    if (targetAlert) {
      notifyAlertSync({
        type: 'ALERT_LOCATION_UPDATED',
        payload: { alert: targetAlert, latitude, longitude, accuracy },
      });

      if (isSupabaseConfigured() && navigator.onLine) {
        try {
          await supabase
            .from('trusted_circle_alerts')
            .update({
              location_shared: true,
              latitude,
              longitude,
              location_accuracy: accuracy,
              updated_at: now,
            })
            .eq('id', (targetAlert as TrustedCircleAlert).id);
        } catch (err) {
          console.warn('[trustedCircleAlertService] Remote location sync warning:', err);
        }
      }
    }
  },

  /**
   * Person in danger marks themselves safe ('I'M SAFE') — resolves the alert
   * If userId is provided, also resolves ALL active alerts triggered by this user
   */
  async resolveAlert(alertId: string, _userId?: string): Promise<void> {
    const now = new Date().toISOString();
    emergencyAudioManager.stopSiren();

    const allAlerts = getStoredAlerts();
    const resolvedIds: string[] = [];

    const updatedAlerts = allAlerts.map((a) => {
      // Resolve specific alert by ID
      const shouldResolve =
        a.id === alertId ||
        // Also resolve ALL active alerts triggered by this user
        (_userId && a.triggered_by_user_id === _userId && a.status !== 'RESOLVED');

      if (shouldResolve) {
        resolvedIds.push(a.id);
        return {
          ...a,
          status: 'RESOLVED' as const,
          resolved_at: now,
          updated_at: now,
        };
      }
      return a;
    });
    saveStoredAlerts(updatedAlerts);

    // Broadcast resolution for each resolved alert
    for (const id of resolvedIds) {
      notifyAlertSync({
        type: 'ALERT_RESOLVED',
        payload: { alertId: id, resolvedAt: now, resolvedBy: _userId },
      });
    }

    if (typeof fetch !== 'undefined') {
      try {
        await fetch('/api/trusted-circle/resolve', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ alertId, userId: _userId }),
        });
      } catch {}
    }

    if (isSupabaseConfigured() && navigator.onLine) {
      try {
        // Resolve specific alert
        await supabase
          .from('trusted_circle_alerts')
          .update({ status: 'RESOLVED', resolved_at: now, updated_at: now })
          .eq('id', alertId);

        // Also resolve all alerts by this user
        if (_userId) {
          await supabase
            .from('trusted_circle_alerts')
            .update({ status: 'RESOLVED', resolved_at: now, updated_at: now })
            .eq('triggered_by_user_id', _userId)
            .neq('status', 'RESOLVED');
        }
      } catch (err) {
        console.warn('[trustedCircleAlertService] Remote resolve sync error:', err);
      }
    }
  },
};
