// SakhiShield — Safety Copilot Input
// Accessible, responsive query input field with keyboard shortcut and send action.

import React, { useState } from 'react';
import { ArrowUp } from 'lucide-react';

interface SafetyCopilotInputProps {
  onSend: (text: string) => void;
  isLoading: boolean;
  disabled?: boolean;
}

export const SafetyCopilotInput: React.FC<SafetyCopilotInputProps> = ({
  onSend,
  isLoading,
  disabled,
}) => {
  const [text, setText] = useState('');

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    const trimmed = text.trim();
    if (!trimmed || isLoading || disabled) return;
    onSend(trimmed);
    setText('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-3 sm:p-4 border-t border-[#1C1917]/10 bg-white/50">
      <div className="flex items-end gap-2 p-2 rounded-2xl border border-[#1C1917]/15 bg-white shadow-2xs focus-within:border-[#1C1917]/40 transition-all">
        <textarea
          rows={1}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask Safety Copilot (e.g. 'Why did my risk change?', 'What should I do?')..."
          disabled={isLoading || disabled}
          className="flex-1 resize-none bg-transparent font-sans text-xs sm:text-sm text-[#1C1917] placeholder:text-[#A8A29E] focus:outline-hidden py-1 px-1.5 max-h-24 leading-relaxed"
          maxLength={400}
        />

        <button
          type="submit"
          disabled={!text.trim() || isLoading || disabled}
          className="w-9 h-9 rounded-xl bg-[#1C1917] text-[#FFFAF3] hover:bg-[#F62440] disabled:bg-[#E7E5E4] disabled:text-[#A8A29E] transition-all flex items-center justify-center shrink-0 cursor-pointer disabled:cursor-not-allowed shadow-2xs"
          aria-label="Send message"
        >
          {isLoading ? (
            <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <ArrowUp className="w-4 h-4" />
          )}
        </button>
      </div>

      <div className="flex items-center justify-between mt-2 px-1 text-[10px] font-mono text-[#78716C]">
        <span>Press Enter to send • Shift+Enter for new line</span>
        <span>{text.length}/400</span>
      </div>
    </form>
  );
};
