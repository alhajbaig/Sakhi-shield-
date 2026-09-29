// SakhiShield — Privacy & Environment Analyzer
// Inspects browser context, permissions, and app privacy exposure safely.

import type { SessionSecurityContext, PrivacySecurityContext } from '../types';
import type { AuthUser } from '../../../lib/auth';

/**
 * Assesses client browser security environment and storage isolation
 */
export function inspectBrowserEnvironment(authUser: AuthUser | null): SessionSecurityContext {
  const isBrowser = typeof window !== 'undefined';
  const isSecureContext = isBrowser ? window.isSecureContext : false;
  const currentOrigin = isBrowser ? window.location.origin : 'unknown';

  let hasLocalStorage = false;
  let hasSessionStorage = false;
  let hasIndexedDb = false;

  if (isBrowser) {
    try {
      localStorage.setItem('__sakhi_test__', '1');
      localStorage.removeItem('__sakhi_test__');
      hasLocalStorage = true;
    } catch {
      hasLocalStorage = false;
    }

    try {
      sessionStorage.setItem('__sakhi_test__', '1');
      sessionStorage.removeItem('__sakhi_test__');
      hasSessionStorage = true;
    } catch {
      hasSessionStorage = false;
    }

    hasIndexedDb = typeof indexedDB !== 'undefined';
  }

  const supportedBrowserCrypto = isBrowser && !!window.crypto && !!window.crypto.subtle;

  return {
    isAuthenticated: !!authUser,
    sessionState: authUser ? 'ACTIVE' : 'UNAUTHENTICATED',
    authMethod: authUser ? 'Supabase JWT / Local Auth' : 'None',
    emailVerified: !!authUser?.email,
    userEmail: authUser?.email,
    currentOrigin,
    isSecureContext,
    storageAvailability: {
      localStorage: hasLocalStorage,
      sessionStorage: hasSessionStorage,
      indexedDb: hasIndexedDb,
    },
    supportedBrowserCrypto,
  };
}

/**
 * Inspects observable browser permissions and safety contacts
 */
export async function inspectPrivacyContext(trustedCircleCount: number): Promise<PrivacySecurityContext> {
  let geolocationPermission: PrivacySecurityContext['geolocationPermission'] = 'unavailable';
  let notificationPermission: PrivacySecurityContext['notificationPermission'] = 'unavailable';
  let cameraPermissionState: PrivacySecurityContext['cameraPermissionState'] = 'unavailable';
  let microphonePermissionState: PrivacySecurityContext['microphonePermissionState'] = 'unavailable';

  if (typeof navigator !== 'undefined' && 'permissions' in navigator) {
    try {
      const geoStatus = await navigator.permissions.query({ name: 'geolocation' as PermissionName });
      geolocationPermission = geoStatus.state as any;
    } catch {
      // Permission query not supported for geolocation in some browsers
    }

    try {
      const notifStatus = await navigator.permissions.query({ name: 'notifications' as PermissionName });
      notificationPermission = notifStatus.state as any;
    } catch {
      if (typeof Notification !== 'undefined') {
        notificationPermission = Notification.permission === 'granted' ? 'granted' : Notification.permission === 'denied' ? 'denied' : 'default';
      }
    }

    try {
      const camStatus = await navigator.permissions.query({ name: 'camera' as PermissionName });
      cameraPermissionState = camStatus.state as any;
    } catch {
      // ignore
    }

    try {
      const micStatus = await navigator.permissions.query({ name: 'microphone' as PermissionName });
      microphonePermissionState = micStatus.state as any;
    } catch {
      // ignore
    }
  }

  return {
    geolocationPermission,
    notificationPermission,
    trustedCircleCount,
    hasEmergencyContacts: trustedCircleCount > 0,
    isPublicProfileExposed: false, // SakhiShield profiles are private by default
    cameraPermissionState,
    microphonePermissionState,
  };
}
