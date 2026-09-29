// SakhiShield — Digital Safety Constants
// Provides truthful messaging, disclaimers, educational guidance, and checklists.

import type { SecurityCategory } from '../types';

export const DIGITAL_SAFETY_DISCLAIMERS = {
  BROWSER_LIMITATION:
    'SakhiShield runs in a secure browser sandbox. It cannot inspect installed apps, operating system files, device malware, or external private accounts.',
  URL_ANALYSIS:
    'URL analysis uses observable syntactic heuristics (HTTPS, ports, IP formats, credential indicators). It does not execute or load the page, and no indicator alone guarantees safety.',
  PASSWORD_PRIVACY:
    'Your password is never transmitted, stored, logged, or sent to any server or AI. Analysis executes 100% locally in your browser memory.',
  BREACH_CHECK_PRIVACY:
    'Breach checking uses privacy-preserving k-anonymity (SHA-1 prefix matching). Only the first 5 characters of a hash are queried; your actual password never leaves your browser.',
};

export const SECURITY_CATEGORIES_METADATA: Record<
  SecurityCategory,
  { label: string; description: string; canVerifyFully: boolean }
> = {
  AUTHENTICATION: {
    label: 'Authentication & Account',
    description: 'Current SakhiShield account credentials, verification, and authentication posture.',
    canVerifyFully: true,
  },
  PASSWORD_HYGIENE: {
    label: 'Password Hygiene',
    description: 'Client-side entropy, complexity, pattern detection, and k-anonymity breach status.',
    canVerifyFully: true,
  },
  TWO_FACTOR: {
    label: 'Two-Factor Authentication',
    description: 'Multi-factor verification protection status on your account.',
    canVerifyFully: true,
  },
  SESSION_SECURITY: {
    label: 'Session & Environment',
    description: 'Browser context security, storage isolation, and active session status.',
    canVerifyFully: true,
  },
  BROWSER_SECURITY: {
    label: 'Browser Security & TLS',
    description: 'Secure HTTPS origin, Web Cryptography API support, and runtime integrity.',
    canVerifyFully: true,
  },
  PRIVACY_EXPOSURE: {
    label: 'Permissions & Exposure',
    description: 'Geolocation permissions, notification access, and Trusted Circle coverage.',
    canVerifyFully: true,
  },
  PHISHING_PROTECTION: {
    label: 'Link & Phishing Defense',
    description: 'Heuristic URL analysis for impersonation, punycode spoofing, and malicious ports.',
    canVerifyFully: true,
  },
  DIGITAL_FOOTPRINT: {
    label: 'Digital Footprint Self-Audit',
    description: 'Guided checklist for social-media privacy, data leakage, and profile hardening.',
    canVerifyFully: false, // Self-assessment guided checklist
  },
  ACCOUNT_PROTECTION: {
    label: 'Emergency Response Playbook',
    description: 'Immediate action steps if an account or personal device is compromised.',
    canVerifyFully: false, // Procedural response guidance
  },
};

export const DIGITAL_FOOTPRINT_CHECKLIST_ITEMS = [
  {
    id: 'df_1',
    title: 'Social Media Profile Visibility',
    description: 'Keep personal accounts private or restrict public audience from viewing phone numbers, birthdates, and daily locations.',
    category: 'Privacy Settings',
  },
  {
    id: 'df_2',
    title: 'Location Tagging in Photos',
    description: 'Disable EXIF geotagging on mobile cameras and refrain from real-time location check-ins when alone.',
    category: 'Geotag Hygiene',
  },
  {
    id: 'df_3',
    title: 'Third-Party App Authorizations',
    description: 'Regularly audit and revoke old OAuth "Sign in with Google/Apple" tokens granted to unused apps.',
    category: 'Token Management',
  },
  {
    id: 'df_4',
    title: 'Public Phone Number & Email Exposure',
    description: 'Avoid posting primary phone numbers or personal emails on open job boards, classifieds, or community forums.',
    category: 'Contact Privacy',
  },
];

export const COMPROMISED_ACCOUNT_PLAYBOOK = [
  {
    step: 1,
    title: 'Isolate & Sign Out Everywhere',
    instruction: 'Immediately revoke active sessions from account security dashboards (Google, Apple, Instagram, WhatsApp).',
  },
  {
    step: 2,
    title: 'Change Password from a Clean Device',
    instruction: 'Update your password using a separate known-safe device or browser, using 16+ characters with a passphrase.',
  },
  {
    step: 3,
    title: 'Activate Two-Factor Authentication (App-based)',
    instruction: 'Switch 2FA from SMS to an authenticator app (Google Authenticator, Bitwarden, 1Password) to prevent SIM swapping.',
  },
  {
    step: 4,
    title: 'Review Forwarding & Recovery Settings',
    instruction: 'Inspect email forwarding rules, filter lists, and recovery phone numbers to confirm attackers did not establish persistence.',
  },
];
