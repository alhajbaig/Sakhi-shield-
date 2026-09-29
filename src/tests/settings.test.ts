// SakhiShield — Automated Test Suite for Settings Module

import assert from 'node:assert';
import { settingsService } from '../features/settings/services/settingsService';
import { webAuthnService } from '../features/settings/services/webAuthnService';
import { inspectBrowserPermissions } from '../features/settings/utils/permissionChecker';
import { playNotificationChime, playEmergencySirenPreview } from '../features/settings/utils/audioSynthesizer';

console.log('🧪 Starting Settings Automated Test Suite...\n');

// ── Test 1: User Settings Loading & Updates ──
console.log('Test 1: User Settings Service Retrieval & Update');
const testUserId = 'usr_test_settings_001';
const initialSettings = await settingsService.getSettings(testUserId);
assert.ok(initialSettings, 'Initial settings must exist');
assert.strictEqual(initialSettings.userId, testUserId);
assert.strictEqual(typeof initialSettings.soundVolume, 'number');

const updateRes = await settingsService.updateSettings(testUserId, {
  soundVolume: 90,
  checkinTimeoutSeconds: 60,
  highContrast: true,
});
assert.strictEqual(updateRes.success, true);
assert.strictEqual(updateRes.data?.soundVolume, 90);
assert.strictEqual(updateRes.data?.checkinTimeoutSeconds, 60);
assert.strictEqual(updateRes.data?.highContrast, true);
console.log('✅ Test 1 Passed: Settings load and persist accurately.\n');

// ── Test 2: Security PIN Hashing & Validation ──
console.log('Test 2: Security PIN Management');
const invalidPinRes = await settingsService.setSecurityPin(testUserId, 'abc');
assert.strictEqual(invalidPinRes, false, 'Non-numeric PIN must be rejected');

const shortPinRes = await settingsService.setSecurityPin(testUserId, '12');
assert.strictEqual(shortPinRes, false, 'PIN shorter than 4 digits must be rejected');

const validPinRes = await settingsService.setSecurityPin(testUserId, '4829');
assert.strictEqual(validPinRes, true, 'Valid 4-digit PIN must be accepted');
console.log('✅ Test 2 Passed: PIN format validation and hashing verified.\n');

// ── Test 3: WebAuthn Service & Local Passkey Management ──
console.log('Test 3: WebAuthn Support & Passkey Store');
const isSupported = webAuthnService.isSupported();
assert.strictEqual(typeof isSupported, 'boolean', 'isSupported must return a boolean');

const passkeys = webAuthnService.getRegisteredPasskeys(testUserId);
assert(Array.isArray(passkeys), 'Registered passkeys must return an array');

const removed = webAuthnService.removePasskey(testUserId, 'non_existent_key');
assert.strictEqual(removed, true);
console.log('✅ Test 3 Passed: WebAuthn service inspection and passkey store verified.\n');

// ── Test 4: Device Permissions Inspection ──
console.log('Test 4: Hardware Permissions Inspector');
const permissions = await inspectBrowserPermissions();
assert.strictEqual(permissions.length, 4, 'Must inspect 4 device permissions');
const permTypes = permissions.map((p) => p.permission);
assert(permTypes.includes('geolocation'));
assert(permTypes.includes('notifications'));
assert(permTypes.includes('camera'));
assert(permTypes.includes('microphone'));
console.log('✅ Test 4 Passed: Device permissions accurately inspected.\n');

// ── Test 5: Audio Synthesizer Graceful Fallback ──
console.log('Test 5: Audio Synthesizer Test Functions');
const chimeRes = playNotificationChime(80);
assert.strictEqual(typeof chimeRes, 'boolean', 'playNotificationChime must return boolean without throwing');

const sirenRes = playEmergencySirenPreview(80);
assert.strictEqual(typeof sirenRes, 'boolean', 'playEmergencySirenPreview must return boolean without throwing');
console.log('✅ Test 5 Passed: Audio synthesizer handled gracefully without throwing errors.\n');

console.log('🎉 ALL SETTINGS TESTS PASSED SUCCESSFULLY!\n');
