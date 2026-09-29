// SakhiShield — useSafetyCopilot Hook
// Manages the reactive conversational session, streaming/loading state,
// sensitive action confirmation modals, and deterministic error handling.

import { useState, useCallback, useEffect } from 'react';
import type {
  CopilotSession,
  CopilotMessage,
  CopilotActionOffer,
  SafetyContext,
} from '../types/safetyCopilot.types';
import { safetyCopilotService } from '../services/safetyCopilotService';
import { useSafetyContext } from './useSafetyContext';
import { useAuth } from '../../../lib/AuthContext';

export function useSafetyCopilot(initialOverrides?: Partial<SafetyContext>) {
  const { user: authUser } = useAuth();
  const userId = authUser?.id || 'usr_guest';

  const { context, refreshContext } = useSafetyContext();
  const [session, setSession] = useState<CopilotSession>(() =>
    safetyCopilotService.loadSession(userId)
  );

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pendingAction, setPendingAction] = useState<CopilotActionOffer | null>(null);
  const [actionFeedback, setActionFeedback] = useState<string | null>(null);

  // Reload session if user changes
  useEffect(() => {
    setSession(safetyCopilotService.loadSession(userId));
  }, [userId]);

  /**
   * Send a query to the Copilot
   */
  const sendMessage = useCallback(
    async (text: string) => {
      if (!text.trim() || isLoading) return;
      setIsLoading(true);
      setError(null);
      setActionFeedback(null);

      try {
        const { updatedSession, assistantMessage } = await safetyCopilotService.sendMessage(
          session,
          text,
          {
            ...context,
            ...initialOverrides,
          }
        );
        setSession(updatedSession);

        // If the assistant offered a high-severity action, suggest it
        if (assistantMessage.actionOffer?.requiresConfirmation) {
          // Keep offer available in the message card
        }
      } catch (err: any) {
        console.error('[useSafetyCopilot] Send message error:', err);
        setError('Unable to reach safety service. Deterministic fallback engaged.');
      } finally {
        setIsLoading(false);
      }
    },
    [session, context, initialOverrides, isLoading]
  );

  /**
   * Request execution of an action offer
   */
  const handleRequestAction = useCallback(
    async (offer: CopilotActionOffer) => {
      if (offer.requiresConfirmation) {
        setPendingAction(offer);
        return;
      }

      // Execute directly if not sensitive
      setIsLoading(true);
      try {
        const result = await safetyCopilotService.executeAction(offer, context, true);
        setActionFeedback(result.message);
        await refreshContext();
      } catch (err: any) {
        setActionFeedback('Action failed to execute.');
      } finally {
        setIsLoading(false);
      }
    },
    [context, refreshContext]
  );

  /**
   * Confirm and execute a pending sensitive action
   */
  const confirmPendingAction = useCallback(async () => {
    if (!pendingAction) return;
    const actionToExec = pendingAction;
    setPendingAction(null);
    setIsLoading(true);

    try {
      const result = await safetyCopilotService.executeAction(actionToExec, context, true);
      setActionFeedback(result.message);

      // Add system message to chat log recording the action execution
      const systemMsg: CopilotMessage = {
        id: `sys_${Date.now()}`,
        sender: 'SYSTEM',
        content: `⚡ Action Confirmed & Executed: ${actionToExec.label}\n${result.message}`,
        timestamp: new Date().toISOString(),
        source: 'SYSTEM_ACTION',
      };

      const updated = {
        ...session,
        messages: [...session.messages, systemMsg],
      };
      setSession(updated);
      safetyCopilotService.saveSession(updated);
      await refreshContext();
    } catch (err) {
      setActionFeedback('Failed to execute emergency action.');
    } finally {
      setIsLoading(false);
    }
  }, [pendingAction, context, session, refreshContext]);

  /**
   * Cancel pending confirmation
   */
  const cancelPendingAction = useCallback(() => {
    setPendingAction(null);
  }, []);

  /**
   * Clear session history
   */
  const clearMessages = useCallback(() => {
    const fresh = safetyCopilotService.clearSession(userId);
    setSession(fresh);
    setError(null);
    setActionFeedback(null);
  }, [userId]);

  return {
    session,
    messages: session.messages,
    context,
    isLoading,
    error,
    pendingAction,
    actionFeedback,
    sendMessage,
    handleRequestAction,
    confirmPendingAction,
    cancelPendingAction,
    clearMessages,
    refreshContext,
  };
}
