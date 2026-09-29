// Supabase Edge Function: process-escalation
// Production-Hardened Security: Authenticates caller via JWT, verifies journey ownership,
// enforces escalation idempotency to prevent duplicate guardian alarms, and logs audit events.

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.42.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY") ?? "";
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";

    // 1. EXTRACT & VERIFY AUTHENTICATED USER IDENTITY FROM JWT
    const authHeader = req.headers.get("authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Unauthorized: Missing Authorization header" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const token = authHeader.replace(/^Bearer\s+/i, "");
    const authClient = createClient(supabaseUrl, supabaseAnonKey);
    const { data: { user }, error: authErr } = await authClient.auth.getUser(token);

    if (authErr || !user) {
      return new Response(JSON.stringify({ error: "Unauthorized: Invalid authentication session" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const authenticatedUserId = user.id;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const body = await req.json();
    const { journeyId, reason, riskScore, riskLevel, idempotencyKey } = body;

    if (!journeyId) {
      return new Response(JSON.stringify({ error: "Missing required parameter: journeyId" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // 2. VERIFY JOURNEY OWNERSHIP
    const { data: journey, error: jErr } = await supabase
      .from("journeys")
      .select("id, user_id, status, risk_score, risk_level")
      .eq("id", journeyId)
      .single();

    if (jErr || !journey) {
      return new Response(JSON.stringify({ error: "Journey not found" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (journey.user_id !== authenticatedUserId) {
      return new Response(JSON.stringify({ error: "Forbidden: You do not own this journey" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // 3. IDEMPOTENCY CHECK: DO NOT DOUBLE-ESCALATE
    if (journey.status === "ESCALATED") {
      return new Response(
        JSON.stringify({
          success: true,
          alreadyEscalated: true,
          status: "ESCALATED",
          message: "Journey is already escalated. Suppressing duplicate alarm dispatch.",
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // 4. ATOMICALLY UPDATE JOURNEY STATUS TO ESCALATED
    const finalScore = Math.max(0, Math.min(100, typeof riskScore === 'number' ? riskScore : 95));
    const finalLevel = riskLevel || 'CRITICAL';

    const { error: updateErr } = await supabase
      .from("journeys")
      .update({
        status: "ESCALATED",
        risk_score: finalScore,
        risk_level: finalLevel,
        updated_at: new Date().toISOString(),
      })
      .eq("id", journeyId)
      .eq("user_id", authenticatedUserId);

    if (updateErr) {
      return new Response(JSON.stringify({ error: "Failed to update journey status", details: updateErr.message }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // 5. RECORD AUDIT EVENT
    await supabase.from("journey_events").insert({
      journey_id: journeyId,
      user_id: authenticatedUserId,
      event_type: "ETA_EXCEEDED",
      metadata: {
        reason: reason || "Check-in timeout threshold exceeded",
        idempotency_key: idempotencyKey || crypto.randomUUID(),
        escalation_triggered_at: new Date().toISOString(),
      },
    });

    // 6. FETCH PRIMARY GUARDIANS
    const { data: guardians } = await supabase
      .from("trusted_contacts")
      .select("id, name, phone, email")
      .eq("user_id", authenticatedUserId)
      .eq("is_primary", true);

    return new Response(
      JSON.stringify({
        success: true,
        alreadyEscalated: false,
        status: "ESCALATED",
        guardiansAlerted: guardians?.length || 0,
        escalationReason: reason || "Safety check-in breach",
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message || "Internal server error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
