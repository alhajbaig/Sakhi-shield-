// Walk With Me - Custom Hook: useNotifications
// Manages push notification permissions and dispatching alerts to trusted contacts

import { useState, useCallback } from 'react';
import { requestPushNotificationPermission } from '../services/firebaseMessagingService';
import { dispatchSafetyNotification, type NotificationPayload } from '../services/notificationService';

export const useNotifications = (userId: string) => {
  const [permission, setPermission] = useState<NotificationPermission>(() => {
    return typeof window !== 'undefined' && 'Notification' in window
      ? Notification.permission
      : 'default';
  });
  const [fcmToken, setFcmToken] = useState<string | null>(null);

  const requestPermission = useCallback(async () => {
    const token = await requestPushNotificationPermission(userId);
    if (token) {
      setFcmToken(token);
      setPermission('granted');
    } else if (typeof window !== 'undefined' && 'Notification' in window) {
      setPermission(Notification.permission);
    }
    return token;
  }, [userId]);

  const notifyContact = useCallback(
    async (payload: Omit<NotificationPayload, 'userId'>) => {
      return await dispatchSafetyNotification({
        ...payload,
        userId,
      });
    },
    [userId]
  );

  return {
    permission,
    fcmToken,
    requestPermission,
    notifyContact,
  };
};
