// SakhiShield — Trusted Circle 2.0 TypeScript Definitions
// Strict typing for circles, memberships, real-time alert lifecycles, and recipient tracking

export type CircleRole = 'OWNER' | 'MEMBER';

export type CircleMemberStatus =
  | 'PENDING'
  | 'APPROVED'
  | 'DECLINED'
  | 'CANCELLED'
  | 'EXPIRED';

export type JoinMode = 'OPEN' | 'APPROVAL_REQUIRED';

export type CircleStatus = 'ACTIVE' | 'ARCHIVED' | 'DELETED';

export interface TrustedCircle {
  id: string;
  name: string;
  description?: string;
  owner_id: string;
  invite_code: string;
  join_mode: JoinMode;
  status: CircleStatus;
  created_at: string;
  updated_at: string;
  member_count?: number;
}

export interface TrustedCircleMember {
  id: string;
  circle_id: string;
  user_id: string;
  role: CircleRole;
  status: CircleMemberStatus;
  joined_at: string;
  updated_at: string;
  removed_at?: string | null;
  // Enriched member profile fields
  user_name?: string;
  user_email?: string;
  user_phone?: string;
  is_online?: boolean;
}

export type AlertType =
  | 'manual_sos'
  | 'critical_risk'
  | 'explicit_help_request'
  | 'missed_checkin'
  | 'user_alert';

export type AlertSeverity = 'ATTENTION' | 'HIGH' | 'CRITICAL';

export type AlertStatus =
  | 'CREATED'
  | 'PROCESSING'
  | 'SENT'
  | 'ACTIVE'
  | 'ACKNOWLEDGED'
  | 'RESOLVED'
  | 'FAILED'
  | 'EXPIRED';

export type AlertRecipientStatus =
  | 'PENDING'
  | 'SENT'
  | 'DELIVERED'
  | 'SEEN'
  | 'ACKNOWLEDGED'
  | 'FAILED';

export interface TrustedCircleAlertRecipient {
  id: string;
  alert_id: string;
  user_id: string;
  user_name?: string;
  user_phone?: string;
  status: AlertRecipientStatus;
  sent_at?: string | null;
  delivered_at?: string | null;
  seen_at?: string | null;
  acknowledged_at?: string | null;
  failed_at?: string | null;
  failure_reason?: string | null;
}

export interface TrustedCircleAlert {
  id: string;
  circle_id: string;
  triggered_by_user_id: string;
  triggered_by_user_name?: string;
  source_event_id?: string | null;
  idempotency_key: string;
  alert_type: AlertType;
  severity: AlertSeverity;
  message: string;
  location_shared: boolean;
  latitude?: number | null;
  longitude?: number | null;
  location_accuracy?: number | null;
  status: AlertStatus;
  created_at: string;
  updated_at: string;
  acknowledged_at?: string | null;
  resolved_at?: string | null;
  recipients?: TrustedCircleAlertRecipient[];
}
