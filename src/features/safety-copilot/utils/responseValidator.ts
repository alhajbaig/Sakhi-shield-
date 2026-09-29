// SakhiShield — Response Validator
// Validates AI-generated text against actual ground-truth SafetyContext before display.
// If any unauthorized emergency claims, false police claims, or dangerous instructions are found,
// the response is rejected and replaced with the deterministic fallback.

import type { SafetyContext, CopilotResponse } from '../types/safetyCopilot.types';
import { generateDeterministicResponse } from './fallbackResponses';

export interface ValidationResult {
  isValid: boolean;
  rejectionReason?: string;
  sanitizedResponse: CopilotResponse;
}

// Prohibited hallucination / false emergency claims:
const FALSE_EMERGENCY_CLAIMS = [
  /i have notified the police/i,
  /police (is|are) on the way/i,
  /police have been dispatched/i,
  /emergency services (have been|are) contacted/i,
  /i alerted emergency services/i,
  /i have shared your location with authorities/i,
  /i have called (112|100|1091)/i,
  /i called 911/i,
];

const DANGEROUS_ADVICE_PATTERNS = [
  /confront the (attacker|individual|suspect)/i,
  /fight back immediately/i,
  /ignore the check-in/i,
  /turn off your phone/i,
  /disable your gps/i,
];

export function validateCopilotResponse(
  candidateText: string,
  userQuery: string,
  context: SafetyContext
): ValidationResult {
  if (!candidateText || candidateText.trim().length === 0) {
    return {
      isValid: false,
      rejectionReason: 'Empty candidate response from AI provider',
      sanitizedResponse: generateDeterministicResponse(userQuery, context),
    };
  }

  // 1. Check for false emergency/police intervention claims
  for (const pattern of FALSE_EMERGENCY_CLAIMS) {
    if (pattern.test(candidateText)) {
      return {
        isValid: false,
        rejectionReason: `Prohibited false emergency claim detected: ${pattern}`,
        sanitizedResponse: generateDeterministicResponse(userQuery, context),
      };
    }
  }

  // 2. Check for dangerous advice
  for (const pattern of DANGEROUS_ADVICE_PATTERNS) {
    if (pattern.test(candidateText)) {
      return {
        isValid: false,
        rejectionReason: `Dangerous advice pattern detected: ${pattern}`,
        sanitizedResponse: generateDeterministicResponse(userQuery, context),
      };
    }
  }

  // 3. Check for contradiction of active journey
  const claimsActiveJourney = /during your walk|on your current trip|destination you are walking to/i.test(candidateText);
  if (claimsActiveJourney && (!context.journey || !context.journey.isLive)) {
    return {
      isValid: false,
      rejectionReason: 'Response hallucinated an active journey when user is stationary',
      sanitizedResponse: generateDeterministicResponse(userQuery, context),
    };
  }

  // 4. Check for claim that "you are completely safe"
  if (/you are completely safe|there is zero risk/i.test(candidateText)) {
    candidateText = candidateText.replace(
      /you are completely safe|there is zero risk/gi,
      'no elevated safety signals are currently detected'
    );
  }

  return {
    isValid: true,
    sanitizedResponse: {
      content: candidateText.trim(),
      source: 'AI',
      contextUsed: { journey: context.journey, risk: context.risk },
      disclaimer: 'AI Safety Guidance • Grounded in SakhiShield Context',
    },
  };
}
