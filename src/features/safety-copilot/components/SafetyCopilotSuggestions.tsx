// SakhiShield — Safety Copilot Suggestions
// Context-aware suggestion chips dynamically adapted to current transit state.

import React from 'react';
import type { SafetyContext } from '../types/safetyCopilot.types';
import { COPILOT_DEFAULT_SUGGESTIONS } from '../constants/safetyCopilot.constants';

interface SafetyCopilotSuggestionsProps {
  context: SafetyContext;
  onSelectSuggestion: (prompt: string) => void;
  disabled?: boolean;
}

export const SafetyCopilotSuggestions: React.FC<SafetyCopilotSuggestionsProps> = ({
  context,
  onSelectSuggestion,
  disabled,
}) => {
  const isLive = Boolean(context.journey && context.journey.isLive);
  const isPendingCheckin = Boolean(context.checkIn?.isPending);
  const isElevated = (context.risk?.score ?? 10) >= 40 || context.risk?.level !== 'SAFE';

  let list = COPILOT_DEFAULT_SUGGESTIONS.NO_JOURNEY;
  if (isPendingCheckin) {
    list = COPILOT_DEFAULT_SUGGESTIONS.PENDING_CHECKIN;
  } else if (isElevated) {
    list = COPILOT_DEFAULT_SUGGESTIONS.ELEVATED_RISK;
  } else if (isLive) {
    list = COPILOT_DEFAULT_SUGGESTIONS.ACTIVE_JOURNEY;
  }

  return (
    <div className="py-2">
      <div className="font-mono text-[10px] text-[#78716C] uppercase tracking-wider mb-2">
        Recommended Safety Queries:
      </div>
      <div className="flex flex-wrap gap-2">
        {list.map((item, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => onSelectSuggestion(item.prompt)}
            disabled={disabled}
            className="px-3 py-1.5 rounded-full border border-[#1C1917]/12 bg-white/80 text-xs font-mono font-medium text-[#1C1917] hover:border-[#1C1917]/30 hover:bg-[#FFE5BF]/40 transition-all text-left cursor-pointer disabled:opacity-50 shadow-2xs"
          >
            {item.label}
          </button>
        ))}
      </div>
    </div>
  );
};
