// SakhiShield — Copilot Response Service
// Implements the AI Provider Abstraction with graceful automatic fallback to the
// deterministic safety engine if offline, unconfigured, or if validation fails.

import type {
  SafetyContext,
  CopilotMessage,
  CopilotResponse,
  SafetyCopilotProvider,
} from '../types/safetyCopilot.types';
import { supabase, isSupabaseConfigured } from '../../../lib/supabase';
import { sanitizeSafetyContext } from '../utils/contextSanitizer';
import { generateDeterministicResponse } from '../utils/fallbackResponses';
import { validateCopilotResponse } from '../utils/responseValidator';
import { safetyCopilotConfig } from '../config/safetyCopilot.config';

export class FallbackCopilotProvider implements SafetyCopilotProvider {
  name = 'deterministic-fallback';

  async generateResponse(
    messages: CopilotMessage[],
    context: SafetyContext
  ): Promise<CopilotResponse> {
    const latestUserMessage = messages.filter((m) => m.sender === 'USER').pop();
    const query = latestUserMessage?.content || 'What is my safety status?';
    return generateDeterministicResponse(query, context);
  }
}

export class EdgeFunctionCopilotProvider implements SafetyCopilotProvider {
  name = 'supabase-edge-function';
  private fallbackProvider = new FallbackCopilotProvider();

  async generateResponse(
    messages: CopilotMessage[],
    context: SafetyContext
  ): Promise<CopilotResponse> {
    const latestUserMessage = messages.filter((m) => m.sender === 'USER').pop();
    const query = latestUserMessage?.content || 'What is my safety status?';

    // If offline or Supabase not configured, immediately use deterministic fallback
    if (!navigator.onLine || !isSupabaseConfigured()) {
      return this.fallbackProvider.generateResponse(messages, context);
    }

    try {
      const sanitized = sanitizeSafetyContext(context);

      // Invoke Supabase edge function with timeout protection
      const invokePromise = supabase.functions.invoke(safetyCopilotConfig.edgeFunctionName, {
        body: {
          messages: messages.slice(-6), // Send only last 6 relevant conversational turns
          context: sanitized,
        },
      });

      const timeoutPromise = new Promise<{ data: null; error: Error }>((_, reject) =>
        setTimeout(() => reject(new Error('Safety Copilot request timeout')), safetyCopilotConfig.timeoutMs)
      );

      const result: any = await Promise.race([invokePromise, timeoutPromise]);

      if (result.error || !result.data?.content) {
        console.warn('[CopilotResponseService] Edge function returned error, falling back:', result.error);
        return this.fallbackProvider.generateResponse(messages, context);
      }

      // Pass raw AI response through strict safety validator
      const validation = validateCopilotResponse(result.data.content, query, context);
      if (!validation.isValid) {
        console.warn('[CopilotResponseService] AI response rejected by validator:', validation.rejectionReason);
        return validation.sanitizedResponse;
      }

      return validation.sanitizedResponse;
    } catch (err) {
      console.warn('[CopilotResponseService] Invocation error, switching to deterministic fallback:', err);
      return this.fallbackProvider.generateResponse(messages, context);
    }
  }
}

export const copilotResponseService = {
  getProvider(): SafetyCopilotProvider {
    if (safetyCopilotConfig.provider === 'fallback-only') {
      return new FallbackCopilotProvider();
    }
    return new EdgeFunctionCopilotProvider();
  },

  async generateResponse(
    messages: CopilotMessage[],
    context: SafetyContext
  ): Promise<CopilotResponse> {
    const provider = this.getProvider();
    return provider.generateResponse(messages, context);
  },
};
