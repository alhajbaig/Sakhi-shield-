// SakhiShield — Safety Context Service
// Aggregates live system telemetry, journey progress, deterministic risk engine metrics,
// check-in timers, and trusted circle states into a normalized, type-safe SafetyContext.

import type {
  SafetyContext,
  UserContext,
  JourneyContext,
  RiskContext,
  LocationContext,
  RouteContext,
  CheckInContext,
  TrustedCircleContext,
  MonitoringContext,
  AlertContext,
  TimeContext,
} from '../types/safetyCopilot.types';
import { trustedCircleService } from '../../../services/trustedCircleService';
import { trustedCircleAlertService } from '../../../services/trustedCircleAlertService';

const SESSION_RECOVERY_KEY = 'sakhishield_active_journey_session_v2';
const ACTIVE_JOURNEY_STORAGE_KEY = 'sakhishield_active_journey_v2';

export const safetyContextService = {
  /**
   * Assembles a comprehensive, grounded snapshot of current SakhiShield context.
   * If live values are provided by active hooks/components, they take priority.
   * Otherwise, persistent storages and service layers are inspected.
   */
  async gatherCurrentContext(overrides?: Partial<SafetyContext>): Promise<SafetyContext> {
    // 1. Time Context
    const now = new Date();
    const currentHour = now.getHours();
    const isLateNight = currentHour >= 22 || currentHour < 5;
    const time: TimeContext = {
      currentHour,
      isLateNight,
      formattedTime: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    // 2. Monitoring & Network Context
    const networkOnline = typeof navigator !== 'undefined' ? navigator.onLine : true;
    const monitoring: MonitoringContext = overrides?.monitoring || {
      networkOnline,
      gpsStatus: 'SEARCHING',
      isLeaderTab: true,
    };

    // 3. Journey Context from storage if not overridden
    let journey: JourneyContext | undefined = overrides?.journey;
    if (!journey && typeof localStorage !== 'undefined') {
      try {
        const stored = localStorage.getItem(ACTIVE_JOURNEY_STORAGE_KEY) || localStorage.getItem(SESSION_RECOVERY_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          if (parsed && (parsed.status === 'ACTIVE' || parsed.monitoring === 'ACTIVE')) {
            journey = {
              id: parsed.id || 'JRN-ACTIVE',
              destination: parsed.destination || parsed.destination_name || 'Destination',
              origin: parsed.origin || parsed.origin_name || 'Starting Point',
              status: (parsed.status as any) || 'ACTIVE',
              etaMinutes: parsed.eta ? parseInt(parsed.eta, 10) || 15 : 15,
              startedAt: parsed.started_at || parsed.startedAt,
              isLive: true,
            };
          }
        }
      } catch {}
    }

    // 4. Deterministic Risk Engine Context
    const risk: RiskContext = overrides?.risk || {
      score: journey ? (isLateNight ? 35 : 15) : 10,
      level: journey ? (isLateNight ? 'ATTENTION' : 'SAFE') : 'SAFE',
      activeSignals: isLateNight ? ['late_night'] : [],
      explanationSummary: journey
        ? isLateNight
          ? 'Late-night transit monitoring active. Vigilance signals calibrated.'
          : 'Normal transit corridor telemetry. No elevated anomalies detected.'
        : 'Stationary safety posture. No active transit hazards.',
    };

    // 5. Location Context (Privacy Preserved)
    const location: LocationContext = overrides?.location || {
      hasPermission: false,
      isStale: false,
    };

    // 6. Route Context
    const route: RouteContext = overrides?.route || {
      isOffRoute: false,
      hasUnexpectedStop: false,
    };

    // 7. Check-In Context
    const checkIn: CheckInContext = overrides?.checkIn || {
      isPending: false,
      stage: 1,
    };

    // 8. Trusted Circle Context & Active Alerts
    let trustedCircle: TrustedCircleContext = overrides?.trustedCircle || {
      configured: false,
      memberCount: 0,
      activeGuardianNames: [],
      activeAlertsCount: 0,
    };

    let alerts: AlertContext[] = overrides?.alerts || [];

    const userId = overrides?.user?.id;
    if (userId) {
      try {
        const userCircles = await trustedCircleService.getUserCircles(userId);
        if (userCircles.length > 0) {
          const primaryCircle = userCircles[0];
          const members = await trustedCircleService.getCircleMembers(primaryCircle.id);
          const activeMembers = members.filter((m) => m.status === 'APPROVED');
          const guardianNames = activeMembers
            .filter((m) => m.user_id !== userId)
            .map((m) => m.user_name || 'Guardian');

          const userAlerts = await trustedCircleAlertService.getActiveAlertsForUser(userId);
          const activeAlerts = [...userAlerts.incomingAlerts, ...userAlerts.outgoingAlerts];

          trustedCircle = {
            configured: true,
            memberCount: activeMembers.length,
            activeGuardianNames: guardianNames,
            activeAlertsCount: activeAlerts.length,
          };

          alerts = activeAlerts.map((a) => ({
            id: a.id,
            alertType: a.alert_type,
            severity: a.severity as any,
            status: a.status,
            createdAt: a.created_at,
          }));
        }
      } catch {}
    }

    // 9. User Context
    const user: UserContext = overrides?.user || {
      id: 'usr_guest',
      name: 'User',
      isAuthenticated: false,
    };

    return {
      user,
      journey,
      risk,
      location,
      route,
      checkIn,
      trustedCircle,
      monitoring,
      alerts,
      time,
    };
  },
};
