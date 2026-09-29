# SakhiShield — Privacy & Data Sovereignty

## Purpose
The **Privacy & Data Sovereignty** module gives SakhiShield users genuine, mathematically verifiable control over spatial telemetry, evidence retention, local-only processing, and portable data extraction.

## Architecture & Features
- **Ephemeral GPS Windows**: Configurable retention horizon (`SESSION_ONLY`, `24_HOURS`, `7_DAYS`, `30_DAYS`, `MANUAL_ONLY`) for location breadcrumbs, with on-demand and automatic purge routines.
- **Spatial Precision Modes**: Toggle between exact GPS, fuzzy approximate corridor (~1km jitter), and Emergency SOS-only transmission.
- **Evidence Vault Auto-Purge**: Connects to the Incident Vault lifecycle to automatically purge binary evidence files after 7, 30, or 90 days following case resolution, while preserving audit event records.
- **Local-Only Processing**: Strictly executes password entropy scoring, malicious URL regex heuristics, and cryptographic SHA-256 byte hashing inside the client browser without sending private payloads to cloud inspection APIs.
- **Data Sovereignty Export**: Compiles an authenticated JSON dossier of profile settings, privacy preferences, and vault metadata with an authentic SHA-256 integrity checksum for immediate download.
- **Targeted Data Deletion**: Immediate, permanent purging of ephemeral GPS caches, local vault caches, or entire application state.
- **Tamper-Evident Audit Trail**: Real-time logging of privacy configuration changes, purges, and exports to `privacy_audit_events`.

## Folder Structure
```text
src/features/privacy-data-sovereignty/
├── components/
│   ├── PrivacyDashboard.tsx
│   ├── EphemeralGpsCard.tsx
│   ├── EvidenceRetentionCard.tsx
│   ├── LocalProcessingCard.tsx
│   ├── DataSharingCard.tsx
│   ├── DataExportModal.tsx
│   ├── DataDeletionModal.tsx
│   └── PrivacyAuditLog.tsx
├── services/
│   ├── privacyService.ts
│   └── privacyExportService.ts
├── hooks/
│   └── usePrivacySettings.ts
├── types/
│   └── privacy.types.ts
├── utils/
│   ├── privacyValidation.ts
│   └── ephemeralStorage.ts
├── constants/
│   └── privacy.constants.ts
├── index.ts
└── README.md
```

## Security & Storage
- **RLS Enforced**: Rows in `public.privacy_preferences` and `public.privacy_audit_events` are strictly bound to `auth.uid() = user_id`.
- **Zero-Knowledge Architecture**: No background tracking; location is only accessed when Walk With Me is running or when SOS is triggered.
