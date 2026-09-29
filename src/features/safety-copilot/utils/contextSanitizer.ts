// SakhiShield — Context Sanitizer
// Strips all PII, exact coordinates, bearer tokens, and internal database IDs
// to construct an AI-safe, privacy-preserving context payload.

import type { SafetyContext } from '../types/safetyCopilot.types';

export interface SanitizedSafetyContext {
  user: {
    name: string;
    isAuthenticated: boolean;
  };
  journey: {
    hasActiveJourney: boolean;
    destination?: string;
    origin?: string;
    status?: string;
    etaMinutes?: number;
    isLive?: boolean;
  };
  risk: {
    score: number;
    level: string;
    activeSignals: string[];
    explanationSummary?: string;
  };
  location: {
    hasPermission: boolean;
    accuracyLevel: 'HIGH' | 'MEDIUM' | 'POOR' | 'UNAVAILABLE';
    approximateArea?: string;
  };
  route: {
    isOffRoute: boolean;
    deviationMeters?: number;
    hasUnexpectedStop: boolean;
    stopDurationMinutes?: number;
  };
  checkIn: {
    isPending: boolean;
    timeRemainingSeconds?: number;
    stage?: number;
  };
  trustedCircle: {
    isConfigured: boolean;
    activeGuardianCount: number;
    activeAlertsCount: number;
  };
  monitoring: {
    networkOnline: boolean;
    gpsStatus: string;
  };
  time: {
    isLateNight: boolean;
    timeFormatted: string;
  };
}

export function sanitizeSafetyContext(context: SafetyContext): SanitizedSafetyContext {
  // Assess accuracy category without sending raw meters if too identifying
  let accuracyLevel: 'HIGH' | 'MEDIUM' | 'POOR' | 'UNAVAILABLE' = 'UNAVAILABLE';
  if (context.location?.hasPermission) {
    const acc = context.location.accuracyMeters;
    if (acc !== undefined) {
      if (acc <= 15) accuracyLevel = 'HIGH';
      else if (acc <= 50) accuracyLevel = 'MEDIUM';
      else accuracyLevel = 'POOR';
    }
  }

  return {
    user: {
      name: context.user?.name ? context.user.name.split(' ')[0] : 'User',
      isAuthenticated: Boolean(context.user?.isAuthenticated),
    },
    journey: {
      hasActiveJourney: Boolean(context.journey && context.journey.isLive),
      destination: context.journey?.destination,
      origin: context.journey?.origin,
      status: context.journey?.status,
      etaMinutes: context.journey?.etaMinutes,
      isLive: context.journey?.isLive,
    },
    risk: {
      score: context.risk?.score ?? 10,
      level: context.risk?.level ?? 'SAFE',
      activeSignals: context.risk?.activeSignals ?? [],
      explanationSummary: context.risk?.explanationSummary,
    },
    location: {
      hasPermission: Boolean(context.location?.hasPermission),
      accuracyLevel,
    },
    route: {
      isOffRoute: Boolean(context.route?.isOffRoute),
      deviationMeters: context.route?.deviationDistanceMeters
        ? Math.round(context.route.deviationDistanceMeters)
        : undefined,
      hasUnexpectedStop: Boolean(context.route?.hasUnexpectedStop),
      stopDurationMinutes: context.route?.stopDurationMinutes,
    },
    checkIn: {
      isPending: Boolean(context.checkIn?.isPending),
      timeRemainingSeconds: context.checkIn?.timeRemainingSeconds,
      stage: context.checkIn?.stage,
    },
    trustedCircle: {
      isConfigured: Boolean(context.trustedCircle?.configured),
      activeGuardianCount: context.trustedCircle?.memberCount ?? 0,
      activeAlertsCount: context.trustedCircle?.activeAlertsCount ?? 0,
    },
    monitoring: {
      networkOnline: Boolean(context.monitoring?.networkOnline),
      gpsStatus: context.monitoring?.gpsStatus ?? 'UNKNOWN',
    },
    time: {
      isLateNight: Boolean(context.time?.isLateNight),
      timeFormatted: context.time?.formattedTime ?? '',
    },
  };
}
