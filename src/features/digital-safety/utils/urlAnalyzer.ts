// SakhiShield — URL & Phishing Heuristic Analyzer
// Analyzes observable URL characteristics without executing or navigating to the link.

import type { UrlSecurityAssessment } from '../types';
import { DIGITAL_SAFETY_CONFIG } from '../config/digitalSafety.config';

/**
 * Checks if a string looks like an IPv4 or IPv6 address
 */
function isIpAddress(hostname: string): boolean {
  // IPv4 test
  const ipv4Regex = /^(\d{1,3}\.){3}\d{1,3}$/;
  if (ipv4Regex.test(hostname)) {
    const parts = hostname.split('.').map(Number);
    return parts.every((p) => p >= 0 && p <= 255);
  }
  // IPv6 test
  return hostname.includes(':') && /^([0-9a-fA-F]{0,4}:){1,7}[0-9a-fA-F]{0,4}$/.test(hostname);
}

/**
 * Checks if domain contains Punycode/IDN spoofing indicators
 */
function hasPunycodeOrIdn(hostname: string): boolean {
  return hostname.toLowerCase().includes('xn--');
}

/**
 * Analyzes observable structural and syntactic properties of a URL
 */
export function analyzeUrlSafety(rawUrl: string): UrlSecurityAssessment {
  const trimmed = (rawUrl || '').trim();

  if (!trimmed) {
    return {
      url: '',
      parsedHost: '',
      protocol: 'unknown',
      isHttps: false,
      isIpAddress: false,
      hasSuspiciousPort: false,
      hasExcessiveSubdomains: false,
      isPunycodeOrIdn: false,
      hasCredentialPatterns: false,
      hasSuspiciousKeywords: false,
      riskScore: 0,
      riskLevel: 'LOW_RISK',
      observableIndicators: ['No URL provided.'],
      warnings: [],
      safeAdvice: 'Paste a link to analyze its structural safety indicators before opening.',
      disclaimer: 'This scanner inspects syntax without making network requests.',
    };
  }

  // Prepend https:// if user pasted a raw domain like "example.com/login"
  let parsedUrl: URL | null = null;
  let normalizedUrl = trimmed;

  try {
    if (!/^https?:\/\//i.test(normalizedUrl)) {
      normalizedUrl = `https://${normalizedUrl}`;
    }
    parsedUrl = new URL(normalizedUrl);
  } catch {
    return {
      url: trimmed,
      parsedHost: '',
      protocol: 'unknown',
      isHttps: false,
      isIpAddress: false,
      hasSuspiciousPort: false,
      hasExcessiveSubdomains: false,
      isPunycodeOrIdn: false,
      hasCredentialPatterns: false,
      hasSuspiciousKeywords: false,
      riskScore: 80,
      riskLevel: 'SUSPICIOUS',
      observableIndicators: ['Malformed URL structure.'],
      warnings: ['The link contains invalid syntax or invalid characters often used to evade filters.'],
      safeAdvice: 'Do not click or paste this into a browser navigation bar.',
      disclaimer: 'Malformed links often hide obfuscated payloads.',
    };
  }

  const hostname = parsedUrl.hostname;
  const protocol = parsedUrl.protocol === 'https:' ? 'https:' : parsedUrl.protocol === 'http:' ? 'http:' : 'unknown';
  const isHttps = protocol === 'https:';
  const port = parsedUrl.port ? parseInt(parsedUrl.port, 10) : (isHttps ? 443 : 80);

  const isIp = isIpAddress(hostname);
  const isPortSuspicious = DIGITAL_SAFETY_CONFIG.urlAnalyzer.suspiciousPorts.includes(port as any);
  
  // Count subdomain parts (e.g. login.secure.bank.com -> 4 parts)
  const hostParts = hostname.split('.');
  const hasExcessiveSubdomains = hostParts.length >= 4 && !isIp;

  const isPunycode = hasPunycodeOrIdn(hostname);

  // Check username/password embed in URL: e.g. http://user:pass@evil.com
  const hasCredentialPatterns = parsedUrl.username !== '' || parsedUrl.password !== '';

  // Check for suspicious target keywords in subdomains/path
  const fullPathAndHost = (hostname + parsedUrl.pathname + parsedUrl.search).toLowerCase();
  const matchedKeywords = DIGITAL_SAFETY_CONFIG.urlAnalyzer.suspiciousKeywords.filter((kw) =>
    fullPathAndHost.includes(kw)
  );
  const hasSuspiciousKeywords = matchedKeywords.length > 0;

  // Score formulation (0 = benign indicators, 100 = highly suspicious)
  let riskScore = 0;
  const observableIndicators: string[] = [];
  const warnings: string[] = [];

  if (!isHttps) {
    riskScore += 25;
    observableIndicators.push('Insecure Protocol (HTTP instead of HTTPS).');
    warnings.push('Unencrypted connection: data submitted can be intercepted by third parties on public Wi-Fi.');
  } else {
    observableIndicators.push('Valid HTTPS protocol scheme.');
  }

  if (isIp) {
    riskScore += 35;
    observableIndicators.push(`Raw IP Host Address (${hostname}).`);
    warnings.push('Legitimate websites virtually always use branded domain names rather than raw IP addresses.');
  }

  if (isPortSuspicious) {
    riskScore += 20;
    observableIndicators.push(`Non-standard port (: ${port}).`);
    warnings.push(`Standard web traffic uses ports 80/443. Port ${port} is frequently used by rogue services.`);
  }

  if (isPunycode) {
    riskScore += 30;
    observableIndicators.push('Punycode / Internationalized Domain Name (IDN).');
    warnings.push('IDN / Punycode is often used in homograph attacks to impersonate real brands with lookalike Unicode characters.');
  }

  if (hasCredentialPatterns) {
    riskScore += 40;
    observableIndicators.push('Credential authentication syntax embedded in URL.');
    warnings.push('Embedding credentials (user@domain) is a classic phishing technique to deceive visual inspection.');
  }

  if (hasExcessiveSubdomains) {
    riskScore += 15;
    observableIndicators.push(`Multiple nested subdomains (${hostParts.length} levels).`);
    warnings.push('Multi-layered subdomains (e.g. "paypal.verify.secure.com") are commonly used to mask the actual root domain.');
  }

  if (hasSuspiciousKeywords && (isIp || hasExcessiveSubdomains || !isHttps)) {
    riskScore += 15;
    warnings.push(`Contains high-value target keywords (${matchedKeywords.slice(0, 3).join(', ')}) combined with suspicious host attributes.`);
  }

  // Cap score
  riskScore = Math.min(100, Math.max(0, riskScore));

  let riskLevel: UrlSecurityAssessment['riskLevel'] = 'LOW_RISK';
  let safeAdvice = 'No obvious structural indicators detected. Always verify the domain spelling before signing in.';

  if (riskScore >= 70) {
    riskLevel = 'DANGEROUS';
    safeAdvice = 'Do NOT open this link. High probability of phishing or credential spoofing.';
  } else if (riskScore >= 45) {
    riskLevel = 'SUSPICIOUS';
    safeAdvice = 'Caution advised. Open only if you explicitly requested this link from a verified trusted sender.';
  } else if (riskScore >= 20) {
    riskLevel = 'CAUTION';
    safeAdvice = 'Review destination carefully. Ensure the root domain matches the organization you intend to visit.';
  }

  return {
    url: trimmed,
    parsedHost: hostname,
    protocol,
    isHttps,
    isIpAddress: isIp,
    hasSuspiciousPort: isPortSuspicious,
    hasExcessiveSubdomains,
    isPunycodeOrIdn: isPunycode,
    hasCredentialPatterns,
    hasSuspiciousKeywords,
    riskScore,
    riskLevel,
    observableIndicators,
    warnings,
    safeAdvice,
    disclaimer: 'Syntactic analysis based on observable URL properties. No network request was sent to the destination server.',
  };
}
