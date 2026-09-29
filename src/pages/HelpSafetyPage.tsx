// SakhiShield — Help & Safety Resources Page
// Renders the Help & Safety Resources module inside the standard SakhiShield AppShell layout.

import React from 'react';
import { AppShell } from '../components/app/AppShell';
import { HelpDashboard } from '../features/help-safety-resources';

export const HelpSafetyPage: React.FC = () => {
  return (
    <AppShell
      title="Help & Safety Resources"
      subtitle="24/7 National Helplines & Guides"
    >
      <HelpDashboard />
    </AppShell>
  );
};

export default HelpSafetyPage;
