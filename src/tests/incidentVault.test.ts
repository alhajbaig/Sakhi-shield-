// SakhiShield — Incident Vault Automated Unit & Integration Tests
// Validates file validation, SHA-256 integrity calculation, incident lifecycle, and expiring share tokens.

import { validateEvidenceFile, sanitizeFileName } from '../features/incident-vault/utils/fileValidation';
import { computeFileSha256, verifyEvidenceIntegrity } from '../features/incident-vault/utils/hashing';
import { buildIncidentExportData } from '../features/incident-vault/utils/export';
import { incidentService } from '../features/incident-vault/services/incidentService';
import { evidenceService } from '../features/incident-vault/services/evidenceService';
import { sharingService } from '../features/incident-vault/services/sharingService';

function assert(condition: boolean, msg: string) {
  if (!condition) {
    console.error(`❌ ASSERTION FAILED: ${msg}`);
    process.exit(1);
  }
}

async function runTests() {
  console.log('🧪 Starting Incident Vault Automated Test Suite...\n');

  // TEST 1: Filename Sanitization & Path Traversal Defense
  console.log('Test 1: File Sanitization - Path traversal defense');
  const dangerousName = '../../etc/passwd..//malicious.jpg';
  const cleanName = sanitizeFileName(dangerousName);
  assert(!cleanName.includes('..') && !cleanName.includes('/'), 'Must strip path traversal sequences');
  assert(cleanName.endsWith('.jpg'), 'Must preserve valid extension');
  console.log(`✅ Test 1 Passed: "${dangerousName}" sanitized to "${cleanName}".\n`);

  // TEST 2: File Validation & MIME Types
  console.log('Test 2: Evidence File Validation');
  const fakeImageFile = new File(['fake-png-bytes'], 'screenshot_threat.png', { type: 'image/png' });
  const valResult = validateEvidenceFile(fakeImageFile);
  assert(valResult.valid === true, 'Valid PNG file must pass validation');
  assert(valResult.category === 'SCREENSHOT', 'Screenshot name should map to SCREENSHOT category');

  const exeFile = new File(['binary-payload'], 'malware.exe', { type: 'application/x-msdownload' });
  const invalidResult = validateEvidenceFile(exeFile);
  assert(invalidResult.valid === false, 'Executable files must be rejected');
  console.log('✅ Test 2 Passed: Evidence file validation rejects unpermitted types.\n');

  // TEST 3: Cryptographic SHA-256 Hashing & Integrity Verification
  console.log('Test 3: Cryptographic SHA-256 Hashing & Verification');
  const fileContent = 'SakhiShield Evidence Byte Stream - Incident #9821';
  const fileObj = new File([fileContent], 'evidence.txt', { type: 'text/plain' });
  
  const hash1 = await computeFileSha256(fileObj);
  assert(hash1.startsWith('0x') && hash1.length === 66, 'Hash must be 0x-prefixed 64 hex characters');

  // Verify matches
  const isMatch = await verifyEvidenceIntegrity(fileObj, hash1);
  assert(isMatch === true, 'Original bytes must match calculated SHA-256 digest');

  // Tampered file test
  const tamperedFile = new File(['Tampered content!'], 'evidence.txt', { type: 'text/plain' });
  const isTamperedMatch = await verifyEvidenceIntegrity(tamperedFile, hash1);
  assert(isTamperedMatch === false, 'Tampered file bytes must fail verification');
  console.log(`✅ Test 3 Passed: SHA-256 computed (${hash1.substring(0, 14)}...) and tampering detected.\n`);

  // TEST 4: Incident Lifecycle (Creation, Update, Status Transitions)
  console.log('Test 4: Incident Lifecycle Operations');
  const mockUserId = 'usr_test_vault_owner';
  const createdIncident = await incidentService.createIncident({
    userId: mockUserId,
    title: 'Suspicious Vehicle Loitering at Transit Stop',
    description: 'White hatchback vehicle circled bus shelter three times with no passenger pickup.',
    category: 'SUSPICIOUS_ACTIVITY',
    severity: 'MEDIUM',
    location: { name: 'Sector 14 Transit Stand' },
  });

  assert(createdIncident.id.startsWith('inc_'), 'Incident ID must be generated with inc_ prefix');
  assert(createdIncident.status === 'ACTIVE', 'Initial status must be ACTIVE');

  // Update status to DOCUMENTED
  const updatedIncident = await incidentService.updateIncident(createdIncident.id, mockUserId, {
    status: 'DOCUMENTED',
    notes: 'Witness observed vehicle plates ending in 421.',
  });
  assert(updatedIncident.status === 'DOCUMENTED', 'Status must transition to DOCUMENTED');
  assert(Boolean(updatedIncident.notes?.includes('421')), 'Notes must be updated');

  // Fetch timeline
  const timeline = await incidentService.getTimeline(createdIncident.id, mockUserId);
  assert(timeline.length >= 2, 'Timeline must record INCIDENT_CREATED and STATUS_CHANGED');
  console.log('✅ Test 4 Passed: Incident created, updated, and timeline tracked successfully.\n');

  // TEST 5: Evidence Attachment & Metadata
  console.log('Test 5: Evidence Attachment Lifecycle');
  const evidenceMeta = await evidenceService.uploadEvidence({
    incidentId: createdIncident.id,
    userId: mockUserId,
    file: fileObj,
    description: 'Original text memorandum recorded at shelter.',
  });

  assert(evidenceMeta.id.startsWith('evd_'), 'Evidence ID must be generated with evd_ prefix');
  assert(evidenceMeta.sha256Hash === hash1, 'Stored SHA-256 hash must match computed digest');
  assert(evidenceMeta.integrityStatus === 'VERIFIED', 'Integrity status must be VERIFIED');
  console.log('✅ Test 5 Passed: Evidence attached with verified cryptographic hash.\n');

  // TEST 6: Expiring Secure Sharing
  console.log('Test 6: Expiring Share Token Creation & Revocation');
  const { share, rawShareToken, shareUrl } = await sharingService.createShareLink({
    incidentId: createdIncident.id,
    userId: mockUserId,
    scope: 'FULL_INCIDENT',
    durationHours: 24,
  });

  assert(rawShareToken.length === 64, 'Raw token must be 32 bytes (64 hex characters)');
  assert(share.shareTokenHash !== rawShareToken, 'Never store raw token in cleartext');
  assert(shareUrl.includes(rawShareToken), 'Share URL must contain bearer token');
  assert(share.isRevoked === false, 'New share must not be revoked');

  // Revoke share
  await sharingService.revokeShare(createdIncident.id, share.id, mockUserId);
  const shares = await sharingService.getShares(createdIncident.id, mockUserId);
  const revoked = shares.find((s) => s.id === share.id);
  assert(revoked?.isRevoked === true, 'Revoked share must immediately be marked revoked');
  console.log('✅ Test 6 Passed: Expiring share generated and successfully revoked.\n');

  // TEST 7: Incident Dossier Export Integrity
  console.log('Test 7: Incident Export Package Construction');
  const exportData = buildIncidentExportData(updatedIncident, [evidenceMeta], timeline);
  assert(exportData.exportVersion === '1.0.0', 'Export format must be versioned');
  assert(exportData.incident.id === createdIncident.id, 'Incident data must be contained');
  assert(exportData.evidence.length === 1, 'Evidence metadata must be included');
  assert(exportData.integrityVerification.allFilesIntact === true, 'Verification flags must report intact');
  console.log('✅ Test 7 Passed: Export dossier generated with integrity verification records.\n');

  console.log('🎉 ALL INCIDENT VAULT ACCEPTANCE TESTS PASSED SUCCESSFULLY!');
}

runTests().catch((err) => {
  console.error('Fatal test error in incident vault:', err);
  process.exit(1);
});
