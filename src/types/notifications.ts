// Walk With Me - Notifications & Trusted Circle Permission Types

export type ContactPermission =
  | 'EMERGENCY_LOCATION'
  | 'JOURNEY_ESCALATION'
  | 'NOTIFICATION'
  | 'TEMPORARY_LOCATION'
  | 'INCIDENT_ACCESS';

export type NotificationChannel = 'PUSH' | 'EMAIL' | 'SMS';

export type NotificationType =
  | 'TRUSTED_CONTACT_ALERT'
  | 'JOURNEY_ESCALATION'
  | 'CRITICAL_SAFETY_EVENT'
  | 'JOURNEY_COMPLETED_NOTICE'
  | 'CHECK_IN_REQUEST';

export interface NotificationToken {
  id: string;
  user_id: string;
  token: string;
  device_type: string;
  browser: string;
  created_at: string;
  last_seen_at: string;
  revoked_at?: string | null;
}

export interface SafetyNotificationRecord {
  id: string;
  user_id: string;
  journey_id: string;
  event_id?: string;
  recipient_id: string;
  notification_type: NotificationType;
  channel: NotificationChannel;
  status: 'QUEUED' | 'SENT' | 'DELIVERED' | 'FAILED';
  idempotency_key: string;
  created_at: string;
  error_message?: string;
}

export interface TrustedContactWithPermissions {
  id: string;
  name: string;
  relationship: string;
  phone: string;
  email?: string;
  isPrimary: boolean;
  status: 'Available' | 'Active' | 'Away';
  permissions: ContactPermission[];
}
