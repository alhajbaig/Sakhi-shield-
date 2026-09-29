// SakhiShield — Safety Copilot Service
// Master orchestration layer coordinating session persistence, context gathering,
// response generation, and action execution.

import type {
  CopilotMessage,
  CopilotSession,
  CopilotActionOffer,
  CopilotActionExecutionResult,
  SafetyContext,
} from '../types/safetyCopilot.types';
import { safetyContextService } from './safetyContextService';
import { copilotResponseService } from './copilotResponseService';
import { copilotEmergencyService } from './copilotEmergencyService';
import { generateSecureId } from '../../../lib/securityUtils';
import {
  COPILOT_STORAGE_KEY,
  COPILOT_MAX_MESSAGES_SAVED,
} from '../constants/safetyCopilot.constants';

export const safetyCopilotService = {
  /**
   * Loads the active Copilot session from localStorage or initializes a fresh one.
   */
  loadSession(userId: string = 'usr_guest'): CopilotSession {
    try {
      if (typeof localStorage !== 'undefined') {
        const stored = localStorage.getItem(`${COPILOT_STORAGE_KEY}_${userId}`);
        if (stored) {
          const parsed = JSON.parse(stored);
          if (parsed && Array.isArray(parsed.messages)) {
            return parsed;
          }
        }
      }
    } catch {}

    const now = new Date().toISOString();
    return {
      id: generateSecureId('copilot_sess'),
      userId,
      startedAt: now,
      updatedAt: now,
      messages: [
        {
          id: 'msg_welcome',
          sender: 'COPILOT',
          content:
            "I'm your SakhiShield Safety Copilot. I monitor your live corridor telemetry, risk signals, and guardian network. How can I support your safety right now?",
          timestamp: now,
          source: 'DETERMINISTIC_FALLBACK',
        },
      ],
    };
  },

  /**
   * Persists the session to localStorage safely.
   */
  saveSession(session: CopilotSession): void {
    try {
      if (typeof localStorage !== 'undefined') {
        // Enforce max history window to respect storage limits and privacy
        const pruned: CopilotSession = {
          ...session,
          updatedAt: new Date().toISOString(),
          messages: session.messages.slice(-COPILOT_MAX_MESSAGES_SAVED),
        };
        localStorage.setItem(`${COPILOT_STORAGE_KEY}_${session.userId}`, JSON.stringify(pruned));
      }
    } catch {}
  },

  /**
   * Sends a user message, gathers live safety context, and obtains a validated response.
   */
  async sendMessage(
    session: CopilotSession,
    userQuery: string,
    contextOverrides?: Partial<SafetyContext>
  ): Promise<{ updatedSession: CopilotSession; assistantMessage: CopilotMessage }> {
    const trimmed = userQuery.trim();
    if (!trimmed) {
      throw new Error('Query cannot be empty');
    }

    const now = new Date().toISOString();
    const userMessage: CopilotMessage = {
      id: generateSecureId('msg_user'),
      sender: 'USER',
      content: trimmed,
      timestamp: now,
      source: 'SYSTEM_ACTION',
    };

    const messagesWithUser = [...session.messages, userMessage];

    // 1. Gather fresh SafetyContext
    const context = await safetyContextService.gatherCurrentContext({
      user: {
        id: session.userId,
        name: contextOverrides?.user?.name || 'User',
        isAuthenticated: session.userId !== 'usr_guest',
      },
      ...contextOverrides,
    });

    // 2. Generate validated response
    const response = await copilotResponseService.generateResponse(messagesWithUser, context);

    // 3. Construct assistant message
    const assistantMessage: CopilotMessage = {
      id: generateSecureId('msg_copilot'),
      sender: 'COPILOT',
      content: response.content,
      timestamp: new Date().toISOString(),
      source: response.source,
      actionOffer: response.suggestedActions?.[0],
      contextSnapshot: {
        journey: context.journey,
        risk: context.risk,
      },
    };

    const updatedSession: CopilotSession = {
      ...session,
      updatedAt: new Date().toISOString(),
      messages: [...messagesWithUser, assistantMessage],
    };

    this.saveSession(updatedSession);
    return { updatedSession, assistantMessage };
  },

  /**
   * Executes an action offer.
   */
  async executeAction(
    offer: CopilotActionOffer,
    context: SafetyContext,
    confirmedByUser: boolean = false
  ): Promise<CopilotActionExecutionResult> {
    return copilotEmergencyService.executeAction(offer, context, confirmedByUser);
  },

  /**
   * Clears the current session and resets to initial welcome state.
   */
  clearSession(userId: string = 'usr_guest'): CopilotSession {
    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.removeItem(`${COPILOT_STORAGE_KEY}_${userId}`);
      }
    } catch {}

    const now = new Date().toISOString();
    return {
      id: generateSecureId('copilot_sess'),
      userId,
      startedAt: now,
      updatedAt: now,
      messages: [
        {
          id: 'msg_welcome_reset',
          sender: 'COPILOT',
          content:
            "I'm your SakhiShield Safety Copilot. I monitor your live corridor telemetry, risk signals, and guardian network. How can I support your safety right now?",
          timestamp: now,
          source: 'DETERMINISTIC_FALLBACK',
        },
      ],
    };
  },
};
