-- Supabase Migration: 20260929_privacy_settings_resources.sql
-- Implements production schemas for Privacy & Data Sovereignty, Settings, and Verified Safety Resources

-- ── 1. PRIVACY & DATA SOVEREIGNTY PREFERENCES ─────────────────────────────────
CREATE TABLE IF NOT EXISTS public.privacy_preferences (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  gps_retention TEXT NOT NULL DEFAULT '24_HOURS'
    CHECK (gps_retention IN ('SESSION_ONLY', '24_HOURS', '7_DAYS', '30_DAYS', 'MANUAL_ONLY')),
  location_mode TEXT NOT NULL DEFAULT 'PRECISE'
    CHECK (location_mode IN ('PRECISE', 'APPROXIMATE_1KM', 'EMERGENCY_ONLY')),
  evidence_retention TEXT NOT NULL DEFAULT '30_DAYS'
    CHECK (evidence_retention IN ('7_DAYS', '30_DAYS', '90_DAYS', 'MANUAL_DELETION')),
  local_parsing_enforced BOOLEAN NOT NULL DEFAULT TRUE,
  telemetry_opt_in BOOLEAN NOT NULL DEFAULT FALSE,
  notification_privacy TEXT NOT NULL DEFAULT 'MINIMAL_DETAILS'
    CHECK (notification_privacy IN ('FULL_DETAILS', 'MINIMAL_DETAILS', 'HIDE_SENSITIVE')),
  last_purge_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_privacy_preferences_user ON public.privacy_preferences(user_id);
ALTER TABLE public.privacy_preferences ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own privacy preferences"
  ON public.privacy_preferences
  FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);


-- ── 2. PRIVACY AUDIT EVENTS (TAMPER-EVIDENT CLIENT-OBSERVABLE LOG) ────────────
CREATE TABLE IF NOT EXISTS public.privacy_audit_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL,
  details TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_privacy_audit_events_user_time ON public.privacy_audit_events(user_id, created_at DESC);
ALTER TABLE public.privacy_audit_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own privacy audit events"
  ON public.privacy_audit_events
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own privacy audit events"
  ON public.privacy_audit_events
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);


-- ── 3. USER APPLICATION SETTINGS ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.user_settings (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  notification_sound_enabled BOOLEAN NOT NULL DEFAULT TRUE,
  sound_volume INTEGER NOT NULL DEFAULT 80
    CHECK (sound_volume >= 0 AND sound_volume <= 100),
  emergency_audible_siren BOOLEAN NOT NULL DEFAULT TRUE,
  journey_reminder_sound BOOLEAN NOT NULL DEFAULT TRUE,
  checkin_timeout_seconds INTEGER NOT NULL DEFAULT 45
    CHECK (checkin_timeout_seconds IN (30, 45, 60, 90)),
  auto_alert_circle_on_start BOOLEAN NOT NULL DEFAULT TRUE,
  high_contrast BOOLEAN NOT NULL DEFAULT FALSE,
  reduce_motion BOOLEAN NOT NULL DEFAULT FALSE,
  font_scale TEXT NOT NULL DEFAULT 'NORMAL'
    CHECK (font_scale IN ('NORMAL', 'LARGE')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_user_settings_user ON public.user_settings(user_id);
ALTER TABLE public.user_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own application settings"
  ON public.user_settings
  FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);


-- ── 4. VERIFIED SAFETY RESOURCES & HELPLINES ──────────────────────────────────
CREATE TABLE IF NOT EXISTS public.safety_resources (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT NOT NULL
    CHECK (category IN ('EMERGENCY', 'WOMENS_SAFETY', 'CYBER_DIGITAL', 'CRISIS_COUNSELING', 'LEGAL_SUPPORT')),
  description TEXT NOT NULL,
  phone TEXT,
  whatsapp TEXT,
  website TEXT,
  availability TEXT NOT NULL DEFAULT '24/7',
  country TEXT NOT NULL DEFAULT 'India',
  source TEXT NOT NULL,
  verified_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  is_official BOOLEAN NOT NULL DEFAULT TRUE,
  priority INTEGER NOT NULL DEFAULT 10,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_safety_resources_category ON public.safety_resources(category, priority);
ALTER TABLE public.safety_resources ENABLE ROW LEVEL SECURITY;

-- Safety resources are publicly readable directory entries
CREATE POLICY "Public read access for verified safety resources"
  ON public.safety_resources
  FOR SELECT
  USING (true);

-- Seed verified official Indian emergency helplines and resources
INSERT INTO public.safety_resources (id, title, category, description, phone, website, availability, country, source, priority)
VALUES
  ('res_112_erss', '112 National Emergency Response Support System', 'EMERGENCY', 'Unified all-India emergency response number for immediate Police, Fire, and Ambulance dispatch.', '112', 'https://112.gov.in', '24/7 / 365 Days', 'India', 'Ministry of Home Affairs (MHA), Govt of India', 1),
  ('res_1091_police', '1091 Women in Distress Helpline', 'WOMENS_SAFETY', 'Dedicated 24/7 emergency police dispatch assistance for women facing harassment, assault, or threats.', '1091', 'https://mha.gov.in', '24/7 / 365 Days', 'India', 'State Police Departments & MHA', 2),
  ('res_181_wcd', '181 Women Domestic & Crisis Helpline', 'WOMENS_SAFETY', 'Emergency and non-emergency support, crisis counseling, legal shelter referral, and One Stop Centre integration.', '181', 'https://wcd.nic.in', '24/7 / 365 Days', 'India', 'Ministry of Women & Child Development', 3),
  ('res_1930_cyber', '1930 National Cyber Crime Reporting Helpline', 'CYBER_DIGITAL', 'Immediate reporting of online financial fraud, digital harassment, identity impersonation, and non-consensual imagery.', '1930', 'https://cybercrime.gov.in', '24/7 / 365 Days', 'India', 'Indian Cyber Crime Coordination Centre (I4C)', 4),
  ('res_ncw_helpline', 'National Commission for Women (NCW) 24/7 Helpline', 'WOMENS_SAFETY', 'Immediate support and grievance registration for women facing violence, harassment, or cyberstalking.', '7827170170', 'https://ncw.nic.in', '24/7 Call & WhatsApp', 'India', 'National Commission for Women', 5),
  ('res_1098_childline', '1098 National Childline', 'CRISIS_COUNSELING', 'Emergency 24/7 outreach service for children in need of care, protection, and safety intervention.', '1098', 'https://childlineindia.org.in', '24/7 / 365 Days', 'India', 'Ministry of Women and Child Development', 6),
  ('res_15100_nalsa', 'NALSA 15100 Legal Aid Helpline', 'LEGAL_SUPPORT', 'Free legal counseling, legal representation, and legal safety advice for vulnerable citizens and victims of abuse.', '15100', 'https://nalsa.gov.in', '24/7 Free Toll-Free', 'India', 'National Legal Services Authority', 7),
  ('res_nimhans_mental', 'NIMHANS Psychosocial Crisis Support Helpline', 'CRISIS_COUNSELING', 'Trauma-informed mental health support and emergency psychosocial assistance by certified clinical psychologists.', '08046110007', 'https://nimhans.ac.in', '24/7 Toll-Free Support', 'India', 'National Institute of Mental Health and Neurosciences', 8),
  ('res_108_ambulance', '108 National Emergency Medical Services', 'EMERGENCY', 'Toll-free emergency medical dispatch for accident, critical trauma, and immediate hospital ambulance response.', '108', 'https://nhm.gov.in', '24/7 / 365 Days', 'India', 'National Health Mission', 9)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  phone = EXCLUDED.phone,
  website = EXCLUDED.website,
  source = EXCLUDED.source,
  priority = EXCLUDED.priority,
  verified_at = NOW();
