// SakhiShield — Digital Safety Configuration
// Defines audit thresholds, verifiable capability mappings, and external service contracts.

export const DIGITAL_SAFETY_CONFIG = {
  // Never fake capability flags:
  capabilities: {
    canVerifyBrowserSecurity: true,
    canVerifyHttps: true,
    canVerifyClientSession: true,
    canVerifyPasswordLocally: true,
    canVerifyUrlHeuristics: true,
    canVerifyPermissions: true,
    // What browser apps CANNOT verify:
    canVerifyDeviceAntivirus: false,
    canVerifyOsMalware: false,
    canVerifyDarkWebBreach: false, // Unless external privacy-preserving API configured
    canVerifyExternalSocialMedia: false,
  },

  // Password hygiene parameters
  password: {
    minRecommendedLength: 12,
    strongLength: 16,
    kAnonymityBreachCheckEnabled: true, // Use k-anonymity (Pwned Passwords SHA-1 prefix)
    breachApiTimeoutMs: 3500,
  },

  // URL / Phishing parameters
  urlAnalyzer: {
    suspiciousPorts: [8080, 8443, 8888, 3000, 5000, 21, 22, 23, 25],
    suspiciousKeywords: [
      'login', 'verify', 'update', 'banking', 'secure', 'signin', 'account',
      'recover', 'wallet', 'suspend', 'free', 'gift', 'prize', 'kyc', 'aadhaar'
    ],
  },

  // Scoring weights for deterministic assessment (Total 100)
  weights: {
    AUTHENTICATION: 15,
    PASSWORD_HYGIENE: 15,
    TWO_FACTOR: 10,
    SESSION_SECURITY: 15,
    BROWSER_SECURITY: 15,
    PRIVACY_EXPOSURE: 15,
    PHISHING_PROTECTION: 15,
  },
} as const;
