-- Supabase Migration: 20260926_security_and_integrity_hardening.sql
-- Hardens Alert Types taxonomy, Live Location Sharing Token Store, and RLS Defenses

-- 1. FIX CANONICAL ALERT TYPE TAXONOMY
-- Ensures 'missed_checkin' is an authorized enum value across the database
ALTER TABLE public.trusted_circle_alerts 
  DROP CONSTRAINT IF EXISTS trusted_circle_alerts_alert_type_check;

ALTER TABLE public.trusted_circle_alerts
  ADD CONSTRAINT trusted_circle_alerts_alert_type_check
  CHECK (alert_type IN ('manual_sos', 'critical_risk', 'explicit_help_request', 'missed_checkin', 'user_alert'));

-- 2. LIVE LOCATION SHARES SECURE STORE
-- Stores cryptographically hashed access tokens with expiration and revocation capabilities
CREATE TABLE IF NOT EXISTS public.live_location_shares (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  journey_id UUID NOT NULL REFERENCES public.journeys(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  recipient_id TEXT,
  token_hash TEXT NOT NULL UNIQUE,
  permission_basis TEXT DEFAULT 'ACTIVE_JOURNEY',
  duration_minutes INTEGER NOT NULL DEFAULT 60,
  expires_at TIMESTAMPTZ NOT NULL,
  revoked BOOLEAN NOT NULL DEFAULT FALSE,
  revoked_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_live_location_token_hash ON public.live_location_shares (token_hash);
CREATE INDEX IF NOT EXISTS idx_live_location_journey_expires ON public.live_location_shares (journey_id, expires_at);

ALTER TABLE public.live_location_shares ENABLE ROW LEVEL SECURITY;

-- Owner has full control over their live location shares
CREATE POLICY "Users can manage own live location shares" ON public.live_location_shares
  FOR ALL USING (auth.uid() = user_id);

-- 3. HARDEN TRUSTED CIRCLE MEMBERSHIP RLS
-- Drop permissive insert policy
DROP POLICY IF EXISTS "Users can request to join circles" ON public.trusted_circle_members;

-- Secure Insert: Regular users can ONLY request to join as 'MEMBER' with 'PENDING' status.
-- Only the circle owner can create an 'OWNER' membership with 'APPROVED' status.
CREATE POLICY "Enforce secure circle membership requests" ON public.trusted_circle_members
  FOR INSERT WITH CHECK (
    user_id = auth.uid() AND (
      -- Case A: Circle owner adding themselves
      (role = 'OWNER' AND status = 'APPROVED' AND EXISTS (
        SELECT 1 FROM public.trusted_circles WHERE id = circle_id AND owner_id = auth.uid()
      ))
      OR
      -- Case B: Any user requesting to join a circle
      (role = 'MEMBER' AND status = 'PENDING')
    )
  );

-- Secure Update: Only the circle owner can approve, decline, or change member statuses
CREATE POLICY "Circle owners can update member status" ON public.trusted_circle_members
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.trusted_circles WHERE id = public.trusted_circle_members.circle_id AND owner_id = auth.uid()
    )
  );

-- 4. HARDEN TRUSTED CIRCLES LOOKUP RLS
-- Drop the overly permissive lookup policy that exposed all circles to any authenticated user
DROP POLICY IF EXISTS "Authenticated users can lookup circle by invite code" ON public.trusted_circles;

-- Provide a secure RPC for looking up a circle by exact invite code without exposing entire table
CREATE OR REPLACE FUNCTION public.lookup_circle_by_invite_code(code_input TEXT)
RETURNS TABLE (
  id UUID,
  name TEXT,
  description TEXT,
  owner_id UUID,
  invite_code TEXT,
  join_mode TEXT,
  status TEXT
)
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT id, name, description, owner_id, invite_code, join_mode, status
  FROM public.trusted_circles
  WHERE UPPER(TRIM(invite_code)) = UPPER(TRIM(code_input))
    AND status = 'ACTIVE'
  LIMIT 1;
$$;

-- Grant execution to authenticated users
GRANT EXECUTE ON FUNCTION public.lookup_circle_by_invite_code(TEXT) TO authenticated;
