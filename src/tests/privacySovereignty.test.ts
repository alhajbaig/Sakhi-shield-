// SakhiShield — Automated Test Suite for Privacy & Data Sovereignty Module

import assert from 'node:assert';
import { validatePrivacyPreferences } from '../features/privacy-data-sovereignty/utils/privacyValidation';
import { executeTelemetryRetentionPurge } from '../features/privacy-data-sovereignty/utils/ephemeralStorage';
import { privacyService } from '../features/privacy-data-sovereignty/services/privacyService';
import { privacyExportService } from '../features/privacy-data-sovereignty/services/privacyExportService';
import type { PrivacyPreferences } from '../features/privacy-data-sovereignty/types/privacy.types';

console.log('🧪 Starting Privacy & Data Sovereignty Automated Test Suite...\n');

// ── Test 1: Validation of Valid & Invalid Preferences ──
console.log('Test 1: Privacy Preferences Validation');
const validPrefs: Partial<PrivacyPreferences> = {
  gpsRetention: '24_HOURS',
  locationMode: 'PRECISE',
  evidenceRetention: '30_DAYS',
  notificationPrivacy: 'MINIMAL_DETAILS',
};
const validRes = validatePrivacyPreferences(validPrefs);
assert.strictEqual(validRes.isValid, true, 'Valid preferences should pass validation');
assert.strictEqual(validRes.errors.length, 0);

const invalidPrefs: any = {
  gpsRetention: 'INFINITE_TRACKING',
  locationMode: 'INVALID_MODE',
  evidenceRetention: '500_DAYS',
};
const invalidRes = validatePrivacyPreferences(invalidPrefs);
assert.strictEqual(invalidRes.isValid, false, 'Invalid preferences should be rejected');
assert(invalidRes.errors.length >= 3, 'Should catch multiple validation errors');
console.log('✅ Test 1 Passed: Privacy preference boundaries strictly validated.\n');

// ── Test 2: Ephemeral GPS & Session Telemetry Purge ──
console.log('Test 2: Ephemeral Storage Retention Purge');
const purgeResult = executeTelemetryRetentionPurge('SESSION_ONLY', '7_DAYS');
assert.strictEqual(typeof purgeResult.purgedSessions, 'number');
assert.strictEqual(typeof purgeResult.purgedGpsPoints, 'number');
assert.strictEqual(purgeResult.success, true);
console.log('✅ Test 2 Passed: Ephemeral telemetry purge executed cleanly.\n');

// ── Test 3: Privacy Service Local Fallback & Audit Log ──
console.log('Test 3: Privacy Service Retrieval & Audit Events');
const testUserId = 'usr_test_privacy_001';
const initialPrefs = await privacyService.getPreferences(testUserId);
assert.ok(initialPrefs, 'Initial preferences must exist');
assert.strictEqual(initialPrefs.userId, testUserId);

const updateRes = await privacyService.updatePreferences(testUserId, {
  gpsRetention: 'SESSION_ONLY',
  locationMode: 'APPROXIMATE_1KM',
});
assert.strictEqual(updateRes.success, true);
assert.strictEqual(updateRes.data?.gpsRetention, 'SESSION_ONLY');
assert.strictEqual(updateRes.data?.locationMode, 'APPROXIMATE_1KM');

const auditEvents = privacyService.getAuditEvents(testUserId);
assert(auditEvents.length > 0, 'Audit event must be logged upon updating preferences');
assert.strictEqual(auditEvents[0].eventType, 'RETENTION_POLICY_UPDATED');
console.log('✅ Test 3 Passed: Service updates persist and log tamper-evident audit events.\n');

// ── Test 4: Data Sovereignty Export & SHA-256 Checksum ──
console.log('Test 4: Data Export Dossier & Integrity Checksum');
const exportPayload = await privacyExportService.generateExportPayload(
  testUserId,
  { fullName: 'Test User', email: 'test@sakhishield.org' },
  updateRes.data!,
  3
);

assert.strictEqual(exportPayload.exportMetadata.system, 'SakhiShield Sovereign Data Engine');
assert.strictEqual(exportPayload.profile.fullName, 'Test User');
assert.strictEqual(exportPayload.trustedCircleCount, 3);
assert(exportPayload.exportMetadata.sha256Checksum?.startsWith('sha256:'), 'SHA-256 checksum must be computed');
console.log('✅ Test 4 Passed: Sovereign export package generated with SHA-256 checksum.\n');

// ── Test 5: Targeted Data Deletion Execution ──
console.log('Test 5: Targeted Data Deletion');
const deleteRes = await privacyExportService.executeTargetedDeletion(testUserId, 'GPS_ONLY');
assert.strictEqual(deleteRes.success, true);
assert(deleteRes.message.includes('GPS'));

const postDeleteLogs = privacyService.getAuditEvents(testUserId);
assert(postDeleteLogs.some((e) => e.eventType === 'DATA_DELETION_REQUESTED'), 'Deletion request must be recorded in audit log');
console.log('✅ Test 5 Passed: Targeted data deletion executed and audited.\n');

console.log('🎉 ALL PRIVACY & DATA SOVEREIGNTY TESTS PASSED SUCCESSFULLY!\n');
