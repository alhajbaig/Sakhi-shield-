// SakhiShield — Interactive Safety Guides Dataset
// Actionable, step-by-step procedures that reflect actual SakhiShield features and protocols.

import type { SafetyGuide } from '../types/resources.types';

export const SAFETY_GUIDES: SafetyGuide[] = [
  {
    id: 'guide_emergency_protocol',
    title: 'Emergency Protocol: What to Do When Feeling Unsafe',
    category: 'Immediate Response',
    summary: 'A clear 4-step grounding and escalation sequence when facing immediate street harassment, tailing, or danger.',
    readTimeMinutes: 2,
    relatedFeatureUrl: '/dashboard',
    relatedFeatureLabel: 'Open Emergency SOS in Dashboard',
    steps: [
      {
        stepNumber: 1,
        title: 'Move Toward a Well-Lit Public Zone',
        instruction: 'Immediately head toward an open shop, transit booth, pharmacy, or populated public establishment. Avoid narrow alleys or unlit paths.',
      },
      {
        stepNumber: 2,
        title: 'Trigger SakhiShield Emergency SOS',
        instruction: 'Tap the red SOS button in the top navigation or hold the mobile shortcut. This dispatches an instant audible siren and broadcasts live GPS coordinates to your Trusted Circle.',
      },
      {
        stepNumber: 3,
        title: 'Dial 112 National Police Emergency',
        instruction: 'Place a direct call to 112 ERSS. State your immediate landmark, direction of travel, and request immediate police patrol intercept.',
      },
      {
        stepNumber: 4,
        title: 'Preserve Situational Awareness',
        instruction: 'Do not look down at your screen continuously. Keep your phone firmly held, speak loudly to guardian or emergency dispatch, and stay in visible public view.',
      },
    ],
  },
  {
    id: 'guide_walk_with_me',
    title: 'How Walk With Me Monitoring Keeps You Safe',
    category: 'Transit Safety',
    summary: 'Understanding automated route deviation detection, unexpected stop analysis, and tiered safety check-in countdowns.',
    readTimeMinutes: 3,
    relatedFeatureUrl: '/walk-with-me',
    relatedFeatureLabel: 'Start Walk With Me Journey',
    steps: [
      {
        stepNumber: 1,
        title: 'Enter Destination & Safe Corridor',
        instruction: 'Start Walk With Me before commencing your trip. The engine plots your expected corridor, calculates accurate ETA, and prepares checkpoint intervals.',
      },
      {
        stepNumber: 2,
        title: 'Automatic Hazard Detection',
        instruction: 'If you diverge significantly from your planned route or stay motionless in an unpopulated zone, the risk engine automatically transitions to Suspicious status.',
      },
      {
        stepNumber: 3,
        title: 'Tiered Safety Check-in Pings',
        instruction: 'You will receive an audible prompt to confirm you are safe. If the first check-in is missed, an urgent final 45-second timer starts.',
      },
      {
        stepNumber: 4,
        title: 'Autonomous Escalation to Guardians',
        instruction: 'If both check-ins expire without response, SakhiShield escalates immediately to your Trusted Circle with live coordinates and automated alert sirens.',
      },
    ],
  },
  {
    id: 'guide_trusted_circle',
    title: 'Building a Reliable Trusted Circle of Guardians',
    category: 'Network Safety',
    summary: 'How to invite family members, friends, or trusted allies to monitor your walks and respond to distress signals.',
    readTimeMinutes: 2,
    relatedFeatureUrl: '/trusted-circle',
    relatedFeatureLabel: 'Manage Trusted Circle',
    steps: [
      {
        stepNumber: 1,
        title: 'Generate an Authenticated Invite Code',
        instruction: 'Navigate to Trusted Circle and generate a single-use or approval-required invite code (e.g. SC-XXXXXX).',
      },
      {
        stepNumber: 2,
        title: 'Select Guardians with Active Phones',
        instruction: 'Choose contacts who keep their phones on loud and are geographically capable of coordinating assistance or contacting emergency services.',
      },
      {
        stepNumber: 3,
        title: 'Review Privacy Boundaries',
        instruction: 'Guardians only receive your location when you actively start Walk With Me or trigger SOS. SakhiShield never allows continuous or secret tracking.',
      },
    ],
  },
  {
    id: 'guide_incident_vault',
    title: 'Preserving Tamper-Evident Evidence in Incident Vault',
    category: 'Digital Evidence',
    summary: 'How cryptographic SHA-256 byte hashing and private vault storage protect safety evidence.',
    readTimeMinutes: 3,
    relatedFeatureUrl: '/incident-vault',
    relatedFeatureLabel: 'Open Incident Vault',
    steps: [
      {
        stepNumber: 1,
        title: 'Create an Incident Record Promptly',
        instruction: 'Document the time, location, category (e.g. Harassment, Threat, Suspicious Activity), and objective factual descriptions.',
      },
      {
        stepNumber: 2,
        title: 'Attach Authentic Evidence Files',
        instruction: 'Upload audio voice memos, photos, video clips, or screenshots. The client calculates a SHA-256 cryptographic digest before private storage upload.',
      },
      {
        stepNumber: 3,
        title: 'Verify File Integrity On Demand',
        instruction: 'You can verify anytime whether stored files match their original upload hash, providing technical proof that evidence was not modified.',
      },
      {
        stepNumber: 4,
        title: 'Generate Time-Limited Secure Share Links',
        instruction: 'Share incident dossiers with legal advocates or guardians via cryptographically random, revocable 24-hour expiring tokens.',
      },
    ],
  },
  {
    id: 'guide_digital_safety',
    title: 'Digital Account Privacy & Link Phishing Defense',
    category: 'Digital Hygiene',
    summary: 'Using client-side entropy audits and syntactic URL heuristics to safeguard your devices from compromise.',
    readTimeMinutes: 2,
    relatedFeatureUrl: '/digital-safety',
    relatedFeatureLabel: 'Open Digital Safety Scanner',
    steps: [
      {
        stepNumber: 1,
        title: 'Audit Password Entropy Locally',
        instruction: 'Verify password complexity in your browser sandbox without ever exposing passwords over the network or sending them to remote servers.',
      },
      {
        stepNumber: 2,
        title: 'Inspect Suspicious Links Before Opening',
        instruction: 'Check incoming SMS and WhatsApp links for punycode homographs, IP-based destinations, and credential harvesting keywords.',
      },
      {
        stepNumber: 3,
        title: 'Maintain Strict Device Permissions',
        instruction: 'Regularly audit camera, microphone, and geolocation permissions to ensure zero background unauthorized access.',
      },
    ],
  },
];
