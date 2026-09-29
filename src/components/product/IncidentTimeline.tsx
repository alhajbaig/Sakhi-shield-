import React, { useState } from 'react';
import { Lock, FileCheck, Shield, Clock, Paperclip, MapPin, MessageSquare, AlertCircle, Download, CheckCircle2 } from 'lucide-react';

interface IncidentTimelineProps {
  incidentId?: string;
  className?: string;
}

export const IncidentTimeline: React.FC<IncidentTimelineProps> = ({
  incidentId = 'SK-2048',
  className = '',
}) => {
  const [filter, setFilter] = useState<'ALL' | 'GPS' | 'EVIDENCE'>('ALL');
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const events = [
    {
      time: '22:41',
      title: 'Journey deviation detected',
      detail: 'Transit divergence +620m recorded at 28.6139° N, 77.2090° E',
      type: 'GPS',
      badge: 'GPS ANOMALY',
    },
    {
      time: '22:42',
      title: 'Safety check-in triggered',
      detail: 'Discreet 45-second verification dialog displayed to user',
      type: 'CHECK',
      badge: 'CHECK-IN',
    },
    {
      time: '22:43',
      title: 'Trusted contact notified',
      detail: 'Encrypted relay packet dispatched to Guardian 01 (Silent SMS broadcast)',
      type: 'CHECK',
      badge: 'CONTACT RELAY',
    },
    {
      time: '22:44',
      title: 'Evidence added',
      detail: 'User attached 1 screenshot containing threatening digital communication',
      type: 'EVIDENCE',
      badge: 'DIGITAL HARASSMENT',
    },
    {
      time: '22:44',
      title: 'Evidence secured',
      detail: 'Cryptographic SHA-256 seal generated. Tamper-evident bundle committed to vault',
      type: 'EVIDENCE',
      badge: 'VAULT SEALED',
    },
    {
      time: '22:47',
      title: 'User marked safe',
      detail: 'Arrived at registered residence. Session closed by user confirmation PIN',
      type: 'GPS',
      badge: 'RESOLVED',
    },
  ];

  const filteredEvents = events.filter((e) => {
    if (filter === 'ALL') return true;
    if (filter === 'GPS') return e.type === 'GPS';
    if (filter === 'EVIDENCE') return e.type === 'EVIDENCE';
    return true;
  });

  const categories = [
    { name: 'SCREENSHOTS', count: '1 FILE', icon: Paperclip },
    { name: 'GPS EVENTS', count: '42 COORD', icon: MapPin },
    { name: 'TIMESTAMPS', count: 'UTC ATTESTED', icon: Clock },
    { name: 'USER RESPONSES', count: 'LOGGED', icon: MessageSquare },
    { name: 'AI ANALYSIS', count: 'INDICATORS', icon: AlertCircle },
    { name: 'NOTIFICATIONS', count: '1 RELAYED', icon: Shield },
  ];

  const handleExport = () => {
    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 5000);
  };

  return (
    <div className={`border border-[#1C1917]/20 bg-[#FFFAF3] rounded-xl p-5 md:p-7 text-[#1C1917] shadow-sm ${className}`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#1C1917]/15 gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-[#1C1917] text-[#FFFAF3] rounded-lg">
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <span className="font-mono text-xs tracking-widest text-[#78716C] uppercase font-bold">
              ZERO-KNOWLEDGE DOSSIER
            </span>
            <h4 className="font-serif text-2xl text-[#1C1917] flex items-center gap-2">
              INCIDENT #{incidentId}
            </h4>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="inline-flex rounded-lg border border-[#1C1917]/20 p-1 bg-[#FFF2DB]">
          <button
            type="button"
            onClick={() => setFilter('ALL')}
            className={`px-2.5 py-1 rounded text-xs font-mono transition-colors cursor-pointer font-bold ${
              filter === 'ALL' ? 'bg-[#1C1917] text-[#FFFAF3]' : 'text-[#57534E]'
            }`}
          >
            ALL (6)
          </button>
          <button
            type="button"
            onClick={() => setFilter('GPS')}
            className={`px-2.5 py-1 rounded text-xs font-mono transition-colors cursor-pointer font-bold ${
              filter === 'GPS' ? 'bg-[#FFE5BF] text-[#1C1917]' : 'text-[#57534E]'
            }`}
          >
            GPS (2)
          </button>
          <button
            type="button"
            onClick={() => setFilter('EVIDENCE')}
            className={`px-2.5 py-1 rounded text-xs font-mono transition-colors cursor-pointer font-bold ${
              filter === 'EVIDENCE' ? 'bg-[#FFE5BF] text-[#1C1917]' : 'text-[#57534E]'
            }`}
          >
            EVIDENCE (2)
          </button>
        </div>
      </div>

      {/* Structured Chronological Timeline */}
      <div className="my-5 relative pl-5 md:pl-7 border-l-2 border-[#1C1917]/25 space-y-4">
        {filteredEvents.map((evt, idx) => (
          <div key={idx} className="relative">
            {/* Timeline bullet node */}
            <div
              className={`absolute -left-[27px] md:-left-[35px] top-1.5 w-3 h-3 rounded-full border-2 ${
                evt.badge === 'GPS ANOMALY'
                  ? 'bg-[#F62440] border-[#F62440]'
                  : evt.badge === 'RESOLVED'
                  ? 'bg-[#1C1917] border-[#1C1917]'
                  : 'bg-[#FFFAF3] border-[#1C1917]'
              }`}
            />

            <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 mb-1">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs sm:text-sm font-bold text-[#1C1917]">{evt.time}</span>
                <span className="font-sans font-bold text-sm sm:text-base text-[#1C1917]">{evt.title}</span>
              </div>
              <span className="font-mono text-[10px] sm:text-xs font-bold px-2 py-0.5 bg-[#FFF2DB] border border-[#1C1917]/15 rounded text-[#1C1917] self-start sm:self-auto">
                {evt.badge}
              </span>
            </div>
            <p className="font-sans text-xs sm:text-sm text-[#44403C] leading-relaxed">
              {evt.detail}
            </p>
          </div>
        ))}
      </div>

      {/* Category Badges */}
      <div className="pt-4 border-t border-[#1C1917]/15">
        <div className="font-mono text-xs uppercase tracking-wider text-[#1C1917] font-bold mb-3">
          PRESERVED EVIDENCE PILLARS
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {categories.map((cat, i) => {
            const Icon = cat.icon;
            return (
              <div
                key={i}
                className="flex items-center justify-between p-2.5 rounded-lg bg-[#FFF2DB]/60 border border-[#1C1917]/15 text-xs"
              >
                <div className="flex items-center gap-2 font-mono text-xs text-[#1C1917] font-bold">
                  <Icon className="w-3.5 h-3.5 text-[#F62440]" />
                  <span>{cat.name}</span>
                </div>
                <span className="font-mono text-[11px] text-[#78716C] font-semibold">{cat.count}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Interactive Export Action & Toast */}
      <div className="mt-5 pt-4 border-t border-[#1C1917]/15 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <button
          type="button"
          onClick={handleExport}
          className="inline-flex items-center justify-center gap-2 py-2.5 px-4 bg-[#1C1917] text-[#FFFAF3] text-xs font-mono font-bold rounded-lg hover:bg-[#333] transition-colors cursor-pointer"
        >
          <Download className="w-4 h-4" />
          <span>EXPORT ENCRYPTED PDF DOSSIER</span>
        </button>

        <span className="font-mono text-xs text-[#78716C]">
          SHA-256 SEAL: e4b2...19fa
        </span>
      </div>

      {downloadSuccess && (
        <div className="mt-3 p-3 bg-[#FFE5BF] border border-[#1C1917]/20 rounded-lg flex items-center gap-2 font-mono text-xs text-[#1C1917] font-bold">
          <CheckCircle2 className="w-4 h-4 text-[#F62440] shrink-0" />
          <span>✓ Dossier #SK-2048 Prepared. Client-side key verified for export.</span>
        </div>
      )}

      {/* Footer Attestation */}
      <div className="mt-3 pt-2 border-t border-[#1C1917]/10 text-xs font-mono text-[#78716C] flex items-center gap-1.5">
        <FileCheck className="w-4 h-4 text-[#1C1917]" />
        <span>ZERO-KNOWLEDGE ARCHITECTURE • CANNOT BE ACCESSED WITHOUT USER PIN</span>
      </div>
    </div>
  );
};
