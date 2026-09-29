export interface TrustedContact {
  id: string;
  name: string;
  relationship: string;
  status: 'Available' | 'Active' | 'Away';
  phone: string;
  isPrimary: boolean;
}

export interface ActiveJourneyData {
  id: string;
  destination: string;
  origin: string;
  eta: string;
  monitoring: 'ACTIVE' | 'PAUSED';
  status: 'SAFE' | 'ATTENTION';
  startedAt: string;
  deviationDistance?: string;
}

export interface IncidentRecord {
  id: string;
  type: string;
  date: string;
  status: 'Resolved' | 'Archived' | 'Reviewing';
  severity: 'Low' | 'Medium' | 'High';
  summary: string;
}

export interface UserProfile {
  name: string;
  fullName: string;
  email: string;
  phone: string;
  initials: string;
  avatarUrl: string;
  status: 'SAFE' | 'ATTENTION' | 'HIGH_RISK' | 'CRITICAL';
  statusDescription: string;
  locationMonitoring: boolean;
  activeJourney: ActiveJourneyData | null;
  trustedContacts: TrustedContact[];
  emergencyPreferences: {
    preferredNotification: string;
    locationSharing: 'Session Only' | 'Emergency Only' | 'Always Off';
    evidenceRetention: '7 Days' | '30 Days' | 'Until Deleted';
    verificationTimeout: string;
  };
  profileCompleteness: number;
  missingField: string;
}

