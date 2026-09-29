// Walk With Me - Master Journey State Machine & Orchestrator Hook (Hardened Production)
// Handles complete lifecycle, multi-tab coordination, rerouting, crash recovery, and timestamp check-in
// TWO-STAGE CHECK-IN: First missed → SUSPICION (popup) → 5min → FINAL check-in → missed → FULL ALERT

import { useState, useCallback, useRef, useEffect } from 'react';
import type {
  CheckInSession,
  Coordinates,
  GPSPoint,
  Journey,
  JourneyLifecycleState,
  JourneyRoute,
} from '../types/journey';
import {
  createJourneyRecord,
  updateJourneyRecord,
  recordJourneyEvent,
  completeJourneyRecord,
} from '../services/journeyService';
import { evaluateArrivalConfidence } from '../services/routeService';
import { SAFETY_THRESHOLDS } from '../config/safetyThresholds';
import { journeyLeaderCoordinator } from '../services/journeyLeaderCoordinator';
import { useNotifications } from './useNotifications';
import { triggerEmergencySiren } from '../services/safetyHaptics';
import { trustedCircleAlertService } from '../services/trustedCircleAlertService';
import { safetyHistoryService } from '../services/safetyHistoryService';
import { generateSecureId } from '../lib/securityUtils';
import { safeJourneyTransition } from '../services/journeyStateMachine';
import type { TrustedContact } from '../lib/mockData';

const SESSION_RECOVERY_KEY = 'sakhishield_active_journey_session_v2';

// ─── Google Maps Location Link Helper ────────────────────────────
/** Constructs a Google Maps URL from coordinates — no API key needed */
const getGoogleMapsLink = (lat?: number, lng?: number): string => {
  if (!lat || !lng) return '';
  return `https://www.google.com/maps?q=${lat},${lng}`;
};

const synthesizeJourneyFromActiveData = (active: any, userId: string = 'usr_current'): Journey => {
  const destCoords = { latitude: 28.6289, longitude: 77.2210 };
  const startCoords = { latitude: 28.6139, longitude: 77.2090 };
  const now = new Date();
  const etaTime = new Date(now.getTime() + 20 * 60 * 1000).toISOString();

  return {
    id: active.id || generateSecureId('JRN').toUpperCase(),
    user_id: userId,
    destination_name: active.destination || 'Home',
    destination_lat: destCoords.latitude,
    destination_lng: destCoords.longitude,
    start_lat: startCoords.latitude,
    start_lng: startCoords.longitude,
    route_geometry: {
      type: 'LineString',
      coordinates: [
        [startCoords.longitude, startCoords.latitude],
        [startCoords.longitude + 0.005, startCoords.latitude + 0.006],
        [destCoords.longitude, destCoords.latitude],
      ],
    },
    distance_meters: 1600,
    expected_arrival: etaTime,
    estimated_arrival: etaTime,
    status: 'ACTIVE',
    risk_score: 20,
    risk_level: 'SAFE',
    route_version: 1,
    active_route_id: 'rte_v1',
    monitoring_started_at: now.toISOString(),
    started_at: now.toISOString(),
    created_at: now.toISOString(),
    updated_at: now.toISOString(),
  };
};

const getInitialStoredJourney = (): { journey: Journey | null; state: JourneyLifecycleState } => {
  if (typeof window === 'undefined') return { journey: null, state: 'IDLE' };
  try {
    const saved = localStorage.getItem(SESSION_RECOVERY_KEY);
    if (saved) {
      const parsed = JSON.parse(saved) as Journey;
      const elapsedHours = (Date.now() - new Date(parsed.created_at || parsed.started_at || Date.now()).getTime()) / (1000 * 60 * 60);
      if (parsed.status === 'ACTIVE' && elapsedHours < 6) {
        return { journey: parsed, state: 'ACTIVE' };
      }
    }
    const activeRaw = localStorage.getItem('sakhishield_active_journey_v2');
    if (activeRaw) {
      const activeParsed = JSON.parse(activeRaw);
      if (activeParsed && activeParsed.destination) {
        const synthesized = synthesizeJourneyFromActiveData(activeParsed);
        localStorage.setItem(SESSION_RECOVERY_KEY, JSON.stringify(synthesized));
        return { journey: synthesized, state: 'ACTIVE' };
      }
    }
  } catch {}
  return { journey: null, state: 'IDLE' };
};

export interface UseJourneyProps {
  userId: string;
  userName: string;
  userPhone?: string;
  trustedContacts?: TrustedContact[];
  currentLocation: GPSPoint | null;
  onStateChange?: (state: JourneyLifecycleState) => void;
}

export interface UseJourneyReturn {
  state: JourneyLifecycleState;
  journey: Journey | null;
  checkInSession: CheckInSession | null;
  isArrivalPromptOpen: boolean;
  isPassiveTab: boolean;
  recoveredCandidate: Journey | null;
  dismissArrivalPrompt: () => void;
  startJourney: (destinationName: string, destinationCoords: Coordinates, route: JourneyRoute) => Promise<Journey>;
  updateRouteFromHere: (newRoute: JourneyRoute) => Promise<void>;
  triggerCheckIn: (reason: string) => void;
  respondToCheckIn: (response: 'SAFE' | 'UNCOMFORTABLE' | 'NEED_HELP') => Promise<void>;
  resolveEscalation: () => Promise<void>;
  confirmArrival: () => Promise<void>;
  completeJourney: () => Promise<void>;
  cancelJourney: () => Promise<void>;
  triggerSOS: () => Promise<void>;
  resumeRecoveredJourney: () => void;
  dismissRecoveredJourney: () => void;
  setState: React.Dispatch<React.SetStateAction<JourneyLifecycleState>>;
}

export const useJourney = ({
  userId,
  userName,
  userPhone,
  trustedContacts,
  currentLocation,
  onStateChange,
}: UseJourneyProps): UseJourneyReturn => {
  const initialData = getInitialStoredJourney();
  const [state, setState] = useState<JourneyLifecycleState>(initialData.state);
  const [journey, setJourney] = useState<Journey | null>(initialData.journey);
  const [checkInSession, setCheckInSession] = useState<CheckInSession | null>(null);
  const [isArrivalPromptOpen, setIsArrivalPromptOpen] = useState(false);
  const [isPassiveTab, setIsPassiveTab] = useState(false);
  const [recoveredCandidate, setRecoveredCandidate] = useState<Journey | null>(null);

  const checkInTimerRef = useRef<number | null>(null);
  const finalCheckInTimerRef = useRef<number | null>(null);
  const consecutiveArrivalRef = useRef(0);
  const isEscalatedRef = useRef(false);
  const { notifyContact } = useNotifications(userId);

  const setSafeState = useCallback(
    (target: JourneyLifecycleState | ((prev: JourneyLifecycleState) => JourneyLifecycleState), reason?: string) => {
      setState((prev) => {
        const next = typeof target === 'function' ? target(prev) : target;
        const res = safeJourneyTransition(prev, next, reason);
        return res.allowed ? res.nextState : prev;
      });
    },
    []
  );

  // Helper to get contacts list
  const getContacts = useCallback(() => {
    return (trustedContacts && trustedContacts.length > 0)
      ? trustedContacts
      : [{ id: 'primary-guardian', name: 'Primary Guardian', phone: userPhone, relationship: 'Primary Guardian', status: 'Available', isPrimary: true }];
  }, [trustedContacts, userPhone]);

  // 1. Multi-Tab Coordination
  useEffect(() => {
    journeyLeaderCoordinator.startCoordination();
    const unsub = journeyLeaderCoordinator.onRoleChange((role) => {
      setIsPassiveTab(role === 'PASSIVE');
    });
    return () => {
      unsub();
      journeyLeaderCoordinator.release();
    };
  }, []);

  // 2. Cross-tab & Multi-window Storage and Tab Visibility Sync
  useEffect(() => {
    const syncFromStorage = () => {
      try {
        const saved = localStorage.getItem(SESSION_RECOVERY_KEY);
        const activeRaw = localStorage.getItem('sakhishield_active_journey_v2');

        if (saved) {
          const parsed = JSON.parse(saved) as Journey;
          const elapsedHours = (Date.now() - new Date(parsed.created_at || parsed.started_at || Date.now()).getTime()) / (1000 * 60 * 60);
          if (parsed.status === 'ACTIVE' && elapsedHours < 6) {
            setJourney(parsed);
            setSafeState((prev) => (prev === 'IDLE' ? 'ACTIVE' : prev), 'Session restored from storage');
            return;
          }
        }

        if (activeRaw) {
          const activeParsed = JSON.parse(activeRaw);
          if (activeParsed && activeParsed.destination) {
            const synthesized = synthesizeJourneyFromActiveData(activeParsed, userId);
            setJourney(synthesized);
            setSafeState((prev) => (prev === 'IDLE' ? 'ACTIVE' : prev), 'Synthesized session from active data');
            return;
          }
        }

        // ONLY if BOTH keys are missing/cleared, do we mark as idle
        if (!saved && !activeRaw) {
          if (state === 'ACTIVE' || state === 'COMPLETING') {
            setJourney(null);
            setSafeState('IDLE', 'Session ended in other tab');
          }
        }
      } catch {}
    };

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === SESSION_RECOVERY_KEY || e.key === 'sakhishield_active_journey_v2') {
        syncFromStorage();
      }
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        syncFromStorage();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [state, userId]);

  // Notify parent of state changes
  useEffect(() => {
    onStateChange?.(state);
  }, [state, onStateChange]);

  // Clean up timers on unmount
  useEffect(() => {
    return () => {
      if (checkInTimerRef.current) clearTimeout(checkInTimerRef.current);
      if (finalCheckInTimerRef.current) clearTimeout(finalCheckInTimerRef.current);
    };
  }, []);

  // 3. Start Journey
  const startJourney = useCallback(
    async (
      destinationName: string,
      destinationCoords: Coordinates,
      route: JourneyRoute
    ): Promise<Journey> => {
      setSafeState('STARTING', 'Starting journey');
      isEscalatedRef.current = false;

      const startLat = currentLocation?.latitude ?? 28.6139;
      const startLng = currentLocation?.longitude ?? 77.2090;
      const now = new Date();
      const expectedArrival = new Date(now.getTime() + (route?.durationSeconds || 1200) * 1000).toISOString();

      const newJourney: Journey = {
        id: generateSecureId('JRN').toUpperCase(),
        user_id: userId,
        destination_name: destinationName,
        destination_lat: destinationCoords.latitude,
        destination_lng: destinationCoords.longitude,
        start_lat: startLat,
        start_lng: startLng,
        route_geometry: route.geometry,
        distance_meters: route.distanceMeters,
        expected_arrival: expectedArrival,
        estimated_arrival: expectedArrival,
        status: 'ACTIVE',
        risk_score: 20,
        risk_level: 'SAFE',
        route_version: 1,
        active_route_id: route.id || 'rte_v1',
        monitoring_started_at: now.toISOString(),
        started_at: now.toISOString(),
        created_at: now.toISOString(),
        updated_at: now.toISOString(),
      };

      const saved = await createJourneyRecord(newJourney);
      setJourney(saved);
      setSafeState('ACTIVE', 'Journey record created and active');

      try {
        localStorage.setItem(SESSION_RECOVERY_KEY, JSON.stringify(saved));
        localStorage.setItem('sakhishield_active_journey_v2', JSON.stringify({
          id: saved.id,
          destination: saved.destination_name,
          origin: 'Current Location',
          eta: Math.round(saved.distance_meters / 1000 * 12) + ' min',
          monitoring: 'ACTIVE',
          status: 'SAFE',
          startedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        }));
      } catch {}

      await recordJourneyEvent({
        journey_id: saved.id,
        user_id: userId,
        event_type: 'JOURNEY_STARTED',
        latitude: startLat,
        longitude: startLng,
        metadata: {
          destination: destinationName,
          distance_meters: route.distanceMeters,
          duration_seconds: route.durationSeconds,
          route_version: 1,
        },
      });

      return saved;
    },
    [userId, currentLocation]
  );

  // 4. Intentional Detour: Update Route From Here
  const updateRouteFromHere = useCallback(
    async (newRoute: JourneyRoute): Promise<void> => {
      if (!journey || state === 'COMPLETED') return;

      const newVersion = (journey.route_version || 1) + 1;
      const now = new Date();
      const newExpectedArrival = new Date(now.getTime() + newRoute.durationSeconds * 1000).toISOString();

      const updatedJourney: Journey = {
        ...journey,
        route_version: newVersion,
        active_route_id: newRoute.id || `rte_v${newVersion}`,
        route_geometry: newRoute.geometry,
        distance_meters: newRoute.distanceMeters,
        expected_arrival: newExpectedArrival,
        estimated_arrival: newExpectedArrival,
        updated_at: now.toISOString(),
      };

      setJourney(updatedJourney);
      try {
        localStorage.setItem(SESSION_RECOVERY_KEY, JSON.stringify(updatedJourney));
      } catch {}

      await updateJourneyRecord(journey.id, {
        route_version: newVersion,
        route_geometry: newRoute.geometry,
        distance_meters: newRoute.distanceMeters,
        expected_arrival: newExpectedArrival,
        estimated_arrival: newExpectedArrival,
      });

      await recordJourneyEvent({
        journey_id: journey.id,
        user_id: userId,
        event_type: 'ROUTE_UPDATED',
        latitude: currentLocation?.latitude,
        longitude: currentLocation?.longitude,
        metadata: {
          previous_version: journey.route_version || 1,
          new_version: newVersion,
          new_distance_meters: newRoute.distanceMeters,
          reason: 'User accepted corridor adaptation / detour',
        },
      });
    },
    [journey, state, userId, currentLocation]
  );

  // ──────────────────────────────────────────────────────────────────
  // 5. TWO-STAGE CHECK-IN FLOW
  // Stage 1: First check-in → if missed → SUSPICION (popup to circle, NOT alert)
  // Stage 2: 5 min later → FINAL check-in → if missed → FULL ALERT + SOS
  // ──────────────────────────────────────────────────────────────────

  const triggerCheckIn = useCallback(
    (reason: string) => {
      if (!journey || state === 'CHECK_IN_REQUIRED' || state === 'FINAL_CHECK_IN' || state === 'COMPLETED' || state === 'CANCELLED') return;

      const sessionId = generateSecureId('chk');
      const now = Date.now();
      const timeoutSec = SAFETY_THRESHOLDS.CHECK_IN.DEFAULT_TIMEOUT_SECONDS;
      const deadline = now + timeoutSec * 1000;

      const session: CheckInSession = {
        id: sessionId,
        journey_id: journey.id,
        timestamp: new Date().toISOString(),
        started_at: now,
        deadline,
        reason,
        state: 'VISIBLE',
        status: 'PENDING',
        timeout_seconds: timeoutSec,
        stage: 'FIRST',
      };

      setCheckInSession(session);
      setSafeState('CHECK_IN_REQUIRED', reason);

      recordJourneyEvent({
        journey_id: journey.id,
        user_id: userId,
        event_type: 'CHECK_IN_REQUESTED',
        latitude: currentLocation?.latitude,
        longitude: currentLocation?.longitude,
        metadata: { reason, deadline, timeout_seconds: timeoutSec, stage: 'FIRST' },
      });

      // ─── STAGE 1 TIMEOUT: First check-in missed → SUSPICION ────
      if (checkInTimerRef.current) clearTimeout(checkInTimerRef.current);
      checkInTimerRef.current = window.setTimeout(async () => {
        // Mark first check-in as timed out
        setCheckInSession((prev) => (prev ? { ...prev, status: 'TIMEOUT', state: 'TIMED_OUT' } : null));
        setSafeState('SUSPICION', 'Stage 1 check-in timed out');

        const mapsLink = getGoogleMapsLink(currentLocation?.latitude, currentLocation?.longitude);

        // Send SUSPICION popup to trusted circle (NOT a full alert)
        const contacts = getContacts();
        for (const contact of contacts) {
          await notifyContact({
            journeyId: journey.id,
            eventId: sessionId + '_suspicion',
            recipientId: contact.id,
            recipientName: contact.name,
            recipientPhone: contact.phone,
            notificationType: 'TRUSTED_CONTACT_ALERT',
            channel: 'PUSH',
            message: `⚠️ ${userName} has been stationary and did not respond to a safety check-in during their walk. Current location: ${mapsLink}`,
            coordinates: currentLocation
              ? { latitude: currentLocation.latitude, longitude: currentLocation.longitude }
              : undefined,
          });
        }

        await recordJourneyEvent({
          journey_id: journey.id,
          user_id: userId,
          event_type: 'ETA_EXCEEDED',
          latitude: currentLocation?.latitude,
          longitude: currentLocation?.longitude,
          metadata: {
            note: 'First check-in missed. Suspicion state activated. Trusted circle notified with popup.',
            stage: 'SUSPICION',
            google_maps_link: mapsLink,
          },
        });

        // ─── STAGE 2: Schedule FINAL CHECK-IN after 5 minutes ────
        const finalDelaySec = SAFETY_THRESHOLDS.CHECK_IN.FINAL_CHECK_IN_DELAY_SECONDS;
        if (finalCheckInTimerRef.current) clearTimeout(finalCheckInTimerRef.current);
        finalCheckInTimerRef.current = window.setTimeout(() => {
          // Launch the FINAL check-in
          const finalSessionId = generateSecureId('chk_final');
          const finalNow = Date.now();
          const finalTimeoutSec = SAFETY_THRESHOLDS.CHECK_IN.FINAL_TIMEOUT_SECONDS;
          const finalDeadline = finalNow + finalTimeoutSec * 1000;

          const finalSession: CheckInSession = {
            id: finalSessionId,
            journey_id: journey.id,
            timestamp: new Date().toISOString(),
            started_at: finalNow,
            deadline: finalDeadline,
            reason: '⚠️ FINAL SAFETY CHECK — This is your last check-in before your trusted circle is fully alerted.',
            state: 'VISIBLE',
            status: 'PENDING',
            timeout_seconds: finalTimeoutSec,
            stage: 'FINAL',
          };

          setCheckInSession(finalSession);
          setSafeState('FINAL_CHECK_IN', 'Stage 2 final check-in prompt');

          recordJourneyEvent({
            journey_id: journey.id,
            user_id: userId,
            event_type: 'CHECK_IN_REQUESTED',
            latitude: currentLocation?.latitude,
            longitude: currentLocation?.longitude,
            metadata: { reason: 'FINAL safety check-in', stage: 'FINAL', timeout_seconds: finalTimeoutSec },
          });

          // ─── STAGE 2 TIMEOUT: Final check-in missed → FULL ALERT ────
          if (checkInTimerRef.current) clearTimeout(checkInTimerRef.current);
          checkInTimerRef.current = window.setTimeout(async () => {
            if (isEscalatedRef.current) return;
            isEscalatedRef.current = true;

            setCheckInSession((prev) => (prev ? { ...prev, status: 'TIMEOUT', state: 'TIMED_OUT' } : null));
            setSafeState('ESCALATING', 'Final check-in timed out — escalation triggered');

            // 1. Audio Siren & Haptic Alert
            triggerEmergencySiren();

            const emergencyMapsLink = getGoogleMapsLink(currentLocation?.latitude, currentLocation?.longitude);

            // 2. Native System / Browser Notification
            if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
              try {
                new Notification('🚨 SakhiShield Emergency Escalation', {
                  body: `${userName} missed BOTH safety check-ins during Walk With Me. Emergency alert dispatched to guardians.`,
                  requireInteraction: true,
                });
              } catch {}
            }

            // 3. Persist Event & Mark Journey Escalated
            await recordJourneyEvent({
              journey_id: journey.id,
              user_id: userId,
              event_type: 'ETA_EXCEEDED',
              latitude: currentLocation?.latitude,
              longitude: currentLocation?.longitude,
              metadata: {
                note: 'FINAL check-in missed. Full emergency escalation dispatched.',
                stage: 'FULL_ALERT',
                google_maps_link: emergencyMapsLink,
              },
            });

            await updateJourneyRecord(journey.id, {
              status: 'ESCALATED',
              risk_score: 95,
              risk_level: 'CRITICAL',
            });

            // 4. Dispatch FULL EMERGENCY ALERT to ALL Guardians
            const alertContacts = getContacts();
            for (const contact of alertContacts) {
              await notifyContact({
                journeyId: journey.id,
                eventId: finalSessionId,
                recipientId: contact.id,
                recipientName: contact.name,
                recipientPhone: contact.phone,
                notificationType: 'JOURNEY_ESCALATION',
                channel: 'PUSH',
                message: `🚨 EMERGENCY ALERT: ${userName} did NOT respond to TWO safety check-ins during their walk. Immediate action required!\n\n📍 Live Location: ${emergencyMapsLink}`,
                coordinates: currentLocation
                  ? { latitude: currentLocation.latitude, longitude: currentLocation.longitude }
                  : undefined,
              });
            }

            // 5. Trigger trusted circle alert service
            trustedCircleAlertService.triggerAlert({
              triggeredByUserId: userId,
              triggeredByUserName: userName,
              alertType: 'missed_checkin',
              severity: 'CRITICAL',
              message: `🚨 EMERGENCY: ${userName} missed both safety check-ins. Location: ${emergencyMapsLink}`,
              locationShared: Boolean(currentLocation),
              latitude: currentLocation?.latitude,
              longitude: currentLocation?.longitude,
              locationAccuracy: currentLocation?.accuracy,
              sourceEventId: 'walk_final_checkin_' + journey.id,
            }).catch((err) => console.warn('[useJourney] Circle alert warning:', err));
          }, finalTimeoutSec * 1000);
        }, finalDelaySec * 1000);
      }, timeoutSec * 1000);
    },
    [journey, state, userId, currentLocation, userName, userPhone, trustedContacts, notifyContact, getContacts]
  );

  // 6. Respond to Check-in (works for both FIRST and FINAL stages)
  const respondToCheckIn = useCallback(
    async (response: 'SAFE' | 'UNCOMFORTABLE' | 'NEED_HELP') => {
      if (!journey || !checkInSession) return;

      // Clear ALL timers (both stages)
      if (checkInTimerRef.current) {
        clearTimeout(checkInTimerRef.current);
        checkInTimerRef.current = null;
      }
      if (finalCheckInTimerRef.current) {
        clearTimeout(finalCheckInTimerRef.current);
        finalCheckInTimerRef.current = null;
      }

      const responseTime = new Date().toISOString();
      const updatedSession: CheckInSession = {
        ...checkInSession,
        status: response,
        state: 'RESPONDED',
        response,
        response_time: responseTime,
      };

      setCheckInSession(null);

      if (response === 'SAFE') {
        isEscalatedRef.current = false;
        setSafeState('ACTIVE', 'User confirmed safe');
        await recordJourneyEvent({
          journey_id: journey.id,
          user_id: userId,
          event_type: 'CHECK_IN_SAFE',
          latitude: currentLocation?.latitude,
          longitude: currentLocation?.longitude,
          metadata: { session_id: updatedSession.id, response, stage: updatedSession.stage },
        });

        // If was in SUSPICION, notify circle that user is safe now
        if (updatedSession.stage === 'FINAL' || state === 'SUSPICION' || state === 'FINAL_CHECK_IN') {
          const contacts = getContacts();
          for (const contact of contacts) {
            await notifyContact({
              journeyId: journey.id,
              eventId: updatedSession.id + '_safe',
              recipientId: contact.id,
              recipientName: contact.name,
              recipientPhone: contact.phone,
              notificationType: 'TRUSTED_CONTACT_ALERT',
              channel: 'PUSH',
              message: `✅ UPDATE: ${userName} has confirmed they are safe. All clear.`,
              coordinates: currentLocation
                ? { latitude: currentLocation.latitude, longitude: currentLocation.longitude }
                : undefined,
            });
          }
        }
      } else if (response === 'UNCOMFORTABLE') {
        setSafeState('UNCOMFORTABLE', 'User reported uncomfortable');
        const mapsLink = getGoogleMapsLink(currentLocation?.latitude, currentLocation?.longitude);
        await recordJourneyEvent({
          journey_id: journey.id,
          user_id: userId,
          event_type: 'CHECK_IN_UNCOMFORTABLE',
          latitude: currentLocation?.latitude,
          longitude: currentLocation?.longitude,
          metadata: { session_id: updatedSession.id, response, google_maps_link: mapsLink },
        });

        const contacts = getContacts();
        for (const contact of contacts) {
          await notifyContact({
            journeyId: journey.id,
            eventId: updatedSession.id,
            recipientId: contact.id,
            recipientName: contact.name,
            recipientPhone: contact.phone,
            notificationType: 'TRUSTED_CONTACT_ALERT',
            channel: 'PUSH',
            message: `⚠️ ${userName} is feeling uncomfortable during their walk.\n\n📍 Location: ${mapsLink}`,
            coordinates: currentLocation
              ? { latitude: currentLocation.latitude, longitude: currentLocation.longitude }
              : undefined,
          });
        }
      } else {
        isEscalatedRef.current = true;
        setSafeState('HELP_REQUESTED', 'User requested immediate help');
        const mapsLink = getGoogleMapsLink(currentLocation?.latitude, currentLocation?.longitude);
        await recordJourneyEvent({
          journey_id: journey.id,
          user_id: userId,
          event_type: 'HELP_REQUESTED',
          latitude: currentLocation?.latitude,
          longitude: currentLocation?.longitude,
          metadata: { session_id: updatedSession.id, response: 'NEED_HELP', google_maps_link: mapsLink },
        });

        const contacts = getContacts();
        for (const contact of contacts) {
          await notifyContact({
            journeyId: journey.id,
            eventId: updatedSession.id,
            recipientId: contact.id,
            recipientName: contact.name,
            recipientPhone: contact.phone,
            notificationType: 'CRITICAL_SAFETY_EVENT',
            channel: 'PUSH',
            message: `🚨 URGENT: ${userName} requested immediate help on their walk!\n\n📍 Location: ${mapsLink}`,
            coordinates: currentLocation
              ? { latitude: currentLocation.latitude, longitude: currentLocation.longitude }
              : undefined,
          });
        }
      }
    },
    [journey, checkInSession, state, userId, currentLocation, userName, notifyContact, getContacts, setSafeState]
  );

  // 7. Arrival Detection Check with Confidence Filter
  useEffect(() => {
    if (!journey || state !== 'ACTIVE' || !currentLocation) return;

    const destCoords: Coordinates = {
      latitude: journey.destination_lat,
      longitude: journey.destination_lng,
    };

    const evaluation = evaluateArrivalConfidence(
      currentLocation,
      destCoords,
      currentLocation.accuracy,
      consecutiveArrivalRef.current
    );

    if (evaluation.status === 'ARRIVAL_CONFIRMED' || evaluation.status === 'ARRIVAL_CANDIDATE') {
      consecutiveArrivalRef.current += 1;
      if (evaluation.isConfirmed && !isArrivalPromptOpen) {
        setIsArrivalPromptOpen(true);
      }
    } else {
      consecutiveArrivalRef.current = 0;
    }
  }, [journey, state, currentLocation, isArrivalPromptOpen]);

  // 8. Confirm Arrival & End Journey
  const confirmArrival = useCallback(async () => {
    if (!journey) return;
    setIsArrivalPromptOpen(false);
    setSafeState('COMPLETING', 'Confirming arrival');

    await recordJourneyEvent({
      journey_id: journey.id,
      user_id: userId,
      event_type: 'ARRIVED',
      latitude: currentLocation?.latitude,
      longitude: currentLocation?.longitude,
      metadata: { status: 'Confirmed at destination' },
    });

    await completeJourneyRecord(journey.id, 'COMPLETED');
    setJourney((prev) => (prev ? { ...prev, status: 'COMPLETED' } : null));
    setSafeState('COMPLETED', 'Arrival verified at destination');

    // Notify circle that user arrived safely
    const contacts = getContacts();
    for (const contact of contacts) {
      await notifyContact({
        journeyId: journey.id,
        eventId: 'arrived_' + Date.now(),
        recipientId: contact.id,
        recipientName: contact.name,
        recipientPhone: contact.phone,
        notificationType: 'TRUSTED_CONTACT_ALERT',
        channel: 'PUSH',
        message: `✅ ${userName} has arrived safely at ${journey.destination_name}. Journey monitoring ended.`,
      });
    }

    try {
      safetyHistoryService.addCompletedJourney({
        destination: journey.destination_name,
        distanceKm: Math.round(((journey.distance_meters || 1800) / 1000) * 10) / 10,
        notes: `Safe arrival confirmed at ${journey.destination_name}. Zero incident escalations during trip.`,
      });
    } catch {}

    try {
      localStorage.removeItem(SESSION_RECOVERY_KEY);
      localStorage.removeItem('sakhishield_active_journey_v2');
      sessionStorage.removeItem(SESSION_RECOVERY_KEY);
    } catch {}
  }, [journey, userId, currentLocation, userName, notifyContact, getContacts, setSafeState]);

  const completeJourney = useCallback(async () => {
    await confirmArrival();
  }, [confirmArrival]);

  const cancelJourney = useCallback(async () => {
    if (!journey) return;
    setSafeState('CANCELLED', 'User requested cancellation');
    try {
      await completeJourneyRecord(journey.id, 'CANCELLED');
    } catch {}
    try {
      localStorage.removeItem(SESSION_RECOVERY_KEY);
      localStorage.removeItem('sakhishield_active_journey_v2');
      sessionStorage.removeItem(SESSION_RECOVERY_KEY);
    } catch {}
    setJourney(null);
    setSafeState('IDLE', 'Reset after cancellation');
  }, [journey, setSafeState]);

  // ─── SOS TRIGGER with Google Maps Location Link ────────────────
  const triggerSOS = useCallback(async () => {
    if (!journey) return;
    if (isEscalatedRef.current) return;
    isEscalatedRef.current = true;

    setSafeState('ESCALATING', 'Emergency SOS triggered by user');

    const mapsLink = getGoogleMapsLink(currentLocation?.latitude, currentLocation?.longitude);

    // 1. Audio siren
    triggerEmergencySiren();

    await recordJourneyEvent({
      journey_id: journey.id,
      user_id: userId,
      event_type: 'SOS_TRIGGERED',
      latitude: currentLocation?.latitude,
      longitude: currentLocation?.longitude,
      metadata: {
        priority: 'IMMEDIATE_ESCALATION',
        google_maps_link: mapsLink,
      },
    });

    await updateJourneyRecord(journey.id, {
      status: 'ESCALATED',
      risk_score: 95,
      risk_level: 'CRITICAL',
    });

    // 2. Notify ALL guardians with Google Maps location
    const contacts = getContacts();
    for (const contact of contacts) {
      await notifyContact({
        journeyId: journey.id,
        eventId: 'sos_' + Date.now(),
        recipientId: contact.id,
        recipientName: contact.name,
        recipientPhone: contact.phone,
        notificationType: 'CRITICAL_SAFETY_EVENT',
        channel: 'PUSH',
        message: `🚨 EMERGENCY SOS activated by ${userName}!\n\n📍 Exact Location: ${mapsLink}\n\nImmediate action required. Contact ${userName} or emergency services.`,
        coordinates: currentLocation
          ? { latitude: currentLocation.latitude, longitude: currentLocation.longitude }
          : undefined,
      });
    }

    // 3. Dispatch to trusted circle alert service
    trustedCircleAlertService.triggerAlert({
      triggeredByUserId: userId,
      triggeredByUserName: userName,
      alertType: 'manual_sos',
      severity: 'CRITICAL',
      message: `🚨 EMERGENCY SOS: ${userName} needs help! Location: ${mapsLink}`,
      locationShared: Boolean(currentLocation),
      latitude: currentLocation?.latitude,
      longitude: currentLocation?.longitude,
      locationAccuracy: currentLocation?.accuracy,
      sourceEventId: 'walk_sos_' + journey.id,
    }).catch((err) => console.warn('[useJourney] Circle alert warning:', err));
  }, [journey, userId, currentLocation, userName, notifyContact, getContacts, setSafeState]);

  const dismissArrivalPrompt = useCallback(() => {
    setIsArrivalPromptOpen(false);
  }, []);

  const resumeRecoveredJourney = useCallback(() => {
    if (recoveredCandidate) {
      setJourney(recoveredCandidate);
      setState('ACTIVE');
      setRecoveredCandidate(null);
      recordJourneyEvent({
        journey_id: recoveredCandidate.id,
        user_id: userId,
        event_type: 'JOURNEY_RESUMED',
        latitude: currentLocation?.latitude,
        longitude: currentLocation?.longitude,
        metadata: { resumed_at: new Date().toISOString() },
      });
    }
  }, [recoveredCandidate, userId, currentLocation]);

  const dismissRecoveredJourney = useCallback(() => {
    if (recoveredCandidate) {
      completeJourneyRecord(recoveredCandidate.id, 'COMPLETED').catch(() => {});
    }
    setRecoveredCandidate(null);
    try {
      localStorage.removeItem(SESSION_RECOVERY_KEY);
      localStorage.removeItem('sakhishield_active_journey_v2');
      sessionStorage.removeItem(SESSION_RECOVERY_KEY);
    } catch {}
  }, [recoveredCandidate]);

  const resolveEscalation = useCallback(async () => {
    if (!journey) return;
    setState('ACTIVE');
    setCheckInSession(null);

    // Clear all timers
    if (checkInTimerRef.current) { clearTimeout(checkInTimerRef.current); checkInTimerRef.current = null; }
    if (finalCheckInTimerRef.current) { clearTimeout(finalCheckInTimerRef.current); finalCheckInTimerRef.current = null; }

    await recordJourneyEvent({
      journey_id: journey.id,
      user_id: userId,
      event_type: 'CHECK_IN_SAFE',
      latitude: currentLocation?.latitude,
      longitude: currentLocation?.longitude,
      metadata: { note: 'User manually acknowledged safe status and stood down escalation.' },
    });

    await updateJourneyRecord(journey.id, {
      status: 'ACTIVE',
      risk_score: 20,
      risk_level: 'SAFE',
    });

    // ── CRITICAL: Resolve ALL active trusted circle alerts for this user ──
    // This stops the 1.5s polling from re-showing alerts on other profiles
    try {
      await trustedCircleAlertService.resolveAlert('', userId);
    } catch (err) {
      console.warn('[useJourney] Failed to resolve circle alerts:', err);
    }

    const contacts = getContacts();
    for (const contact of contacts) {
      await notifyContact({
        journeyId: journey.id,
        eventId: 'resolved_' + journey.id,
        recipientId: contact.id,
        recipientName: contact.name,
        recipientPhone: contact.phone,
        notificationType: 'TRUSTED_CONTACT_ALERT',
        channel: 'PUSH',
        message: `✅ UPDATE: ${userName} has confirmed they are safe and okay. Safety alert stood down.`,
        coordinates: currentLocation
          ? { latitude: currentLocation.latitude, longitude: currentLocation.longitude }
          : undefined,
      });
    }
  }, [journey, userId, currentLocation, userName, notifyContact, getContacts]);

  return {
    state,
    journey,
    checkInSession,
    isArrivalPromptOpen,
    isPassiveTab,
    recoveredCandidate,
    dismissArrivalPrompt,
    startJourney,
    updateRouteFromHere,
    triggerCheckIn,
    respondToCheckIn,
    resolveEscalation,
    confirmArrival,
    completeJourney,
    cancelJourney,
    triggerSOS,
    resumeRecoveredJourney,
    dismissRecoveredJourney,
    setState,
  };
};
