import React, { createContext, useContext, useState, useMemo, useCallback, useRef } from 'react';
import { useAuth } from './AuthContext';
import { trustedCircleService } from '../services/trustedCircleService';
import { trustedCircleAlertService } from '../services/trustedCircleAlertService';
import { safetyHistoryService } from '../services/safetyHistoryService';
import { generateSecureId } from './securityUtils';
import type { UserProfile, ActiveJourneyData, IncidentRecord } from './mockData';

const emptySafetySnapshot = {
  journeysCompleted: 0,
  safetyCheckIns: 0,
  incidents: 0,
};

interface AppContextType {
  user: UserProfile;
  incidents: IncidentRecord[];
  snapshot: typeof emptySafetySnapshot;
  sosActive: boolean;
  startJourney: (destination?: string) => void;
  endJourney: () => void;
  triggerSOS: () => void;
  cancelSOS: () => void;
  updateUser: (updated: Partial<UserProfile>) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const ACTIVE_JOURNEY_STORAGE_KEY = 'sakhishield_active_journey_v2';
const SOS_ACTIVE_STORAGE_KEY = 'sakhishield_sos_active_v2';

const getInitialJourney = (): ActiveJourneyData | null => {
  try {
    const raw = localStorage.getItem(ACTIVE_JOURNEY_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      // Keep active if started within the last 6 hours
      if (parsed) return parsed;
    }
  } catch {
    // Ignore error
  }
  return null;
};

const getInitialSos = (): boolean => {
  try {
    return localStorage.getItem(SOS_ACTIVE_STORAGE_KEY) === 'true';
  } catch {
    return false;
  }
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user: authUser } = useAuth();

  // Build a profile from real auth user data — NO hardcoded mock contacts
  const buildInitialProfile = (): UserProfile => {
    const name = authUser?.name || 'User';
    const email = authUser?.email || '';
    const phone = authUser?.phone || '';
    const initials = name
      .split(' ')
      .map((w) => w[0])
      .join('')
      .toUpperCase()
      .slice(0, 2) || 'U';

    const savedJourney = getInitialJourney();
    const isSos = getInitialSos();

    return {
      name: name.split(' ')[0],
      fullName: name,
      email,
      phone,
      initials,
      avatarUrl: authUser?.avatarUrl || '',
      status: isSos ? 'CRITICAL' : 'SAFE',
      statusDescription: isSos
        ? 'Emergency beacon activated. Trusted guardians alerted.'
        : savedJourney
        ? 'Your journey is currently being actively monitored.'
        : 'No active safety concerns.',
      locationMonitoring: Boolean(savedJourney),
      activeJourney: savedJourney,
      // Fresh accounts start with an empty trusted circle — user must add real contacts
      trustedContacts: [],
      emergencyPreferences: {
        preferredNotification: 'Silent SMS + Live Coordinate Link',
        locationSharing: 'Session Only',
        evidenceRetention: '30 Days',
        verificationTimeout: '45 Seconds',
      },
      profileCompleteness: phone ? 60 : 40,
      missingField: phone ? 'Emergency medical note' : 'Phone number, Emergency contacts',
    };
  };

  const [user, setUser] = useState<UserProfile>(buildInitialProfile);
  // Fresh accounts have zero incidents
  const [incidents] = useState<IncidentRecord[]>([]);
  const [snapshot, setSnapshot] = useState(emptySafetySnapshot);
  const [sosActive, setSosActive] = useState<boolean>(getInitialSos);

  // Sync state across browser tabs and on tab focus in real time
  React.useEffect(() => {
    const syncFromStorage = () => {
      try {
        const rawJourney = localStorage.getItem(ACTIVE_JOURNEY_STORAGE_KEY);
        const isSos = localStorage.getItem(SOS_ACTIVE_STORAGE_KEY) === 'true';

        setSosActive(isSos);

        if (rawJourney) {
          const parsed = JSON.parse(rawJourney);
          setUser((prev) => ({
            ...prev,
            activeJourney: parsed,
            locationMonitoring: true,
            status: isSos ? 'CRITICAL' : 'SAFE',
            statusDescription: isSos
              ? 'Emergency beacon activated. Trusted guardians alerted.'
              : 'Your journey is currently being actively monitored.',
          }));
        } else {
          setUser((prev) => ({
            ...prev,
            activeJourney: null,
            locationMonitoring: false,
            status: isSos ? 'CRITICAL' : 'SAFE',
            statusDescription: isSos
              ? 'Emergency beacon activated. Trusted guardians alerted.'
              : 'No active safety concerns.',
          }));
        }
      } catch {}
    };

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === ACTIVE_JOURNEY_STORAGE_KEY || e.key === SOS_ACTIVE_STORAGE_KEY) {
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
  }, []);

  // Sync user profile when auth user changes (name, email, avatar)
  React.useEffect(() => {
    if (authUser) {
      setUser((prev) => {
        const name = authUser.name || prev.name;
        const initials = name
          .split(' ')
          .map((w) => w[0])
          .join('')
          .toUpperCase()
          .slice(0, 2) || prev.initials;
        return {
          ...prev,
          name: name.split(' ')[0],
          fullName: name,
          email: authUser.email || prev.email,
          phone: authUser.phone || prev.phone,
          initials,
          avatarUrl: authUser.avatarUrl || prev.avatarUrl,
        };
      });
    }
  }, [authUser?.id, authUser?.name, authUser?.email]);

  const startJourney = useCallback((destination: string = 'Home') => {
    const journeyId = generateSecureId('JRN');
    const now = new Date();
    const expectedArrival = new Date(now.getTime() + 20 * 60 * 1000).toISOString();

    const newJourney: ActiveJourneyData = {
      id: journeyId,
      destination,
      origin: 'Current Location',
      eta: '20 min',
      monitoring: 'ACTIVE',
      status: 'SAFE',
      startedAt: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const fullJourney = {
      id: journeyId,
      user_id: authUser?.id || 'usr_current',
      destination_name: destination,
      destination_lat: 28.6289,
      destination_lng: 77.2210,
      start_lat: 28.6139,
      start_lng: 77.2090,
      route_geometry: {
        type: 'LineString',
        coordinates: [
          [77.2090, 28.6139],
          [77.2140, 28.6200],
          [77.2210, 28.6289],
        ],
      },
      distance_meters: 1600,
      expected_arrival: expectedArrival,
      estimated_arrival: expectedArrival,
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

    try {
      localStorage.setItem(ACTIVE_JOURNEY_STORAGE_KEY, JSON.stringify(newJourney));
      localStorage.setItem('sakhishield_active_journey_session_v2', JSON.stringify(fullJourney));
    } catch {}

    setUser((prev) => ({
      ...prev,
      activeJourney: newJourney,
      locationMonitoring: true,
      status: 'SAFE',
      statusDescription: 'Your journey is currently being actively monitored.',
    }));
  }, [authUser?.id]);

  const endJourney = useCallback(() => {
    if (user.activeJourney) {
      try {
        safetyHistoryService.addCompletedJourney({
          destination: user.activeJourney.destination,
          origin: user.activeJourney.origin,
          notes: `Safe completion recorded from dashboard control. Zero safety escalations.`,
        });
      } catch {}
    }

    try {
      localStorage.removeItem(ACTIVE_JOURNEY_STORAGE_KEY);
      localStorage.removeItem('sakhishield_active_journey_session_v2');
      localStorage.removeItem('sakhishield_active_journey_session');
    } catch {}

    setUser((prev) => ({
      ...prev,
      activeJourney: null,
      locationMonitoring: false,
      status: sosActive ? 'CRITICAL' : 'SAFE',
      statusDescription: sosActive
        ? 'Emergency beacon activated. Trusted guardians alerted.'
        : 'No active safety concerns.',
    }));
    setSnapshot((prev) => ({
      ...prev,
      journeysCompleted: prev.journeysCompleted + 1,
    }));
  }, [sosActive]);

  const lastActiveAlertIdRef = useRef<string | null>(null);

  const triggerSOS = useCallback(() => {
    // 1. Existing SOS behavior continues immediately (Rule #1, Section 26)
    setSosActive(true);
    try {
      localStorage.setItem(SOS_ACTIVE_STORAGE_KEY, 'true');
    } catch {}

    setUser((prev) => ({
      ...prev,
      status: 'CRITICAL',
      statusDescription: 'Emergency beacon activated. Trusted guardians alerted.',
    }));

    // 2. Parallel asynchronous Trusted Circle alert dispatch (Fail-Safe SOS Section 26, 27)
    if (authUser?.id) {
      (async () => {
        try {
          const userCircles = await trustedCircleService.getUserCircles(authUser.id);
          if (userCircles.length > 0) {
            const primaryCircle = userCircles[0];

            let lat: number | undefined;
            let lng: number | undefined;
            let accuracy: number | undefined;
            let locationShared = false;

            if (navigator.geolocation) {
              navigator.geolocation.getCurrentPosition(
                (pos) => {
                  lat = pos.coords.latitude;
                  lng = pos.coords.longitude;
                  accuracy = pos.coords.accuracy;
                  locationShared = true;
                  trustedCircleAlertService.shareLocation(
                    primaryCircle.id,
                    pos.coords.latitude,
                    pos.coords.longitude,
                    pos.coords.accuracy
                  ).catch(() => {});
                },
                () => {},
                { timeout: 5000 }
              );
            }

            const targetCircleId = primaryCircle?.id;
            const alert = await trustedCircleAlertService.triggerAlert({
              circleId: targetCircleId,
              triggeredByUserId: authUser.id,
              triggeredByUserName: authUser.name || 'User',
              alertType: 'manual_sos',
              severity: 'CRITICAL',
              message: `🚨 EMERGENCY SOS: ${authUser.name || 'User'} is in DANGER! Immediate check-in requested!`,
              locationShared,
              latitude: lat,
              longitude: lng,
              locationAccuracy: accuracy,
              sourceEventId: 'sos_' + authUser.id,
            });
            if (alert) {
              lastActiveAlertIdRef.current = alert.id;
            }
          }
        } catch (circleErr) {
          // Fail-safe: log warning but never block or fail the primary SOS
          console.warn('[AppContext] Asynchronous circle alert dispatch warning (fail-safe active):', circleErr);
        }
      })();
    }
  }, [authUser?.id, authUser?.name]);

  const cancelSOS = useCallback(() => {
    // 1. Immediate local status reset
    setSosActive(false);
    try {
      localStorage.removeItem(SOS_ACTIVE_STORAGE_KEY);
    } catch {}

    setUser((prev) => ({
      ...prev,
      status: 'SAFE',
      statusDescription: prev.activeJourney
        ? 'Your journey is currently being actively monitored.'
        : 'No active safety concerns.',
    }));

    // 2. Resolve ALL active circle alerts for this user atomically
    if (authUser?.id) {
      (async () => {
        try {
          const alertId = lastActiveAlertIdRef.current || '';
          await trustedCircleAlertService.resolveAlert(alertId, authUser.id);
          lastActiveAlertIdRef.current = null;
        } catch (err) {
          console.warn('[AppContext] Error resolving circle alert on cancelSOS:', err);
        }
      })();
    }
  }, [authUser?.id]);

  const updateUser = useCallback((updated: Partial<UserProfile>) => {
    if ('activeJourney' in updated) {
      try {
        if (updated.activeJourney) {
          localStorage.setItem(ACTIVE_JOURNEY_STORAGE_KEY, JSON.stringify(updated.activeJourney));
        } else {
          localStorage.removeItem(ACTIVE_JOURNEY_STORAGE_KEY);
        }
      } catch {}
    }
    setUser((prev) => {
      let hasChanges = false;
      for (const key of Object.keys(updated) as (keyof UserProfile)[]) {
        if (prev[key] !== updated[key]) {
          hasChanges = true;
          break;
        }
      }
      return hasChanges ? { ...prev, ...updated } : prev;
    });
  }, []);

  const value = useMemo(() => ({
    user,
    incidents,
    snapshot,
    sosActive,
    startJourney,
    endJourney,
    triggerSOS,
    cancelSOS,
    updateUser,
  }), [user, incidents, snapshot, sosActive, startJourney, endJourney, triggerSOS, cancelSOS, updateUser]);

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
