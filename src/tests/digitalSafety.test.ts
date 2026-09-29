// SakhiShield — Digital Safety Automated Unit & Acceptance Tests
// Tests local password analysis, URL heuristics, deterministic scoring, boundary disclosures, and privacy.

import { analyzePasswordLocally } from '../features/digital-safety/utils/passwordAnalyzer';
import { analyzeUrlSafety } from '../features/digital-safety/utils/urlAnalyzer';
import {
  buildVerifiableSecurityChecks,
  calculateDeterministicSecurityScore,
} from '../features/digital-safety/utils/securityScoring';
import { generateRecommendations } from '../features/digital-safety/utils/securityRecommendations';
import type { SessionSecurityContext, PrivacySecurityContext } from '../features/digital-safety/types';

function assert(condition: boolean, msg: string) {
  if (!condition) {
    console.error(`❌ ASSERTION FAILED: ${msg}`);
    process.exit(1);
  }
}

async function runTests() {
  console.log('🧪 Starting Digital Safety Test Suite...\n');

  // TEST 1: Password Analyzer — Local Evaluation & Entropy
  console.log('Test 1: Password Analyzer - Local entropy & weak pattern detection');
  const weakResult = analyzePasswordLocally('123456');
  assert(weakResult.score < 30, 'Weak password "123456" must receive low score');
  assert(weakResult.label === 'Very Weak' || weakResult.label === 'Weak', 'Should label "123456" as weak');
  assert(weakResult.issues.length > 0, 'Weak password should have issues detected');

  const strongResult = analyzePasswordLocally('K9#mQx!8vL$2wZp@');
  assert(strongResult.score >= 80, 'Complex 16-char password must receive high score');
  assert(strongResult.hasUppercase && strongResult.hasNumbers && strongResult.hasSpecialChars, 'Should detect diversity');
  console.log('✅ Test 1 Passed: Password analysis correctly computes complexity locally.\n');

  // TEST 2: URL Analyzer — HTTPS, Raw IP, Non-standard ports
  console.log('Test 2: URL Analyzer - Syntactic heuristics');
  const benignUrl = analyzeUrlSafety('https://example.com/about');
  assert(benignUrl.isHttps === true, 'example.com should be HTTPS');
  assert(benignUrl.isIpAddress === false, 'example.com is not an IP');
  assert(benignUrl.riskLevel === 'LOW_RISK', 'Standard HTTPS domain should be LOW_RISK');

  const suspiciousUrl = analyzeUrlSafety('http://192.168.1.1:8080/login/verify');
  assert(suspiciousUrl.isHttps === false, 'Should flag non-HTTPS');
  assert(suspiciousUrl.isIpAddress === true, 'Should flag raw IP host');
  assert(suspiciousUrl.hasSuspiciousPort === true, 'Should flag port 8080');
  assert(suspiciousUrl.riskLevel === 'DANGEROUS' || suspiciousUrl.riskLevel === 'SUSPICIOUS', 'Should flag high risk level');
  console.log('✅ Test 2 Passed: URL analyzer correctly identifies dangerous syntactic properties.\n');

  // TEST 3: URL Analyzer — Punycode / IDN Spoofing
  console.log('Test 3: URL Analyzer - Punycode detection');
  const punycodeUrl = analyzeUrlSafety('https://xn--pple-43d.com');
  assert(punycodeUrl.isPunycodeOrIdn === true, 'Should detect xn-- punycode indicator');
  console.log('✅ Test 3 Passed: Punycode homograph indicator detected.\n');

  // TEST 4: Telemetry Matrix — Verified vs Non-verifiable distinction
  console.log('Test 4: Truthful Capability Boundaries');
  const mockSession: SessionSecurityContext = {
    isAuthenticated: true,
    sessionState: 'ACTIVE',
    authMethod: 'Supabase JWT',
    emailVerified: true,
    userEmail: 'user@example.com',
    currentOrigin: 'https://app.sakhishield.org',
    isSecureContext: true,
    storageAvailability: { localStorage: true, sessionStorage: true, indexedDb: true },
    supportedBrowserCrypto: true,
  };

  const mockPrivacy: PrivacySecurityContext = {
    geolocationPermission: 'granted',
    notificationPermission: 'granted',
    trustedCircleCount: 3,
    hasEmergencyContacts: true,
    isPublicProfileExposed: false,
    cameraPermissionState: 'granted',
    microphonePermissionState: 'prompt',
  };

  const { checks } = buildVerifiableSecurityChecks(mockSession, mockPrivacy);
  const deviceCheck = checks.find((c) => c.id === 'chk_device_integrity');
  assert(deviceCheck !== undefined, 'Device check must exist');
  assert(deviceCheck?.canVerify === false, 'Browser MUST NOT claim ability to verify OS device integrity');
  assert(deviceCheck?.status === 'unknown', 'Non-verifiable check status must be unknown');
  console.log('✅ Test 4 Passed: Truthful boundary verified; browser limitation honored.\n');

  // TEST 5: Deterministic Scoring System
  console.log('Test 5: Deterministic Scoring Computation');
  const score = calculateDeterministicSecurityScore(checks);
  assert(score.overall >= 80, 'Optimal session and verified contacts should score high');
  assert(score.categoryBreakdown.AUTHENTICATION.score > 0, 'Auth category should be scored');
  assert(score.categoryBreakdown.BROWSER_SECURITY.score > 0, 'Browser security category should be scored');
  console.log(`✅ Test 5 Passed: Deterministic score calculated as ${score.overall}/100 without hallucinations.\n`);

  // TEST 6: Actionable Recommendations from Vulnerabilities
  console.log('Test 6: Recommendation Generation');
  const emptyPrivacy: PrivacySecurityContext = {
    ...mockPrivacy,
    trustedCircleCount: 0,
    hasEmergencyContacts: false,
  };
  const unauthSession: SessionSecurityContext = {
    ...mockSession,
    isAuthenticated: false,
  };

  const vulnerableChecks = buildVerifiableSecurityChecks(unauthSession, emptyPrivacy);
  const recs = generateRecommendations(vulnerableChecks.findings);
  assert(recs.length >= 2, 'Should generate recommendations for guest session and missing emergency contacts');
  assert(recs.some((r) => r.category === 'PRIVACY_EXPOSURE'), 'Should recommend configuring Trusted Circle');
  assert(recs.some((r) => r.category === 'AUTHENTICATION'), 'Should recommend logging in');
  console.log('✅ Test 6 Passed: High-priority recommendations produced for real vulnerabilities.\n');

  console.log('🎉 ALL DIGITAL SAFETY ACCEPTANCE TESTS PASSED SUCCESSFULLY!');
}

runTests().catch((err) => {
  console.error('Fatal test error:', err);
  process.exit(1);
});
