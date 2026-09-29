// SakhiShield — Privacy & Data Sovereignty Page
// Renders the Privacy & Data Sovereignty module inside the standard SakhiShield AppShell layout.

import React from 'react';
import { AppShell } from '../components/app/AppShell';
import { PrivacyDashboard } from '../features/privacy-data-sovereignty';

export const PrivacySettingsPage: React.FC = () => {
  return (
    <AppShell
      title="Privacy & Data Sovereignty"
      subtitle="Zero-knowledge settings"
    >
      <PrivacyDashboard />
    </AppShell>
  );
};

export default PrivacySettingsPage;
