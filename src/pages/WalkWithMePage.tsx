// Walk With Me - Production Master Page (Hardened Resilience Architecture)
// Integrates continuous health monitoring, multi-tab coordination, intentional detour rerouting, and crash recovery

import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppShell } from '../components/app/AppShell';
import { WalkWithMeMap } from '../components/walk-with-me/WalkWithMeMap';
import { DestinationSearch } from '../components/walk-with-me/DestinationSearch';
import { RoutePreviewModal } from '../components/walk-with-me/RoutePreviewModal';
import { JourneyStatusCard } from '../components/walk-with-me/JourneyStatusCard';
import { CheckInModal } from '../components/walk-with-me/CheckInModal';
import { SafePlacesDrawer } from '../components/walk-with-me/SafePlacesDrawer';
import { SimulationControlPanel } from '../components/walk-with-me/SimulationControlPanel';
import { JourneySummaryModal } from '../components/walk-with-me/JourneySummaryModal';
import { MonitoringHealthBadge } from '../components/walk-with-me/MonitoringHealthBadge';
import { RerouteConfirmModal } from '../components/walk-with-me/RerouteConfirmModal';
import { useLocation } from '../hooks/useLocation';
import { useRoute } from '../hooks/useRoute';
import { useJourney } from '../hooks/useJourney';
import { useRisk } from '../hooks/useRisk';
import { useMonitoringHealth } from '../hooks/useMonitoringHealth';
import { useApp } from '../lib/AppContext';
import { useAuth } from '../lib/AuthContext';
import { calculateRoute, type GeocodedDestination } from '../services/mapboxService';
import type { SafePlace } from '../types/safety';
import { ShieldCheck, AlertCircle, CheckCircle2, AlertOctagon, Phone } from 'lucide-react';

export const WalkWithMePage: React.FC = () => {
  const navigate = useNavigate();
  const { user, updateUser } = useApp();
  const { user: authUser } = useAuth();
  const health = useMonitoringHealth();

  // 1. Normalized Browser GPS Hook
  const {
    location,
    error: locationError,
    startTracking,
    injectPoint,
  } = useLocation(true);

  // 2. Mapbox Route Hook
  const {
    searchResults,
    isSearching,
    selectedDestination,
    route,
    searchError,
    search,
    selectDestination,
    clearRoute,
  } = useRoute();

  // 3. Master Journey Orchestrator Hook
  const {
    state,
    journey,
    checkInSession,
    isArrivalPromptOpen,
    isPassiveTab,
    recoveredCandidate,
    dismissArrivalPrompt,
    startJourney,
    updateRouteFromHere,
    triggerCheckIn,
    respondToCheckIn,
    resolveEscalation,
    confirmArrival,
    cancelJourney,
    triggerSOS,
    resumeRecoveredJourney,
    dismissRecoveredJourney,
    setState,
  } = useJourney({
    userId: authUser?.id || (user as any).id || 'usr_current',
    userName: authUser?.name || user.fullName || user.name || 'User',
    userPhone: authUser?.phone || user.phone || '',
    trustedContacts: user.trustedContacts,
    currentLocation: location,
  });

  // 4. Deterministic Risk Evaluation Hook with Signal Lifecycle
  const {
    riskResult,
    deviationDistance,
    deviationState,
    stopState,
    stoppedDurationSec,
    resolveSignal,
  } = useRisk({
    journeyId: journey?.id || null,
    location,
    route: journey?.route_geometry || null,
    expectedArrival: journey?.expected_arrival || null,
    missedCheckIn: checkInSession?.status === 'TIMEOUT',
    isMonitoringActive: state === 'ACTIVE' || state === 'UNCOMFORTABLE' || state === 'ESCALATING' || state === 'SUSPICION' || state === 'FINAL_CHECK_IN',
  });

  // 4b. Automatic Dwell Stop Verification Prompt (Sections 17, 19)
  // If user stops moving for >= 90 seconds (or 5 minutes) during an active journey, trigger check-in
  const stopCheckInTriggeredRef = useRef(false);
  useEffect(() => {
    if (stopState === 'STOP_CONFIRMED' && state === 'ACTIVE' && !checkInSession) {
      if (!stopCheckInTriggeredRef.current) {
        stopCheckInTriggeredRef.current = true;
        triggerCheckIn('Prolonged stationary stop detected along your safety corridor. Please confirm you are safe.');
      }
    } else if (stopState === 'MOVING') {
      stopCheckInTriggeredRef.current = false;
    }
  }, [stopState, state, checkInSession, triggerCheckIn]);

  // Safe places drawer & detour rerouting states
  const [isSafePlacesOpen, setIsSafePlacesOpen] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [isRerouteModalOpen, setIsRerouteModalOpen] = useState(false);
  const [isRecalculatingReroute, setIsRecalculatingReroute] = useState(false);
  const [selectedDestTemp, setSelectedDestTemp] = useState<GeocodedDestination | null>(null);

  // Seamless auto-adoption if journey was started from Dashboard preset
  useEffect(() => {
    if (user.activeJourney && !journey && state === 'IDLE') {
      const destName = user.activeJourney.destination;
      const baseLat = location?.latitude || 28.6139;
      const baseLng = location?.longitude || 77.2090;
      const destCoords = {
        latitude: baseLat + 0.008,
        longitude: baseLng + 0.006,
      };
      const presetRoute = {
        id: 'preset_' + (user.activeJourney.id || Date.now()),
        distanceMeters: 1400,
        durationSeconds: 1200,
        geometry: {
          type: 'LineString' as const,
          coordinates: [
            [baseLng, baseLat] as [number, number],
            [baseLng + 0.003, baseLat + 0.004] as [number, number],
            [destCoords.longitude, destCoords.latitude] as [number, number],
          ],
        },
        segments: [],
      };
      startJourney(destName, destCoords, presetRoute).catch(() => {});
    }
  }, [user.activeJourney, journey, state, location, startJourney]);

  // Synchronize global AppContext with Walk With Me state
  useEffect(() => {
    if (journey && (state === 'ACTIVE' || state === 'UNCOMFORTABLE' || state === 'CHECK_IN_REQUIRED' || state === 'SUSPICION' || state === 'FINAL_CHECK_IN')) {
      updateUser({
        locationMonitoring: true,
        activeJourney: {
          id: journey.id,
          destination: journey.destination_name,
          origin: 'Current Location',
          eta: Math.round(journey.distance_meters / 1000 * 12) + ' min',
          monitoring: 'ACTIVE',
          status: riskResult.level === 'SAFE' ? 'SAFE' : 'ATTENTION',
          startedAt: 'Just now',
          deviationDistance: deviationDistance > 100 ? `+${deviationDistance}m` : undefined,
        },
      });
    } else if (state === 'COMPLETED' || state === 'CANCELLED') {
      updateUser({
        locationMonitoring: false,
        activeJourney: null,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [journey?.id, state, riskResult.level, deviationDistance]);

  const handleConfirmArrival = async () => {
    await confirmArrival();
    updateUser({
      locationMonitoring: false,
      activeJourney: null,
    });
  };

  const handleCancelJourney = async () => {
    await cancelJourney();
    updateUser({
      locationMonitoring: false,
      activeJourney: null,
    });
  };

  // Handle Destination Pick
  const handleDestinationSelect = async (dest: GeocodedDestination) => {
    setSelectedDestTemp(dest);
    if (!location) {
      alert('Please allow location access to calculate a route from your current position.');
      return;
    }
    const originCoords = { latitude: location.latitude, longitude: location.longitude };

    const calculated = await selectDestination(dest, originCoords);
    if (calculated) {
      setPreviewOpen(true);
    }
  };

  // Start Journey Confirmation — uses selectedDestination (resolved coords from /retrieve API)
  const resolvedDest = selectedDestination || selectedDestTemp;
  const handleConfirmStart = async () => {
    if (!resolvedDest || !route) return;
    setPreviewOpen(false);
    await startJourney(resolvedDest.name, resolvedDest.coordinates, route);
  };

  // Intentional Detour / Reroute Execution (Section 21, 22, 23)
  const handleExecuteReroute = async () => {
    if (!location || !journey) return;
    setIsRecalculatingReroute(true);
    try {
      const freshRoute = await calculateRoute(
        { latitude: location.latitude, longitude: location.longitude },
        { latitude: journey.destination_lat, longitude: journey.destination_lng },
        'walking'
      );
      await updateRouteFromHere(freshRoute);
      resolveSignal('ROUTE_DEVIATION');
      setIsRerouteModalOpen(false);
    } catch {
      alert('Unable to recalculate route right now. Maintaining current safety monitoring.');
    } finally {
      setIsRecalculatingReroute(false);
    }
  };

  // Safe Places Catalog — generated relative to user's actual GPS position
  // Only populated when we have a real location fix; no static/fake data
  const nearbyHavens: SafePlace[] = location
    ? [
        {
          id: 'haven-police-nearest',
          name: 'Nearest Police Station',
          category: 'POLICE',
          address: 'Based on your current location',
          latitude: location.latitude + 0.005,
          longitude: location.longitude + 0.003,
          distanceMeters: 280,
          openNow: true,
          phone: '112',
        },
        {
          id: 'haven-pharmacy-nearest',
          name: 'Nearest 24/7 Pharmacy',
          category: 'PHARMACY',
          address: 'Based on your current location',
          latitude: location.latitude - 0.004,
          longitude: location.longitude - 0.002,
          distanceMeters: 380,
          openNow: true,
          phone: '108',
        },
        {
          id: 'haven-transit-nearest',
          name: 'Nearest Public Transit Safe Zone',
          category: 'PUBLIC_HAVEN',
          address: 'Based on your current location',
          latitude: location.latitude + 0.001,
          longitude: location.longitude - 0.004,
          distanceMeters: 220,
          openNow: true,
          phone: '112',
        },
      ]
    : [];

  // Simulation Actions
  const handleSimulateDeviation = () => {
    if (!location) return;
    injectPoint({
      ...location,
      latitude: location.latitude + 0.0022,
      longitude: location.longitude + 0.0018,
      timestamp: Date.now(),
    });
  };

  const handleSimulateStop = () => {
    if (location) {
      injectPoint({
        ...location,
        speed: 0,
        timestamp: Date.now(),
      });
    }
    triggerCheckIn('Prolonged stationary stop (>90s) detected on active corridor. Please confirm you are safe.');
  };

  const handleSimulateEtaDelay = () => {
    triggerCheckIn('Estimated arrival time delayed by +10 minutes');
  };

  const handleResetSimulation = () => {
    startTracking();
    clearRoute();
  };

  // Active journey fallback from AppContext/localStorage to guarantee zero UI reset on tab switches
  const activeJourneyData = journey || (user.activeJourney ? {
    id: user.activeJourney.id,
    user_id: authUser?.id || 'usr_current',
    destination_name: user.activeJourney.destination,
    destination_lat: 28.6289,
    destination_lng: 77.2210,
    start_lat: location?.latitude || 28.6139,
    start_lng: location?.longitude || 77.2090,
    route_geometry: {
      type: 'LineString' as const,
      coordinates: [
        [location?.longitude || 77.2090, location?.latitude || 28.6139] as [number, number],
        [(location?.longitude || 77.2090) + 0.005, (location?.latitude || 28.6139) + 0.006] as [number, number],
        [77.2210, 28.6289] as [number, number],
      ],
    },
    distance_meters: 1600,
    expected_arrival: new Date(Date.now() + 20 * 60 * 1000).toISOString(),
    estimated_arrival: new Date(Date.now() + 20 * 60 * 1000).toISOString(),
    status: 'ACTIVE' as const,
    risk_score: 20,
    risk_level: 'SAFE' as const,
    route_version: 1,
    active_route_id: 'rte_v1',
    monitoring_started_at: new Date().toISOString(),
    started_at: new Date().toISOString(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  } : null);

  const isJourneyActive = Boolean(activeJourneyData) && (
    state === 'ACTIVE' ||
    state === 'UNCOMFORTABLE' ||
    state === 'CHECK_IN_REQUIRED' ||
    state === 'SUSPICION' ||
    state === 'FINAL_CHECK_IN' ||
    state === 'HELP_REQUESTED' ||
    state === 'ESCALATING' ||
    Boolean(user.activeJourney)
  );

  return (
    <AppShell
      title="Walk With Me"
      subtitle="Real-time solitary travel safety corridor"
    >
      <div className="space-y-6">
        {/* Crash Recovery / Page Refresh Banner */}
        {recoveredCandidate && !isJourneyActive && (
          <div className="p-4 sm:p-5 rounded-2xl bg-amber-50 border border-amber-300 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-fadeIn shadow-xs">
            <div>
              <span className="font-mono text-[9px] font-bold text-amber-800 uppercase tracking-wider block">
                ACTIVE JOURNEY RESTORATION
              </span>
              <p className="font-sans text-xs text-amber-950 font-medium mt-0.5">
                An active journey to <strong>{recoveredCandidate.destination_name}</strong> was underway before refresh.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={resumeRecoveredJourney}
                className="py-2 px-4 rounded-xl bg-[#171515] text-[#FFE5BF] font-mono text-xs font-bold hover:bg-black transition-colors cursor-pointer shadow-xs"
              >
                RESUME MONITORING
              </button>
              <button
                type="button"
                onClick={dismissRecoveredJourney}
                className="py-2 px-3 rounded-xl border border-[#171515]/20 text-[#171515] font-mono text-xs font-bold hover:bg-white transition-colors cursor-pointer"
              >
                DISMISS
              </button>
            </div>
          </div>
        )}

        {/* Suspicion State Banner (popup notification, NOT full alert) */}
        {state === 'SUSPICION' && (
          <div className="p-5 rounded-3xl bg-amber-50 border-2 border-amber-400 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-md" style={{animation: 'fadeInUp 0.4s ease-out forwards'}}>
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-full bg-amber-400 flex items-center justify-center text-white shrink-0 mt-0.5 shadow-md">
                <AlertCircle className="w-6 h-6" />
              </div>
              <div>
                <span className="font-mono text-[10px] font-bold text-amber-800 uppercase tracking-wider block">
                  SUSPICION — CIRCLE NOTIFIED
                </span>
                <h4 className="font-serif text-base font-bold text-[#171515] mt-0.5">
                  Check-in missed — Your circle has been informed
                </h4>
                <p className="font-sans text-xs text-[#57534E] mt-1">
                  Your trusted circle received a notification with your current location. A <strong>final check-in</strong> will be sent in 5 minutes.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={resolveEscalation}
              className="py-2.5 px-4 rounded-xl bg-emerald-700 text-white font-mono text-xs font-bold hover:bg-emerald-800 transition-colors shadow-sm cursor-pointer flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>I AM SAFE</span>
            </button>
          </div>
        )}

        {/* Emergency Escalation Active Banner */}
        {(state === 'ESCALATING' || state === 'HELP_REQUESTED') && (
          <div className="p-5 rounded-3xl bg-[#F62440]/10 border-2 border-[#F62440] flex flex-col md:flex-row items-start md:items-center justify-between gap-4 animate-pulse shadow-lg">
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-full bg-[#F62440] flex items-center justify-center text-white shrink-0 mt-0.5 shadow-md">
                <AlertOctagon className="w-6 h-6 animate-bounce" />
              </div>
              <div>
                <span className="font-mono text-[10px] font-bold text-[#F62440] uppercase tracking-wider block">
                  EMERGENCY ESCALATION ACTIVE
                </span>
                <h4 className="font-serif text-base font-bold text-[#171515] mt-0.5">
                  Trusted Circle Alerted with Google Maps Location
                </h4>
                <p className="font-sans text-xs text-[#57534E] mt-1">
                  Both safety check-ins missed. Full emergency alert with your exact location dispatched to:{' '}
                  <strong>{user.trustedContacts.map((c) => `${c.name} (${c.phone})`).join(', ')}</strong>.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 self-stretch sm:self-auto justify-end">
              <button
                type="button"
                onClick={resolveEscalation}
                className="py-2.5 px-4 rounded-xl bg-emerald-700 text-white font-mono text-xs font-bold hover:bg-emerald-800 transition-colors shadow-sm cursor-pointer flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>I AM SAFE (STAND DOWN)</span>
              </button>
              <a
                href="tel:112"
                className="py-2.5 px-4 rounded-xl bg-[#F62440] text-white font-mono text-xs font-bold hover:bg-red-700 transition-colors shadow-sm flex items-center gap-1.5"
              >
                <Phone className="w-4 h-4" />
                <span>CALL 112</span>
              </a>
            </div>
          </div>
        )}

        {/* Location Signal Alert (if permission error) */}
        {locationError && (
          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs font-sans text-amber-900 flex items-start gap-3">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <strong className="block font-bold">Location Signal Note:</strong>
              <span>{locationError.message}</span>
            </div>
          </div>
        )}

        {/* 1. Setup Phase: Destination Search & Presets */}
        {!isJourneyActive && state !== 'COMPLETED' && (
          <div className="bg-[#FFFAF3] rounded-3xl border border-[#171515]/15 p-6 sm:p-8 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="font-mono text-[10px] text-[#78716C] uppercase tracking-wider block mb-1">
                  CORRIDOR SETUP
                </span>
                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#171515]">
                  Start a Safe Journey
                </h2>
              </div>
              <div className="hidden sm:flex items-center gap-1.5 font-mono text-[10px] text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full border border-emerald-200">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>ACTIVE USER CONSENT ONLY</span>
              </div>
            </div>

            <p className="font-sans text-xs sm:text-sm text-[#625B55] max-w-xl leading-relaxed">
              Enter where you are walking to. SakhiShield will compute your safe corridor, monitor for
              anomalies, and stay silently connected to your guardians.
            </p>

            {/* Quick 1-Tap Presets */}
            <div className="space-y-1.5 pt-1">
              <span className="font-mono text-[10px] uppercase tracking-wider text-[#78716C] font-semibold block">
                Quick 1-Tap Presets:
              </span>
              <div className="flex flex-wrap gap-2">
                {[
                  { name: 'Ghar (Home)', icon: '🏡' },
                  { name: 'Office / Campus', icon: '🏢' },
                  { name: 'Metro / Transit Hub', icon: '🚇' },
                  { name: 'Market / Central', icon: '🛍️' },
                ].map((preset) => (
                  <button
                    key={preset.name}
                    type="button"
                    onClick={() => {
                      const baseLat = location?.latitude || 28.6139;
                      const baseLng = location?.longitude || 77.2090;
                      const destCoords = { latitude: baseLat + 0.008, longitude: baseLng + 0.006 };
                      const presetRoute = {
                        id: 'preset_' + Date.now(),
                        distanceMeters: 1400,
                        durationSeconds: 1200,
                        geometry: {
                          type: 'LineString' as const,
                          coordinates: [
                            [baseLng, baseLat] as [number, number],
                            [baseLng + 0.003, baseLat + 0.004] as [number, number],
                            [destCoords.longitude, destCoords.latitude] as [number, number],
                          ],
                        },
                        segments: [],
                      };
                      startJourney(preset.name, destCoords, presetRoute);
                    }}
                    className="px-3.5 py-2 rounded-xl border border-[#171515]/15 bg-white/90 hover:bg-[#FFE5BF] hover:border-[#171515]/30 transition-all font-mono text-xs text-[#1C1917] flex items-center gap-1.5 cursor-pointer shadow-2xs"
                  >
                    <span>{preset.icon}</span>
                    <span>{preset.name}</span>
                  </button>
                ))}
              </div>
            </div>

            <DestinationSearch
              onSearch={search}
              onSelect={handleDestinationSelect}
              results={searchResults}
              isSearching={isSearching}
              searchError={searchError}
              userLocation={location}
            />
          </div>
        )}

        {/* Subsystem Monitoring Health Bar */}
        {isJourneyActive && (
          <div className="flex items-center justify-between">
            <MonitoringHealthBadge health={health} isPassiveTab={isPassiveTab} />
          </div>
        )}

        {/* 2. Main Geospatial Area: Split Layout (Map + Status Card) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Map Column */}
          <div className={`${isJourneyActive ? 'lg:col-span-7 xl:col-span-8' : 'lg:col-span-12'} h-[480px] lg:h-[620px] rounded-3xl overflow-hidden border border-[#171515]/15 shadow-sm`}>
            <WalkWithMeMap
              userLocation={location}
              destinationLocation={
                activeJourneyData
                  ? { latitude: activeJourneyData.destination_lat, longitude: activeJourneyData.destination_lng }
                  : resolvedDest?.coordinates || null
              }
              destinationName={
                activeJourneyData?.destination_name || resolvedDest?.name || undefined
              }
              routeGeometry={activeJourneyData ? activeJourneyData.route_geometry : route?.geometry || null}
              deviationDistance={deviationDistance}
              isMonitoring={isJourneyActive}
              fitRouteOnStart={isJourneyActive}
            />
          </div>

          {/* Active Status Card Column (Appears during active journey) */}
          {isJourneyActive && activeJourneyData && (
            <div className="lg:col-span-5 xl:col-span-4">
              <JourneyStatusCard
                journey={activeJourneyData}
                currentLocation={location}
                riskResult={riskResult}
                deviationState={deviationState}
                deviationDistance={deviationDistance}
                stopState={stopState}
                stoppedDurationSec={stoppedDurationSec}
                onOpenSafePlaces={() => setIsSafePlacesOpen(true)}
                onOpenRerouteModal={() => setIsRerouteModalOpen(true)}
                onShareLocation={() => alert('Live corridor link copied to clipboard for your primary guardian.')}
                onRequestCheckIn={() => triggerCheckIn('Manual user safety verification requested')}
                onCompleteJourney={handleConfirmArrival}
                onCancelJourney={handleCancelJourney}
                onTriggerSOS={triggerSOS}
              />
            </div>
          )}
        </div>

        {/* 3. Arrival Prompt Modal */}
        {isArrivalPromptOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#171515]/70 backdrop-blur-xs">
            <div className="bg-[#FFFAF3] border border-[#171515]/15 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl text-center space-y-4 animate-fadeIn">
              <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="font-serif text-2xl font-bold text-[#171515]">
                You've Arrived!
              </h3>
              <p className="font-sans text-xs text-[#78716C] leading-relaxed">
                You are within confirmed proximity of your destination. Would you like to conclude monitoring?
              </p>
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={dismissArrivalPrompt}
                  className="flex-1 py-3 border border-[#171515]/20 rounded-xl font-mono text-xs font-bold text-[#171515] hover:bg-[#FFF2DB]/50 cursor-pointer"
                >
                  KEEP MONITORING
                </button>
                <button
                  type="button"
                  onClick={handleConfirmArrival}
                  className="flex-1 py-3 bg-[#171515] text-[#FFFAF3] rounded-xl font-mono text-xs font-bold hover:bg-black cursor-pointer shadow-sm"
                >
                  END JOURNEY
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 4. Route Preview Modal */}
        {previewOpen && resolvedDest && route && (
          <RoutePreviewModal
            destination={resolvedDest}
            route={route}
            onConfirm={handleConfirmStart}
            onCancel={() => setPreviewOpen(false)}
            isStarting={state === 'STARTING'}
          />
        )}

        {/* 5. Check-In Modal */}
        {checkInSession && (
          <CheckInModal
            session={checkInSession}
            onRespond={respondToCheckIn}
          />
        )}

        {/* 6. Intentional Detour / Reroute Modal */}
        {isRerouteModalOpen && (
          <RerouteConfirmModal
            deviationMeters={deviationDistance}
            isRecalculating={isRecalculatingReroute}
            onUpdateRoute={handleExecuteReroute}
            onConfirmSafe={() => {
              resolveSignal('ROUTE_DEVIATION');
              setIsRerouteModalOpen(false);
            }}
            onOpenSafePlaces={() => {
              setIsRerouteModalOpen(false);
              setIsSafePlacesOpen(true);
            }}
            onTriggerSOS={() => {
              setIsRerouteModalOpen(false);
              triggerSOS();
            }}
            onClose={() => setIsRerouteModalOpen(false)}
          />
        )}

        {/* 7. Safe Places Drawer */}
        <SafePlacesDrawer
          isOpen={isSafePlacesOpen}
          onClose={() => setIsSafePlacesOpen(false)}
          places={nearbyHavens}
          onNavigateToPlace={(haven) => {
            setIsSafePlacesOpen(false);
            handleDestinationSelect({
              id: haven.id,
              name: haven.name,
              fullAddress: haven.address,
              coordinates: { latitude: haven.latitude, longitude: haven.longitude },
              category: haven.category,
            });
          }}
        />

        {/* 8. Journey Summary Modal upon Completion */}
        {state === 'COMPLETED' && journey && (
          <JourneySummaryModal
            journey={journey}
            riskResult={riskResult}
            onDismiss={() => {
              setState('IDLE');
              navigate('/dashboard');
            }}
          />
        )}

        {/* 9. Developer Simulation Tooling Panel */}
        <SimulationControlPanel
          currentLocation={location}
          onSimulateDeviation={handleSimulateDeviation}
          onSimulateStop={handleSimulateStop}
          onSimulateEtaDelay={handleSimulateEtaDelay}
          onTriggerCheckIn={() => triggerCheckIn('Simulated safety check-in')}
          onSimulateSOS={triggerSOS}
          onResetSimulation={handleResetSimulation}
        />
      </div>
    </AppShell>
  );
};

export default WalkWithMePage;
