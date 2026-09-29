// SakhiShield — Data Export Modal

import React, { useState } from 'react';
import { Download, X, ShieldCheck, Check } from 'lucide-react';

interface DataExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onExport: () => Promise<void>;
}

export const DataExportModal: React.FC<DataExportModalProps> = ({
  isOpen,
  onClose,
  onExport,
}) => {
  const [isExporting, setIsExporting] = useState(false);
  const [downloaded, setDownloaded] = useState(false);

  if (!isOpen) return null;

  const handleExport = async () => {
    setIsExporting(true);
    try {
      await onExport();
      setDownloaded(true);
      setTimeout(() => {
        setDownloaded(false);
        onClose();
      }, 2000);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#1C1917]/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-[#FFFAF3] border border-[#1C1917]/20 rounded-2xl p-6 sm:p-8 max-w-lg w-full shadow-2xl relative space-y-5">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 text-[#78716C] hover:text-[#1C1917] rounded-lg cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-[#FFF2DB] border border-[#1C1917]/15 flex items-center justify-center text-[#1C1917]">
            <Download className="w-6 h-6" />
          </div>
          <div>
            <span className="font-mono text-[10px] uppercase tracking-wider text-[#78716C] font-bold block">
              PORTABLE DATA PACKAGE
            </span>
            <h3 className="font-serif text-2xl text-[#1C1917] font-bold">
              Export Sovereign Dossier
            </h3>
          </div>
        </div>

        <p className="font-sans text-xs text-[#57534E] leading-relaxed">
          Generate a standardized, machine-readable JSON archive containing all safety settings, trusted circle configurations, and incident metadata stored in your SakhiShield vault.
        </p>

        <div className="p-4 bg-[#FFF2DB]/60 border border-[#1C1917]/10 rounded-xl space-y-2 text-xs font-mono text-[#57534E]">
          <div className="flex items-center gap-2 font-bold text-[#1C1917]">
            <ShieldCheck className="w-4 h-4 text-emerald-700" />
            <span>Cryptographic Integrity Verification</span>
          </div>
          <p className="font-sans text-[11px] leading-relaxed">
            The exported package includes an authenticated SHA-256 digital fingerprint calculated directly from the file stream so you can mathematically verify the dossier was not altered.
          </p>
        </div>

        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 border border-[#1C1917]/20 rounded-xl font-mono text-xs font-bold text-[#57534E] hover:text-[#1C1917] cursor-pointer"
          >
            CANCEL
          </button>

          <button
            type="button"
            onClick={handleExport}
            disabled={isExporting}
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#1C1917] text-[#FFFAF3] rounded-xl font-mono text-xs font-bold hover:bg-[#333] transition-colors cursor-pointer disabled:opacity-50"
          >
            {downloaded ? (
              <>
                <Check className="w-4 h-4 text-emerald-400" />
                <span>DOSSIER DOWNLOADED</span>
              </>
            ) : isExporting ? (
              <span>PREPARING EXPORT...</span>
            ) : (
              <>
                <Download className="w-4 h-4" />
                <span>GENERATE & DOWNLOAD</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
