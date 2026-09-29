-- Supabase Migration: Walk With Me Production Safety Architecture
-- Enables Realtime, Row Level Security, and Audit Tables

-- 1. Profiles Table (if not existing)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  avatar_url TEXT,
  status TEXT DEFAULT 'SAFE',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Trusted Contacts Table
CREATE TABLE IF NOT EXISTS public.trusted_contacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  relationship TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  is_primary BOOLEAN DEFAULT FALSE,
  permissions TEXT[] DEFAULT ARRAY['EMERGENCY_LOCATION', 'JOURNEY_ESCALATION', 'NOTIFICATION'],
  status TEXT DEFAULT 'Available',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Journeys Table
CREATE TABLE IF NOT EXISTS public.journeys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  destination_name TEXT NOT NULL,
  destination_lat DOUBLE PRECISION NOT NULL,
  destination_lng DOUBLE PRECISION NOT NULL,
  start_lat DOUBLE PRECISION NOT NULL,
  start_lng DOUBLE PRECISION NOT NULL,
  route_geometry JSONB NOT NULL,
  distance_meters INTEGER NOT NULL,
  expected_arrival TIMESTAMPTZ NOT NULL,
  estimated_arrival TIMESTAMPTZ NOT NULL,
  status TEXT NOT NULL DEFAULT 'ACTIVE' CHECK (status IN ('PLANNED', 'ACTIVE', 'COMPLETED', 'CANCELLED', 'ESCALATED')),
  risk_score INTEGER NOT NULL DEFAULT 20 CHECK (risk_score >= 0 AND risk_score <= 100),
  risk_level TEXT NOT NULL DEFAULT 'SAFE' CHECK (risk_level IN ('SAFE', 'ATTENTION', 'HIGH_RISK', 'CRITICAL')),
  monitoring_started_at TIMESTAMPTZ DEFAULT NOW(),
  started_at TIMESTAMPTZ DEFAULT NOW(),
  ended_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Journey Events Table
CREATE TABLE IF NOT EXISTS public.journey_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  journey_id UUID NOT NULL REFERENCES public.journeys(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL,
  timestamp TIMESTAMPTZ DEFAULT NOW(),
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  accuracy DOUBLE PRECISION,
  metadata JSONB DEFAULT '{}'::jsonb
);

-- 5. Risk Events Table
CREATE TABLE IF NOT EXISTS public.risk_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  journey_id UUID NOT NULL REFERENCES public.journeys(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL,
  severity TEXT NOT NULL CHECK (severity IN ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL')),
  score_delta INTEGER NOT NULL,
  reason TEXT NOT NULL,
  metadata JSONB DEFAULT '{}'::jsonb,
  timestamp TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Notification Tokens (FCM & Web Push)
CREATE TABLE IF NOT EXISTS public.notification_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  token TEXT NOT NULL UNIQUE,
  device_type TEXT NOT NULL,
  browser TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  last_seen_at TIMESTAMPTZ DEFAULT NOW(),
  revoked_at TIMESTAMPTZ
);

-- 7. Safety Notifications Audit Table
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  journey_id UUID REFERENCES public.journeys(id) ON DELETE SET NULL,
  event_id UUID,
  recipient_id TEXT NOT NULL,
  notification_type TEXT NOT NULL,
  channel TEXT NOT NULL CHECK (channel IN ('PUSH', 'EMAIL', 'SMS')),
  status TEXT NOT NULL DEFAULT 'QUEUED' CHECK (status IN ('QUEUED', 'SENT', 'DELIVERED', 'FAILED')),
  idempotency_key TEXT NOT NULL UNIQUE,
  error_message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. Privacy Settings Table
CREATE TABLE IF NOT EXISTS public.privacy_settings (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  location_sharing TEXT NOT NULL DEFAULT 'Session Only' CHECK (location_sharing IN ('Session Only', 'Emergency Only', 'Always Off')),
  evidence_retention TEXT NOT NULL DEFAULT '30 Days',
  verification_timeout_seconds INTEGER NOT NULL DEFAULT 45,
  zero_persistent_tracking BOOLEAN NOT NULL DEFAULT TRUE,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for High Performance Queries
CREATE INDEX IF NOT EXISTS idx_journeys_user_status ON public.journeys (user_id, status);
CREATE INDEX IF NOT EXISTS idx_journey_events_journey ON public.journey_events (journey_id, timestamp);
CREATE INDEX IF NOT EXISTS idx_risk_events_journey ON public.risk_events (journey_id, timestamp);
CREATE INDEX IF NOT EXISTS idx_notifications_idempotency ON public.notifications (idempotency_key);
CREATE INDEX IF NOT EXISTS idx_trusted_contacts_user ON public.trusted_contacts (user_id);

-- Enable Row Level Security (RLS) on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trusted_contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.journeys ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.journey_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.risk_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notification_tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.privacy_settings ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Profiles: Users can view and update own profile
CREATE POLICY "Users can manage own profile" ON public.profiles
  FOR ALL USING (auth.uid() = id);

-- Trusted Contacts: Users can manage own contacts
CREATE POLICY "Users can manage own trusted contacts" ON public.trusted_contacts
  FOR ALL USING (auth.uid() = user_id);

-- Journeys: Owner has full access
CREATE POLICY "Users can manage own journeys" ON public.journeys
  FOR ALL USING (auth.uid() = user_id);

-- Journey Events: Owner has full access
CREATE POLICY "Users can manage own journey events" ON public.journey_events
  FOR ALL USING (auth.uid() = user_id);

-- Risk Events: Owner has read/write
CREATE POLICY "Users can view own risk events" ON public.risk_events
  FOR ALL USING (auth.uid() = (SELECT user_id FROM public.journeys WHERE public.journeys.id = journey_id));

-- Notification Tokens: Owner has full access
CREATE POLICY "Users can manage own notification tokens" ON public.notification_tokens
  FOR ALL USING (auth.uid() = user_id);

-- Notifications: Owner can view own audit logs
CREATE POLICY "Users can view own notifications" ON public.notifications
  FOR SELECT USING (auth.uid() = user_id);

-- Privacy Settings: Owner has full access
CREATE POLICY "Users can manage own privacy settings" ON public.privacy_settings
  FOR ALL USING (auth.uid() = user_id);

-- Realtime Configuration
ALTER PUBLICATION supabase_realtime ADD TABLE public.journeys;
ALTER PUBLICATION supabase_realtime ADD TABLE public.journey_events;
ALTER PUBLICATION supabase_realtime ADD TABLE public.risk_events;
