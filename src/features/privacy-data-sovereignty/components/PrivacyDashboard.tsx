// SakhiShield — Privacy & Data Sovereignty Master Dashboard
// Implements full ephemeral GPS window configuration, local parsing sovereignty, evidence auto-purge, and audit tracking.

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ShieldCheck, CheckCircle2, AlertCircle } from 'lucide-react';
import { useAuth } from '../../../lib/AuthContext';
import { useApp } from '../../../lib/AppContext';
import { usePrivacySettings } from '../hooks/usePrivacySettings';
import { EphemeralGpsCard } from './EphemeralGpsCard';
import { EvidenceRetentionCard } from './EvidenceRetentionCard';
import { LocalProcessingCard } from './LocalProcessingCard';
import { DataSharingCard } from './DataSharingCard';
import { PrivacyAuditLog } from './PrivacyAuditLog';
import { DataExportModal } from './DataExportModal';
import { DataDeletionModal } from './DataDeletionModal';

export const PrivacyDashboard: React.FC = () => {
  const { user: authUser } = useAuth();
  const { user } = useApp();

  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isDeletionModalOpen, setIsDeletionModalOpen] = useState(false);

  const {
    preferences,
    auditEvents,
    isLoading,
    isSaving,
    isPurging,
    feedback,
    updatePreferences,
    runPurge,
    exportData,
    deleteTargetedData,
    refreshLogs,
  } = usePrivacySettings(
    authUser?.id || 'usr_current',
    {
      fullName: user.fullName || authUser?.name || 'User',
      email: user.email || authUser?.email || '',
      phone: user.phone || authUser?.phone,
    },
    user.trustedContacts.length
  );

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* 1. Navigation Breadcrumb + Pipeline Status Badge */}
      <div className="flex items-center justify-between pb-1">
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-[#57534E] hover:text-[#1C1917] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>BACK TO DASHBOARD</span>
        </Link>
        <span className="font-mono text-xs px-2.5 py-0.5 bg-[#FFF2DB] border border-[#1C1917]/15 rounded text-[#1C1917] font-bold">
          PRIVACY RULES PIPELINE
        </span>
      </div>

      {/* 2. Top Sovereign Policy Status Banner */}
      <div className="p-5 rounded-2xl border border-[#1C1917]/15 bg-[#FFF2DB]/60 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-2xs">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-[#FFE5BF] border border-[#1C1917]/15 flex items-center justify-center text-[#1C1917] shrink-0">
            <ShieldCheck className="w-6 h-6 text-emerald-800" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-serif text-xl sm:text-2xl text-[#1C1917] font-bold">
                Zero-Knowledge Privacy Architecture
              </h2>
            </div>
            <p className="font-sans text-xs text-[#57534E]">
              Your coordinates, private incident files, and identity remain sovereign to this client session.
            </p>
          </div>
        </div>

        {/* Fact-based Status Pills */}
        <div className="flex items-center gap-2 font-mono text-[11px] flex-wrap">
          <div className="px-3 py-1.5 rounded-lg bg-[#FFFAF3] border border-[#1C1917]/15 text-[#1C1917] font-semibold">
            GPS: <span className="text-emerald-700">{preferences.gpsRetention.replace('_', ' ')}</span>
          </div>
          <div className="px-3 py-1.5 rounded-lg bg-[#FFFAF3] border border-[#1C1917]/15 text-[#1C1917] font-semibold">
            VAULT: <span className="text-emerald-700">{preferences.evidenceRetention.replace('_', ' ')}</span>
          </div>
          <div className="px-3 py-1.5 rounded-lg bg-[#FFFAF3] border border-[#1C1917]/15 text-[#1C1917] font-semibold">
            PARSING: <span className="text-emerald-700">{preferences.localParsingEnforced ? 'LOCAL ONLY' : 'STANDARD'}</span>
          </div>
        </div>
      </div>

      {/* 3. Feedback Banner */}
      {feedback && (
        <div
          className={`p-3 rounded-xl border flex items-center gap-2.5 text-xs font-mono font-bold ${
            feedback.type === 'success'
              ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
              : 'bg-red-50 border-red-300 text-red-950'
          }`}
        >
          {feedback.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-red-700 shrink-0" />
          )}
          <span>{feedback.message}</span>
        </div>
      )}

      {/* 4. Core Privacy Cards Stack */}
      <div className="space-y-6">
        <EphemeralGpsCard
          preferences={preferences}
          onUpdate={updatePreferences}
          onPurge={runPurge}
          isPurging={isPurging}
          disabled={isLoading || isSaving}
        />

        <EvidenceRetentionCard
          preferences={preferences}
          onUpdate={updatePreferences}
          disabled={isLoading || isSaving}
        />

        <LocalProcessingCard
          preferences={preferences}
          onUpdate={updatePreferences}
          disabled={isLoading || isSaving}
        />

        <DataSharingCard
          preferences={preferences}
          onUpdate={updatePreferences}
          onOpenExportModal={() => setIsExportModalOpen(true)}
          onOpenDeletionModal={() => setIsDeletionModalOpen(true)}
          disabled={isLoading || isSaving}
        />

        <PrivacyAuditLog
          events={auditEvents}
          onRefresh={refreshLogs}
        />
      </div>

      {/* 5. Modals */}
      <DataExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        onExport={exportData}
      />

      <DataDeletionModal
        isOpen={isDeletionModalOpen}
        onClose={() => setIsDeletionModalOpen(false)}
        onDeleteTarget={deleteTargetedData}
      />
    </div>
  );
};
