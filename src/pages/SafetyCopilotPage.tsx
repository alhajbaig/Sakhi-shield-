// SakhiShield — Safety Copilot Page
// Renders the Safety Copilot feature inside the standard SakhiShield AppShell layout.

import React from 'react';
import { AppShell } from '../components/app/AppShell';
import { SafetyCopilot } from '../features/safety-copilot';

export const SafetyCopilotPage: React.FC = () => {
  return (
    <AppShell
      title="Safety Copilot"
      subtitle="Context-aware safety intelligence & grounded action guidance"
    >
      <SafetyCopilot />
    </AppShell>
  );
};

export default SafetyCopilotPage;
