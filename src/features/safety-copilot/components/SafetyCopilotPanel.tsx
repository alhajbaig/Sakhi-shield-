// SakhiShield — Safety Copilot Panel
// Two-column layout coordinating context telemetry on the left, and chat on the right.

import React from 'react';
import { SafetyContextCard } from './SafetyContextCard';
import { RiskContextCard } from './RiskContextCard';
import { LocationContextCard } from './LocationContextCard';
import { SafetyCopilotMessages } from './SafetyCopilotMessages';
import { SafetyCopilotSuggestions } from './SafetyCopilotSuggestions';
import { SafetyCopilotInput } from './SafetyCopilotInput';
import type {
  SafetyContext,
  CopilotMessage,
  CopilotActionOffer,
} from '../types/safetyCopilot.types';
import { AlertCircle, CheckCircle } from 'lucide-react';

interface SafetyCopilotPanelProps {
  context: SafetyContext;
  messages: CopilotMessage[];
  isLoading: boolean;
  error: string | null;
  actionFeedback: string | null;
  onSend: (text: string) => void;
  onRequestAction: (offer: CopilotActionOffer) => void;
}

export const SafetyCopilotPanel: React.FC<SafetyCopilotPanelProps> = ({
  context,
  messages,
  isLoading,
  error,
  actionFeedback,
  onSend,
  onRequestAction,
}) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      {/* Left Column: Authoritative Telemetry & Risk Explainability (5 columns on desktop) */}
      <div className="lg:col-span-5 space-y-4">
        <SafetyContextCard context={context} />
        <RiskContextCard risk={context.risk} />
        <LocationContextCard location={context.location} route={context.route} />

        {/* Action execution feedback banner */}
        {actionFeedback && (
          <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs font-sans text-emerald-900 flex items-start gap-2 animate-in fade-in duration-150">
            <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span>{actionFeedback}</span>
          </div>
        )}

        {/* Error banner */}
        {error && (
          <div className="p-3.5 rounded-2xl bg-[#FEE2E2] border border-[#F62440]/30 text-xs font-sans text-[#F62440] flex items-start gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}
      </div>

      {/* Right Column: Conversational Safety Intelligence (7 columns on desktop) */}
      <div className="lg:col-span-7 rounded-3xl border border-[#1C1917]/15 bg-[#FFFAF3] shadow-xs flex flex-col overflow-hidden">
        {/* Messages */}
        <SafetyCopilotMessages
          messages={messages}
          isLoading={isLoading}
          onRequestAction={onRequestAction}
        />

        {/* Suggestions Bar */}
        <div className="px-4 py-2 border-t border-[#1C1917]/8 bg-white/30">
          <SafetyCopilotSuggestions
            context={context}
            onSelectSuggestion={onSend}
            disabled={isLoading}
          />
        </div>

        {/* Input */}
        <SafetyCopilotInput onSend={onSend} isLoading={isLoading} />
      </div>
    </div>
  );
};
