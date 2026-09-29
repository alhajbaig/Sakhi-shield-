// SakhiShield — Local Password Security Analyzer
// Zero-knowledge, client-side only. Passwords are NEVER stored, logged, or sent over network.

import type { PasswordAssessment } from '../types';
import { DIGITAL_SAFETY_CONFIG } from '../config/digitalSafety.config';

/**
 * Calculates Shannon entropy of a string
 */
function calculateEntropy(str: string): number {
  if (!str) return 0;
  const len = str.length;
  const frequencies = new Map<string, number>();

  for (let i = 0; i < len; i++) {
    const char = str[i];
    frequencies.set(char, (frequencies.get(char) || 0) + 1);
  }

  let entropy = 0;
  frequencies.forEach((count) => {
    const p = count / len;
    entropy -= p * Math.log2(p);
  });

  return Math.round(entropy * len * 10) / 10;
}

/**
 * Common weak pattern checks
 */
const COMMON_PATTERNS = [
  'password', '123456', 'qwerty', 'admin', 'welcome', 'sakhi',
  'iloveyou', 'letmein', 'monkey', 'dragon', 'football', 'master'
];

/**
 * Analyzes password strength purely in client memory
 */
export function analyzePasswordLocally(password: string): PasswordAssessment {
  if (!password || password.trim().length === 0) {
    return {
      score: 0,
      label: 'Very Weak',
      entropyBits: 0,
      length: 0,
      hasUppercase: false,
      hasLowercase: false,
      hasNumbers: false,
      hasSpecialChars: false,
      hasRepeatedSequences: false,
      hasCommonSubstrings: false,
      issues: ['Password cannot be empty.'],
      recommendations: ['Enter a password to inspect its complexity and entropy.'],
      estimatedCrackTime: 'Instant',
      breachCheckSupported: true,
      breachStatus: 'NOT_CHECKED',
    };
  }

  const length = password.length;
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumbers = /[0-9]/.test(password);
  const hasSpecialChars = /[^A-Za-z0-9]/.test(password);
  
  // Detect repeated characters (e.g. "aaaa" or "1111")
  const hasRepeatedSequences = /(.)\1{2,}/.test(password);

  // Detect common keyboard runs or dictionary substrings
  const lower = password.toLowerCase();
  const hasCommonSubstrings = COMMON_PATTERNS.some((pat) => lower.includes(pat));

  const entropyBits = calculateEntropy(password);

  const issues: string[] = [];
  const recommendations: string[] = [];

  let points = 0;

  // Length scoring
  if (length >= DIGITAL_SAFETY_CONFIG.password.strongLength) {
    points += 35;
  } else if (length >= DIGITAL_SAFETY_CONFIG.password.minRecommendedLength) {
    points += 25;
  } else if (length >= 8) {
    points += 15;
    issues.push(`Length (${length} chars) is below the recommended 12+ characters.`);
    recommendations.push('Increase length to 12 or more characters for exponentially higher entropy.');
  } else {
    points += 5;
    issues.push('Critically short length (less than 8 characters).');
    recommendations.push('Passwords under 8 characters can be brute-forced in seconds.');
  }

  // Diversity scoring
  let diversityCount = 0;
  if (hasUppercase) diversityCount++;
  if (hasLowercase) diversityCount++;
  if (hasNumbers) diversityCount++;
  if (hasSpecialChars) diversityCount++;

  points += diversityCount * 12; // up to 48 points

  if (!hasUppercase) {
    issues.push('Missing uppercase letters.');
    recommendations.push('Add capital letters.');
  }
  if (!hasNumbers) {
    issues.push('Missing numbers.');
    recommendations.push('Include numbers.');
  }
  if (!hasSpecialChars) {
    issues.push('Missing symbols/special characters.');
    recommendations.push('Include special characters (e.g., !@#$%^&*).');
  }

  // Penalties
  if (hasRepeatedSequences) {
    points = Math.max(0, points - 15);
    issues.push('Contains repetitive character sequences (e.g. "aaa" or "111").');
    recommendations.push('Avoid repeating identical characters sequentially.');
  }

  if (hasCommonSubstrings) {
    points = Math.max(0, points - 25);
    issues.push('Contains easily guessed dictionary words or common keyboard patterns.');
    recommendations.push('Replace known words like "password" or "qwerty" with a multi-word passphrase.');
  }

  // Bonus for high entropy
  if (entropyBits > 65) points += 10;

  const score = Math.min(100, Math.max(0, Math.round(points)));

  let label: PasswordAssessment['label'] = 'Weak';
  let estimatedCrackTime = 'Seconds';

  if (score >= 85) {
    label = 'Very Strong';
    estimatedCrackTime = 'Centuries';
  } else if (score >= 70) {
    label = 'Strong';
    estimatedCrackTime = 'Decades';
  } else if (score >= 50) {
    label = 'Fair';
    estimatedCrackTime = 'Days to Weeks';
  } else if (score >= 30) {
    label = 'Weak';
    estimatedCrackTime = 'Minutes to Hours';
  } else {
    label = 'Very Weak';
    estimatedCrackTime = 'Instant';
  }

  return {
    score,
    label,
    entropyBits,
    length,
    hasUppercase,
    hasLowercase,
    hasNumbers,
    hasSpecialChars,
    hasRepeatedSequences,
    hasCommonSubstrings,
    issues,
    recommendations,
    estimatedCrackTime,
    breachCheckSupported: true,
    breachStatus: 'NOT_CHECKED',
  };
}

/**
 * Checks password against HIBP Pwned Passwords via k-Anonymity.
 * ONLY the first 5 characters of the SHA-1 hash are sent.
 * The full password or full hash NEVER leaves client browser.
 */
export async function checkPasswordBreachKAnonymity(password: string): Promise<{
  breachStatus: PasswordAssessment['breachStatus'];
  occurrences: number;
}> {
  if (!password) {
    return { breachStatus: 'NOT_CHECKED', occurrences: 0 };
  }

  // Check Web Crypto API
  if (typeof window === 'undefined' || !window.crypto || !window.crypto.subtle) {
    return { breachStatus: 'SERVICE_UNAVAILABLE', occurrences: 0 };
  }

  try {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await window.crypto.subtle.digest('SHA-1', data);
    
    // Convert buffer to hex string
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const fullHash = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('').toUpperCase();

    const prefix = fullHash.substring(0, 5);
    const suffix = fullHash.substring(5);

    // K-Anonymity API call
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), DIGITAL_SAFETY_CONFIG.password.breachApiTimeoutMs);

    const response = await fetch(`https://api.pwnedpasswords.com/range/${prefix}`, {
      method: 'GET',
      headers: {
        'Add-Padding': 'true', // Prevents response size side-channel
      },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      return { breachStatus: 'SERVICE_UNAVAILABLE', occurrences: 0 };
    }

    const text = await response.text();
    const lines = text.split('\n');

    for (const line of lines) {
      const [hashSuffix, countStr] = line.trim().split(':');
      if (hashSuffix && hashSuffix.toUpperCase() === suffix) {
        const count = parseInt(countStr || '0', 10);
        return { breachStatus: 'BREACHED', occurrences: count };
      }
    }

    return { breachStatus: 'VERIFIED_CLEAR', occurrences: 0 };
  } catch {
    return { breachStatus: 'SERVICE_UNAVAILABLE', occurrences: 0 };
  }
}
