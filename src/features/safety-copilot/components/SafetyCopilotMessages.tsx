// SakhiShield — Safety Copilot Messages List
// Scrollable container with auto-scroll and loading indicators.

import React, { useEffect, useRef } from 'react';
import { SafetyCopilotMessage } from './SafetyCopilotMessage';
import type { CopilotMessage, CopilotActionOffer } from '../types/safetyCopilot.types';
import { Sparkles } from 'lucide-react';

interface SafetyCopilotMessagesProps {
  messages: CopilotMessage[];
  isLoading: boolean;
  onRequestAction?: (offer: CopilotActionOffer) => void;
}

export const SafetyCopilotMessages: React.FC<SafetyCopilotMessagesProps> = ({
  messages,
  isLoading,
  onRequestAction,
}) => {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-2 min-h-[320px] max-h-[580px]">
      {messages.map((msg) => (
        <SafetyCopilotMessage
          key={msg.id}
          message={msg}
          onRequestAction={onRequestAction}
        />
      ))}

      {isLoading && (
        <div className="flex items-center gap-2.5 my-3 animate-pulse">
          <div className="w-8 h-8 rounded-xl bg-[#FFE5BF] text-[#1C1917] flex items-center justify-center shrink-0 border border-[#1C1917]/10">
            <Sparkles className="w-4 h-4 text-[#1C1917]" />
          </div>
          <div className="p-3.5 rounded-2xl rounded-tl-xs bg-white/80 border border-[#1C1917]/10 text-xs font-mono text-[#78716C] flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#1C1917] animate-ping" />
            <span>Analyzing corridor telemetry & grounding response...</span>
          </div>
        </div>
      )}

      <div ref={bottomRef} />
    </div>
  );
};
