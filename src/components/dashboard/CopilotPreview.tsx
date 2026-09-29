import React, { useState } from 'react';
import { Sparkles, Compass, Share2, Users, ChevronRight, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export const CopilotPreview: React.FC = () => {
  const [feedback, setFeedback] = useState<string | null>(null);

  const handleAction = (text: string) => {
    setFeedback(`Action triggered: ${text}`);
    setTimeout(() => setFeedback(null), 3500);
  };

  return (
    <div className="p-5 sm:p-6 rounded-2xl border border-[#1C1917]/15 bg-[#FFF2DB]/60 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 mb-4 border-b border-[#1C1917]/10 gap-2">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[#F62440]" />
          <h3 className="font-mono text-xs uppercase tracking-wider font-bold text-[#1C1917]">
            SAFETY COPILOT
          </h3>
        </div>
        <span className="font-mono text-[10px] text-[#78716C]">
          DECISION SUPPORT
        </span>
      </div>

      <div className="mb-4">
        <h4 className="font-serif text-xl sm:text-2xl text-[#1C1917] font-bold mb-1">
          Need help deciding what to do?
        </h4>
        <p className="font-sans text-xs sm:text-sm text-[#57534E]">
          Safety Copilot helps you choose discrete, context-aware actions without setting off panic.
        </p>
      </div>

      {/* Quick Action Chips */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 my-3">
        <button
          type="button"
          onClick={() => handleAction('Nearest 24/7 staffed safe haven displayed on map')}
          className="p-3 bg-[#FFFAF3] border border-[#1C1917]/15 rounded-xl hover:bg-[#FFE5BF] transition-colors cursor-pointer text-left flex items-center gap-2.5"
        >
          <Compass className="w-4 h-4 text-[#1C1917] shrink-0" />
          <div>
            <div className="font-mono text-xs font-bold text-[#1C1917]">Find Safe Place</div>
            <div className="text-[10px] text-[#78716C] font-sans">Open commercial havens</div>
          </div>
        </button>

        <button
          type="button"
          onClick={() => handleAction('Temporary 1-hour coordinate broadcast link created')}
          className="p-3 bg-[#FFFAF3] border border-[#1C1917]/15 rounded-xl hover:bg-[#FFE5BF] transition-colors cursor-pointer text-left flex items-center gap-2.5"
        >
          <Share2 className="w-4 h-4 text-[#1C1917] shrink-0" />
          <div>
            <div className="font-mono text-xs font-bold text-[#1C1917]">Share Location</div>
            <div className="text-[10px] text-[#78716C] font-sans">Encrypted 1-time link</div>
          </div>
        </button>

        <button
          type="button"
          onClick={() => handleAction('Discreet synthetic check-in ping sent to Mother')}
          className="p-3 bg-[#FFFAF3] border border-[#1C1917]/15 rounded-xl hover:bg-[#FFE5BF] transition-colors cursor-pointer text-left flex items-center gap-2.5"
        >
          <Users className="w-4 h-4 text-[#1C1917] shrink-0" />
          <div>
            <div className="font-mono text-xs font-bold text-[#1C1917]">Quiet Contact Ping</div>
            <div className="text-[10px] text-[#78716C] font-sans">Non-alarming check-in</div>
          </div>
        </button>
      </div>

      {feedback && (
        <div className="p-2.5 bg-emerald-50 border border-emerald-300 rounded-lg flex items-center gap-2 text-xs font-mono text-emerald-900 my-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{feedback}</span>
        </div>
      )}

      <div className="pt-3 border-t border-[#1C1917]/10 flex items-center justify-between mt-4">
        <Link
          to="/safety-copilot"
          className="font-mono text-xs font-bold text-[#1C1917] hover:text-[#F62440] transition-colors flex items-center gap-1 cursor-pointer"
        >
          <span>OPEN SAFETY COPILOT</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </Link>
        <span className="font-mono text-[10px] text-[#78716C]">ACTION SYSTEM • NOT A CHATBOT</span>
      </div>
    </div>
  );
};
