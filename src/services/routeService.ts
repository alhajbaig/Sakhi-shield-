// Walk With Me - Geospatial Calculation and Route Monitoring Service
// High-precision Haversine and cross-track distance calculations with transit awareness and arrival hardening

import { SAFETY_THRESHOLDS } from '../config/safetyThresholds';
import type { Coordinates, GPSPoint, RouteGeometry } from '../types/journey';
import type { RouteDeviationState, StopDetectionState } from '../types/safety';

const EARTH_RADIUS_METERS = 6371000;

// Converts degrees to radians
const toRadians = (degrees: number): number => (degrees * Math.PI) / 180;

// Haversine distance between two coordinates in meters
export const calculateDistanceMeters = (
  coord1: Coordinates,
  coord2: Coordinates
): number => {
  const dLat = toRadians(coord2.latitude - coord1.latitude);
  const dLon = toRadians(coord2.longitude - coord1.longitude);

  const lat1 = toRadians(coord1.latitude);
  const lat2 = toRadians(coord2.latitude);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return EARTH_RADIUS_METERS * c;
};

// Distance from point P to line segment AB in meters
export const distanceToSegment = (
  p: Coordinates,
  a: Coordinates,
  b: Coordinates
): number => {
  // Approximate planar projection for local segment lengths (< 5km)
  const x = toRadians(b.longitude - a.longitude) * Math.cos(toRadians((a.latitude + b.latitude) / 2));
  const y = toRadians(b.latitude - a.latitude);
  const segLengthSq = x * x + y * y;

  if (segLengthSq === 0) {
    return calculateDistanceMeters(p, a);
  }

  const px = toRadians(p.longitude - a.longitude) * Math.cos(toRadians((a.latitude + p.latitude) / 2));
  const py = toRadians(p.latitude - a.latitude);

  // Projection scalar t onto segment [0, 1]
  const t = Math.max(0, Math.min(1, (px * x + py * y) / segLengthSq));

  const projLat = a.latitude + t * (b.latitude - a.latitude);
  const projLng = a.longitude + t * (b.longitude - a.longitude);

  return calculateDistanceMeters(p, { latitude: projLat, longitude: projLng });
};

// Calculate minimum distance from user position to entire route polyline
export const calculateDistanceFromRoute = (
  point: Coordinates,
  route: RouteGeometry
): number => {
  if (!route || !route.coordinates || route.coordinates.length === 0) return 0;

  if (route.coordinates.length === 1) {
    const only = route.coordinates[0];
    return calculateDistanceMeters(point, { latitude: only[1], longitude: only[0] });
  }

  let minDistance = Infinity;

  for (let i = 0; i < route.coordinates.length - 1; i++) {
    const a = { latitude: route.coordinates[i][1], longitude: route.coordinates[i][0] };
    const b = { latitude: route.coordinates[i + 1][1], longitude: route.coordinates[i + 1][0] };

    const dist = distanceToSegment(point, a, b);
    if (dist < minDistance) {
      minDistance = dist;
    }
  }

  return minDistance === Infinity ? 0 : minDistance;
};

// Determine route deviation state with configurable thresholds
export const evaluateDeviationState = (distanceMeters: number): RouteDeviationState => {
  const { MINOR_METERS, SIGNIFICANT_METERS, MAJOR_METERS } = SAFETY_THRESHOLDS.DEVIATION;

  if (distanceMeters >= MAJOR_METERS) {
    return 'MAJOR_DEVIATION';
  }
  if (distanceMeters >= SIGNIFICANT_METERS) {
    return 'SIGNIFICANT_DEVIATION';
  }
  if (distanceMeters >= MINOR_METERS) {
    return 'MINOR_DEVIATION';
  }
  return 'ON_ROUTE';
};

// Stop detection state machine evaluator with transit & confidence awareness (Section 16, 17)
export interface StopDetectorState {
  stationarySince: number | null;
  lastMovingPoint: GPSPoint | null;
  stoppedDurationSec?: number;
}

export const evaluateStopState = (
  currentPoint: GPSPoint,
  state: StopDetectorState
): { newState: StopDetectorState; status: StopDetectionState; stoppedDurationSec: number } => {
  // If GPS accuracy is truly poor or unavailable (>150m or UNAVAILABLE), flag LOCATION_UNCERTAIN
  if (currentPoint.confidence === 'POOR' || currentPoint.confidence === 'UNAVAILABLE' || currentPoint.accuracy > 150) {
    return {
      newState: state,
      status: 'LOCATION_UNCERTAIN',
      stoppedDurationSec: state.stoppedDurationSec || 0,
    };
  }

  const { SPEED_THRESHOLD_MPS, MAX_DRIFT_METERS, POSSIBLY_STOPPED_SECONDS, STOP_CONFIRMED_SECONDS } =
    SAFETY_THRESHOLDS.STOP_DETECTION;

  const currentSpeed = currentPoint.speed !== null && currentPoint.speed >= 0 ? currentPoint.speed : 0;
  const isSpeedLow = currentSpeed < SPEED_THRESHOLD_MPS;

  // Allow dynamic drift threshold based on GPS accuracy (prevents desktop/laptop Wi-Fi jitter from wiping stop timer)
  const allowableDrift = Math.max(MAX_DRIFT_METERS, Math.min(80, (currentPoint.accuracy || 20) * 0.7));

  let isStationary = isSpeedLow;
  if (state.lastMovingPoint) {
    const dist = calculateDistanceMeters(currentPoint, state.lastMovingPoint);
    if (dist > allowableDrift) {
      isStationary = false;
    }
  }

  const now = currentPoint.timestamp || Date.now();

  if (!isStationary) {
    return {
      newState: {
        stationarySince: null,
        lastMovingPoint: currentPoint,
        stoppedDurationSec: 0,
      },
      status: 'MOVING',
      stoppedDurationSec: 0,
    };
  }

  const stationarySince = state.stationarySince || now;
  const stoppedDurationSec = Math.max(0, Math.round((now - stationarySince) / 1000));

  let status: StopDetectionState = 'MOVING';
  if (stoppedDurationSec >= STOP_CONFIRMED_SECONDS) {
    status = 'STOP_CONFIRMED';
  } else if (stoppedDurationSec >= POSSIBLY_STOPPED_SECONDS) {
    status = 'POSSIBLY_STOPPED';
  }

  return {
    newState: {
      stationarySince,
      lastMovingPoint: state.lastMovingPoint || currentPoint,
      stoppedDurationSec,
    },
    status,
    stoppedDurationSec,
  };
};

// Arrival hardening (Section 43, 44)
export type ArrivalStatus = 'APPROACHING' | 'ARRIVAL_CANDIDATE' | 'ARRIVAL_CONFIRMED';

export interface ArrivalEvaluation {
  distanceMeters: number;
  status: ArrivalStatus;
  isConfirmed: boolean;
}

export const evaluateArrivalConfidence = (
  currentLoc: Coordinates,
  destinationLoc: Coordinates,
  accuracy: number,
  consecutiveCloseReadings = 1
): ArrivalEvaluation => {
  const distance = calculateDistanceMeters(currentLoc, destinationLoc);
  const proximityRadius = SAFETY_THRESHOLDS.ARRIVAL.PROXIMITY_METERS;

  if (distance <= proximityRadius) {
    // If accuracy is poor, treat as candidate only
    if (accuracy > 40) {
      return { distanceMeters: Math.round(distance), status: 'ARRIVAL_CANDIDATE', isConfirmed: false };
    }
    // Require at least 2 persistent readings within proximity
    if (consecutiveCloseReadings >= 2) {
      return { distanceMeters: Math.round(distance), status: 'ARRIVAL_CONFIRMED', isConfirmed: true };
    }
    return { distanceMeters: Math.round(distance), status: 'ARRIVAL_CANDIDATE', isConfirmed: false };
  }

  return { distanceMeters: Math.round(distance), status: 'APPROACHING', isConfirmed: false };
};

// Backward-compatible simple arrival check
export const checkArrival = (
  currentLoc: Coordinates,
  destinationLoc: Coordinates
): boolean => {
  const distance = calculateDistanceMeters(currentLoc, destinationLoc);
  return distance <= SAFETY_THRESHOLDS.ARRIVAL.PROXIMITY_METERS;
};
