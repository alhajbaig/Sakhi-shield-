// SakhiShield — Custom Hook: useTrustedCircleAlerts
// Manages real-time incoming/outgoing emergency alerts, audible sirens, and acknowledgements

import { useState, useEffect, useCallback, useRef } from 'react';
import { trustedCircleAlertService } from '../services/trustedCircleAlertService';
import { emergencyAudioManager } from '../services/emergencyAudioManager';
import type { TrustedCircleAlert } from '../types/trustedCircle';

export interface UseTrustedCircleAlertsReturn {
  activeIncomingAlert: TrustedCircleAlert | null;
  activeOutgoingAlert: TrustedCircleAlert | null;
  incomingAlert: TrustedCircleAlert | null;
  outgoingAlert: TrustedCircleAlert | null;
  isAudioPlaying: boolean;
  isAutoplayBlocked: boolean;
  acknowledgeAlert: (alertId: string) => Promise<void>;
  resolveAlert: (alertId: string) => Promise<void>;
  shareLocationForAlert: (alertId: string, latitude: number, longitude: number, accuracy?: number) => Promise<void>;
  unlockAudio: () => Promise<void>;
  triggerCircleEmergency: (params: {
    message?: string;
    latitude?: number | null;
    longitude?: number | null;
    accuracy?: number | null;
    sourceEventId?: string;
  }) => Promise<TrustedCircleAlert | null>;
  dismissIncomingOverlay: () => void;
}

export const useTrustedCircleAlerts = (
  userId: string | undefined,
  userName: string = 'User'
): UseTrustedCircleAlertsReturn => {
  const [activeIncomingAlert, setActiveIncomingAlert] = useState<TrustedCircleAlert | null>(null);
  const [activeOutgoingAlert, setActiveOutgoingAlert] = useState<TrustedCircleAlert | null>(null);
  const [isAudioPlaying, setIsAudioPlaying] = useState<boolean>(false);
  const [isAutoplayBlocked, setIsAutoplayBlocked] = useState<boolean>(false);
  const dismissedAlertIdsRef = useRef<Set<string>>(new Set());
  const mountedRef = useRef(true);

  // Sync audio state
  const syncAudioState = useCallback(() => {
    setIsAudioPlaying(emergencyAudioManager.isPlaying());
    setIsAutoplayBlocked(emergencyAudioManager.isAutoplayBlocked());
  }, []);

  // Fetch active alerts on mount & reconnect (Sections 40, 41, 82)
  const syncActiveAlerts = useCallback(async () => {
    if (!userId) return;

    try {
      const { incomingAlerts, outgoingAlerts } =
        await trustedCircleAlertService.getActiveAlertsForUser(userId);

      if (!mountedRef.current) return;

      // 1. Incoming alerts
      const unacknowledged = incomingAlerts.find(
        (a) =>
          a.status !== 'RESOLVED' &&
          !dismissedAlertIdsRef.current.has(a.id) &&
          (typeof sessionStorage === 'undefined' || sessionStorage.getItem('sakhishield_acked_' + a.id) !== 'true') &&
          !a.recipients?.some((r) => r.user_id === userId && r.status === 'ACKNOWLEDGED')
      );

      if (unacknowledged) {
        setActiveIncomingAlert(unacknowledged);
        if (unacknowledged.severity === 'CRITICAL') {
          emergencyAudioManager.playSiren(unacknowledged.id).then((played) => {
            if (mountedRef.current) {
              setIsAudioPlaying(played);
              setIsAutoplayBlocked(!played);
            }
          });
        }
      } else {
        setActiveIncomingAlert(null);
        emergencyAudioManager.stopSiren();
        syncAudioState();
      }

      // 2. Outgoing alerts — skip any that have been dismissed/resolved locally
      const unresolvedOutgoing = outgoingAlerts.filter(
        (a) => !dismissedAlertIdsRef.current.has(a.id) && a.status !== 'RESOLVED'
      );
      if (unresolvedOutgoing.length > 0) {
        setActiveOutgoingAlert(unresolvedOutgoing[0]);
      } else {
        setActiveOutgoingAlert(null);
      }
    } catch (err) {
      console.warn('[useTrustedCircleAlerts] Error syncing active alerts:', err);
    }
  }, [userId, syncAudioState]);

  useEffect(() => {
    mountedRef.current = true;
    syncActiveAlerts();

    // Subscribe to realtime & cross-tab alert changes
    const unsub = trustedCircleAlertService.subscribeToAlerts((event) => {
      if (event.type === 'ALERT_CREATED' && event.alert) {
        // If alert was triggered by someone else, check if we are an eligible recipient
        if (event.alert.triggered_by_user_id !== userId) {
          // If already acknowledged in this session, do not re-show or ring siren
          const isAckedInSession =
            typeof sessionStorage !== 'undefined' &&
            sessionStorage.getItem('sakhishield_acked_' + event.alert.id) === 'true';
          if (!isAckedInSession && !dismissedAlertIdsRef.current.has(event.alert.id)) {
            setActiveIncomingAlert(event.alert);
            if (event.alert.severity === 'CRITICAL') {
              emergencyAudioManager.playSiren(event.alert.id).then((played) => {
                if (mountedRef.current) {
                  setIsAudioPlaying(played);
                  setIsAutoplayBlocked(!played);
                }
              });
            }
          }
        } else {
          setActiveOutgoingAlert(event.alert);
        }
      } else if (event.type === 'ALERT_ACKNOWLEDGED' || event.type === 'RECIPIENT_UPDATED') {
        syncActiveAlerts();
      } else if (event.type === 'ALERT_RESOLVED') {
        const resAlertId = (event as any).payload?.alertId;
        if (resAlertId) {
          dismissedAlertIdsRef.current.add(resAlertId);
        }
        emergencyAudioManager.stopSiren();
        syncAudioState();
        setActiveIncomingAlert(null);
        setActiveOutgoingAlert(null);
      }
    });

    // Network online reconnection listener
    const onlineHandler = () => {
      syncActiveAlerts();
    };
    window.addEventListener('online', onlineHandler);

    // Continuous 1.5s background check guarantees cross-window, incognito & cross-device SOS delivery
    const pollInterval = setInterval(() => {
      syncActiveAlerts();
    }, 1500);

    return () => {
      mountedRef.current = false;
      unsub();
      clearInterval(pollInterval);
      window.removeEventListener('online', onlineHandler);
      emergencyAudioManager.stopSiren();
    };
  }, [userId, syncActiveAlerts, syncAudioState]);

  // Acknowledge alert
  const acknowledgeAlert = useCallback(
    async (alertId: string) => {
      if (!userId) return;
      emergencyAudioManager.stopSiren();
      syncAudioState();
      dismissedAlertIdsRef.current.add(alertId);
      try {
        sessionStorage.setItem('sakhishield_acked_' + alertId, 'true');
      } catch {}
      setActiveIncomingAlert(null);

      await trustedCircleAlertService.acknowledgeAlert(alertId, userId, userName);
    },
    [userId, userName, syncAudioState]
  );

  // Resolve alert ('I AM SAFE') — resolves all active emergency sessions atomically
  const resolveAlert = useCallback(
    async (alertId: string) => {
      if (!userId) return;
      emergencyAudioManager.stopSiren();
      syncAudioState();

      // 1. Immediately dismiss from local state & polling filter
      if (alertId) dismissedAlertIdsRef.current.add(alertId);
      setActiveOutgoingAlert(null);
      setActiveIncomingAlert(null);

      // 2. Resolve atomically on server, local storage, and BroadcastChannel
      await trustedCircleAlertService.resolveAlert(alertId, userId);

      // 3. Mark any currently known outgoing alerts in dismissed set to guarantee no flicker
      try {
        const { outgoingAlerts } = await trustedCircleAlertService.getActiveAlertsForUser(userId);
        for (const a of outgoingAlerts) {
          dismissedAlertIdsRef.current.add(a.id);
        }
      } catch {}

      setActiveOutgoingAlert(null);
    },
    [userId, syncAudioState]
  );

  // Unlock audio when user interacts
  const unlockAudio = useCallback(async () => {
    if (activeIncomingAlert) {
      const played = await emergencyAudioManager.unlockAndPlay(activeIncomingAlert.id);
      setIsAudioPlaying(played);
      setIsAutoplayBlocked(!played);
    }
  }, [activeIncomingAlert]);

  // Manually dismiss incoming overlay (without acknowledging)
  const dismissIncomingOverlay = useCallback(() => {
    if (activeIncomingAlert) {
      dismissedAlertIdsRef.current.add(activeIncomingAlert.id);
      emergencyAudioManager.stopSiren();
      syncAudioState();
      setActiveIncomingAlert(null);
    }
  }, [activeIncomingAlert, syncAudioState]);

  // Trigger emergency alert to circle
  const triggerCircleEmergency = useCallback(
    async (params: {
      message?: string;
      latitude?: number | null;
      longitude?: number | null;
      accuracy?: number | null;
      sourceEventId?: string;
    }): Promise<TrustedCircleAlert | null> => {
      if (!userId) return null;

      const alert = await trustedCircleAlertService.triggerAlert({
        triggeredByUserId: userId,
        triggeredByUserName: userName,
        alertType: 'manual_sos',
        severity: 'CRITICAL',
        message: params.message || 'EMERGENCY SOS: I need help immediately.',
        locationShared: Boolean(params.latitude && params.longitude),
        latitude: params.latitude,
        longitude: params.longitude,
        locationAccuracy: params.accuracy,
        sourceEventId: params.sourceEventId,
      });

      if (alert) {
        setActiveOutgoingAlert(alert);
      }
      return alert;
    },
    [userId, userName]
  );

  const shareLocationForAlert = useCallback(
    async (alertId: string, latitude: number, longitude: number, accuracy?: number) => {
      await trustedCircleAlertService.shareLocation(alertId, latitude, longitude, accuracy);
    },
    []
  );

  return {
    activeIncomingAlert,
    activeOutgoingAlert,
    incomingAlert: activeIncomingAlert,
    outgoingAlert: activeOutgoingAlert,
    isAudioPlaying,
    isAutoplayBlocked,
    acknowledgeAlert,
    resolveAlert,
    shareLocationForAlert,
    unlockAudio,
    triggerCircleEmergency,
    dismissIncomingOverlay,
  };
};
