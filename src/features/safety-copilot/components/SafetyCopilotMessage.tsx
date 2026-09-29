// SakhiShield — Safety Copilot Message
// Renders user bubbles, assistant cards with provenance tags, and actionable emergency offers.

import React from 'react';
import { Sparkles, Shield, AlertOctagon, CheckCircle2 } from 'lucide-react';
import type { CopilotMessage, CopilotActionOffer } from '../types/safetyCopilot.types';

interface SafetyCopilotMessageProps {
  message: CopilotMessage;
  onRequestAction?: (offer: CopilotActionOffer) => void;
}

export const SafetyCopilotMessage: React.FC<SafetyCopilotMessageProps> = ({
  message,
  onRequestAction,
}) => {
  const isUser = message.sender === 'USER';
  const isSystem = message.sender === 'SYSTEM';

  if (isSystem) {
    return (
      <div className="flex justify-center my-3">
        <div className="px-3.5 py-1.5 rounded-full bg-[#FFE5BF] border border-[#1C1917]/15 font-mono text-[11px] font-bold text-[#1C1917] shadow-2xs text-center max-w-lg">
          {message.content}
        </div>
      </div>
    );
  }

  if (isUser) {
    return (
      <div className="flex justify-end my-2.5">
        <div className="max-w-[85%] sm:max-w-[75%] rounded-2xl rounded-tr-xs bg-[#1C1917] text-[#FFFAF3] p-3.5 sm:p-4 shadow-xs space-y-1">
          <p className="font-sans text-xs sm:text-sm leading-relaxed whitespace-pre-wrap break-words">
            {message.content}
          </p>
          <div className="text-[10px] font-mono text-white/50 text-right">
            {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
        </div>
      </div>
    );
  }

  // Copilot Message
  const isAi = message.source === 'AI';
  const offer = message.actionOffer;

  return (
    <div className="flex items-start gap-2.5 my-3">
      <div className="w-8 h-8 rounded-xl bg-[#FFE5BF] text-[#1C1917] flex items-center justify-center shrink-0 border border-[#1C1917]/10 mt-1 shadow-2xs">
        <Sparkles className="w-4 h-4 text-[#1C1917]" />
      </div>

      <div className="max-w-[90%] sm:max-w-[82%] rounded-2xl rounded-tl-xs bg-white/90 border border-[#1C1917]/12 p-4 shadow-xs space-y-3 text-[#1C1917]">
        {/* Header Tag */}
        <div className="flex items-center justify-between gap-2 pb-2 border-b border-[#1C1917]/8">
          <span className="font-mono text-[10px] font-bold tracking-wider uppercase text-[#1C1917] flex items-center gap-1">
            <Shield className="w-3 h-3 text-emerald-700" />
            SAFETY COPILOT
          </span>
          <span
            className={`font-mono text-[9px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${
              isAi
                ? 'bg-purple-100 text-purple-900 border border-purple-200'
                : 'bg-emerald-100 text-emerald-900 border border-emerald-200'
            }`}
          >
            {isAi ? 'AI GROUNDED' : 'DETERMINISTIC PROTOCOL'}
          </span>
        </div>

        {/* Content Body */}
        <div className="font-sans text-xs sm:text-sm text-[#292524] leading-relaxed whitespace-pre-wrap break-words">
          {message.content}
        </div>

        {/* Action Offer Card if present */}
        {offer && (
          <div className="mt-3 p-3 rounded-xl border border-[#1C1917]/15 bg-[#FFF2DB]/50 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10px] uppercase font-bold text-[#78716C] tracking-wider">
                RECOMMENDED ACTION
              </span>
              <span className="font-mono text-[10px] font-bold text-[#1C1917]">
                {offer.requiresConfirmation ? 'REQUIRES CONFIRMATION' : 'ONE-TAP ACTION'}
              </span>
            </div>
            <div className="font-sans font-bold text-xs text-[#1C1917]">
              {offer.label}
            </div>
            <p className="font-sans text-[11px] text-[#57534E] leading-normal">
              {offer.description}
            </p>
            <button
              type="button"
              onClick={() => onRequestAction?.(offer)}
              className={`w-full mt-2 py-2 px-3 rounded-xl font-mono text-xs font-bold text-white shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                offer.severity === 'CRITICAL'
                  ? 'bg-[#F62440] hover:bg-[#d81e35]'
                  : 'bg-[#1C1917] hover:bg-[#F62440]'
              }`}
            >
              {offer.severity === 'CRITICAL' ? (
                <AlertOctagon className="w-3.5 h-3.5" />
              ) : (
                <CheckCircle2 className="w-3.5 h-3.5" />
              )}
              <span>{offer.label}</span>
            </button>
          </div>
        )}

        {/* Timestamp */}
        <div className="text-[10px] font-mono text-[#78716C] text-right">
          {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>
    </div>
  );
};
