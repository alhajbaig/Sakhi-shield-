// Firebase Cloud Messaging Service Worker for SakhiShield Web Push
// Handles background push notifications when browser tab is inactive or closed

importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyDXtj6tbf8MXlqwG8qdIoezcGdtk5KKF7w",
  authDomain: "sakhishield-c6d4b.firebaseapp.com",
  projectId: "sakhishield-c6d4b",
  storageBucket: "sakhishield-c6d4b.firebasestorage.app",
  messagingSenderId: "627062127300",
  appId: "1:627062127300:web:08df802ad70195aa6ce791",
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  const notificationTitle = payload.notification?.title || 'SakhiShield Safety Alert';
  const notificationOptions = {
    body: payload.notification?.body || 'Safety signal update received during Walk With Me.',
    icon: '/favicon.svg',
    badge: '/favicon.svg',
    vibrate: [200, 100, 200],
    tag: payload.data?.journeyId || 'sakhishield-alert',
    data: payload.data,
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    clients.openWindow('/walk-with-me')
  );
});
