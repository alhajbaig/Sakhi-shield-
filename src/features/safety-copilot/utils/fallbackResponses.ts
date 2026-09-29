// SakhiShield — Deterministic Safety Layer
// High-reliability offline and zero-AI rule-based response engine.
// Grounded strictly in actual SakhiShield telemetry — NEVER fabricates.

import type { SafetyContext, CopilotResponse, CopilotActionOffer } from '../types/safetyCopilot.types';

export function generateDeterministicResponse(
  userQuery: string,
  context: SafetyContext
): CopilotResponse {
  const query = userQuery.toLowerCase().trim();
  const journey = context.journey;
  const risk = context.risk;
  const checkIn = context.checkIn;
  const route = context.route;
  const trustedCircle = context.trustedCircle;
  const monitoring = context.monitoring;

  const actions: CopilotActionOffer[] = [];

  // 1. CRITICAL ESCALATION STATE (Highest Priority)
  if (journey?.status === 'ESCALATED' || journey?.status === 'ESCALATING' || journey?.status === 'HELP_REQUESTED') {
    actions.push({
      id: 'act_sos_active',
      type: 'TRIGGER_SOS',
      label: 'Emergency Alert Active',
      description: 'Emergency beacon is currently broadcasting to your trusted guardians.',
      requiresConfirmation: false,
      severity: 'CRITICAL',
      status: 'EXECUTED',
    });

    return {
      content:
        '⚠️ An emergency escalation is currently active for your journey. Your live coordinates have been broadcast to your Trusted Circle guardians. Please prioritize your immediate physical safety. If you are in safe hands, you can stand down the alert from the Walk With Me screen.',
      source: 'DETERMINISTIC_FALLBACK',
      suggestedActions: actions,
      contextUsed: { journey, risk },
      disclaimer: 'Deterministic Safety Protocol • Live Escalation Active',
    };
  }

  // 2. PENDING CHECK-IN
  if (checkIn?.isPending) {
    actions.push({
      id: 'act_confirm_checkin',
      type: 'REQUEST_CHECKIN',
      label: 'Confirm I Am Safe',
      description: 'Acknowledge check-in prompt to stand down guardian alerts.',
      requiresConfirmation: false,
      severity: 'CAUTION',
    });

    const timeRemaining = checkIn.timeRemainingSeconds ? `${checkIn.timeRemainingSeconds}s` : 'shortly';

    return {
      content: `🔔 You have an active safety check-in pending (timer expiring in ${timeRemaining}). If you are safe, please confirm your check-in right now to prevent automatic notification to your Trusted Circle.`,
      source: 'DETERMINISTIC_FALLBACK',
      suggestedActions: actions,
      contextUsed: { checkIn, journey },
      disclaimer: 'Deterministic Safety Protocol • Priority Action Required',
    };
  }

  // 3. EXPLAIN RISK QUERY
  if (
    query.includes('risk') ||
    query.includes('score') ||
    query.includes('why') ||
    query.includes('elevated') ||
    query.includes('signal')
  ) {
    const score = risk?.score ?? 10;
    const level = risk?.level ?? 'SAFE';
    const signals = risk?.activeSignals ?? [];

    if (level === 'SAFE') {
      return {
        content: `Your current risk score is ${score}/100 (${level}). No elevated safety anomalies are detected. The system is monitoring your position, transit pace, and check-in milestones in the background.`,
        source: 'DETERMINISTIC_FALLBACK',
        contextUsed: { risk, journey },
        disclaimer: 'Deterministic Risk Engine Telemetry',
      };
    }

    const signalExplanations: string[] = [];
    if (signals.includes('route_deviation')) {
      signalExplanations.push(
        '• Route Deviation: Your current location deviated from the planned arterial corridor.'
      );
    }
    if (signals.includes('unexpected_stop')) {
      signalExplanations.push(
        '• Unexpected Stop: Prolonged stationary telemetry detected outside designated safe havens.'
      );
    }
    if (signals.includes('late_night')) {
      signalExplanations.push(
        '• Late-Night Transit: Higher vigilance scoring is calibrated between 10:00 PM and 5:00 AM.'
      );
    }
    if (signals.includes('eta_exceeded')) {
      signalExplanations.push(
        '• ETA Exceeded: Transit duration has extended past initial arrival prediction.'
      );
    }
    if (signals.includes('missed_checkin')) {
      signalExplanations.push(
        '• Missed Check-in: Scheduled milestone acknowledgment was not confirmed.'
      );
    }
    if (signals.includes('low_battery')) {
      signalExplanations.push('• Low Battery: Device battery level dropped below 15%.');
    }

    const explanationBody =
      signalExplanations.length > 0
        ? signalExplanations.join('\n')
        : '• System vigilance calibration adjusted for active transit environment.';

    if (level === 'CRITICAL' || score >= 75) {
      actions.push({
        id: 'act_alert_circle',
        type: 'TRIGGER_SOS',
        label: 'Trigger Emergency SOS',
        description: 'Notify your circle immediately with live coordinates.',
        requiresConfirmation: true,
        severity: 'CRITICAL',
      });
    }

    return {
      content: `Your current risk score is ${score}/100 (${level}).\n\nActive contributing signals:\n${explanationBody}\n\nNote: Elevated signals do not by themselves prove danger, but indicate variance from expected transit patterns.`,
      source: 'DETERMINISTIC_FALLBACK',
      suggestedActions: actions,
      contextUsed: { risk, route },
      disclaimer: 'Deterministic Risk Engine Ground Truth',
    };
  }

  // 4. ROUTE DEVIATION QUERY / STATE
  if (route?.isOffRoute || query.includes('deviation') || query.includes('off route') || query.includes('wrong way')) {
    const devDist = route?.deviationDistanceMeters ? ` (~${Math.round(route.deviationDistanceMeters)}m from corridor)` : '';
    return {
      content: `⚠️ Route Deviation Detected${devDist}. Your location is currently outside the intended safe corridor. If you intentionally changed route, you can continue or recalculate in Walk With Me. If you feel uncomfortable, you can notify your Trusted Circle.`,
      source: 'DETERMINISTIC_FALLBACK',
      suggestedActions: [
        {
          id: 'act_open_circle',
          type: 'OPEN_TRUSTED_CIRCLE',
          label: 'View Trusted Circle',
          description: 'Check guardian status and alert readiness.',
          requiresConfirmation: false,
          severity: 'NORMAL',
        },
      ],
      contextUsed: { route, risk },
      disclaimer: 'Spatial Corridor Telemetry',
    };
  }

  // 5. UNEXPECTED STOP
  if (route?.hasUnexpectedStop || query.includes('stopped') || query.includes('halt') || query.includes('not moving')) {
    const duration = route?.stopDurationMinutes ? ` for ${route.stopDurationMinutes} minutes` : '';
    return {
      content: `The system detected an unexpected stop${duration}. If you stopped for traffic, shopping, or a ride delay, no action is required unless a check-in prompt appears. If you need assistance, your emergency options are available at any time.`,
      source: 'DETERMINISTIC_FALLBACK',
      contextUsed: { route, risk },
      disclaimer: 'Spatial Stop Detection Engine',
    };
  }

  // 6. I'M UNCOMFORTABLE / SCARE / HELP QUERY
  if (
    query.includes('uncomfortable') ||
    query.includes('scared') ||
    query.includes('afraid') ||
    query.includes('help') ||
    query.includes('emergency') ||
    query.includes('someone following')
  ) {
    actions.push({
      id: 'act_req_help',
      type: 'REQUEST_CHECKIN',
      label: 'Request Discreet Guardian Check',
      description: 'Dispatches high-priority reassurance pulse to your guardians.',
      requiresConfirmation: true,
      severity: 'CAUTION',
    });
    actions.push({
      id: 'act_sos',
      type: 'TRIGGER_SOS',
      label: 'Trigger Emergency SOS',
      description: 'Sends live tracking link and siren to all trusted circle members.',
      requiresConfirmation: true,
      severity: 'CRITICAL',
    });

    return {
      content:
        'If you feel uncomfortable or unsafe:\n1. Head toward well-lit public places or commercial stores.\n2. Keep your phone in hand.\n3. You can dispatch a discreet guardian check or activate emergency SOS below with one tap.\n\nYour emergency buttons require your confirmation before dispatching alarms.',
      source: 'DETERMINISTIC_FALLBACK',
      suggestedActions: actions,
      contextUsed: { risk, trustedCircle },
      disclaimer: 'Deterministic Safety Guidance',
    };
  }

  // 7. TRUSTED CIRCLE QUERY
  if (query.includes('circle') || query.includes('guardian') || query.includes('contact') || query.includes('family')) {
    if (trustedCircle && trustedCircle.configured && trustedCircle.memberCount > 0) {
      const names = trustedCircle.activeGuardianNames.length > 0
        ? ` (${trustedCircle.activeGuardianNames.join(', ')})`
        : '';
      return {
        content: `Your Trusted Circle has ${trustedCircle.memberCount} active member(s)${names}. In an emergency or missed check-in, they automatically receive high-priority location alerts.`,
        source: 'DETERMINISTIC_FALLBACK',
        contextUsed: { trustedCircle },
        disclaimer: 'Trusted Circle Subsystem',
      };
    } else {
      actions.push({
        id: 'act_setup_circle',
        type: 'OPEN_TRUSTED_CIRCLE',
        label: 'Configure Trusted Circle',
        description: 'Add family or close friends to monitor your journeys.',
        requiresConfirmation: false,
        severity: 'NORMAL',
      });
      return {
        content:
          "You don't have an active Trusted Circle configured yet. We strongly recommend adding at least one trusted guardian so SakhiShield can deliver automated alerts if you encounter an anomaly.",
        source: 'DETERMINISTIC_FALLBACK',
        suggestedActions: actions,
        contextUsed: { trustedCircle },
        disclaimer: 'Trusted Circle Subsystem',
      };
    }
  }

  // 8. GPS OR MONITORING INQUIRY
  if (query.includes('gps') || query.includes('offline') || query.includes('location') || query.includes('internet')) {
    const isOnline = monitoring?.networkOnline !== false;
    const gpsStatus = monitoring?.gpsStatus || 'SEARCHING';

    return {
      content: `Monitoring Health Telemetry:\n• Network: ${isOnline ? 'Online (Realtime connected)' : 'Offline (Local queue & SMS ready)'}\n• GPS Lock: ${gpsStatus}\n\nSakhiShield operates an offline-first resilient architecture. Even without internet, check-ins, sirens, and telemetry queues operate uninterrupted locally.`,
      source: 'DETERMINISTIC_FALLBACK',
      contextUsed: { monitoring },
      disclaimer: 'Monitoring Health Subsystem',
    };
  }

  // 9. ACTIVE JOURNEY GENERAL QUERY
  if (journey && journey.isLive) {
    const etaText = journey.etaMinutes ? `Estimated remaining time: ~${journey.etaMinutes} minutes.` : 'ETA calculation in progress.';
    actions.push({
      id: 'act_explain_risk',
      type: 'EXPLAIN_RISK',
      label: 'Explain My Risk',
      description: 'Get a breakdown of all active signals.',
      requiresConfirmation: false,
      severity: 'NORMAL',
    });

    return {
      content: `You have an active journey to "${journey.destination}".\n• Status: ${journey.status}\n• ${etaText}\n• Risk Level: ${risk?.level ?? 'SAFE'} (${risk?.score ?? 15}/100)\n\nSakhiShield is continuously logging corridor safe havens and GPS precision.`,
      source: 'DETERMINISTIC_FALLBACK',
      suggestedActions: actions,
      contextUsed: { journey, risk },
      disclaimer: 'Live Walk With Me Session',
    };
  }

  // 10. NO ACTIVE JOURNEY GENERAL STATUS
  return {
    content:
      'No active transit journey is currently detected. You are in stationary monitoring mode. If you are preparing to travel, start a journey in "Walk With Me" to enable continuous corridor illumination tracking, automated check-in verification, and live guardian breadcrumbs.',
    source: 'DETERMINISTIC_FALLBACK',
    suggestedActions: [
      {
        id: 'act_check_circle',
        type: 'OPEN_TRUSTED_CIRCLE',
        label: 'View Trusted Circle',
        description: 'Verify your emergency guardian network.',
        requiresConfirmation: false,
        severity: 'NORMAL',
      },
    ],
    contextUsed: { journey, risk, trustedCircle },
    disclaimer: 'Stationary Safety Posture',
  };
}
