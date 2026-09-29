import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './lib/AppContext';
import { AuthProvider, useAuth } from './lib/AuthContext';

// ── Eager imports: lightweight pages that load instantly ──
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/auth/LoginPage';
import { SignupPage } from './pages/auth/SignupPage';
import { ForgotPasswordPage } from './pages/auth/ForgotPasswordPage';

// ── Lazy imports: heavy pages code-split into separate chunks ──
const DashboardPage = lazy(() => import('./pages/DashboardPage'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));
const WalkWithMePage = lazy(() => import('./pages/WalkWithMePage'));
const DevHealthPage = lazy(() => import('./pages/DevHealthPage'));
const PrivacySettingsPage = lazy(() => import('./pages/PrivacySettingsPage'));
const SettingsPage = lazy(() => import('./pages/SettingsPage'));
const HelpSafetyPage = lazy(() => import('./pages/HelpSafetyPage'));
const TrustedCirclePage = lazy(() => import('./pages/TrustedCirclePage'));
const SafetyHistoryPage = lazy(() => import('./pages/SafetyHistoryPage'));
const SafetyCopilotPage = lazy(() => import('./pages/SafetyCopilotPage'));
const DigitalSafetyPage = lazy(() => import('./pages/DigitalSafetyPage'));
const IncidentVaultPage = lazy(() => import('./pages/IncidentVaultPage'));

import { EmergencyAlertOverlay } from './components/trusted-circle/EmergencyAlertOverlay';
import { useTrustedCircleAlerts } from './hooks/useTrustedCircleAlerts';

/**
 * Minimal loading spinner shown while lazy chunks are fetched.
 */
function PageFallback() {
  return (
    <div className="h-screen w-full flex items-center justify-center bg-[#FFFAF3]">
      <div className="flex flex-col items-center gap-4">
        <div className="w-8 h-8 border-3 border-[#1C1917]/20 border-t-[#1C1917] rounded-full animate-spin" />
        <span className="font-mono text-xs text-[#78716C] tracking-wider uppercase">Loading...</span>
      </div>
    </div>
  );
}

/**
 * Guard wrapper that redirects unauthenticated users to /login.
 */
function RequireAuth({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <PageFallback />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

/**
 * Global incoming emergency alert listener.
 * Displays full-screen emergency overlay and manages siren playback across all routes.
 */
function GlobalEmergencyAlertListener() {
  const { user } = useAuth();
  const { incomingAlert, isAudioPlaying, isAutoplayBlocked, acknowledgeAlert, unlockAudio } =
    useTrustedCircleAlerts(user?.id, user?.name || 'Guardian');

  if (!incomingAlert) return null;

  return (
    <EmergencyAlertOverlay
      alert={incomingAlert}
      isAudioPlaying={isAudioPlaying}
      isAutoplayBlocked={isAutoplayBlocked}
      onAcknowledge={() => acknowledgeAlert(incomingAlert.id)}
      onUnlockAudio={unlockAudio}
    />
  );
}

function AppRoutes() {
  return (
    <Suspense fallback={<PageFallback />}>
      <Routes>
        {/* Landing Page */}
        <Route path="/" element={<LandingPage />} />

        {/* Authentication Routes — always accessible */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signin" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />

        {/* Protected Routes — require authentication */}
        <Route path="/dashboard" element={<RequireAuth><DashboardPage /></RequireAuth>} />
        <Route path="/app" element={<Navigate to="/dashboard" replace />} />
        <Route path="/profile" element={<RequireAuth><ProfilePage /></RequireAuth>} />

        {/* Core Walk With Me Route */}
        <Route path="/walk-with-me" element={<RequireAuth><WalkWithMePage /></RequireAuth>} />
        <Route path="/dev/walk-with-me-health" element={<DevHealthPage />} />

        <Route
          path="/safety-copilot"
          element={
            <RequireAuth>
              <SafetyCopilotPage />
            </RequireAuth>
          }
        />

        <Route
          path="/digital-safety"
          element={
            <RequireAuth>
              <DigitalSafetyPage />
            </RequireAuth>
          }
        />

        <Route
          path="/incident-vault"
          element={
            <RequireAuth>
              <IncidentVaultPage />
            </RequireAuth>
          }
        />

        <Route
          path="/trusted-circle"
          element={
            <RequireAuth>
              <TrustedCirclePage />
            </RequireAuth>
          }
        />

        <Route
          path="/safety-history"
          element={
            <RequireAuth>
              <SafetyHistoryPage />
            </RequireAuth>
          }
        />

        <Route
          path="/privacy-settings"
          element={
            <RequireAuth>
              <PrivacySettingsPage />
            </RequireAuth>
          }
        />

        <Route
          path="/settings"
          element={
            <RequireAuth>
              <SettingsPage />
            </RequireAuth>
          }
        />

        <Route
          path="/help"
          element={
            <RequireAuth>
              <HelpSafetyPage />
            </RequireAuth>
          }
        />

        {/* Catch-all redirect to Dashboard */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Suspense>
  );
}

export function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <BrowserRouter>
          <GlobalEmergencyAlertListener />
          <AppRoutes />
        </BrowserRouter>
      </AppProvider>
    </AuthProvider>
  );
}

export default App;
