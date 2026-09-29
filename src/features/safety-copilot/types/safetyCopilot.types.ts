// SakhiShield — Safety Copilot Contracts & Types
// Defines the strict context models, message contracts, action contracts, and provider interfaces.

import type { RiskLevel } from '../../../types/journey';

export interface UserContext {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  isAuthenticated: boolean;
}

export interface JourneyContext {
  id: string;
  destination: string;
  origin?: string;
  status: 'IDLE' | 'PLANNING' | 'ACTIVE' | 'PAUSED' | 'CHECKING_IN' | 'HELP_REQUESTED' | 'ESCALATING' | 'ESCALATED' | 'COMPLETING' | 'COMPLETED' | 'CANCELLED';
  etaMinutes?: number;
  distanceRemainingMeters?: number;
  startedAt?: string;
  isLive: boolean;
}

export interface RiskContext {
  score: number; // 0 to 100
  level: RiskLevel;
  activeSignals: string[];
  explanationSummary?: string;
}

export interface LocationContext {
  hasPermission: boolean;
  accuracyMeters?: number;
  isStale: boolean;
  latitudeApprox?: number; // Rounded to ~1km for AI privacy
  longitudeApprox?: number;
  latitudeExact?: number; // Only for local action execution, NEVER passed to external AI
  longitudeExact?: number;
}

export interface RouteContext {
  isOffRoute: boolean;
  deviationDistanceMeters?: number;
  hasUnexpectedStop: boolean;
  stopDurationMinutes?: number;
}

export interface CheckInContext {
  isPending: boolean;
  timeRemainingSeconds?: number;
  stage?: number;
  prompt?: string;
  lastCheckInStatus?: 'VERIFIED' | 'SYSTEM_AUTO' | 'MISSED' | 'PENDING';
}

export interface TrustedCircleContext {
  configured: boolean;
  memberCount: number;
  activeGuardianNames: string[];
  activeAlertsCount: number;
}

export interface MonitoringContext {
  networkOnline: boolean;
  gpsStatus: 'LOCKED' | 'SEARCHING' | 'DENIED' | 'UNAVAILABLE';
  isLeaderTab: boolean;
}

export interface AlertContext {
  id: string;
  alertType: string;
  severity: 'NORMAL' | 'ATTENTION' | 'CRITICAL';
  status: string;
  createdAt: string;
}

export interface TimeContext {
  currentHour: number;
  isLateNight: boolean;
  formattedTime: string;
}

export interface SafetyContext {
  user?: UserContext;
  journey?: JourneyContext;
  risk?: RiskContext;
  location?: LocationContext;
  route?: RouteContext;
  checkIn?: CheckInContext;
  trustedCircle?: TrustedCircleContext;
  monitoring?: MonitoringContext;
  alerts?: AlertContext[];
  time?: TimeContext;
}

export type CopilotSender = 'USER' | 'COPILOT' | 'SYSTEM';
export type CopilotResponseSource = 'AI' | 'DETERMINISTIC_FALLBACK' | 'SYSTEM_ACTION';

export type CopilotActionType =
  | 'EXPLAIN_RISK'
  | 'CHECK_STATUS'
  | 'REQUEST_CHECKIN'
  | 'OPEN_TRUSTED_CIRCLE'
  | 'TRIGGER_SOS'
  | 'CANCEL_JOURNEY'
  | 'CONFIRM_ARRIVAL';

export interface CopilotActionOffer {
  id: string;
  type: CopilotActionType;
  label: string;
  description: string;
  requiresConfirmation: boolean;
  severity: 'NORMAL' | 'CAUTION' | 'CRITICAL';
  status?: 'OFFERED' | 'CONFIRMED' | 'CANCELLED' | 'EXECUTED';
}

export interface CopilotActionExecutionResult {
  actionType: CopilotActionType;
  success: boolean;
  message: string;
  data?: Record<string, unknown>;
}

export interface CopilotMessage {
  id: string;
  sender: CopilotSender;
  content: string;
  timestamp: string;
  source: CopilotResponseSource;
  actionOffer?: CopilotActionOffer;
  contextSnapshot?: Partial<SafetyContext>;
  intentTag?: string;
}

export interface CopilotSession {
  id: string;
  userId: string;
  startedAt: string;
  updatedAt: string;
  messages: CopilotMessage[];
}

export interface CopilotResponse {
  content: string;
  source: CopilotResponseSource;
  suggestedActions?: CopilotActionOffer[];
  contextUsed?: Partial<SafetyContext>;
  disclaimer?: string;
}

export interface SafetyCopilotProvider {
  name: string;
  generateResponse(
    messages: CopilotMessage[],
    context: SafetyContext
  ): Promise<CopilotResponse>;
}
