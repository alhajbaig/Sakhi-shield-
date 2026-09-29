// SakhiShield — Incident Vault Page
// Renders the Incident Vault feature module inside the standard SakhiShield AppShell layout.

import React from 'react';
import { AppShell } from '../components/app/AppShell';
import { IncidentVault } from '../features/incident-vault';

export const IncidentVaultPage: React.FC = () => {
  return (
    <AppShell
      title="Incident Vault"
      subtitle="Encrypted evidence preservation, SHA-256 integrity verification & secure sharing"
    >
      <IncidentVault />
    </AppShell>
  );
};

export default IncidentVaultPage;
