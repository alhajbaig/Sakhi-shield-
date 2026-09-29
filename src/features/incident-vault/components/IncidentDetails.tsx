// SakhiShield — Incident Details View Component
// Full incident view with evidence uploader, evidence list, timeline, and export/share controls.

import React, { useState } from 'react';
import type { IncidentRecord, EvidenceMetadata, IncidentTimelineEvent } from '../types';
import { INCIDENT_CATEGORIES_CONFIG, INCIDENT_SEVERITY_CONFIG, INCIDENT_STATUS_CONFIG } from '../constants/incidentVault.constants';
import { EvidenceItemCard } from './EvidenceItemCard';
import { SecureShareModal } from './SecureShareModal';
import {
  Calendar,
  MapPin,
  Upload,
  Share2,
  Download,
  Trash2,
  ArrowLeft,
  Info,
} from 'lucide-react';

interface IncidentDetailsProps {
  incident: IncidentRecord;
  evidenceList: EvidenceMetadata[];
  timelineEvents: IncidentTimelineEvent[];
  isUploading: boolean;
  onBack: () => void;
  onUpdateStatus: (newStatus: IncidentRecord['status']) => void;
  onDeleteIncident: () => void;
  onAttachEvidence: (file: File, description?: string) => Promise<any>;
  onDeleteEvidence: (evidenceId: string) => Promise<any>;
  onVerifyIntegrity: (evidence: EvidenceMetadata) => void;
  onCreateShare: (scope: any, hours: number) => Promise<any>;
  onExport: () => void;
}

export const IncidentDetails: React.FC<IncidentDetailsProps> = ({
  incident,
  evidenceList,
  timelineEvents,
  isUploading,
  onBack,
  onUpdateStatus,
  onDeleteIncident,
  onAttachEvidence,
  onDeleteEvidence,
  onVerifyIntegrity,
  onCreateShare,
  onExport,
}) => {
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [evidenceDescription, setEvidenceDescription] = useState('');
  const [fileToUpload, setFileToUpload] = useState<File | null>(null);

  const catConfig = INCIDENT_CATEGORIES_CONFIG[incident.category] || INCIDENT_CATEGORIES_CONFIG.OTHER;
  const sevConfig = INCIDENT_SEVERITY_CONFIG[incident.severity] || INCIDENT_SEVERITY_CONFIG.LOW;

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fileToUpload) return;
    await onAttachEvidence(fileToUpload, evidenceDescription);
    setFileToUpload(null);
    setEvidenceDescription('');
  };

  return (
    <div className="space-y-6">
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#1C1917]/10">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1.5 font-mono text-xs font-bold text-[#1C1917] hover:text-[#78716C] transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>BACK TO ALL INCIDENTS</span>
        </button>

        <div className="flex flex-wrap items-center gap-2">
          {/* Status selector */}
          <select
            value={incident.status}
            onChange={(e) => onUpdateStatus(e.target.value as any)}
            className="px-3 py-1.5 rounded-lg border border-[#1C1917]/20 bg-white font-mono text-xs font-bold text-[#1C1917]"
          >
            {Object.entries(INCIDENT_STATUS_CONFIG).map(([k, cfg]) => (
              <option key={k} value={k}>
                STATUS: {cfg.label.toUpperCase()}
              </option>
            ))}
          </select>

          <button
            onClick={() => setIsShareModalOpen(true)}
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-[#1C1917]/20 bg-white font-mono text-xs font-bold text-[#1C1917] hover:bg-[#FAF6F0] cursor-pointer"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>SHARE</span>
          </button>

          <button
            onClick={onExport}
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-[#1C1917]/20 bg-white font-mono text-xs font-bold text-[#1C1917] hover:bg-[#FAF6F0] cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>EXPORT JSON</span>
          </button>

          <button
            onClick={onDeleteIncident}
            title="Delete this incident and its attached evidence"
            className="p-1.5 rounded-lg text-red-600 hover:bg-red-50 cursor-pointer"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Incident Summary Card */}
      <div className="p-6 rounded-2xl border border-[#1C1917]/15 bg-[#FFFAF3] shadow-xs space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase border ${catConfig.badgeColor}`}>
            {catConfig.label}
          </span>
          <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase border ${sevConfig.color}`}>
            {sevConfig.label} SEVERITY
          </span>
          <span className="font-mono text-xs text-[#78716C] ml-auto">
            ID: #{incident.id}
          </span>
        </div>

        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#1C1917]">
          {incident.title}
        </h1>

        <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-[#57534E]">
          <span className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-[#A8A29E]" />
            {new Date(incident.incidentDate).toLocaleString([], {
              dateStyle: 'medium',
              timeStyle: 'short',
            })}
          </span>

          {incident.location?.name && (
            <span className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-[#A8A29E]" />
              {incident.location.name}
            </span>
          )}
        </div>

        <div className="p-4 rounded-xl bg-white border border-[#1C1917]/10 text-sm font-sans text-[#1C1917] leading-relaxed">
          {incident.description}
        </div>

        {incident.notes && (
          <div className="text-xs text-[#57534E] flex items-start gap-1.5">
            <Info className="w-3.5 h-3.5 text-[#78716C] shrink-0 mt-0.5" />
            <p>
              <strong className="font-mono text-[#1C1917]">Private Notes: </strong>
              {incident.notes}
            </p>
          </div>
        )}
      </div>

      {/* Grid: Evidence Uploader/List + Timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Evidence Column (2 cols) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-[#1C1917]/10">
            <h3 className="font-serif text-lg font-bold text-[#1C1917]">
              Attached Evidence ({evidenceList.length})
            </h3>
            <span className="font-mono text-[10px] text-[#78716C]">
              SHA-256 INTEGRITY VERIFIED
            </span>
          </div>

          {/* Upload Form */}
          <form
            onSubmit={handleUploadSubmit}
            className="p-4 rounded-xl border border-dashed border-[#1C1917]/25 bg-white space-y-3"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <input
                type="file"
                required
                onChange={(e) => setFileToUpload(e.target.files?.[0] || null)}
                className="font-mono text-xs text-[#57534E] file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border file:border-[#1C1917]/20 file:text-xs file:font-mono file:font-bold file:bg-[#1C1917] file:text-[#FFFAF3] hover:file:bg-[#333]"
              />

              <button
                type="submit"
                disabled={!fileToUpload || isUploading}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#1C1917] text-[#FFFAF3] font-mono text-xs font-bold hover:bg-[#333] transition-colors disabled:opacity-50 shrink-0 cursor-pointer"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>{isUploading ? 'HASHING & UPLOADING...' : 'ATTACH EVIDENCE'}</span>
              </button>
            </div>

            {fileToUpload && (
              <input
                type="text"
                value={evidenceDescription}
                onChange={(e) => setEvidenceDescription(e.target.value)}
                placeholder="Optional description of this evidence item (e.g. Plate number, audio memo)..."
                className="w-full px-3 py-1.5 rounded-lg border border-[#1C1917]/15 bg-[#FFFAF3] font-sans text-xs text-[#1C1917]"
              />
            )}
          </form>

          {/* Evidence Items */}
          {evidenceList.length === 0 ? (
            <div className="p-8 text-center bg-white rounded-xl border border-[#1C1917]/10">
              <p className="font-sans text-xs text-[#57534E]">
                No files attached to this incident yet. Attach audio, photos, or documents above.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {evidenceList.map((evd) => (
                <EvidenceItemCard
                  key={evd.id}
                  evidence={evd}
                  onVerify={onVerifyIntegrity}
                  onDelete={onDeleteEvidence}
                />
              ))}
            </div>
          )}
        </div>

        {/* Timeline Column (1 col) */}
        <div className="space-y-4">
          <div className="pb-2 border-b border-[#1C1917]/10 flex items-center justify-between">
            <h3 className="font-serif text-lg font-bold text-[#1C1917]">
              Incident History
            </h3>
            <span className="font-mono text-[10px] text-[#78716C]">
              AUDIT CHRONOLOGY
            </span>
          </div>

          <div className="p-4 rounded-xl border border-[#1C1917]/10 bg-white space-y-3">
            {timelineEvents.map((evt) => (
              <div key={evt.id} className="relative pl-5 border-l-2 border-[#1C1917]/15 pb-3 last:pb-0">
                <div className="absolute -left-[5px] top-1 w-2 h-2 rounded-full bg-[#1C1917]" />
                <span className="font-mono text-[9px] text-[#78716C] block">
                  {new Date(evt.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', month: 'short', day: 'numeric' })}
                </span>
                <h5 className="font-mono text-xs font-bold text-[#1C1917] mt-0.5">
                  {evt.title}
                </h5>
                <p className="font-sans text-[11px] text-[#57534E] leading-relaxed mt-0.5">
                  {evt.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Share Modal */}
      <SecureShareModal
        isOpen={isShareModalOpen}
        incidentTitle={incident.title}
        onClose={() => setIsShareModalOpen(false)}
        onCreateShare={onCreateShare}
      />
    </div>
  );
};
