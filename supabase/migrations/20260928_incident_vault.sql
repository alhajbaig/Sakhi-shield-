-- SakhiShield — Incident Vault Schema & Strict Row-Level Security
-- Migration: 20260928_incident_vault.sql

-- 1. INCIDENTS TABLE
CREATE TABLE IF NOT EXISTS public.incidents (
  id TEXT PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN (
    'HARASSMENT', 'THREAT', 'SUSPICIOUS_ACTIVITY', 'STALKING',
    'TRAVEL_INCIDENT', 'EMERGENCY', 'PHYSICAL_SAFETY', 'DIGITAL_SAFETY', 'OTHER'
  )),
  severity TEXT NOT NULL CHECK (severity IN ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL')),
  status TEXT NOT NULL DEFAULT 'ACTIVE' CHECK (status IN (
    'DRAFT', 'ACTIVE', 'DOCUMENTED', 'RESOLVED', 'ARCHIVED'
  )),
  incident_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  location JSONB,
  associated_context JSONB,
  notes TEXT,
  evidence_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  resolved_at TIMESTAMPTZ,
  archived_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_incidents_user_id ON public.incidents (user_id);
CREATE INDEX IF NOT EXISTS idx_incidents_status ON public.incidents (user_id, status);
CREATE INDEX IF NOT EXISTS idx_incidents_date ON public.incidents (user_id, incident_date DESC);

ALTER TABLE public.incidents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own incidents"
  ON public.incidents FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own incidents"
  ON public.incidents FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own incidents"
  ON public.incidents FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own incidents"
  ON public.incidents FOR DELETE
  USING (auth.uid() = user_id);


-- 2. INCIDENT EVIDENCE TABLE
CREATE TABLE IF NOT EXISTS public.incident_evidence (
  id TEXT PRIMARY KEY,
  incident_id TEXT NOT NULL REFERENCES public.incidents(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  file_name TEXT NOT NULL,
  sanitized_file_name TEXT NOT NULL,
  file_size_bytes BIGINT NOT NULL,
  mime_type TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN (
    'IMAGE', 'AUDIO', 'VIDEO', 'DOCUMENT', 'SCREENSHOT', 'OTHER'
  )),
  storage_path TEXT NOT NULL,
  sha256_hash TEXT NOT NULL,
  integrity_status TEXT NOT NULL DEFAULT 'VERIFIED' CHECK (integrity_status IN ('VERIFIED', 'MODIFIED', 'UNKNOWN')),
  description TEXT,
  captured_at TIMESTAMPTZ,
  uploaded_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_verified_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_evidence_incident_id ON public.incident_evidence (incident_id);
CREATE INDEX IF NOT EXISTS idx_evidence_user_id ON public.incident_evidence (user_id);

ALTER TABLE public.incident_evidence ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own evidence"
  ON public.incident_evidence FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can upload own evidence"
  ON public.incident_evidence FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own evidence"
  ON public.incident_evidence FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own evidence"
  ON public.incident_evidence FOR DELETE
  USING (auth.uid() = user_id);


-- 3. INCIDENT TIMELINE EVENTS TABLE
CREATE TABLE IF NOT EXISTS public.incident_timeline_events (
  id TEXT PRIMARY KEY,
  incident_id TEXT NOT NULL REFERENCES public.incidents(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  metadata JSONB
);

CREATE INDEX IF NOT EXISTS idx_timeline_incident_id ON public.incident_timeline_events (incident_id, timestamp ASC);

ALTER TABLE public.incident_timeline_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own timeline events"
  ON public.incident_timeline_events FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own timeline events"
  ON public.incident_timeline_events FOR INSERT
  WITH CHECK (auth.uid() = user_id);


-- 4. INCIDENT SHARES TABLE (Expiring, revocable shares)
CREATE TABLE IF NOT EXISTS public.incident_shares (
  id TEXT PRIMARY KEY,
  incident_id TEXT NOT NULL REFERENCES public.incidents(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  share_token_hash TEXT NOT NULL UNIQUE,
  scope TEXT NOT NULL CHECK (scope IN ('SUMMARY_ONLY', 'SELECTED_EVIDENCE', 'FULL_INCIDENT')),
  selected_evidence_ids JSONB,
  expires_at TIMESTAMPTZ NOT NULL,
  is_revoked BOOLEAN NOT NULL DEFAULT FALSE,
  revoked_at TIMESTAMPTZ,
  access_count INTEGER NOT NULL DEFAULT 0,
  last_accessed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_shares_token_hash ON public.incident_shares (share_token_hash);
CREATE INDEX IF NOT EXISTS idx_shares_user_id ON public.incident_shares (user_id);

ALTER TABLE public.incident_shares ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own incident shares"
  ON public.incident_shares FOR ALL
  USING (auth.uid() = user_id);
