// SakhiShield — Evidence Item Card Component
// Displays attached evidence, cryptographic hash, verification trigger, and secure download.

import React from 'react';
import type { EvidenceMetadata } from '../types';
import {
  FileText,
  Image as ImageIcon,
  Video,
  Mic,
  ShieldCheck,
  ShieldAlert,
  HelpCircle,
  Download,
  Trash2,
  RefreshCw,
} from 'lucide-react';

interface EvidenceItemCardProps {
  evidence: EvidenceMetadata;
  onVerify: (evidence: EvidenceMetadata) => void;
  onDelete: (evidenceId: string) => void;
}

export const EvidenceItemCard: React.FC<EvidenceItemCardProps> = ({
  evidence,
  onVerify,
  onDelete,
}) => {
  const getCategoryIcon = () => {
    switch (evidence.category) {
      case 'IMAGE':
      case 'SCREENSHOT':
        return <ImageIcon className="w-4 h-4 text-emerald-700" />;
      case 'VIDEO':
        return <Video className="w-4 h-4 text-purple-700" />;
      case 'AUDIO':
        return <Mic className="w-4 h-4 text-amber-700" />;
      case 'DOCUMENT':
      default:
        return <FileText className="w-4 h-4 text-blue-700" />;
    }
  };

  const getIntegrityBadge = () => {
    switch (evidence.integrityStatus) {
      case 'VERIFIED':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-300">
            <ShieldCheck className="w-3 h-3" />
            SHA-256 INTACT
          </span>
        );
      case 'MODIFIED':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-red-100 text-red-800 border border-red-300">
            <ShieldAlert className="w-3 h-3" />
            MISMATCH DETECTED
          </span>
        );
      case 'UNKNOWN':
      default:
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-mono text-[#78716C] bg-stone-100 px-1.5 py-0.5 rounded">
            <HelpCircle className="w-3 h-3" />
            UNVERIFIED
          </span>
        );
    }
  };

  return (
    <div className="p-3.5 rounded-xl border border-[#1C1917]/10 bg-white flex flex-col justify-between gap-3">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#FFFAF3] border border-[#1C1917]/10 flex items-center justify-center shrink-0 mt-0.5">
            {getCategoryIcon()}
          </div>
          <div>
            <h4 className="font-mono text-xs font-bold text-[#1C1917] truncate max-w-[200px] sm:max-w-[280px]">
              {evidence.sanitizedFileName}
            </h4>
            <p className="font-mono text-[10px] text-[#78716C] mt-0.5">
              {(evidence.fileSizeBytes / 1024).toFixed(1)} KB • {evidence.mimeType}
            </p>
          </div>
        </div>

        <div className="shrink-0">{getIntegrityBadge()}</div>
      </div>

      {evidence.description && (
        <p className="font-sans text-xs text-[#57534E] leading-relaxed bg-[#FFFAF3] p-2 rounded-lg border border-[#1C1917]/5">
          {evidence.description}
        </p>
      )}

      {/* Cryptographic Hash Summary */}
      <div className="p-2 rounded bg-stone-50 border border-stone-200 text-[10px] font-mono text-[#57534E] flex items-center justify-between">
        <span className="truncate max-w-[220px]">
          SHA-256: <strong className="text-[#1C1917]">{evidence.sha256Hash}</strong>
        </span>
        <button
          onClick={() => onVerify(evidence)}
          title="Re-verify file bytes against stored digest"
          className="text-[#78716C] hover:text-[#1C1917] ml-2 shrink-0 cursor-pointer"
        >
          <RefreshCw className="w-3 h-3" />
        </button>
      </div>

      {/* Actions */}
      <div className="pt-2 border-t border-[#1C1917]/10 flex items-center justify-between">
        <span className="font-mono text-[9px] text-[#78716C]">
          Uploaded {new Date(evidence.uploadedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </span>

        <div className="flex items-center gap-2">
          {evidence.downloadUrl && (
            <a
              href={evidence.downloadUrl}
              download={evidence.sanitizedFileName}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-[#FFFAF3] border border-[#1C1917]/15 text-[#1C1917] font-mono text-[10px] font-bold hover:bg-[#FAF6F0]"
            >
              <Download className="w-3 h-3" />
              <span>DOWNLOAD</span>
            </a>
          )}

          <button
            onClick={() => onDelete(evidence.id)}
            title="Delete evidence"
            className="p-1 rounded text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
