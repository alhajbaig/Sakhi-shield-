# SakhiShield — Incident Vault Feature Module

## Purpose
The **Incident Vault** is a secure, privacy-preserving evidence organization and incident documentation layer built directly into the SakhiShield personal safety platform.

## Architecture
- **Location:** `src/features/incident-vault/`
- **Zero-Knowledge Evidence Integrity:** File bytes are hashed via the Web Cryptography API (`SHA-256`) before transmission. Stored hashes are verified against actual bytes on demand.
- **Strict Row-Level Security (RLS):** All database rows in `public.incidents`, `public.incident_evidence`, `public.incident_timeline_events`, and `public.incident_shares` are protected by `auth.uid() = user_id`.
- **Private Storage:** Media files are stored in a private Supabase bucket (`incident-evidence`) under partitioned owner paths:
  `user/{userId}/incidents/{incidentId}/evidence/{evidenceId}_{sanitizedFileName}`
- **Expiring Secure Shares:** Sharing creates cryptographically random 32-byte tokens hashed via SHA-256 with user-defined time-to-live (TTL) and instant revocation.
- **Offline Sync Queue:** Mutation operations (`CREATE_INCIDENT`, `UPDATE_INCIDENT`, `DELETE_INCIDENT`) are buffered into an idempotent local storage queue and automatically replayed when connectivity returns.

## Boundaries & Non-Negotiables
- **No Artificial Intelligence:** Evidence files and personal notes are never ingested into third-party AI models or analytics.
- **No Legal Claims:** The vault provides technical verification of file integrity via cryptographic digests, not legal or forensic court certification.
- **UI Freeze:** Fully conforms to approved SakhiShield visual standards and design tokens.
