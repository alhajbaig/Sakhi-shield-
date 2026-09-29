// SakhiShield — Help & Safety Resources Type Contracts

export type ResourceCategory =
  | 'ALL'
  | 'EMERGENCY'
  | 'WOMENS_SAFETY'
  | 'CYBER_DIGITAL'
  | 'CRISIS_COUNSELING'
  | 'LEGAL_SUPPORT';

export interface SafetyResource {
  id: string;
  title: string;
  category: Exclude<ResourceCategory, 'ALL'>;
  description: string;
  phone?: string;
  whatsapp?: string;
  website?: string;
  availability: string;
  country: string;
  source: string;
  verifiedAt: string;
  isOfficial: boolean;
  priority: number;
}

export interface GuideStep {
  stepNumber: number;
  title: string;
  instruction: string;
}

export interface SafetyGuide {
  id: string;
  title: string;
  category: string;
  summary: string;
  readTimeMinutes: number;
  steps: GuideStep[];
  relatedFeatureUrl?: string;
  relatedFeatureLabel?: string;
}

export interface FAQItem {
  id: string;
  question: string;
  category: string;
  answer: string;
}
