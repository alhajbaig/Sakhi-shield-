import React, { useState } from 'react';
import { ScanText, AlertCircle, Save, FolderPlus, ArrowRight, CheckCircle2 } from 'lucide-react';

interface DigitalAnalysisPanelProps {
  className?: string;
}

export const DigitalAnalysisPanel: React.FC<DigitalAnalysisPanelProps> = ({ className = '' }) => {
  const sampleMessages = [
    {
      id: 1,
      name: 'Sample 01: Hostile Threat',
      text: '“I know where you live. Don\'t ignore me.”',
      status: 'POTENTIAL THREATENING COMMUNICATION',
      isThreat: true,
      indicators: [
        { label: 'THREATENING LANGUAGE', status: 'DETECTED' },
        { label: 'INTIMIDATION PATTERN', status: 'DETECTED' },
        { label: 'PERSONAL-LOCATION REFERENCE', status: 'FLAGGED' },
      ],
    },
    {
      id: 2,
      name: 'Sample 02: Stalking / Presence',
      text: '“I am standing outside your gate right now.”',
      status: 'PHYSICAL PRESENCE INTIMIDATION',
      isThreat: true,
      indicators: [
        { label: 'IMMEDIATE PROXIMITY CLAIM', status: 'DETECTED' },
        { label: 'UNSOLICITED CONTACT', status: 'DETECTED' },
        { label: 'COERCIVE INTIMIDATION', status: 'FLAGGED' },
      ],
    },
    {
      id: 3,
      name: 'Sample 03: Normal Transit Check',
      text: '“Hey! Let me know as soon as you get home safe.”',
      status: 'BENIGN COMMUNICATION',
      isThreat: false,
      indicators: [
        { label: 'THREATENING LANGUAGE', status: 'NONE' },
        { label: 'INTIMIDATION PATTERN', status: 'NONE' },
        { label: 'HOSTILE INTENT', status: 'CLEARED' },
      ],
    },
  ];

  const [selectedSample, setSelectedSample] = useState(0);
  const [evidenceCount, setEvidenceCount] = useState(1);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const activeMsg = sampleMessages[selectedSample];

  const handleSave = (type: string) => {
    setEvidenceCount((prev) => prev + 1);
    setToastMessage(`✓ ${type} saved to Incident #SK-2048 (Total Items: ${evidenceCount + 1})`);
    setTimeout(() => setToastMessage(null), 4000);
  };

  return (
    <div className={`border border-[#1C1917]/20 bg-[#FFFAF3] rounded-xl p-5 md:p-7 text-[#1C1917] shadow-sm ${className}`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#1C1917]/15 gap-2">
        <div>
          <span className="font-mono text-xs tracking-widest text-[#78716C] uppercase font-bold">
            DIGITAL THREAT TELEMETRY
          </span>
          <h4 className="font-serif text-2xl text-[#1C1917]">Interactive Threat Analysis</h4>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs px-3 py-1 bg-[#1C1917] text-[#FFFAF3] rounded font-bold">
            VAULT EVIDENCE: {evidenceCount}
          </span>
        </div>
      </div>

      {/* Visual Pipeline Strip */}
      <div className="py-3 my-4 bg-[#FFF2DB] border border-[#1C1917]/15 rounded-lg px-4">
        <div className="flex flex-wrap items-center justify-between gap-1 text-xs font-mono text-[#44403C] font-semibold">
          <span className="text-[#1C1917]">01 SCREENSHOT</span>
          <ArrowRight className="w-3.5 h-3.5 text-[#78716C] shrink-0" />
          <span className="text-[#1C1917]">02 OCR EXTRACTION</span>
          <ArrowRight className="w-3.5 h-3.5 text-[#78716C] shrink-0" />
          <span className="text-[#1C1917]">03 TEXT PARSER</span>
          <ArrowRight className="w-3.5 h-3.5 text-[#78716C] shrink-0" />
          <span className="text-[#1C1917]">04 AI ANALYSIS</span>
          <ArrowRight className="w-3.5 h-3.5 text-[#78716C] shrink-0" />
          <span className="text-[#F62440] font-bold">05 SAFETY SIGNALS</span>
        </div>
      </div>

      {/* Sample Switcher Tabs */}
      <div className="my-3">
        <div className="font-mono text-xs text-[#57534E] mb-1.5 font-semibold">
          TEST INTERACTIVE SAMPLE:
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {sampleMessages.map((s, idx) => (
            <button
              key={s.id}
              type="button"
              onClick={() => setSelectedSample(idx)}
              className={`p-2.5 rounded-lg border text-left text-xs font-mono transition-colors cursor-pointer font-medium ${
                selectedSample === idx
                  ? 'border-[#1C1917] bg-[#FFE5BF] text-[#1C1917] font-bold'
                  : 'border-[#1C1917]/15 bg-[#FFF2DB]/50 text-[#57534E] hover:bg-[#FFF2DB]'
              }`}
            >
              {s.name}
            </button>
          ))}
        </div>
      </div>

      {/* Extracted Sample and Detected Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
        {/* Left: OCR Extracted Text */}
        <div className="border border-[#1C1917]/15 bg-[#FFF2DB]/40 p-4 rounded-lg flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs font-mono text-[#78716C] mb-2 pb-1.5 border-b border-[#1C1917]/10 font-semibold">
              <span className="flex items-center gap-1.5 text-[#1C1917]">
                <ScanText className="w-4 h-4 text-[#1C1917]" />
                EXTRACTED TEXT [OCR 99.4%]
              </span>
              <span>22:04</span>
            </div>

            <div className="p-4 bg-[#FFFAF3] border border-[#1C1917]/15 rounded-lg font-sans text-base italic text-[#1C1917] leading-relaxed my-2 shadow-xs">
              {activeMsg.text}
            </div>
          </div>

          <div className="mt-3 font-mono text-xs text-[#78716C] flex items-center justify-between pt-2 border-t border-[#1C1917]/10">
            <span>SOURCE: DIRECT MESSAGE</span>
            <span>HASH: 7b2f...89e1</span>
          </div>
        </div>

        {/* Right: Heuristic Analysis Output */}
        <div className={`border p-4 rounded-lg flex flex-col justify-between ${
          activeMsg.isThreat ? 'border-[#F62440]/40 bg-[#FFF2DB]/80' : 'border-[#1C1917]/20 bg-[#FFF2DB]/40'
        }`}>
          <div>
            <div className="flex items-center justify-between text-xs font-mono mb-2 pb-1.5 border-b border-[#1C1917]/10 font-bold">
              <span className={`flex items-center gap-1.5 ${activeMsg.isThreat ? 'text-[#F62440]' : 'text-[#1C1917]'}`}>
                <AlertCircle className="w-4 h-4" />
                {activeMsg.status}
              </span>
              <span className="text-[#78716C]">ON-DEVICE</span>
            </div>

            <div className="space-y-2 my-3">
              {activeMsg.indicators.map((ind, i) => (
                <div key={i} className="flex items-center justify-between text-xs px-3 py-1.5 bg-[#FFFAF3] border border-[#1C1917]/15 rounded font-mono">
                  <span className="text-[#1C1917] font-semibold">{ind.label}</span>
                  <span className={`font-bold ${ind.status === 'DETECTED' || ind.status === 'FLAGGED' ? 'text-[#F62440]' : 'text-emerald-700'}`}>
                    {ind.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Action Triggers */}
          <div className="flex gap-2 pt-3 border-t border-[#1C1917]/10">
            <button
              type="button"
              onClick={() => handleSave('Screenshot Evidence')}
              className="flex-1 flex items-center justify-center gap-2 py-2 px-3 bg-[#1C1917] text-[#FFFAF3] text-xs font-mono rounded-lg hover:bg-[#333] transition-colors cursor-pointer font-bold"
            >
              <Save className="w-3.5 h-3.5" />
              SAVE EVIDENCE
            </button>
            <button
              type="button"
              onClick={() => handleSave('Message Threat Indicator')}
              className="flex-1 flex items-center justify-center gap-2 py-2 px-3 bg-[#FFF2DB] border border-[#1C1917]/25 text-[#1C1917] text-xs font-mono rounded-lg hover:bg-[#FFE5BF] transition-colors cursor-pointer font-bold"
            >
              <FolderPlus className="w-3.5 h-3.5 text-[#1C1917]" />
              ADD TO INCIDENT
            </button>
          </div>
        </div>
      </div>

      {/* Live Toast */}
      {toastMessage && (
        <div className="p-3 bg-[#FFE5BF] border border-[#1C1917]/20 rounded-lg flex items-center gap-2 font-mono text-xs text-[#1C1917] font-bold">
          <CheckCircle2 className="w-4 h-4 text-[#F62440] shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Mandatory Disclaimer */}
      <div className="pt-3 border-t border-[#1C1917]/10 flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs font-mono text-[#78716C]">
        <span>IDENTIFIES POTENTIAL SAFETY SIGNALS ONLY. DOES NOT DRAW LEGAL CONCLUSIONS.</span>
        <span className="font-semibold text-[#1C1917]">ON-DEVICE PRIVACY GUARANTEED</span>
      </div>
    </div>
  );
};
