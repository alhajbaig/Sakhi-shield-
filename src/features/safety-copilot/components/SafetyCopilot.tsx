// SakhiShield — Safety Copilot Root Component
// Connects useSafetyCopilot state machine to header, telemetry panel, and confirmation modal.

import React from 'react';
import { SafetyCopilotHeader } from './SafetyCopilotHeader';
import { SafetyCopilotPanel } from './SafetyCopilotPanel';
import { EmergencyActionCard } from './EmergencyActionCard';
import { useSafetyCopilot } from '../hooks/useSafetyCopilot';

export const SafetyCopilot: React.FC = () => {
  const {
    messages,
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
  } = useSafetyCopilot();

  return (
    <div className="space-y-6">
      {/* Header with Title and Global Actions */}
      <SafetyCopilotHeader
        context={context}
        onRefresh={refreshContext}
        onClear={clearMessages}
        isLoading={isLoading}
      />

      {/* Main Panel: Telemetry Cards & Chat Interface */}
      <SafetyCopilotPanel
        context={context}
        messages={messages}
        isLoading={isLoading}
        error={error}
        actionFeedback={actionFeedback}
        onSend={sendMessage}
        onRequestAction={handleRequestAction}
      />

      {/* Sensitive Action Explicit Confirmation Modal */}
      <EmergencyActionCard
        action={pendingAction}
        onConfirm={confirmPendingAction}
        onCancel={cancelPendingAction}
        isLoading={isLoading}
      />
    </div>
  );
};
