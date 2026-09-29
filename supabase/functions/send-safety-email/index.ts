// Supabase Edge Function: send-safety-email
// Uses Resend API server-side with secure RESEND_API_KEY secret.
// Production-Hardened Security: Authenticates caller JWT to prevent anonymous email relay abuse.

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.42.0";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface EmailPayload {
  to: string;
  recipientName: string;
  userName: string;
  notificationType: "TRUSTED_CONTACT_ALERT" | "JOURNEY_ESCALATION" | "CRITICAL_SAFETY_EVENT";
  message: string;
  coordinates?: { latitude: number; longitude: number };
  journeyId: string;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY") ?? "";

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

    const payload: EmailPayload = await req.json();

    if (!payload.to || !payload.message) {
      return new Response(JSON.stringify({ error: "Missing required email fields: to, message" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(payload.to)) {
      return new Response(JSON.stringify({ error: "Invalid recipient email address" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (!RESEND_API_KEY) {
      console.warn("RESEND_API_KEY not set in Edge Function secrets. Simulation mode active.");
      return new Response(JSON.stringify({ success: true, simulated: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const senderName = payload.userName || user.user_metadata?.full_name || "SakhiShield User";

    const emailSubject =
      payload.notificationType === "CRITICAL_SAFETY_EVENT"
        ? `[CRITICAL ALERT] SakhiShield Safety Notification for ${senderName}`
        : `[Safety Update] SakhiShield Walk With Me Notification for ${senderName}`;

    const locationSnippet = payload.coordinates
      ? `<p><strong>Latest Observable Coordinates:</strong> ${payload.coordinates.latitude.toFixed(5)}, ${payload.coordinates.longitude.toFixed(5)}</p>`
      : "";

    const htmlBody = `
      <div style="font-family: sans-serif; max-width: 560px; margin: auto; padding: 24px; border: 1px solid #eee; border-radius: 12px; background: #FFFAF3; color: #171515;">
        <h2 style="margin-top: 0; color: #171515;">SakhiShield Safety Corridor Notice</h2>
        <p>Hello ${payload.recipientName || 'Guardian'},</p>
        <p>You are receiving this notification because you are a registered Trusted Guardian for <strong>${senderName}</strong>.</p>
        <div style="padding: 16px; background: #FFF2DB; border-left: 4px solid #F62440; margin: 16px 0; border-radius: 4px;">
          <p style="margin: 0; font-weight: bold;">${payload.message}</p>
        </div>
        ${locationSnippet}
        <p style="font-size: 12px; color: #625B55; margin-top: 24px; border-top: 1px solid #eee; padding-top: 12px;">
          SakhiShield Sovereign Safety Architecture • Zero persistent tracking outside active journeys.
        </p>
      </div>
    `;

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "SakhiShield Safety <safety@sakhishield.com>",
        to: [payload.to],
        subject: emailSubject,
        html: htmlBody,
      }),
    });

    const resData = await res.json();
    return new Response(JSON.stringify({ success: res.ok, data: resData }), {
      status: res.ok ? 200 : res.status,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message || "Failed to dispatch email" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
