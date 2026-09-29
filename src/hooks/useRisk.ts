// Walk With Me - Custom Hook: useRisk (Hardened Signal Lifecycle)
// Pure deterministic risk evaluation with signal resolution and explainability

import { useState, useEffect, useRef } from 'react';
import {
  calculateRiskScore,
  createSafetySignal,
  resolveSignalByType,
  isLateNightHour,
} from '../services/riskEngine';
import {
  calculateDistanceFromRoute,
  evaluateDeviationState,
  evaluateStopState,
  type StopDetectorState,
} from '../services/routeService';
import { recordRiskEvent } from '../services/journeyService';
import { SAFETY_THRESHOLDS } from '../config/safetyThresholds';
import type { GPSPoint, RouteGeometry } from '../types/journey';
import type { RiskEngineResult, RouteDeviationState, StopDetectionState, SafetySignal } from '../types/safety';

interface UseRiskProps {
  journeyId: string | null;
  location: GPSPoint | null;
  route: RouteGeometry | null;
  expectedArrival: string | null;
  missedCheckIn: boolean;
  isMonitoringActive: boolean;
}

export interface UseRiskReturn {
  riskResult: RiskEngineResult;
  deviationDistance: number;
  deviationState: RouteDeviationState;
  stopState: StopDetectionState;
  stoppedDurationSec: number;
  etaDelaySeconds: number;
  resolveSignal: (type: any) => void;
}

export const useRisk = ({
  journeyId,
  location,
  route,
  expectedArrival,
  missedCheckIn,
  isMonitoringActive,
}: UseRiskProps): UseRiskReturn => {
  const [signals, setSignals] = useState<SafetySignal[]>(() => {
    const initial: SafetySignal[] = [];
    if (isLateNightHour()) {
      initial.push(createSafetySignal('LATE_NIGHT', 'Journey underway during late-night hours (22:00–05:00)'));
    }
    return initial;
  });

  const [riskResult, setRiskResult] = useState<RiskEngineResult>(() =>
    calculateRiskScore({
      lateNight: isLateNightHour(),
      routeDeviation: false,
      unexpectedStop: false,
      etaExceeded: false,
      missedCheckIn: false,
      signals,
    })
  );

  const [deviationDistance, setDeviationDistance] = useState(0);
  const [deviationState, setDeviationState] = useState<RouteDeviationState>('ON_ROUTE');
  const [stopState, setStopState] = useState<StopDetectionState>('MOVING');
  const [stoppedDurationSec, setStoppedDurationSec] = useState(0);
  const [etaDelaySeconds, setEtaDelaySeconds] = useState(0);

  // Debounce counter for route deviation (requires 3 consecutive readings)
  const consecutiveDeviationRef = useRef(0);
  const stopDetectorStateRef = useRef<StopDetectorState>({
    stationarySince: null,
    lastMovingPoint: null,
    stoppedDurationSec: 0,
  });

  const lastRecordedScoreRef = useRef(riskResult.score);

  useEffect(() => {
    if (!isMonitoringActive || !location || !route) return;

    // 1. Calculate distance from active route baseline
    const distMeters = calculateDistanceFromRoute(location, route);
    setDeviationDistance(Math.round(distMeters));

    const rawDevState = evaluateDeviationState(distMeters);
    if (rawDevState !== 'ON_ROUTE') {
      consecutiveDeviationRef.current += 1;
    } else {
      consecutiveDeviationRef.current = 0;
    }

    // Confirm deviation only after 3 consecutive off-corridor readings
    const isDevConfirmed =
      consecutiveDeviationRef.current >= SAFETY_THRESHOLDS.DEVIATION.CONSECUTIVE_READINGS_REQUIRED;
    const finalDevState = isDevConfirmed ? rawDevState : 'ON_ROUTE';
    setDeviationState(finalDevState);

    // 2. Evaluate stop detection (Location uncertain when GPS is degraded)
    const { newState, status, stoppedDurationSec: sec } = evaluateStopState(location, stopDetectorStateRef.current);
    stopDetectorStateRef.current = newState;
    setStopState(status);
    setStoppedDurationSec(sec);

    // 3. Evaluate ETA delay
    let isDelayTriggered = false;
    if (expectedArrival) {
      const expectedTime = new Date(expectedArrival).getTime();
      const now = Date.now();
      const diffSeconds = Math.round((now - expectedTime) / 1000);
      setEtaDelaySeconds(Math.max(0, diffSeconds));

      if (diffSeconds > SAFETY_THRESHOLDS.ETA.ALLOWABLE_DELAY_SECONDS) {
        isDelayTriggered = true;
      }
    }

    // 4. Update Signal Lifecycle
    setSignals((prevSignals) => {
      let updated = [...prevSignals];

      // Route deviation signal lifecycle
      const hasDevSignal = updated.some((s) => s.type === 'ROUTE_DEVIATION' && s.active);
      if (finalDevState !== 'ON_ROUTE' && !hasDevSignal) {
        updated.push(createSafetySignal('ROUTE_DEVIATION', `Corridor deviation detected (+${Math.round(distMeters)}m)`));
      } else if (finalDevState === 'ON_ROUTE' && hasDevSignal) {
        updated = resolveSignalByType(updated, 'ROUTE_DEVIATION');
      }

      // Stop signal lifecycle
      const hasStopSignal = updated.some((s) => s.type === 'UNEXPECTED_STOP' && s.active);
      if (status === 'STOP_CONFIRMED' && !hasStopSignal) {
        updated.push(createSafetySignal('UNEXPECTED_STOP', 'Prolonged stationary dwell time detected on active corridor'));
      } else if (status === 'MOVING' && hasStopSignal) {
        updated = resolveSignalByType(updated, 'UNEXPECTED_STOP');
      }

      // ETA delay signal lifecycle
      const hasEtaSignal = updated.some((s) => s.type === 'ETA_EXCEEDED' && s.active);
      if (isDelayTriggered && !hasEtaSignal) {
        updated.push(createSafetySignal('ETA_EXCEEDED', 'Expected arrival window exceeded without arrival confirmation'));
      }

      // Missed check-in signal lifecycle
      const hasCheckinSignal = updated.some((s) => s.type === 'MISSED_CHECK_IN' && s.active);
      if (missedCheckIn && !hasCheckinSignal) {
        updated.push(createSafetySignal('MISSED_CHECK_IN', 'Safety verification prompt timed out without response'));
      }

      return updated;
    });
  }, [location, route, expectedArrival, missedCheckIn, isMonitoringActive]);

  // 5. Continuous Active Heartbeat: Evaluates stop dwell time and ETA even when user is stationary
  useEffect(() => {
    if (!isMonitoringActive || !location) return;

    const interval = setInterval(() => {
      // Advance stop detector evaluation with fresh current timestamp
      const nowPoint: GPSPoint = {
        ...location,
        timestamp: Date.now(),
      };

      const { newState, status, stoppedDurationSec: sec } = evaluateStopState(nowPoint, stopDetectorStateRef.current);
      stopDetectorStateRef.current = newState;
      setStopState(status);
      setStoppedDurationSec(sec);

      // Evaluate ETA delay in real-time
      let isDelay = false;
      if (expectedArrival) {
        const expectedTime = new Date(expectedArrival).getTime();
        const diffSeconds = Math.round((Date.now() - expectedTime) / 1000);
        setEtaDelaySeconds(Math.max(0, diffSeconds));
        if (diffSeconds > SAFETY_THRESHOLDS.ETA.ALLOWABLE_DELAY_SECONDS) {
          isDelay = true;
        }
      }

      // Update Stop & ETA signals if changed
      setSignals((prevSignals) => {
        let updated = [...prevSignals];
        const hasStopSignal = updated.some((s) => s.type === 'UNEXPECTED_STOP' && s.active);

        if (status === 'STOP_CONFIRMED' && !hasStopSignal) {
          updated.push(createSafetySignal('UNEXPECTED_STOP', 'Prolonged stationary dwell time detected on active corridor'));
        } else if (status === 'MOVING' && hasStopSignal) {
          updated = resolveSignalByType(updated, 'UNEXPECTED_STOP');
        }

        const hasEtaSignal = updated.some((s) => s.type === 'ETA_EXCEEDED' && s.active);
        if (isDelay && !hasEtaSignal) {
          updated.push(createSafetySignal('ETA_EXCEEDED', 'Expected arrival window exceeded without arrival confirmation'));
        }

        return updated;
      });
    }, 2000);

    return () => clearInterval(interval);
  }, [isMonitoringActive, location, expectedArrival]);

  // Recalculate pure deterministic risk whenever signals update
  useEffect(() => {
    const newRisk = calculateRiskScore({
      lateNight: isLateNightHour(),
      routeDeviation: false,
      unexpectedStop: false,
      etaExceeded: false,
      missedCheckIn: false,
      signals,
    });

    setRiskResult(newRisk);

    // If score changed by >= 10 points, log explainable audit event
    if (journeyId && Math.abs(newRisk.score - lastRecordedScoreRef.current) >= 10) {
      lastRecordedScoreRef.current = newRisk.score;
      const severityMap: Record<string, 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'> = {
        SAFE: 'LOW',
        ATTENTION: 'MEDIUM',
        HIGH_RISK: 'HIGH',
        CRITICAL: 'CRITICAL',
      };

      recordRiskEvent({
        journey_id: journeyId,
        event_type: 'RISK_SCORE_CHANGED',
        severity: severityMap[newRisk.level] || 'LOW',
        score_delta: newRisk.score - 20,
        reason: newRisk.reasons.join('; ') || 'Standard corridor baseline',
        metadata: {
          score: newRisk.score,
          level: newRisk.level,
          active_signals: newRisk.triggeredSignals,
        },
      });
    }
  }, [signals, journeyId]);

  const resolveSignal = (type: any) => {
    setSignals((prev) => resolveSignalByType(prev, type));
  };

  return {
    riskResult,
    deviationDistance,
    deviationState,
    stopState,
    stoppedDurationSec,
    etaDelaySeconds,
    resolveSignal,
  };
};
