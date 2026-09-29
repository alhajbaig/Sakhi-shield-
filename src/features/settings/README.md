# SakhiShield — Settings

## Purpose
The **Settings** module provides centralized, verifiable control over user profile credentials, WebAuthn/FIDO2 passkey hardware, synthesized notification chime and siren audio testing, browser hardware permissions inspection, and accessibility accommodations.

## Features & Architecture
- **Account Settings**: Management of user display name, registered phone number for SMS guardian escalations, and emergency medical/travel notes.
- **Security & PIN**: Direct password reset link dispatch via Supabase Auth and client-side security PIN hashing for authorizing high-stakes vault actions and SOS cancellations.
- **Passkey Authentication (WebAuthn/FIDO2)**: Authentic browser passkey registration with cryptographic challenges using `navigator.credentials.create` and local device passkey management. Truthful fallback when running in unsupported browser environments.
- **Notification Sounds**: Master alert volume control (0-100%), notification chimes on/off, high-priority emergency siren toggle, and test sound previewers synthesized in real time via the Web Audio API with zero external mp3 assets.
- **Device Permissions Inspector**: Direct telemetry inspection of browser permissions (`geolocation`, `notifications`, `camera`, `microphone`) with actionable request buttons.
- **Accessibility & Appearance**: High contrast border toggles, reduced motion modes that honor `prefers-reduced-motion`, and typography scaling. Theme freeze preserves the approved SakhiShield Warm Sand design.
- **Session Management**: Transparent inspection of browser, operating system, and authenticated session signout.

## Folder Structure
```text
src/features/settings/
├── components/
│   ├── SettingsDashboard.tsx
│   ├── AccountSettingsCard.tsx
│   ├── SecuritySettingsCard.tsx
│   ├── PasskeyManagerCard.tsx
│   ├── NotificationSettingsCard.tsx
│   ├── DevicePermissionsCard.tsx
│   ├── AppearanceAccessibilityCard.tsx
│   └── SessionManagerCard.tsx
├── services/
│   ├── settingsService.ts
│   └── webAuthnService.ts
├── hooks/
│   ├── useSettings.ts
│   └── useDevicePermissions.ts
├── types/
│   └── settings.types.ts
├── utils/
│   ├── audioSynthesizer.ts
│   └── permissionChecker.ts
├── constants/
│   └── settings.constants.ts
├── index.ts
└── README.md
```

## Security & Storage
- **RLS Enforced**: Rows in `public.user_settings` are strictly bound to `auth.uid() = user_id`.
- **Zero Client Secrets**: All operations use public anon keys and authenticated user session JWTs.
