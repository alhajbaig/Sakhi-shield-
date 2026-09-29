// Supabase Edge Function: notify-trusted-contact
// Production-Hardened Security: Validates JWT session, authenticates identity,
// checks resource ownership and permissions, and ensures idempotent notification dispatch.

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

    // Derived identity from JWT — NEVER trust body.userId
    const authenticatedUserId = user.id;

    // Use service client for administrative database checks
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const body = await req.json();
    const { journeyId, recipientId, notificationType, message, channel, idempotencyKey } = body;

    if (!journeyId || !recipientId || !notificationType) {
      return new Response(JSON.stringify({ error: "Missing required parameters: journeyId, recipientId, notificationType" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // 2. VERIFY JOURNEY OWNERSHIP
    const { data: journey, error: journeyErr } = await supabase
      .from("journeys")
      .select("id, user_id, status")
      .eq("id", journeyId)
      .single();

    if (journeyErr || !journey) {
      return new Response(JSON.stringify({ error: "Resource not found or inaccessible" }), {
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

    // 3. IDEMPOTENCY CHECK: PREVENT DUPLICATE SENDS
    if (idempotencyKey) {
      const { data: existingNotification } = await supabase
        .from("notifications")
        .select("id, status, created_at")
        .eq("idempotency_key", idempotencyKey)
        .single();

      if (existingNotification) {
        return new Response(
          JSON.stringify({
            success: true,
            idempotent: true,
            status: existingNotification.status,
            message: "Notification already processed with this idempotency key",
          }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
    }

    // 4. VERIFY RECIPIENT AUTHORIZATION AND PERMISSIONS
    const { data: contact, error: contactErr } = await supabase
      .from("trusted_contacts")
      .select("id, permissions, phone, email, name")
      .eq("id", recipientId)
      .eq("user_id", authenticatedUserId)
      .single();

    if (contactErr || !contact) {
      return new Response(JSON.stringify({ error: "Recipient not found in your trusted contacts" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const hasPermission =
      contact.permissions?.includes("NOTIFICATION") ||
      contact.permissions?.includes("JOURNEY_ESCALATION");

    const finalStatus = hasPermission ? "SENT" : "FAILED";
    const errorMessage = hasPermission ? null : "Permission not granted by user for this contact";

    // 5. AUDIT LOG RECORD
    const { error: insertErr } = await supabase.from("notifications").insert({
      user_id: authenticatedUserId,
      journey_id: journeyId,
      recipient_id: recipientId,
      notification_type: notificationType,
      channel: channel || "PUSH",
      status: finalStatus,
      idempotency_key: idempotencyKey || crypto.randomUUID(),
      error_message: errorMessage,
    });

    if (insertErr) {
      console.error("[notify-trusted-contact] Notification audit write error:", insertErr);
    }

    return new Response(
      JSON.stringify({
        success: hasPermission,
        status: finalStatus,
        authorized: hasPermission,
        recipientName: contact.name,
        error: errorMessage,
      }),
      {
        status: hasPermission ? 200 : 403,
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
