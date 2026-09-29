// SakhiShield — Settings Page
// Renders the Settings module inside the standard SakhiShield AppShell layout.

import React from 'react';
import { AppShell } from '../components/app/AppShell';
import { SettingsDashboard } from '../features/settings';

export const SettingsPage: React.FC = () => {
  return (
    <AppShell
      title="Settings"
      subtitle="Application preferences"
    >
      <SettingsDashboard />
    </AppShell>
  );
};

export default SettingsPage;
