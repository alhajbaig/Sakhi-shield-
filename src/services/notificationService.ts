// Walk With Me - Safety Notification & Escalation Service (Hardened Delivery Verification)
// Handles Idempotency Deduplication, Delivery State Tracking, Cooldowns, and Edge Function Isolation

import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { generateSecureId } from '../lib/securityUtils';
import type { NotificationChannel, NotificationType, SafetyNotificationRecord } from '../types/notifications';
import { monitoringHealthService } from './monitoringHealthService';

export type DeliveryState = 'QUEUED' | 'SENT' | 'DELIVERY_UNKNOWN' | 'FAILED';

export interface NotificationPayload {
  userId: string;
  journeyId: string;
  eventId: string;
  recipientId: string;
  recipientName: string;
  recipientPhone?: string;
  recipientEmail?: string;
  notificationType: NotificationType;
  channel: NotificationChannel;
  message: string;
  coordinates?: { latitude: number; longitude: number };
}

export interface NotificationResult {
  success: boolean;
  deliveryState: DeliveryState;
  idempotencyKey: string;
  deduplicated?: boolean;
  error?: string;
}

// In-memory set to prevent duplicate dispatches in the current session
const dispatchedIdempotencyKeys = new Set<string>();
const lastDispatchTimestamps = new Map<string, number>();

// Generates standard idempotency key per specification: journey_id + event_id + recipient_id + notification_type
export const generateIdempotencyKey = (
  journeyId: string,
  eventId: string,
  recipientId: string,
  notificationType: NotificationType
): string => {
  return `${journeyId}:${eventId}:${recipientId}:${notificationType}`;
};

export const dispatchSafetyNotification = async (
  payload: NotificationPayload
): Promise<NotificationResult> => {
  const idempotencyKey = generateIdempotencyKey(
    payload.journeyId,
    payload.eventId,
    payload.recipientId,
    payload.notificationType
  );

  // 1. Session-level deduplication guard
  if (dispatchedIdempotencyKeys.has(idempotencyKey)) {
    return { success: true, deliveryState: 'SENT', idempotencyKey, deduplicated: true };
  }

  // 2. Cooldown guard (Prevent notification storms: 45s cooldown unless EMERGENCY SOS or ESCALATION)
  const recipientCooldownKey = `${payload.recipientId}:${payload.notificationType}`;
  const lastSent = lastDispatchTimestamps.get(recipientCooldownKey) || 0;
  const isEmergency =
    payload.notificationType === 'CRITICAL_SAFETY_EVENT' ||
    payload.notificationType === 'JOURNEY_ESCALATION';

  if (!isEmergency && Date.now() - lastSent < 45000) {
    return { success: true, deliveryState: 'QUEUED', idempotencyKey, deduplicated: true };
  }

  dispatchedIdempotencyKeys.add(idempotencyKey);
  lastDispatchTimestamps.set(recipientCooldownKey, Date.now());

  // Immediate local system notification fallback if permission granted
  if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
    try {
      new Notification(`🚨 SakhiShield Safety Notice`, {
        body: payload.message,
        icon: '/icons/sakhishield-icon.png',
      });
    } catch {}
  }

  let deliveryState: DeliveryState = 'DELIVERY_UNKNOWN';

  // 3. Dispatch via Supabase Edge Function if configured
  if (isSupabaseConfigured() && navigator.onLine) {
    try {
      const { data, error } = await supabase.functions.invoke('notify-trusted-contact', {
        body: {
          ...payload,
          idempotencyKey,
        },
      });

      if (!error && data?.success) {
        deliveryState = 'SENT';
        monitoringHealthService.updateNotifications('AVAILABLE');
      } else {
        deliveryState = 'DELIVERY_UNKNOWN';
      }
    } catch (err) {
      console.warn('[NotificationService] Edge function invocation error, isolated safely:', err);
      deliveryState = 'FAILED';
    }
  } else {
    // Queued locally
    deliveryState = 'QUEUED';
  }

  // 4. Audit record in public.notifications
  const record: SafetyNotificationRecord = {
    id: generateSecureId('notif'),
    user_id: payload.userId,
    journey_id: payload.journeyId,
    event_id: payload.eventId,
    recipient_id: payload.recipientId,
    notification_type: payload.notificationType,
    channel: payload.channel,
    status: deliveryState === 'SENT' ? 'SENT' : 'QUEUED',
    idempotency_key: idempotencyKey,
    created_at: new Date().toISOString(),
  };

  if (isSupabaseConfigured() && navigator.onLine) {
    try {
      await supabase.from('notifications').insert(record);
    } catch {
      // Offline fallback
    }
  }

  return { success: deliveryState !== 'FAILED', deliveryState, idempotencyKey };
};
