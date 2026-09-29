// SakhiShield — Help & Safety Resources Constants

import type { ResourceCategory } from '../types/resources.types';

export const RESOURCE_STORAGE_KEYS = {
  CACHED_RESOURCES: 'sakhishield_safety_resources_cache_v1',
  LAST_FETCH: 'sakhishield_safety_resources_last_fetch_v1',
};

export const RESOURCE_CATEGORIES: { id: ResourceCategory; label: string }[] = [
  { id: 'ALL', label: 'All Resources' },
  { id: 'EMERGENCY', label: '🚨 Immediate Emergency' },
  { id: 'WOMENS_SAFETY', label: '🛡️ Women’s Safety' },
  { id: 'CYBER_DIGITAL', label: '💻 Cyber & Digital' },
  { id: 'CRISIS_COUNSELING', label: '🤝 Crisis Support' },
  { id: 'LEGAL_SUPPORT', label: '⚖️ Free Legal Aid' },
];
