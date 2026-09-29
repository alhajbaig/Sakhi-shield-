import React, { useState } from 'react';
import { ShieldCheck, Compass, Users, Share2, AlertTriangle, FileText, ChevronRight, CheckCircle2 } from 'lucide-react';

export type CopilotMode = 'SAFE' | 'UNCOMFORTABLE' | 'EMERGENCY';

interface CopilotPanelProps {
  initialMode?: CopilotMode;
  className?: string;
}

export const CopilotPanel: React.FC<CopilotPanelProps> = ({ initialMode = 'UNCOMFORTABLE', className = '' }) => {
  const [activeMode, setActiveMode] = useState<CopilotMode>(initialMode);
  const [activeActionFeedback, setActiveActionFeedback] = useState<string | null>(null);

  const handleAction = (name: string, result: string) => {
    setActiveActionFeedback(`Engaged: ${name} — ${result}`);
  };

  return (
    <div className={`border border-[#1C1917]/20 bg-[#FFFAF3] rounded-xl p-5 md:p-7 text-[#1C1917] shadow-sm ${className}`}>
      {/* Header with Mode Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#1C1917]/15 gap-3">
        <div>
          <span className="font-mono text-xs tracking-widest text-[#78716C] uppercase font-bold">
            COPILOT ACTION MATRIX
          </span>
          <h4 className="font-serif text-2xl text-[#1C1917]">Interactive Action Guidance</h4>
        </div>

        {/* 3-State selector */}
        <div className="inline-flex rounded-lg border border-[#1C1917]/20 p-1 bg-[#FFF2DB]">
          <button
            type="button"
            onClick={() => { setActiveMode('SAFE'); setActiveActionFeedback(null); }}
            className={`px-3 py-1.5 rounded text-xs font-mono transition-colors cursor-pointer font-bold ${
              activeMode === 'SAFE'
                ? 'bg-[#1C1917] text-[#FFFAF3]'
                : 'text-[#57534E] hover:text-[#1C1917]'
            }`}
          >
            1. SAFE
          </button>
          <button
            type="button"
            onClick={() => { setActiveMode('UNCOMFORTABLE'); setActiveActionFeedback(null); }}
            className={`px-3 py-1.5 rounded text-xs font-mono transition-colors cursor-pointer font-bold ${
              activeMode === 'UNCOMFORTABLE'
                ? 'bg-[#FFE5BF] text-[#1C1917] border border-[#1C1917]/20'
                : 'text-[#57534E] hover:text-[#1C1917]'
            }`}
          >
            2. UNCOMFORTABLE
          </button>
          <button
            type="button"
            onClick={() => { setActiveMode('EMERGENCY'); setActiveActionFeedback(null); }}
            className={`px-3 py-1.5 rounded text-xs font-mono transition-colors cursor-pointer font-bold ${
              activeMode === 'EMERGENCY'
                ? 'bg-[#F62440] text-[#FFFAF3]'
                : 'text-[#57534E] hover:text-[#F62440]'
            }`}
          >
            3. EMERGENCY
          </button>
        </div>
      </div>

      {/* State banner */}
      <div className="py-2.5 px-3.5 my-4 bg-[#FFF2DB] border border-[#1C1917]/15 rounded flex items-center justify-between text-xs sm:text-sm">
        <div className="flex items-center gap-2 font-bold font-mono">
          <span className={`w-2.5 h-2.5 rounded-full ${
            activeMode === 'SAFE' ? 'bg-[#1C1917]' : activeMode === 'UNCOMFORTABLE' ? 'bg-[#D97706]' : 'bg-[#F62440]'
          }`} />
          <span>STATE: {activeMode}</span>
        </div>
        <span className="font-mono text-xs text-[#57534E]">
          {activeMode === 'SAFE' && 'Zero alerts • Passive route verification'}
          {activeMode === 'UNCOMFORTABLE' && 'Proactive assist options queued'}
          {activeMode === 'EMERGENCY' && 'Immediate guardian escalation'}
        </span>
      </div>

      {/* Action Buttons: Clickable with Live Feedback */}
      <div className="space-y-3 my-4">
        {activeMode === 'SAFE' && (
          <>
            <button
              type="button"
              onClick={() => handleAction('Continue Journey', 'Passive monitoring continues along planned corridor')}
              className="w-full p-4 bg-[#FFF2DB]/40 border border-[#1C1917]/15 rounded-lg flex items-center justify-between hover:bg-[#FFE5BF]/40 transition-colors cursor-pointer text-left"
            >
              <div className="flex items-center gap-3">
                <ShieldCheck className="w-5 h-5 text-[#1C1917]" />
                <div>
                  <div className="font-sans font-bold text-sm text-[#1C1917]">Continue Journey</div>
                  <div className="text-xs text-[#57534E]">Passive background monitoring along planned path</div>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-[#78716C]" />
            </button>

            <button
              type="button"
              onClick={() => handleAction('View Route', 'Corridor map displayed with 3 nearby safe hubs')}
              className="w-full p-4 bg-[#FFF2DB]/40 border border-[#1C1917]/15 rounded-lg flex items-center justify-between hover:bg-[#FFE5BF]/40 transition-colors cursor-pointer text-left"
            >
              <div className="flex items-center gap-3">
                <Compass className="w-5 h-5 text-[#1C1917]" />
                <div>
                  <div className="font-sans font-bold text-sm text-[#1C1917]">View Route & Checkpoints</div>
                  <div className="text-xs text-[#57534E]">Inspect next transit milestones and safe hubs</div>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-[#78716C]" />
            </button>
          </>
        )}

        {activeMode === 'UNCOMFORTABLE' && (
          <>
            <button
              type="button"
              onClick={() => handleAction('Find Safe Place', 'Directing to 24/7 Metro Hub & Staffed Pharmacy (320m away)')}
              className="w-full p-4 bg-[#FFE5BF]/60 border border-[#1C1917]/20 rounded-lg flex items-center justify-between hover:bg-[#FFE5BF] transition-colors cursor-pointer text-left"
            >
              <div className="flex items-center gap-3">
                <Compass className="w-5 h-5 text-[#1C1917]" />
                <div>
                  <div className="font-sans font-bold text-sm text-[#1C1917]">Find Safe Place</div>
                  <div className="text-xs text-[#44403C]">Direct route to nearest 24/7 staffed safe haven</div>
                </div>
              </div>
              <span className="font-mono text-xs font-bold px-2 py-0.5 bg-[#1C1917] text-[#FFFAF3] rounded">
                RECOMMENDED
              </span>
            </button>

            <button
              type="button"
              onClick={() => handleAction('Share Location', 'One-time encrypted live link dispatched to primary contact')}
              className="w-full p-4 bg-[#FFF2DB]/60 border border-[#1C1917]/15 rounded-lg flex items-center justify-between hover:bg-[#FFF2DB] transition-colors cursor-pointer text-left"
            >
              <div className="flex items-center gap-3">
                <Share2 className="w-5 h-5 text-[#1C1917]" />
                <div>
                  <div className="font-sans font-bold text-sm text-[#1C1917]">Share Live Location</div>
                  <div className="text-xs text-[#57534E]">Send temporary encrypted tracking link to 1 trusted contact</div>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-[#78716C]" />
            </button>

            <button
              type="button"
              onClick={() => handleAction('Contact Trusted Person', 'Quiet synthetic SMS alert sent to Guardian 01')}
              className="w-full p-4 bg-[#FFF2DB]/60 border border-[#1C1917]/15 rounded-lg flex items-center justify-between hover:bg-[#FFF2DB] transition-colors cursor-pointer text-left"
            >
              <div className="flex items-center gap-3">
                <Users className="w-5 h-5 text-[#1C1917]" />
                <div>
                  <div className="font-sans font-bold text-sm text-[#1C1917]">Quiet Contact Ping</div>
                  <div className="text-xs text-[#57534E]">Quiet synthetic message: "Check in with me in 5 minutes"</div>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-[#78716C]" />
            </button>
          </>
        )}

        {activeMode === 'EMERGENCY' && (
          <>
            <button
              type="button"
              onClick={() => handleAction('Immediate SOS', 'High-priority alert beacon fired to all guardians with live GPS')}
              className="w-full p-4 bg-[#F62440]/10 border border-[#F62440] rounded-lg flex items-center justify-between hover:bg-[#F62440]/20 transition-colors cursor-pointer text-left"
            >
              <div className="flex items-center gap-3">
                <AlertTriangle className="w-5 h-5 text-[#F62440]" />
                <div>
                  <div className="font-sans font-bold text-sm text-[#F62440]">Trigger Immediate SOS</div>
                  <div className="text-xs text-[#1C1917]">High-priority alert beacon to all trusted contacts</div>
                </div>
              </div>
              <span className="font-mono text-xs font-bold text-[#FFFAF3] bg-[#F62440] px-3 py-1 rounded">
                ACTIVE
              </span>
            </button>

            <button
              type="button"
              onClick={() => handleAction('Create Incident Dossier', 'Incident #SK-2048 created and locked in zero-knowledge vault')}
              className="w-full p-4 bg-[#FFF2DB]/60 border border-[#1C1917]/15 rounded-lg flex items-center justify-between hover:bg-[#FFF2DB] transition-colors cursor-pointer text-left"
            >
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-[#1C1917]" />
                <div>
                  <div className="font-sans font-bold text-sm text-[#1C1917]">Package Incident Dossier</div>
                  <div className="text-xs text-[#57534E]">Commit sensor timestamps, audio snippet, and coordinates</div>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-[#78716C]" />
            </button>
          </>
        )}
      </div>

      {/* Live Feedback Toast Box */}
      {activeActionFeedback && (
        <div className="mt-3 p-3 bg-[#FFE5BF] border border-[#1C1917]/20 rounded-lg flex items-center gap-2 font-mono text-xs text-[#1C1917]">
          <CheckCircle2 className="w-4 h-4 text-[#F62440] shrink-0" />
          <span className="font-bold">{activeActionFeedback}</span>
        </div>
      )}

      {/* Footer rule */}
      <div className="mt-4 pt-3 border-t border-[#1C1917]/10 flex items-center justify-between text-xs font-mono text-[#78716C]">
        <span>CLICK ANY ACTION TO SIMULATE RESPONSE</span>
        <span className="font-semibold text-[#1C1917]">USER CONFIRMATION REQUIRED</span>
      </div>
    </div>
  );
};
