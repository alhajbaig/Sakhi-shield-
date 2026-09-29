import React from 'react';
import { AppShell } from '../components/app/AppShell';
import { SafetyStatus } from '../components/dashboard/SafetyStatus';
import { ActiveJourney } from '../components/dashboard/ActiveJourney';
import { QuickActions } from '../components/dashboard/QuickActions';
import { TrustedCircle } from '../components/dashboard/TrustedCircle';
import { RecentIncidents } from '../components/dashboard/RecentIncidents';
import { CopilotPreview } from '../components/dashboard/CopilotPreview';
import { DigitalSafetyPreview } from '../components/dashboard/DigitalSafetyPreview';
import { SafetySnapshot } from '../components/dashboard/SafetySnapshot';
import { EmergencyAction } from '../components/dashboard/EmergencyAction';

export const DashboardPage: React.FC = () => {
  return (
    <AppShell>
      <div className="space-y-6 sm:space-y-8">
        
        {/* LEVEL 1: Primary Safety Status (Immediate Answer: AM I SAFE?) */}
        <SafetyStatus />

        {/* LEVEL 2: Active Journey & Quick Actions (Immediate Answer: WHAT IS HAPPENING RIGHT NOW?) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7">
            <ActiveJourney />
          </div>
          <div className="lg:col-span-5">
            <QuickActions />
          </div>
        </div>

        {/* LEVEL 3: Trusted Circle & Recent Incidents (Immediate Answer: WHO CAN HELP ME?) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-6">
            <TrustedCircle />
          </div>
          <div className="lg:col-span-6">
            <RecentIncidents />
          </div>
        </div>

        {/* LEVEL 4: Safety Copilot Entry Point (Immediate Answer: WHAT CAN I DO?) */}
        <CopilotPreview />

        {/* LEVEL 5: Digital Safety & Safety Snapshot */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7">
            <DigitalSafetyPreview />
          </div>
          <div className="lg:col-span-5">
            <SafetySnapshot />
          </div>
        </div>

        {/* LEVEL 6: Persistent Emergency Action Control */}
        <EmergencyAction />

      </div>
    </AppShell>
  );
};

export default DashboardPage;
