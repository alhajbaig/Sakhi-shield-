import { initializeApp, getApps, type FirebaseApp } from 'firebase/app';
import { getMessaging, type Messaging } from 'firebase/messaging';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

let app: FirebaseApp | null = null;
let messaging: Messaging | null = null;

export const isFirebaseConfigured = (): boolean => {
  return Boolean(
    firebaseConfig.apiKey &&
    firebaseConfig.projectId &&
    import.meta.env.VITE_FIREBASE_VAPID_KEY
  );
};

export const getFirebaseApp = (): FirebaseApp | null => {
  if (!isFirebaseConfigured()) return null;
  if (!app) {
    app = getApps().length > 0 ? getApps()[0] : initializeApp(firebaseConfig);
  }
  return app;
};

export const getFirebaseMessagingInstance = (): Messaging | null => {
  const firebaseApp = getFirebaseApp();
  if (!firebaseApp || typeof window === 'undefined') return null;

  try {
    if (!messaging) {
      messaging = getMessaging(firebaseApp);
    }
    return messaging;
  } catch {
    // Unsupported browser or permissions
    return null;
  }
};
