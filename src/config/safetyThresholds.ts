// Walk With Me - Safety System Thresholds & Configuration
// All safety parameters are centrally defined here rather than buried in UI code.

export const SAFETY_THRESHOLDS = {
  // Route deviation thresholds in meters
  DEVIATION: {
    MINOR_METERS: 100,
    SIGNIFICANT_METERS: 250,
    MAJOR_METERS: 500,
    CONSECUTIVE_READINGS_REQUIRED: 3, // Debounce: requires 3 points to confirm deviation
  },

  // Stop / Stoppage detection
  STOP_DETECTION: {
    SPEED_THRESHOLD_MPS: 0.5, // Below 0.5 m/s (~1.8 km/h) considered static
    MAX_DRIFT_METERS: 15, // Location jitter allowance while stopped
    POSSIBLY_STOPPED_SECONDS: 45, // Initial hesitation (e.g. traffic light / shop pause)
    STOP_CONFIRMED_SECONDS: 90, // Unscheduled stop confirmed
  },

  // ETA Engine
  ETA: {
    ALLOWABLE_DELAY_SECONDS: 300, // 5 minutes grace
    PERCENTAGE_DELAY_THRESHOLD: 0.25, // 25% beyond expected arrival
  },

  // GPS Quality Filter
  GPS_QUALITY: {
    MAX_ALLOWABLE_ACCURACY_METERS: 50, // Accuracy worse than 50m flagged as low accuracy
    STALE_THRESHOLD_MS: 60000, // Points older than 60s rejected
    MAX_WALKING_SPEED_MPS: 15, // > 15 m/s (~54 km/h) considered erratic jump
  },

  // Check-In Engine (Two-Stage Flow)
  CHECK_IN: {
    DEFAULT_TIMEOUT_SECONDS: 45,
    /** Delay in seconds after first missed check-in before sending the FINAL check-in */
    FINAL_CHECK_IN_DELAY_SECONDS: 300, // 5 minutes
    /** Timeout for the final check-in before full emergency alert */
    FINAL_TIMEOUT_SECONDS: 45,
    AUTO_ESCALATE_ON_TIMEOUT: true,
  },

  // Arrival Proximity
  ARRIVAL: {
    PROXIMITY_METERS: 40, // Within 40m of destination
    PERSISTENT_CHECKS_REQUIRED: 2,
  },

  // Deterministic Risk Engine Scoring Weights
  RISK_ENGINE: {
    BASE_SCORE: 20,
    LATE_NIGHT_DELTA: 10, // Between 22:00 and 05:00 local time
    ROUTE_DEVIATION_DELTA: 20,
    UNEXPECTED_STOP_DELTA: 15,
    ETA_EXCEEDED_DELTA: 10,
    MISSED_CHECK_IN_DELTA: 25,
    // Risk Level boundaries
    LEVELS: {
      SAFE_MAX: 29,
      ATTENTION_MAX: 59,
      HIGH_RISK_MAX: 79,
      // 80 - 100 is CRITICAL
    },
  },
} as const;
