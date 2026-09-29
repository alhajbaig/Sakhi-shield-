// SakhiShield — Digital Safety Root Feature Component
// Assembles header, score, telemetry matrix, client-side tools, and remediation actions.

import React from 'react';
import { useDigitalSafety } from '../hooks/useDigitalSafety';
import { DigitalSafetyHeader } from './DigitalSafetyHeader';
import { SecurityScoreCard } from './SecurityScoreCard';
import { SecurityOverview } from './SecurityOverview';
import { PasswordSecurityCard } from './PasswordSecurityCard';
import { PhishingProtectionCard } from './PhishingProtectionCard';
import { DigitalFootprintCard } from './DigitalFootprintCard';
import { RecommendationCard } from './RecommendationCard';

export const DigitalSafety: React.FC = () => {
  const {
    state,
    refreshAssessment,
    passwordInput,
    passwordResult,
    isCheckingBreach,
    handlePasswordChange,
    handleCheckBreach,
    handleClearPassword,
    urlInput,
    urlResult,
    handleAnalyzeUrl,
  } = useDigitalSafety();

  return (
    <div className="w-full space-y-6 pb-12">
      {/* 1. Header with scope transparency */}
      <DigitalSafetyHeader
        isLoading={state.isLoading}
        onRefresh={refreshAssessment}
        lastAssessedAt={state.lastAssessedAt}
      />

      {/* 2. Deterministic Score Card */}
      <SecurityScoreCard score={state.score} />

      {/* 3. Actionable Remediation Roadmap */}
      {state.recommendations.length > 0 && (
        <RecommendationCard recommendations={state.recommendations} />
      )}

      {/* 4. Active Zero-Knowledge Tools */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PasswordSecurityCard
          input={passwordInput}
          result={passwordResult}
          isCheckingBreach={isCheckingBreach}
          onChange={handlePasswordChange}
          onCheckBreach={handleCheckBreach}
          onClear={handleClearPassword}
        />

        <PhishingProtectionCard
          input={urlInput}
          result={urlResult}
          onChange={handleAnalyzeUrl}
        />
      </div>

      {/* 5. Telemetry Matrix: Observable vs Non-Verifiable */}
      <SecurityOverview checks={state.checks} />

      {/* 6. Digital Footprint & Incident Response Playbook */}
      <DigitalFootprintCard />
    </div>
  );
};
