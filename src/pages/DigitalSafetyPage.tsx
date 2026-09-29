// SakhiShield — Digital Safety Page
// Renders the Digital Safety feature module inside the standard SakhiShield AppShell layout.

import React from 'react';
import { AppShell } from '../components/app/AppShell';
import { DigitalSafety } from '../features/digital-safety';

export const DigitalSafetyPage: React.FC = () => {
  return (
    <AppShell
      title="Digital Safety"
      subtitle="Client-side privacy verification, password hygiene & link telemetry"
    >
      <DigitalSafety />
    </AppShell>
  );
};

export default DigitalSafetyPage;
