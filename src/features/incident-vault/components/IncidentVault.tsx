// SakhiShield — Incident Vault Root Feature Component
// Assembles filters, creation modal, incident cards list, and detailed evidence view.

import React, { useState } from 'react';
import { useIncidentVault } from '../hooks/useIncidentVault';
import { IncidentCard } from './IncidentCard';
import { IncidentDetails } from './IncidentDetails';
import { CreateIncidentModal } from './CreateIncidentModal';
import { LockKeyhole, Plus, ShieldCheck, Search } from 'lucide-react';
import { INCIDENT_CATEGORIES_CONFIG, INCIDENT_SEVERITY_CONFIG } from '../constants/incidentVault.constants';

export const IncidentVault: React.FC = () => {
  const {
    incidents,
    selectedIncident,
    setSelectedIncident,
    evidenceList,
    timelineEvents,
    filters,
    setFilters,
    isLoading,
    isUploading,
    createIncident,
    updateIncident,
    deleteIncident,
    attachEvidence,
    deleteEvidence,
    verifyIntegrity,
    createShareLink,
    exportIncident,
  } = useIncidentVault();

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // If viewing details of a selected incident
  if (selectedIncident) {
    return (
      <IncidentDetails
        incident={selectedIncident}
        evidenceList={evidenceList}
        timelineEvents={timelineEvents}
        isUploading={isUploading}
        onBack={() => setSelectedIncident(null)}
        onUpdateStatus={(st) => updateIncident(selectedIncident.id, { status: st })}
        onDeleteIncident={() => deleteIncident(selectedIncident.id)}
        onAttachEvidence={attachEvidence}
        onDeleteEvidence={deleteEvidence}
        onVerifyIntegrity={verifyIntegrity}
        onCreateShare={createShareLink}
        onExport={exportIncident}
      />
    );
  }

  return (
    <div className="w-full space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#1C1917]/10 pb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#1C1917] text-[#FFFAF3] flex items-center justify-center">
            <LockKeyhole className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-[10px] tracking-wider uppercase font-bold text-[#F62440]">
                PRIVATE EVIDENCE VAULT
              </span>
              <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-mono bg-emerald-100 text-emerald-800 border border-emerald-300">
                ENCRYPTED STORAGE
              </span>
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl text-[#1C1917] font-bold">
              Incident Documentation Vault
            </h1>
          </div>
        </div>

        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#1C1917] text-[#FFFAF3] font-mono text-xs font-bold hover:bg-[#333] transition-colors self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>RECORD NEW INCIDENT</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-xl border border-[#1C1917]/15 bg-white flex flex-col md:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-[#A8A29E] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={filters.searchQuery || ''}
            onChange={(e) => setFilters((prev) => ({ ...prev, searchQuery: e.target.value }))}
            placeholder="Search incident title, description, or notes..."
            className="w-full pl-9 pr-3 py-2 rounded-lg border border-[#1C1917]/20 bg-[#FFFAF3] font-sans text-xs text-[#1C1917] focus:outline-none focus:border-[#1C1917]"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <select
            value={filters.category || 'ALL'}
            onChange={(e) => setFilters((prev) => ({ ...prev, category: e.target.value as any }))}
            className="px-3 py-2 rounded-lg border border-[#1C1917]/20 bg-white font-mono text-xs text-[#1C1917] focus:outline-none"
          >
            <option value="ALL">ALL CATEGORIES</option>
            {Object.entries(INCIDENT_CATEGORIES_CONFIG).map(([k, cfg]) => (
              <option key={k} value={k}>
                {cfg.label.toUpperCase()}
              </option>
            ))}
          </select>

          <select
            value={filters.severity || 'ALL'}
            onChange={(e) => setFilters((prev) => ({ ...prev, severity: e.target.value as any }))}
            className="px-3 py-2 rounded-lg border border-[#1C1917]/20 bg-white font-mono text-xs text-[#1C1917] focus:outline-none"
          >
            <option value="ALL">ALL SEVERITIES</option>
            {Object.entries(INCIDENT_SEVERITY_CONFIG).map(([k, cfg]) => (
              <option key={k} value={k}>
                {cfg.label.toUpperCase()}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Incidents Grid */}
      {isLoading ? (
        <div className="py-12 text-center">
          <div className="w-8 h-8 border-3 border-[#1C1917]/20 border-t-[#1C1917] rounded-full animate-spin mx-auto mb-3" />
          <p className="font-mono text-xs text-[#78716C]">Accessing encrypted vault records...</p>
        </div>
      ) : incidents.length === 0 ? (
        <div className="py-16 text-center bg-white rounded-2xl border border-[#1C1917]/10 p-6 space-y-3">
          <div className="w-12 h-12 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center mx-auto">
            <ShieldCheck className="w-6 h-6 text-emerald-600" />
          </div>
          <h3 className="font-serif text-xl font-bold text-[#1C1917]">
            No Incidents Recorded
          </h3>
          <p className="font-sans text-xs text-[#57534E] max-w-md mx-auto leading-relaxed">
            Your safety vault is currently clear. When needed, record incidents with photos, audio, or notes here for organized documentation.
          </p>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#1C1917] text-[#FFFAF3] font-mono text-xs font-bold hover:bg-[#333] transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>RECORD FIRST INCIDENT</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {incidents.map((inc) => (
            <IncidentCard
              key={inc.id}
              incident={inc}
              isSelected={false}
              onSelect={setSelectedIncident}
            />
          ))}
        </div>
      )}

      {/* Create Modal */}
      <CreateIncidentModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={async (params) => {
          await createIncident({
            ...params,
            location: params.locationName ? { name: params.locationName } : undefined,
          });
        }}
      />
    </div>
  );
};
