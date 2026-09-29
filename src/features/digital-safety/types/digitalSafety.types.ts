// SakhiShield — Digital Safety Contracts & Types
// Defines the strict assessment models, capabilities, findings, recommendations, and action contracts.

export type SecurityCategory =
  | 'AUTHENTICATION'
  | 'PASSWORD_HYGIENE'
  | 'TWO_FACTOR'
  | 'SESSION_SECURITY'
  | 'BROWSER_SECURITY'
  | 'PRIVACY_EXPOSURE'
  | 'PHISHING_PROTECTION'
  | 'DIGITAL_FOOTPRINT'
  | 'ACCOUNT_PROTECTION';

export type CheckStatus = 'secure' | 'attention' | 'risk' | 'unknown';
export type SeverityLevel = 'low' | 'medium' | 'high' | 'critical';

export interface SecurityCheck {
  id: string;
  category: SecurityCategory;
  title: string;
  status: CheckStatus;
  severity: SeverityLevel;
  explanation: string;
  recommendation?: string;
  actionLabel?: string;
  actionId?: string;
  canVerify: boolean; // TRUE only if verified with real evidence, FALSE if self-assessment/guidance
  verificationSource: 'BROWSER_ENVIRONMENT' | 'SUPABASE_SESSION' | 'LOCAL_EVALUATION' | 'USER_DISCLOSURE' | 'NOT_VERIFIABLE';
  lastCheckedAt: string;
}

export interface SecurityFinding {
  id: string;
  checkId: string;
  category: SecurityCategory;
  title: string;
  description: string;
  severity: SeverityLevel;
  impact: string;
  remediationStep: string;
  isActionable: boolean;
  actionId?: string;
}

export interface SecurityRecommendation {
  id: string;
  title: string;
  description: string;
  priority: SeverityLevel;
  category: SecurityCategory;
  actionLabel: string;
  actionType: 'NAVIGATE' | 'TRIGGER_ACTION' | 'EXTERNAL_LINK' | 'COPY_GUIDANCE';
  target?: string;
}

export interface SecurityScore {
  overall: number; // 0 to 100
  isComplete: boolean;
  status: 'OPTIMAL' | 'MODERATE' | 'VULNERABLE' | 'INCOMPLETE';
  categoryBreakdown: Record<SecurityCategory, { score: number; max: number; verifiedCount: number; unknownCount: number }>;
  explanation: string;
}

// Local client-only Password Assessment (never sent to AI or server)
export interface PasswordAssessment {
  score: number; // 0 to 100
  label: 'Very Weak' | 'Weak' | 'Fair' | 'Strong' | 'Very Strong';
  entropyBits: number;
  length: number;
  hasUppercase: boolean;
  hasLowercase: boolean;
  hasNumbers: boolean;
  hasSpecialChars: boolean;
  hasRepeatedSequences: boolean;
  hasCommonSubstrings: boolean;
  issues: string[];
  recommendations: string[];
  estimatedCrackTime: string;
  breachCheckSupported: boolean;
  breachStatus: 'VERIFIED_CLEAR' | 'BREACHED' | 'NOT_CHECKED' | 'SERVICE_UNAVAILABLE';
  breachOccurrences?: number;
}

// Heuristic URL / Phishing Assessment (never navigates or downloads)
export interface UrlSecurityAssessment {
  url: string;
  parsedHost: string;
  protocol: 'https:' | 'http:' | 'unknown';
  isHttps: boolean;
  isIpAddress: boolean;
  hasSuspiciousPort: boolean;
  hasExcessiveSubdomains: boolean;
  isPunycodeOrIdn: boolean;
  hasCredentialPatterns: boolean;
  hasSuspiciousKeywords: boolean;
  riskScore: number; // 0 (benign indicators) to 100 (high suspicious indicators)
  riskLevel: 'LOW_RISK' | 'CAUTION' | 'SUSPICIOUS' | 'DANGEROUS';
  observableIndicators: string[];
  warnings: string[];
  safeAdvice: string;
  disclaimer: string;
}

// Session & Environment Context
export interface SessionSecurityContext {
  isAuthenticated: boolean;
  sessionState: 'ACTIVE' | 'EXPIRED' | 'UNAUTHENTICATED' | 'OFFLINE';
  authMethod: string;
  emailVerified: boolean;
  userEmail?: string;
  currentOrigin: string;
  isSecureContext: boolean; // window.isSecureContext
  storageAvailability: {
    localStorage: boolean;
    sessionStorage: boolean;
    indexedDb: boolean;
  };
  supportedBrowserCrypto: boolean;
}

// Privacy & Permissions Context
export interface PrivacySecurityContext {
  geolocationPermission: 'granted' | 'prompt' | 'denied' | 'unavailable';
  notificationPermission: 'granted' | 'default' | 'denied' | 'unavailable';
  trustedCircleCount: number;
  hasEmergencyContacts: boolean;
  isPublicProfileExposed: boolean;
  cameraPermissionState: 'granted' | 'prompt' | 'denied' | 'unavailable';
  microphonePermissionState: 'granted' | 'prompt' | 'denied' | 'unavailable';
}

// Unified Digital Safety State
export interface DigitalSafetyState {
  score: SecurityScore;
  checks: SecurityCheck[];
  findings: SecurityFinding[];
  recommendations: SecurityRecommendation[];
  session: SessionSecurityContext;
  privacy: PrivacySecurityContext;
  lastAssessedAt: string;
  isLoading: boolean;
  error?: string;
}
