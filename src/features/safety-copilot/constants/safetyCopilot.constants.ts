// SakhiShield — Safety Copilot Constants

export const COPILOT_STORAGE_KEY = 'sakhishield_safety_copilot_session_v1';
export const COPILOT_MAX_MESSAGES_SAVED = 40;
export const COPILOT_REQUEST_TIMEOUT_MS = 12000;

export const COPILOT_DEFAULT_SUGGESTIONS = {
  NO_JOURNEY: [
    { label: "What's my current safety status?", prompt: "What is my current safety status right now?" },
    { label: "Explain my safety signals", prompt: "Explain how SakhiShield monitors my safety and active signals." },
    { label: "Check Trusted Circle", prompt: "What is the status of my Trusted Circle?" },
  ],
  ACTIVE_JOURNEY: [
    { label: "What's my journey status?", prompt: "What is the status and ETA of my current journey?" },
    { label: "Explain my risk score", prompt: "Why is my risk score at its current level?" },
    { label: "Check-in now", prompt: "I want to confirm my safety check-in." },
    { label: "I feel uncomfortable", prompt: "I feel uncomfortable right now. What are my options?" },
  ],
  ELEVATED_RISK: [
    { label: "Why did my risk change?", prompt: "Why is my risk level elevated right now?" },
    { label: "What should I do now?", prompt: "My risk is elevated. What precautions should I take?" },
    { label: "Alert my Trusted Circle", prompt: "Can you help me alert my Trusted Circle?" },
  ],
  PENDING_CHECKIN: [
    { label: "I am safe (Check in)", prompt: "I am safe. Confirm my check-in." },
    { label: "Why am I asked to check in?", prompt: "Why is there an active check-in prompt?" },
  ],
};

export const COPILOT_SYSTEM_PROMPT = `You are SakhiShield Safety Copilot — a calm, vigilant, precise on-device safety intelligence assistant for women's personal safety in India.

CRITICAL RULES:
1. AUTHORITY: SakhiShield's deterministic safety risk engine is the single source of truth. You NEVER modify risk scores or invent safety signals.
2. NO FABRICATION: NEVER invent crime statistics, police presence, CCTV coverage, safe havens, threats, emergency response times, or news. If something is unknown or not verified, say so explicitly.
3. CONCISENESS: During elevated or critical risk, be brief, calm, and direct. Do not write essays when someone needs actionable guidance.
4. ACTION CONFIRMATION: You cannot autonomously trigger SOS, send emergency broadcasts, or end journeys without explicit user authorization and confirmation.
5. EXPLAIN RISK HONESTLY: Translate the deterministic risk signals (e.g. route deviation, unexpected stop, late night, missed check-in) into clear, reassuring explanation.
6. NO FALSE PROMISES: Never say "You are completely safe". Say "No elevated risk signals are currently detected."
7. PRIVACY: Respect location privacy. Do not repeatedly cite exact GPS coordinates.
`;
