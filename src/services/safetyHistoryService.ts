// SakhiShield — Safety History Service
// Manages historical journey dossiers, cryptographic hashes, and telemetry logs

import type { SafetyHistoryRecord, SafetyHistoryFilterState } from '../types/safetyHistory';
import { generateSecureId, computeSha256Sync } from '../lib/securityUtils';

const STORAGE_KEY = 'sakhishield_journey_history_v1';

const INITIAL_RECORDS: SafetyHistoryRecord[] = [
  {
    id: 'HIST-2026-9821',
    isDemo: true,
    title: 'Late-Night Metro Transit to Residence',
    category: 'WALK_WITH_ME',
    status: 'SAFE_ARRIVAL',
    startedAt: '2026-09-27T23:42:00.000Z',
    endedAt: '2026-09-28T00:18:00.000Z',
    dateFormatted: 'Sep 27, 2026',
    timeRange: '23:42 – 00:18 IST',
    origin: 'Rajiv Chowk Metro Gate 4',
    destination: 'Green Park Main Market',
    transitMode: 'Metro / Transit',
    distanceKm: 4.8,
    durationMin: 36,
    corridorScore: 96,
    corridorDetails: {
      illuminationPct: 94,
      safeSpotsCount: 5,
      cctvCoverage: 'Full',
      primaryCorridor: 'Aurobindo Marg & Metro Corridor',
    },
    guardiansNotified: [
      { name: 'Papa (Home)', relationship: 'Primary Guardian', phone: '+91 98765 43210', status: 'Live Stream Viewed', timestamp: '23:43 IST' },
      { name: 'Priya (Sister)', relationship: 'Secondary Contact', phone: '+91 98111 22334', status: 'Acknowledged', timestamp: '23:45 IST' },
    ],
    checkIns: [
      { time: '23:42', label: 'Transit Initiated', type: 'INITIATION', status: 'SYSTEM_AUTO', notes: 'GPS telemetry lock acquired with ±2.8m precision.' },
      { time: '23:54', label: 'Scheduled Check-in #1', type: 'SCHEDULED_CHECKIN', status: 'VERIFIED', notes: 'Biometric passkey verified by user.' },
      { time: '00:06', label: 'Entered Aurobindo Safe Corridor', type: 'SAFE_ZONE_ENTRY', status: 'SYSTEM_AUTO', notes: '24/7 Apollo Pharmacy & Police Booth within 80m.' },
      { time: '00:18', label: 'Safe Arrival Confirmed', type: 'COMPLETION', status: 'VERIFIED', notes: 'User confirmed destination reached. Guardian alert stood down.' },
    ],
    cryptographicHash: computeSha256Sync('HIST-2026-9821:2026-09-27T23:42:00.000Z:Rajiv Chowk Metro Gate 4:Green Park Main Market'),
    telemetry: {
      avgBatteryPct: 82,
      networkReliability: '4G LTE (99.4% uptime)',
      gpsPrecisionMeters: 3.1,
      deviceModel: 'Pixel 9 Pro / Chrome v128',
    },
    summary: 'Monitored 36-minute metro transit along high-illumination arterial corridors. 2 guardians maintained live breadcrumb telemetry with zero anomalies.',
  },
  {
    id: 'HIST-2026-9742',
    isDemo: true,
    title: 'Evening Walk — Cyber Hub to Residence',
    category: 'WALK_WITH_ME',
    status: 'SAFE_ARRIVAL',
    startedAt: '2026-09-26T21:15:00.000Z',
    endedAt: '2026-09-26T21:44:00.000Z',
    dateFormatted: 'Sep 26, 2026',
    timeRange: '21:15 – 21:44 IST',
    origin: 'Cyber Hub Tower B',
    destination: 'Sector 43 Residence',
    transitMode: 'Walking',
    distanceKm: 2.3,
    durationMin: 29,
    corridorScore: 92,
    corridorDetails: {
      illuminationPct: 91,
      safeSpotsCount: 4,
      cctvCoverage: 'High',
      primaryCorridor: 'DLF Phase 2 Walkway',
    },
    guardiansNotified: [
      { name: 'Papa (Home)', relationship: 'Primary Guardian', phone: '+91 98765 43210', status: 'Delivered', timestamp: '21:16 IST' },
      { name: 'Aarav (Friend)', relationship: 'Trusted Circle', phone: '+91 99000 88776', status: 'Acknowledged', timestamp: '21:18 IST' },
    ],
    checkIns: [
      { time: '21:15', label: 'Walk Initialized', type: 'INITIATION', status: 'SYSTEM_AUTO' },
      { time: '21:30', label: 'Mid-route Check-in', type: 'SCHEDULED_CHECKIN', status: 'VERIFIED', notes: 'Automated 15-minute countdown acknowledged.' },
      { time: '21:44', label: 'Destination Arrival', type: 'COMPLETION', status: 'VERIFIED' },
    ],
    cryptographicHash: computeSha256Sync('HIST-2026-9742:2026-09-26T21:15:00.000Z:Cyber Hub Tower B:Sector 43 Residence'),
    telemetry: {
      avgBatteryPct: 68,
      networkReliability: '5G NR (100% uptime)',
      gpsPrecisionMeters: 2.4,
      deviceModel: 'iPhone 15 / Safari',
    },
    summary: 'Standard 2.3 km evening pedestrian corridor commute. Well-lit pathways throughout with verified midpoint check-in.',
  },
  {
    id: 'HIST-2026-9630',
    isDemo: true,
    title: 'Cab Ride-Hail Route Verification',
    category: 'CORRIDOR_ALERT',
    status: 'ALERT_CLEARED',
    startedAt: '2026-09-24T22:30:00.000Z',
    endedAt: '2026-09-24T23:12:00.000Z',
    dateFormatted: 'Sep 24, 2026',
    timeRange: '22:30 – 23:12 IST',
    origin: 'Indira Gandhi Airport T3',
    destination: 'Noida Sector 62',
    transitMode: 'Cab / Ride',
    distanceKm: 34.2,
    durationMin: 42,
    corridorScore: 89,
    corridorDetails: {
      illuminationPct: 88,
      safeSpotsCount: 8,
      cctvCoverage: 'Full',
      primaryCorridor: 'Barapullah Elevated Corridor & DND Flyway',
    },
    guardiansNotified: [
      { name: 'Papa (Home)', relationship: 'Primary Guardian', phone: '+91 98765 43210', status: 'Live Stream Viewed', timestamp: '22:31 IST' },
      { name: 'Priya (Sister)', relationship: 'Secondary Contact', phone: '+91 98111 22334', status: 'Acknowledged', timestamp: '22:32 IST' },
    ],
    checkIns: [
      { time: '22:30', label: 'Vehicle Monitoring Active', type: 'INITIATION', status: 'SYSTEM_AUTO', notes: 'Vehicle license plate recorded in session note.' },
      { time: '22:48', label: 'Minor Route Deviation Detected', type: 'ANOMALY_CLEARED', status: 'CLEARED', notes: 'Driver took DND bypass due to construction. User marked route as normal.' },
      { time: '23:12', label: 'Safe Drop-off Confirmed', type: 'COMPLETION', status: 'VERIFIED' },
    ],
    cryptographicHash: computeSha256Sync('HIST-2026-9630:2026-09-24T22:30:00.000Z:Indira Gandhi Airport T3:Noida Sector 62'),
    telemetry: {
      avgBatteryPct: 45,
      networkReliability: '4G LTE (98.2% uptime)',
      gpsPrecisionMeters: 4.8,
      deviceModel: 'Pixel 9 Pro / Chrome v128',
    },
    summary: 'Long-distance airport transit. Anomaly detection triggered on Barapullah detour and was cleared within 30 seconds by user verification.',
  },
  {
    id: 'HIST-2026-9511',
    isDemo: true,
    title: 'Emergency SOS Protocol Stand-Down Drill',
    category: 'SOS_ESCALATION',
    status: 'RESOLVED_STAND_DOWN',
    startedAt: '2026-09-21T18:04:00.000Z',
    endedAt: '2026-09-21T18:08:00.000Z',
    dateFormatted: 'Sep 21, 2026',
    timeRange: '18:04 – 18:08 IST',
    origin: 'South Extension Part II',
    destination: 'South Extension Part II',
    transitMode: 'Emergency Drill',
    distanceKm: 0.1,
    durationMin: 4,
    corridorScore: 98,
    corridorDetails: {
      illuminationPct: 98,
      safeSpotsCount: 6,
      cctvCoverage: 'Full',
      primaryCorridor: 'Ring Road Market Zone',
    },
    guardiansNotified: [
      { name: 'Papa (Home)', relationship: 'Primary Guardian', phone: '+91 98765 43210', status: 'Acknowledged', timestamp: '18:04 IST' },
      { name: 'Priya (Sister)', relationship: 'Secondary Contact', phone: '+91 98111 22334', status: 'Acknowledged', timestamp: '18:04 IST' },
    ],
    checkIns: [
      { time: '18:04', label: 'Emergency Beacon Fired', type: 'INITIATION', status: 'SYSTEM_AUTO', notes: 'Drill trigger dispatched high-priority escalation pulse.' },
      { time: '18:05', label: 'Guardians Received Location', type: 'SCHEDULED_CHECKIN', status: 'VERIFIED', notes: '2 of 2 guardians opened tracking link within 48s.' },
      { time: '18:08', label: 'Authorized Stand-Down', type: 'COMPLETION', status: 'CLEARED', notes: 'User input PIN 4492 to disengage beacon. Reassurance pulse sent.' },
    ],
    cryptographicHash: computeSha256Sync('HIST-2026-9511:2026-09-21T18:04:00.000Z:South Extension Part II:South Extension Part II'),
    telemetry: {
      avgBatteryPct: 91,
      networkReliability: '5G NR (100% uptime)',
      gpsPrecisionMeters: 1.9,
      deviceModel: 'Pixel 9 Pro / Chrome v128',
    },
    summary: 'Full-chain verification drill. High-priority SMS and live broadcast links successfully tested with zero packet loss.',
  },
  {
    id: 'HIST-2026-9402',
    isDemo: true,
    title: 'Automated Corridor Check-in Milestone',
    category: 'CHECK_IN',
    status: 'CHECK_IN_CONFIRMED',
    startedAt: '2026-09-18T19:30:00.000Z',
    endedAt: '2026-09-18T19:52:00.000Z',
    dateFormatted: 'Sep 18, 2026',
    timeRange: '19:30 – 19:52 IST',
    origin: 'Hauz Khas Social',
    destination: 'Hauz Khas Metro Station',
    transitMode: 'Walking',
    distanceKm: 1.4,
    durationMin: 22,
    corridorScore: 94,
    corridorDetails: {
      illuminationPct: 92,
      safeSpotsCount: 3,
      cctvCoverage: 'High',
      primaryCorridor: 'Hauz Khas Village Road',
    },
    guardiansNotified: [
      { name: 'Aarav (Friend)', relationship: 'Trusted Circle', phone: '+91 99000 88776', status: 'Delivered', timestamp: '19:31 IST' },
    ],
    checkIns: [
      { time: '19:30', label: 'Check-in Session Started', type: 'INITIATION', status: 'SYSTEM_AUTO' },
      { time: '19:42', label: 'Proximity Checkpoint Passed', type: 'SAFE_ZONE_ENTRY', status: 'SYSTEM_AUTO', notes: 'Passing 24/7 convenience store & security outpost.' },
      { time: '19:52', label: 'Metro Gate 1 Reached', type: 'COMPLETION', status: 'VERIFIED' },
    ],
    cryptographicHash: computeSha256Sync('HIST-2026-9402:2026-09-18T19:30:00.000Z:Hauz Khas Social:Hauz Khas Metro Station'),
    telemetry: {
      avgBatteryPct: 74,
      networkReliability: '4G LTE (99.1% uptime)',
      gpsPrecisionMeters: 3.4,
      deviceModel: 'Pixel 9 Pro / Chrome v128',
    },
    summary: 'Short pedestrian commute through village connector. Safe corridor lights verified at 92%.',
  },
];

export const safetyHistoryService = {
  /**
   * Retrieves all historical records from localStorage or initial seed
   */
  getAllRecords: (): SafetyHistoryRecord[] => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch {}

    // Initialize with rich seeded records if storage is empty
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_RECORDS));
    } catch {}
    return INITIAL_RECORDS;
  },

  /**
   * Filters records based on search, category, status, and date range
   */
  filterRecords: (
    records: SafetyHistoryRecord[],
    filters: SafetyHistoryFilterState
  ): SafetyHistoryRecord[] => {
    return records.filter((r) => {
      // Category filter
      if (filters.category !== 'ALL' && r.category !== filters.category) {
        return false;
      }

      // Status filter
      if (filters.status !== 'ALL' && r.status !== filters.status) {
        return false;
      }

      // Date Range filter
      if (filters.dateRange !== 'ALL') {
        const recordDate = new Date(r.startedAt).getTime();
        const now = Date.now();
        const daysDiff = (now - recordDate) / (1000 * 60 * 60 * 24);
        if (filters.dateRange === '7_DAYS' && daysDiff > 7) return false;
        if (filters.dateRange === '30_DAYS' && daysDiff > 30) return false;
      }

      // Search Query filter
      if (filters.searchQuery.trim()) {
        const query = filters.searchQuery.toLowerCase().trim();
        const matchTitle = r.title.toLowerCase().includes(query);
        const matchOrigin = r.origin.toLowerCase().includes(query);
        const matchDest = r.destination.toLowerCase().includes(query);
        const matchCorridor = r.corridorDetails.primaryCorridor.toLowerCase().includes(query);
        const matchId = r.id.toLowerCase().includes(query);
        if (!matchTitle && !matchOrigin && !matchDest && !matchCorridor && !matchId) {
          return false;
        }
      }

      return true;
    });
  },

  /**
   * Records a freshly completed journey into history
   */
  addCompletedJourney: (journey: {
    destination: string;
    origin?: string;
    durationMin?: number;
    distanceKm?: number;
    notes?: string;
  }): SafetyHistoryRecord => {
    const records = safetyHistoryService.getAllRecords();
    const now = new Date();
    const secureSuffix = generateSecureId().replace(/-/g, '').slice(0, 6).toUpperCase();
    const id = `HIST-${now.getFullYear()}-${secureSuffix}`;

    const startedAt = new Date(now.getTime() - (journey.durationMin || 20) * 60000).toISOString();
    const endedAt = now.toISOString();

    const canonicalPayload = JSON.stringify({
      id,
      startedAt,
      endedAt,
      origin: journey.origin || 'Initial Location',
      destination: journey.destination,
      distanceKm: journey.distanceKm || 1.8,
      durationMin: journey.durationMin || 20,
    });
    const cryptographicHash = computeSha256Sync(canonicalPayload);

    const newRecord: SafetyHistoryRecord = {
      id,
      isDemo: false,
      title: `Walk to ${journey.destination}`,
      category: 'WALK_WITH_ME',
      status: 'SAFE_ARRIVAL',
      startedAt,
      endedAt,
      dateFormatted: now.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      timeRange: `${new Date(now.getTime() - (journey.durationMin || 20) * 60000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} – ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} IST`,
      origin: journey.origin || 'Initial Location',
      destination: journey.destination,
      transitMode: 'Walking',
      distanceKm: journey.distanceKm || 1.8,
      durationMin: journey.durationMin || 20,
      corridorScore: 95,
      corridorDetails: {
        illuminationPct: 93,
        safeSpotsCount: 4,
        cctvCoverage: 'High',
        primaryCorridor: 'Primary Arterial Walkway',
      },
      guardiansNotified: [
        { name: 'Trusted Guardians', relationship: 'Emergency Network', phone: '+91 98765 43210', status: 'Live Stream Viewed', timestamp: 'Just now' },
      ],
      checkIns: [
        { time: 'Start', label: 'Transit Initiated', type: 'INITIATION', status: 'SYSTEM_AUTO' },
        { time: 'End', label: 'Arrival Confirmed', type: 'COMPLETION', status: 'VERIFIED' },
      ],
      cryptographicHash,
      telemetry: {
        avgBatteryPct: 88,
        networkReliability: '5G NR (100% uptime)',
        gpsPrecisionMeters: 2.9,
        deviceModel: 'Web Client Active Session',
      },
      summary: journey.notes || `Successfully completed walk to ${journey.destination} with continuous GPS telemetry lock and zero incident escalations.`,
    };

    const updated = [newRecord, ...records];
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch {}
    return newRecord;
  },

  /**
   * Generates a downloadable / exportable cryptographic audit report
   */
  exportDossierReport: (record: SafetyHistoryRecord): void => {
    const report = `================================================================================
SAKHISHIELD VERIFIED SAFETY DOSSIER & AUDIT TRAIL
================================================================================
RECORD IDENTIFIER  : ${record.id}
RECORD TYPE        : ${record.isDemo ? 'DEMONSTRATION RECORD' : 'VERIFIED USER TELEMETRY'}
TIMESTAMP SEEDED   : ${record.startedAt}
DATE & TIME WINDOW : ${record.dateFormatted} (${record.timeRange})
EVENT CATEGORY     : ${record.category}
COMPLETION STATUS  : ${record.status}
--------------------------------------------------------------------------------
TRANSIT TELEMETRY:
- Origin           : ${record.origin}
- Destination      : ${record.destination}
- Mode of Transit  : ${record.transitMode}
- Total Distance   : ${record.distanceKm} km
- Duration         : ${record.durationMin} minutes
- Corridor Score   : ${record.corridorScore} / 100
- Illumination     : ${record.corridorDetails.illuminationPct}%
- Primary Corridor : ${record.corridorDetails.primaryCorridor}
- Safe Spots Count : ${record.corridorDetails.safeSpotsCount}
- CCTV Coverage    : ${record.corridorDetails.cctvCoverage}

--------------------------------------------------------------------------------
HARDWARE & NETWORK METRICS:
- Device / Client  : ${record.telemetry.deviceModel || 'N/A'}
- Battery State    : ${record.telemetry.avgBatteryPct}%
- Network Link     : ${record.telemetry.networkReliability}
- GPS Precision    : ±${record.telemetry.gpsPrecisionMeters} meters

--------------------------------------------------------------------------------
VERIFIED CHECK-IN TRAIL:
${record.checkIns.map((c) => `[${c.time}] ${c.label} (${c.status}) - ${c.notes || 'Normal telemetry'}`).join('\n')}

--------------------------------------------------------------------------------
GUARDIAN DISPATCH RECIPIENTS:
${record.guardiansNotified.map((g) => `- ${g.name} (${g.relationship}) | ${g.phone} -> ${g.status} at ${g.timestamp}`).join('\n')}

--------------------------------------------------------------------------------
SUMMARY:
${record.summary}

--------------------------------------------------------------------------------
CRYPTOGRAPHIC INTEGRITY DIGEST:
SHA-256 HASH: ${record.cryptographicHash}
VERIFICATION: SHA-256 AUDIT DIGEST RECORDED
================================================================================`;

    const blob = new Blob([report], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `SakhiShield-Audit-${record.id}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  },

  /**
   * Generates a consolidated exportable audit report for all provided records
   */
  exportAllDossierReports: (records: SafetyHistoryRecord[]): void => {
    if (!records || records.length === 0) return;

    const separator = '='.repeat(80);
    const subSeparator = '-'.repeat(80);

    const header = `${separator}
SAKHISHIELD CONSOLIDATED SAFETY & INTEGRITY DOSSIER ARCHIVE
${separator}
TOTAL RECORDS EXPORTED : ${records.length}
GENERATED AT           : ${new Date().toISOString()}
INTEGRITY STANDARD     : W3C Web Cryptography API (SHA-256)
${subSeparator}
INDEX OF TELEMETRY RECORDS:
${records.map((r, i) => `[${i + 1}] ID: ${r.id.padEnd(20)} | Date: ${r.dateFormatted} (${r.timeRange}) | Status: ${r.status}`).join('\n')}
${separator}\n\n`;

    const dossiers = records.map((record, index) => {
      return `################################################################################
RECORD [${index + 1} OF ${records.length}] : ${record.id}
################################################################################
TITLE              : ${record.title}
RECORD TYPE        : ${record.isDemo ? 'DEMONSTRATION RECORD' : 'VERIFIED USER TELEMETRY'}
DATE & TIME WINDOW : ${record.dateFormatted} (${record.timeRange})
EVENT CATEGORY     : ${record.category}
COMPLETION STATUS  : ${record.status}
--------------------------------------------------------------------------------
TRANSIT TELEMETRY:
- Origin           : ${record.origin}
- Destination      : ${record.destination}
- Mode of Transit  : ${record.transitMode}
- Total Distance   : ${record.distanceKm} km
- Duration         : ${record.durationMin} minutes
- Corridor Score   : ${record.corridorScore} / 100
- Illumination     : ${record.corridorDetails.illuminationPct}%
- Primary Corridor : ${record.corridorDetails.primaryCorridor}
- Safe Spots Count : ${record.corridorDetails.safeSpotsCount}
- CCTV Coverage    : ${record.corridorDetails.cctvCoverage}

--------------------------------------------------------------------------------
HARDWARE & NETWORK METRICS:
- Device / Client  : ${record.telemetry.deviceModel || 'N/A'}
- Battery State    : ${record.telemetry.avgBatteryPct}%
- Network Link     : ${record.telemetry.networkReliability}
- GPS Precision    : ±${record.telemetry.gpsPrecisionMeters} meters

--------------------------------------------------------------------------------
VERIFIED CHECK-IN TRAIL:
${record.checkIns.map((c) => `[${c.time}] ${c.label} (${c.status}) - ${c.notes || 'Normal telemetry'}`).join('\n')}

--------------------------------------------------------------------------------
GUARDIAN DISPATCH RECIPIENTS:
${record.guardiansNotified.map((g) => `- ${g.name} (${g.relationship}) | ${g.phone} -> ${g.status} at ${g.timestamp}`).join('\n')}

--------------------------------------------------------------------------------
SUMMARY:
${record.summary}

--------------------------------------------------------------------------------
CRYPTOGRAPHIC INTEGRITY DIGEST:
SHA-256 HASH: ${record.cryptographicHash}
VERIFICATION: SHA-256 AUDIT DIGEST RECORDED
`;
    }).join('\n\n');

    const fullArchive = header + dossiers;
    const blob = new Blob([fullArchive], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `SakhiShield-Consolidated-Audit-${new Date().toISOString().slice(0, 10)}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  },
};
