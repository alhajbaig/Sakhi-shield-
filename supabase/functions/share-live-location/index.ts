// Supabase Edge Function: share-live-location
// Production-Hardened Security: Implements server-verifiable live location sharing tokens.
// Stores SHA-256 hashes of tokens in database, enforces expiration, validates journey ownership,
// and supports time-bounded public tracking without exposing private user data.

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.42.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

async function hashToken(token: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(token);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
  const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY") ?? "";
  const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";

  const url = new URL(req.url);

  // ─────────────────────────────────────────────────────────────────────────────
  // 1. PUBLIC GET ROUTE: VERIFY TOKEN & RETURN SANITIZED TELEMETRY
  // ─────────────────────────────────────────────────────────────────────────────
  if (req.method === "GET") {
    const rawToken = url.searchParams.get("token");
    const journeyId = url.searchParams.get("journeyId");

    if (!rawToken || !journeyId) {
      return new Response(JSON.stringify({ error: "Missing required token or journeyId parameter" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    try {
      const supabase = createClient(supabaseUrl, supabaseServiceKey);
      const tokenHash = await hashToken(rawToken);

      // Verify token in database
      const { data: shareRecord, error: shareErr } = await supabase
        .from("live_location_shares")
        .select("id, journey_id, expires_at, revoked")
        .eq("token_hash", tokenHash)
        .eq("journey_id", journeyId)
        .single();

      if (shareErr || !shareRecord) {
        return new Response(JSON.stringify({ error: "Invalid tracking token" }), {
          status: 403,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      if (shareRecord.revoked) {
        return new Response(JSON.stringify({ error: "This live tracking link has been revoked by the sender" }), {
          status: 410,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      if (new Date(shareRecord.expires_at).getTime() < Date.now()) {
        return new Response(JSON.stringify({ error: "This live tracking link has expired" }), {
          status: 410,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      // Fetch journey state
      const { data: journey, error: jErr } = await supabase
        .from("journeys")
        .select("id, destination_name, status, risk_level, updated_at, route_geometry")
        .eq("id", journeyId)
        .single();

      if (jErr || !journey) {
        return new Response(JSON.stringify({ error: "Journey not found" }), {
          status: 404,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      // Fetch latest location update event
      const { data: latestEvent } = await supabase
        .from("journey_events")
        .select("latitude, longitude, accuracy, timestamp")
        .eq("journey_id", journeyId)
        .order("timestamp", { ascending: false })
        .limit(1)
        .single();

      return new Response(
        JSON.stringify({
          valid: true,
          journey: {
            id: journey.id,
            destinationName: journey.destination_name,
            status: journey.status,
            riskLevel: journey.risk_level,
            updatedAt: journey.updated_at,
            routeGeometry: journey.route_geometry,
            latestLocation: latestEvent
              ? {
                  latitude: latestEvent.latitude,
                  longitude: latestEvent.longitude,
                  accuracy: latestEvent.accuracy,
                  timestamp: latestEvent.timestamp,
                }
              : null,
          },
          expiresAt: shareRecord.expires_at,
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    } catch (err: any) {
      return new Response(JSON.stringify({ error: err.message || "Failed to verify tracking token" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // 2. AUTHENTICATED POST ROUTE: GENERATE OR REVOKE SHARING TOKEN
  // ─────────────────────────────────────────────────────────────────────────────
  try {
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
      return new Response(JSON.stringify({ error: "Unauthorized: Invalid session" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const authenticatedUserId = user.id;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const body = await req.json();
    const { action, journeyId, recipientId, permissionBasis, durationMinutes = 60, rawTokenToRevoke } = body;

    if (!journeyId) {
      return new Response(JSON.stringify({ error: "Missing required parameter: journeyId" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Verify journey ownership
    const { data: journey, error: jErr } = await supabase
      .from("journeys")
      .select("id, user_id, status")
      .eq("id", journeyId)
      .single();

    if (jErr || !journey || journey.user_id !== authenticatedUserId) {
      return new Response(JSON.stringify({ error: "Forbidden: You do not own this journey" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Revocation request
    if (action === "revoke") {
      if (rawTokenToRevoke) {
        const hash = await hashToken(rawTokenToRevoke);
        await supabase
          .from("live_location_shares")
          .update({ revoked: true, revoked_at: new Date().toISOString() })
          .eq("token_hash", hash)
          .eq("user_id", authenticatedUserId);
      } else {
        // Revoke all shares for this journey
        await supabase
          .from("live_location_shares")
          .update({ revoked: true, revoked_at: new Date().toISOString() })
          .eq("journey_id", journeyId)
          .eq("user_id", authenticatedUserId);
      }

      return new Response(JSON.stringify({ success: true, message: "Live location share revoked" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Token creation request
    const rawToken = crypto.randomUUID();
    const tokenHash = await hashToken(rawToken);
    const validMinutes = Math.max(5, Math.min(240, Number(durationMinutes) || 60));
    const expiresAt = new Date(Date.now() + validMinutes * 60 * 1000).toISOString();

    const { error: insertErr } = await supabase.from("live_location_shares").insert({
      journey_id: journeyId,
      user_id: authenticatedUserId,
      recipient_id: recipientId || null,
      token_hash: tokenHash,
      permission_basis: permissionBasis || "ACTIVE_JOURNEY",
      duration_minutes: validMinutes,
      expires_at: expiresAt,
      revoked: false,
    });

    if (insertErr) {
      return new Response(JSON.stringify({ error: "Failed to store share token", details: insertErr.message }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Log the sharing audit event
    await supabase.from("journey_events").insert({
      journey_id: journeyId,
      user_id: authenticatedUserId,
      event_type: "LOCATION_SHARED",
      metadata: {
        recipient_id: recipientId,
        permission_basis: permissionBasis,
        expires_at: expiresAt,
        token_id: rawToken.substring(0, 8),
      },
    });

    const origin = req.headers.get("origin") || "https://sakhishield.app";
    const liveShareUrl = `${origin}/track/${journeyId}?token=${rawToken}`;

    return new Response(
      JSON.stringify({
        success: true,
        liveShareUrl,
        rawToken,
        expiresAt,
        durationMinutes: validMinutes,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message || "Internal server error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
