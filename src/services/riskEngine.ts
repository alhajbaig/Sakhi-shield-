// Walk With Me - Deterministic Risk Scoring Engine with Signal Lifecycle
// Pure TypeScript calculation. Zero probabilistic guesswork, zero LLMs.
// Score represents: "Detected safety-related journey signals", not "probability of crime".

import { SAFETY_THRESHOLDS } from '../config/safetyThresholds';
import type { RiskEngineInputs, RiskEngineResult, SafetySignal, SafetySignalType } from '../types/safety';
import type { RiskLevel } from '../types/journey';
import { generateSecureId } from '../lib/securityUtils';

export const calculateRiskScore = (inputs: RiskEngineInputs): RiskEngineResult => {
  const {
    BASE_SCORE,
    LATE_NIGHT_DELTA,
    ROUTE_DEVIATION_DELTA,
    UNEXPECTED_STOP_DELTA,
    ETA_EXCEEDED_DELTA,
    MISSED_CHECK_IN_DELTA,
  } = SAFETY_THRESHOLDS.RISK_ENGINE;

  let score = Number.isFinite(BASE_SCORE) ? BASE_SCORE : 20;
  const reasons: string[] = [];
  const triggeredSignals: string[] = [];

  // 1. If explicit signals array is provided, evaluate strictly from active signals
  if (inputs.signals && Array.isArray(inputs.signals)) {
    // Deduplicate active signals by type to prevent accidental double-counting
    const seenTypes = new Set<SafetySignalType>();
    const activeSignals = inputs.signals.filter((s) => {
      if (!s.active) return false;
      if (seenTypes.has(s.type)) return false;
      seenTypes.add(s.type);
      return true;
    });

    for (const signal of activeSignals) {
      const contribution = Number.isFinite(signal.score_contribution) ? signal.score_contribution : 0;
      score += contribution;
      reasons.push(signal.reason);
      triggeredSignals.push(signal.type);
    }
  } else {
    // 2. Direct inputs evaluation (backward compatible)
    if (inputs.lateNight) {
      score += LATE_NIGHT_DELTA;
      reasons.push('Journey underway during late-night hours (22:00–05:00)');
      triggeredSignals.push('LATE_NIGHT');
    }

    if (inputs.routeDeviation) {
      score += ROUTE_DEVIATION_DELTA;
      reasons.push('Path deviated from planned safety corridor');
      triggeredSignals.push('ROUTE_DEVIATION');
    }

    if (inputs.unexpectedStop) {
      score += UNEXPECTED_STOP_DELTA;
      reasons.push('Unscheduled or stationary dwell time detected on active route');
      triggeredSignals.push('UNEXPECTED_STOP');
    }

    if (inputs.etaExceeded) {
      score += ETA_EXCEEDED_DELTA;
      reasons.push('Estimated arrival window elapsed without arrival confirmation');
      triggeredSignals.push('ETA_EXCEEDED');
    }

    if (inputs.missedCheckIn) {
      score += MISSED_CHECK_IN_DELTA;
      reasons.push('Safety check-in request timed out without user confirmation');
      triggeredSignals.push('MISSED_CHECK_IN');
    }
  }

  // Pure mathematical clamp between 0 and 100 with NaN guard
  const validatedScore = Number.isFinite(score) ? score : BASE_SCORE;
  const clampedScore = Math.max(0, Math.min(100, Math.round(validatedScore)));

  // Determine discrete risk level
  const level = getRiskLevel(clampedScore);

  return {
    score: clampedScore,
    level,
    reasons,
    triggeredSignals,
    activeSignals: inputs.signals?.filter((s) => s.active),
  };
};

// Helper: Factory for new safety signals with cryptographically secure lifecycle IDs
export const createSafetySignal = (
  type: SafetySignalType,
  reason: string,
  scoreDelta?: number
): SafetySignal => {
  const {
    LATE_NIGHT_DELTA,
    ROUTE_DEVIATION_DELTA,
    UNEXPECTED_STOP_DELTA,
    ETA_EXCEEDED_DELTA,
    MISSED_CHECK_IN_DELTA,
  } = SAFETY_THRESHOLDS.RISK_ENGINE;

  let delta = scoreDelta ?? 15;
  if (type === 'LATE_NIGHT') delta = LATE_NIGHT_DELTA;
  else if (type === 'ROUTE_DEVIATION') delta = ROUTE_DEVIATION_DELTA;
  else if (type === 'UNEXPECTED_STOP') delta = UNEXPECTED_STOP_DELTA;
  else if (type === 'ETA_EXCEEDED') delta = ETA_EXCEEDED_DELTA;
  else if (type === 'MISSED_CHECK_IN') delta = MISSED_CHECK_IN_DELTA;
  else if (type === 'EMERGENCY_SOS') delta = 50;

  return {
    signal_id: generateSecureId('sig'),
    type,
    created_at: Date.now(),
    active: true,
    score_contribution: delta,
    reason,
  };
};

// Helper: Resolves specific signal type (e.g. user updated route or confirmed safe)
export const resolveSignalByType = (
  signals: SafetySignal[],
  type: SafetySignalType
): SafetySignal[] => {
  return signals.map((s) => {
    if (s.type === type && s.active) {
      return { ...s, active: false, resolved_at: Date.now() };
    }
    return s;
  });
};

// Helper to determine discrete risk level from a numeric score
export const getRiskLevel = (score: number): RiskLevel => {
  const { LEVELS } = SAFETY_THRESHOLDS.RISK_ENGINE;
  if (score <= LEVELS.SAFE_MAX) return 'SAFE';
  if (score <= LEVELS.ATTENTION_MAX) return 'ATTENTION';
  if (score <= LEVELS.HIGH_RISK_MAX) return 'HIGH_RISK';
  return 'CRITICAL';
};

// Helper to determine if current time is late night (22:00 - 05:00)
export const isLateNightHour = (date: Date = new Date()): boolean => {
  const hour = date.getHours();
  return hour >= 22 || hour < 5;
};
