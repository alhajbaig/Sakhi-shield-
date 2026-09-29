// SakhiShield — Safety Copilot Automated Test Suite
// Rigorously tests context gathering, sanitization, deterministic safety rules,
// prompt-injection defense, response validation, and sensitive action confirmations.

import { sanitizeSafetyContext } from '../features/safety-copilot/utils/contextSanitizer';
import { generateDeterministicResponse } from '../features/safety-copilot/utils/fallbackResponses';
import { validateCopilotResponse } from '../features/safety-copilot/utils/responseValidator';
import { copilotEmergencyService } from '../features/safety-copilot/services/copilotEmergencyService';
import type { SafetyContext, CopilotActionOffer } from '../features/safety-copilot/types/safetyCopilot.types';

function assert(condition: boolean, message: string) {
  if (!condition) {
    console.error(`❌ FAILED: ${message}`);
    process.exit(1);
  }
  console.log(`✅ PASSED: ${message}`);
}

console.log('====================================================');
console.log('RUNNING SAFETY COPILOT AUTOMATED TEST SUITE');
console.log('====================================================\n');

// ─── TEST 1: NO JOURNEY CONTEXT ─────────────────────────────────
console.log('--- 1. No Active Journey Handling ---');
const stationaryContext: SafetyContext = {
  user: { id: 'usr_1', name: 'Aanchal', isAuthenticated: true },
  journey: undefined,
  risk: { score: 10, level: 'SAFE', activeSignals: [] },
  monitoring: { networkOnline: true, gpsStatus: 'SEARCHING', isLeaderTab: true },
};

const res1 = generateDeterministicResponse("What's my current safety status?", stationaryContext);
assert(
  res1.content.toLowerCase().includes('stationary monitoring') ||
    res1.content.toLowerCase().includes('no active'),
  'Must recognize stationary mode when no journey exists'
);
assert(!res1.content.toLowerCase().includes('connaught place'), 'Must not hallucinate or invent a destination');

// ─── TEST 2: ACTIVE JOURNEY CONTEXT ─────────────────────────────
console.log('\n--- 2. Active Journey Grounding ---');
const activeJourneyContext: SafetyContext = {
  user: { id: 'usr_1', name: 'Aanchal', isAuthenticated: true },
  journey: {
    id: 'JRN-4021',
    destination: 'Green Park Metro',
    status: 'ACTIVE',
    etaMinutes: 18,
    isLive: true,
  },
  risk: { score: 15, level: 'SAFE', activeSignals: [] },
};

const res2 = generateDeterministicResponse('What is my journey status?', activeJourneyContext);
assert(res2.content.includes('Green Park Metro'), 'Must accurately reference actual destination');
assert(res2.content.includes('18'), 'Must report actual ground-truth ETA');
assert(res2.source === 'DETERMINISTIC_FALLBACK', 'Source must be verified deterministic');

// ─── TEST 3: ROUTE DEVIATION SIGNAL EXPLANATION ───────────────────
console.log('\n--- 3. Route Deviation Grounded Explanation ---');
const deviationContext: SafetyContext = {
  user: { id: 'usr_1', name: 'Aanchal', isAuthenticated: true },
  journey: {
    id: 'JRN-4021',
    destination: 'Green Park Metro',
    status: 'ACTIVE',
    isLive: true,
  },
  risk: {
    score: 55,
    level: 'ATTENTION',
    activeSignals: ['route_deviation'],
  },
  route: {
    isOffRoute: true,
    deviationDistanceMeters: 140,
    hasUnexpectedStop: false,
  },
};

const res3 = generateDeterministicResponse('Why did my risk change?', deviationContext);
assert(res3.content.includes('Route Deviation'), 'Must explain the actual route_deviation signal');
assert(res3.content.includes('55'), 'Must report actual risk score (55)');
assert(
  !res3.content.toLowerCase().includes('you are in immediate danger'),
  'Must not exaggerate danger without cause'
);

// ─── TEST 4: PENDING CHECK-IN PRIORITY ───────────────────────────
console.log('\n--- 4. Pending Check-in Prioritization ---');
const checkInContext: SafetyContext = {
  user: { id: 'usr_1', name: 'Aanchal', isAuthenticated: true },
  journey: {
    id: 'JRN-4021',
    destination: 'Home',
    status: 'CHECKING_IN',
    isLive: true,
  },
  checkIn: {
    isPending: true,
    timeRemainingSeconds: 25,
    stage: 1,
  },
};

const res4 = generateDeterministicResponse('What should I do?', checkInContext);
assert(
  res4.content.toLowerCase().includes('check-in pending') ||
    res4.content.toLowerCase().includes('active safety check-in'),
  'Must prioritize check-in acknowledgment over general discussion'
);
assert(
  res4.suggestedActions?.some((a) => a.type === 'REQUEST_CHECKIN') === true,
  'Must offer one-tap check-in action'
);

// ─── TEST 5: CRITICAL ESCALATION STAND-DOWN PROTECTION ───────────
console.log('\n--- 5. Active Emergency Escalation Grounding ---');
const escalatedContext: SafetyContext = {
  user: { id: 'usr_1', name: 'Aanchal', isAuthenticated: true },
  journey: {
    id: 'JRN-4021',
    destination: 'Home',
    status: 'ESCALATED',
    isLive: true,
  },
  risk: { score: 95, level: 'CRITICAL', activeSignals: ['manual_sos'] },
};

const res5 = generateDeterministicResponse('Where are my guardians?', escalatedContext);
assert(
  res5.content.toLowerCase().includes('emergency escalation is currently active') ||
    res5.content.toLowerCase().includes('broadcast'),
  'Must acknowledge active emergency state without disrupting escalation protocol'
);

// ─── TEST 6: CONTEXT SANITIZATION & PRIVACY ─────────────────────
console.log('\n--- 6. Privacy & Context Sanitization ---');
const rawContext: SafetyContext = {
  user: {
    id: 'usr_sensitive_uuid_12345',
    name: 'Aanchal Sharma',
    email: 'aanchal.private@domain.com',
    phone: '+91 9988776655',
    isAuthenticated: true,
  },
  location: {
    hasPermission: true,
    latitudeExact: 28.6139382,
    longitudeExact: 77.2090212,
    accuracyMeters: 4.2,
    isStale: false,
  },
  trustedCircle: {
    configured: true,
    memberCount: 2,
    activeGuardianNames: ['Papa (+91 9876543210)', 'Sister'],
    activeAlertsCount: 0,
  },
};

const sanitized = sanitizeSafetyContext(rawContext);
assert(sanitized.user.name === 'Aanchal', 'User surname must be stripped');
assert((sanitized as any).user.email === undefined, 'User email must be stripped');
assert((sanitized as any).user.phone === undefined, 'User phone must be stripped');
assert((sanitized.location as any).latitudeExact === undefined, 'Exact latitude must never be in sanitized context');
assert((sanitized.location as any).longitudeExact === undefined, 'Exact longitude must never be in sanitized context');
assert(sanitized.location.accuracyLevel === 'HIGH', 'Accuracy categorized without exposing exact precision');

// ─── TEST 7: RESPONSE VALIDATOR & PROMPT-INJECTION DEFENSE ───────
console.log('\n--- 7. Response Validation & False Emergency Claim Defense ---');
// Hallucinated police dispatch
const badAiCandidate1 = 'Do not worry, I have notified the police and emergency units are dispatched.';
const val1 = validateCopilotResponse(badAiCandidate1, 'Help', activeJourneyContext);
assert(!val1.isValid, 'Must reject hallucinated police dispatch claim');
assert(val1.sanitizedResponse.source === 'DETERMINISTIC_FALLBACK', 'Must substitute deterministic fallback on rejection');

// Dangerous instruction
const badAiCandidate2 = 'Turn off your phone immediately and confront the individual following you.';
const val2 = validateCopilotResponse(badAiCandidate2, 'Someone is following me', activeJourneyContext);
assert(!val2.isValid, 'Must reject dangerous unsupported instructions');

// False promise of absolute safety
const candidateWithFalsePromise = 'You are completely safe right now.';
const val3 = validateCopilotResponse(candidateWithFalsePromise, 'Am I safe?', activeJourneyContext);
assert(val3.isValid, 'Valid grammar must pass after sanitization');
assert(
  !val3.sanitizedResponse.content.toLowerCase().includes('you are completely safe'),
  'Must replace absolute safety claims with measured phrasing'
);

// ─── TEST 8: SENSITIVE ACTION CONFIRMATION GUARD ─────────────────
console.log('\n--- 8. Sensitive Action Confirmation Guard ---');
const sosOffer: CopilotActionOffer = {
  id: 'offer_sos_1',
  type: 'TRIGGER_SOS',
  label: 'Trigger Emergency SOS',
  description: 'Broadcast high-priority alarm',
  requiresConfirmation: true,
  severity: 'CRITICAL',
};

// Attempt unconfirmed execution:
const unconfirmedAttempt = await copilotEmergencyService.executeAction(
  sosOffer,
  activeJourneyContext,
  false // user NOT confirmed
);
assert(!unconfirmedAttempt.success, 'Unconfirmed SOS execution MUST fail');
assert(
  unconfirmedAttempt.message.toLowerCase().includes('confirmation is required'),
  'Must report confirmation requirement'
);

// Confirmed execution:
const confirmedAttempt = await copilotEmergencyService.executeAction(
  sosOffer,
  activeJourneyContext,
  true // user explicitly confirmed
);
assert(confirmedAttempt.success, 'Confirmed SOS execution must succeed');
assert(confirmedAttempt.actionType === 'TRIGGER_SOS', 'Action type must match');

console.log('\n====================================================');
console.log('ALL SAFETY COPILOT AUTOMATED TESTS PASSED! 🎉');
console.log('====================================================');
