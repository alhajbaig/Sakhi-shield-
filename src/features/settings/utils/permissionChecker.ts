// SakhiShield — Browser Device Permissions Inspector & Trigger

import type { DevicePermissionState, PermissionType, PermissionStateValue } from '../types/settings.types';

export async function inspectBrowserPermissions(): Promise<DevicePermissionState[]> {
  const permissions: DevicePermissionState[] = [
    {
      permission: 'geolocation',
      status: 'unavailable',
      label: 'Location / Geolocation',
      description: 'Used for live corridor breadcrumbs during Walk With Me and SOS coordinate dispatch.',
      isOptional: false,
    },
    {
      permission: 'notifications',
      status: 'unavailable',
      label: 'Browser Notifications',
      description: 'Used to deliver safety check-in countdown reminders and incoming circle alerts.',
      isOptional: false,
    },
    {
      permission: 'camera',
      status: 'unavailable',
      label: 'Camera Access',
      description: 'Used only when explicitly snapping photo evidence to attach to an Incident Vault case.',
      isOptional: true,
    },
    {
      permission: 'microphone',
      status: 'unavailable',
      label: 'Microphone Access',
      description: 'Not passively monitored. Accessible only if user explicitly starts emergency audio recording.',
      isOptional: true,
    },
  ];

  if (typeof window === 'undefined') return permissions;

  // 1. Geolocation
  if ('geolocation' in navigator) {
    try {
      if (navigator.permissions && navigator.permissions.query) {
        const queryRes = await navigator.permissions.query({ name: 'geolocation' as any });
        permissions[0].status = queryRes.state as PermissionStateValue;
      } else {
        permissions[0].status = 'prompt';
      }
    } catch {
      permissions[0].status = 'prompt';
    }
  }

  // 2. Notifications
  if ('Notification' in window) {
    const raw = Notification.permission;
    if (raw === 'granted') permissions[1].status = 'granted';
    else if (raw === 'denied') permissions[1].status = 'denied';
    else permissions[1].status = 'prompt';
  }

  // 3. Camera
  try {
    if (navigator.permissions && navigator.permissions.query) {
      const queryRes = await navigator.permissions.query({ name: 'camera' as any });
      permissions[2].status = queryRes.state as PermissionStateValue;
    } else {
      permissions[2].status = navigator.mediaDevices ? 'prompt' : 'unavailable';
    }
  } catch {
    permissions[2].status = navigator.mediaDevices ? 'prompt' : 'unavailable';
  }

  // 4. Microphone
  try {
    if (navigator.permissions && navigator.permissions.query) {
      const queryRes = await navigator.permissions.query({ name: 'microphone' as any });
      permissions[3].status = queryRes.state as PermissionStateValue;
    } else {
      permissions[3].status = navigator.mediaDevices ? 'prompt' : 'unavailable';
    }
  } catch {
    permissions[3].status = navigator.mediaDevices ? 'prompt' : 'unavailable';
  }

  return permissions;
}

export async function requestPermission(
  type: PermissionType
): Promise<{ status: PermissionStateValue; message: string }> {
  if (typeof window === 'undefined') {
    return { status: 'unavailable', message: 'Environment does not support device permissions.' };
  }

  if (type === 'geolocation') {
    return new Promise((resolve) => {
      if (!navigator.geolocation) {
        return resolve({ status: 'unavailable', message: 'Geolocation is not supported by your browser.' });
      }
      navigator.geolocation.getCurrentPosition(
        () => resolve({ status: 'granted', message: 'Location permission granted successfully.' }),
        (err) => {
          if (err.code === err.PERMISSION_DENIED) {
            resolve({ status: 'denied', message: 'Location permission was denied in browser settings.' });
          } else {
            resolve({ status: 'prompt', message: 'Could not obtain location lock.' });
          }
        },
        { timeout: 8000 }
      );
    });
  }

  if (type === 'notifications') {
    if (!('Notification' in window)) {
      return { status: 'unavailable', message: 'Notifications are not supported by this browser.' };
    }
    try {
      const res = await Notification.requestPermission();
      return {
        status: res as PermissionStateValue,
        message: res === 'granted' ? 'Notifications permission granted.' : 'Notifications not granted.',
      };
    } catch {
      return { status: 'prompt', message: 'Unable to prompt for notification permission.' };
    }
  }

  if (type === 'camera' || type === 'microphone') {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      return { status: 'unavailable', message: 'Media devices API unavailable in this browser.' };
    }
    try {
      const constraints = type === 'camera' ? { video: true } : { audio: true };
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      // Immediately stop all tracks to release device hardware
      stream.getTracks().forEach((track) => track.stop());
      return { status: 'granted', message: `${type === 'camera' ? 'Camera' : 'Microphone'} access verified.` };
    } catch {
      return { status: 'denied', message: `Access to ${type} was denied.` };
    }
  }

  return { status: 'unavailable', message: 'Unknown permission type.' };
}
