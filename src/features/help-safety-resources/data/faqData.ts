// SakhiShield — Frequently Asked Questions Dataset
// Factual, transparent answers addressing architecture, location storage, cryptography, and privacy sovereignty.

import type { FAQItem } from '../types/resources.types';

export const FAQ_DATA: FAQItem[] = [
  {
    id: 'faq_location_storage',
    question: 'Where and how long is my location data stored?',
    category: 'Privacy & Architecture',
    answer: 'Location data is never continuously tracked in the background. It is accessed only during an active Walk With Me journey or when Emergency SOS is triggered. Under your Privacy & Data Sovereignty settings, you can configure ephemeral GPS windows (Session Only, 24 Hours, 7 Days, or 30 Days), after which spatial points are purged from device storage.',
  },
  {
    id: 'faq_data_selling',
    question: 'Does SakhiShield sell, monetize, or share my personal data?',
    category: 'Privacy & Sovereignty',
    answer: 'No. SakhiShield operates under strict data sovereignty principles. We do not sell user data, run third-party advertising trackers, or share records with commercial data brokers. Your safety records belong exclusively to your authenticated identity.',
  },
  {
    id: 'faq_unauthorized_tracking',
    question: 'Can a contact in my Trusted Circle track my location without my permission?',
    category: 'Trusted Circle',
    answer: 'No. Being in a Trusted Circle never grants continuous or stealth location access to anyone. Circle members can only view your location when you explicitly start a Walk With Me journey with live sharing enabled, or when an emergency SOS beacon is activated.',
  },
  {
    id: 'faq_sha256_integrity',
    question: 'How does Incident Vault SHA-256 integrity verification work?',
    category: 'Incident Vault',
    answer: 'When you attach an evidence file (audio, photo, video, or screenshot), the browser calculates a cryptographic SHA-256 digest directly from the raw file bytes before upload. This mathematical fingerprint is stored alongside the record. You can verify at any time that the stored file has not experienced bitrot, modification, or tampering.',
  },
  {
    id: 'faq_sos_trigger',
    question: 'What happens immediately when I press the Emergency SOS button?',
    category: 'Emergency Response',
    answer: 'Pressing SOS triggers a high-priority emergency state. The application plays an audible alarm, dispatches your exact GPS coordinates and emergency broadcast to all verified guardians in your Trusted Circle, and provides a direct shortcut to dial 112 emergency police dispatch.',
  },
  {
    id: 'faq_offline_support',
    question: 'Can I access emergency helplines and safety guides when offline?',
    category: 'Offline Capability',
    answer: 'Yes. All verified national emergency numbers (112, 1091, 181, 1930) and safety guides are bundled directly within the client application and cached in browser storage, ensuring they remain immediately accessible even with zero cellular data or in airplane mode.',
  },
  {
    id: 'faq_data_purge',
    question: 'How can I export or permanently purge my safety data?',
    category: 'Privacy & Sovereignty',
    answer: 'Visit the Privacy & Data Sovereignty screen. You can download a complete, machine-readable JSON dossier authenticated with a SHA-256 checksum, or execute targeted data deletion to purge ephemeral GPS breadcrumbs, local vault records, or complete application cache.',
  },
];
