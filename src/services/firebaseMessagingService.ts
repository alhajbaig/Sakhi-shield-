// Walk With Me - Firebase Cloud Messaging & Web Push Service
// Manages device token registration, push permissions, and token persistence

import { getToken } from 'firebase/messaging';
import { getFirebaseMessagingInstance, isFirebaseConfigured } from '../lib/firebase';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

export const requestPushNotificationPermission = async (
  userId: string
): Promise<string | null> => {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    console.info('Notifications not supported in this browser environment');
    return null;
  }

  try {
    const permission = await Notification.requestPermission();
    if (permission !== 'granted') {
      return null;
    }

    if (!isFirebaseConfigured()) {
      return 'mock-vapid-token-' + userId.substring(0, 8);
    }

    const messaging = getFirebaseMessagingInstance();
    if (!messaging) return null;

    const vapidKey = import.meta.env.VITE_FIREBASE_VAPID_KEY;
    const currentToken = await getToken(messaging, { vapidKey });

    if (currentToken && isSupabaseConfigured()) {
      // Persist token to database
      await supabase.from('notification_tokens').upsert(
        {
          user_id: userId,
          token: currentToken,
          device_type: navigator.userAgent.includes('Mobile') ? 'MOBILE' : 'DESKTOP',
          browser: navigator.userAgent,
          last_seen_at: new Date().toISOString(),
        },
        { onConflict: 'token' }
      );
    }

    return currentToken;
  } catch (err) {
    console.warn('Failed to obtain FCM token:', err);
    return null;
  }
};
