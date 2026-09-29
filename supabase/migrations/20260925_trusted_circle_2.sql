-- Supabase Migration: Trusted Circle 2.0 Production Architecture
-- Adds Circles, Memberships, Alerts, and Recipient Delivery Tracking with Row Level Security & Realtime

-- 1. Trusted Circles Table
CREATE TABLE IF NOT EXISTS public.trusted_circles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  owner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  invite_code TEXT NOT NULL UNIQUE,
  join_mode TEXT NOT NULL DEFAULT 'APPROVAL_REQUIRED' CHECK (join_mode IN ('OPEN', 'APPROVAL_REQUIRED')),
  status TEXT NOT NULL DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'ARCHIVED', 'DELETED')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);

-- 2. Trusted Circle Members Table
CREATE TABLE IF NOT EXISTS public.trusted_circle_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  circle_id UUID NOT NULL REFERENCES public.trusted_circles(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'MEMBER' CHECK (role IN ('OWNER', 'MEMBER')),
  status TEXT NOT NULL DEFAULT 'APPROVED' CHECK (status IN ('PENDING', 'APPROVED', 'DECLINED', 'CANCELLED', 'EXPIRED')),
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  removed_at TIMESTAMPTZ,
  UNIQUE(circle_id, user_id)
);

-- 3. Trusted Circle Alerts Table
CREATE TABLE IF NOT EXISTS public.trusted_circle_alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  circle_id UUID NOT NULL REFERENCES public.trusted_circles(id) ON DELETE CASCADE,
  triggered_by_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  source_event_id TEXT,
  idempotency_key TEXT UNIQUE,
  alert_type TEXT NOT NULL CHECK (alert_type IN ('manual_sos', 'critical_risk', 'explicit_help_request', 'missed_checkin', 'user_alert')),
  severity TEXT NOT NULL DEFAULT 'CRITICAL' CHECK (severity IN ('ATTENTION', 'HIGH', 'CRITICAL')),
  message TEXT NOT NULL,
  location_shared BOOLEAN DEFAULT FALSE,
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  location_accuracy DOUBLE PRECISION,
  status TEXT NOT NULL DEFAULT 'ACTIVE' CHECK (status IN ('CREATED', 'PROCESSING', 'SENT', 'ACTIVE', 'ACKNOWLEDGED', 'RESOLVED', 'FAILED', 'EXPIRED')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  acknowledged_at TIMESTAMPTZ,
  resolved_at TIMESTAMPTZ
);

-- 4. Trusted Circle Alert Recipients Table (Tracks independent recipient delivery & acknowledgement state)
CREATE TABLE IF NOT EXISTS public.trusted_circle_alert_recipients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  alert_id UUID NOT NULL REFERENCES public.trusted_circle_alerts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'SENT', 'DELIVERED', 'SEEN', 'ACKNOWLEDGED', 'FAILED')),
  sent_at TIMESTAMPTZ,
  delivered_at TIMESTAMPTZ,
  seen_at TIMESTAMPTZ,
  acknowledged_at TIMESTAMPTZ,
  failed_at TIMESTAMPTZ,
  failure_reason TEXT,
  UNIQUE(alert_id, user_id)
);

-- Indexes for Fast Querying & Idempotency Lookups
CREATE INDEX IF NOT EXISTS idx_trusted_circles_owner ON public.trusted_circles (owner_id);
CREATE INDEX IF NOT EXISTS idx_trusted_circles_code ON public.trusted_circles (invite_code);
CREATE INDEX IF NOT EXISTS idx_circle_members_circle ON public.trusted_circle_members (circle_id);
CREATE INDEX IF NOT EXISTS idx_circle_members_user ON public.trusted_circle_members (user_id);
CREATE INDEX IF NOT EXISTS idx_circle_alerts_circle ON public.trusted_circle_alerts (circle_id, status);
CREATE INDEX IF NOT EXISTS idx_circle_alerts_idempotency ON public.trusted_circle_alerts (idempotency_key);
CREATE INDEX IF NOT EXISTS idx_alert_recipients_alert_user ON public.trusted_circle_alert_recipients (alert_id, user_id);
CREATE INDEX IF NOT EXISTS idx_alert_recipients_user_status ON public.trusted_circle_alert_recipients (user_id, status);

-- Enable Row Level Security (RLS)
ALTER TABLE public.trusted_circles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trusted_circle_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trusted_circle_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trusted_circle_alert_recipients ENABLE ROW LEVEL SECURITY;

-- 5. RLS Policies

-- Trusted Circles:
-- Owner can do all operations
CREATE POLICY "Owners can manage own circles" ON public.trusted_circles
  FOR ALL USING (auth.uid() = owner_id);

-- Members can view circles they are part of
CREATE POLICY "Members can view their circles" ON public.trusted_circles
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.trusted_circle_members
      WHERE circle_id = public.trusted_circles.id
      AND user_id = auth.uid()
      AND status = 'APPROVED'
    )
  );

-- Authenticated users can query circle by invite code to join
CREATE POLICY "Authenticated users can lookup circle by invite code" ON public.trusted_circles
  FOR SELECT USING (auth.role() = 'authenticated');

-- Trusted Circle Members:
-- Circle owner can view and manage all members in their circle
CREATE POLICY "Circle owners can manage members" ON public.trusted_circle_members
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.trusted_circles
      WHERE id = public.trusted_circle_members.circle_id
      AND owner_id = auth.uid()
    )
  );

-- Users can view their own membership rows
CREATE POLICY "Users can view own memberships" ON public.trusted_circle_members
  FOR SELECT USING (user_id = auth.uid());

-- Users can insert their own join request / membership
CREATE POLICY "Users can request to join circles" ON public.trusted_circle_members
  FOR INSERT WITH CHECK (user_id = auth.uid());

-- Users can delete their own membership (Leave circle)
CREATE POLICY "Users can leave circles" ON public.trusted_circle_members
  FOR DELETE USING (user_id = auth.uid() AND role != 'OWNER');

-- Approved members can view other approved members in the same circle
CREATE POLICY "Members can view peers in same circle" ON public.trusted_circle_members
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.trusted_circle_members AS m
      WHERE m.circle_id = public.trusted_circle_members.circle_id
      AND m.user_id = auth.uid()
      AND m.status = 'APPROVED'
    )
  );

-- Trusted Circle Alerts:
-- Creator can view and manage their alerts
CREATE POLICY "Creators can manage own alerts" ON public.trusted_circle_alerts
  FOR ALL USING (triggered_by_user_id = auth.uid());

-- Circle members can view alerts in their circle
CREATE POLICY "Members can view circle alerts" ON public.trusted_circle_alerts
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.trusted_circle_members
      WHERE circle_id = public.trusted_circle_alerts.circle_id
      AND user_id = auth.uid()
      AND status = 'APPROVED'
    )
  );

-- Alert Recipients:
-- Recipient can view and update their own recipient status (e.g. acknowledge, mark seen)
CREATE POLICY "Recipients can view and update own status" ON public.trusted_circle_alert_recipients
  FOR ALL USING (user_id = auth.uid());

-- Alert creator can view all recipient delivery statuses for their alert
CREATE POLICY "Alert creators can view recipient statuses" ON public.trusted_circle_alert_recipients
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.trusted_circle_alerts
      WHERE id = public.trusted_circle_alert_recipients.alert_id
      AND triggered_by_user_id = auth.uid()
    )
  );

-- 6. Realtime Publication
ALTER PUBLICATION supabase_realtime ADD TABLE public.trusted_circles;
ALTER PUBLICATION supabase_realtime ADD TABLE public.trusted_circle_members;
ALTER PUBLICATION supabase_realtime ADD TABLE public.trusted_circle_alerts;
ALTER PUBLICATION supabase_realtime ADD TABLE public.trusted_circle_alert_recipients;
