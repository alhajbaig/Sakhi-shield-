// SakhiShield — Trusted Circle 2.0 Automated Verification Suite
// Tests invite code security, join approval flow, multi-recipient state machine,
// fail-safe async SOS dispatch, idempotency, audio controls, and alert resolution.

import { generateSecureInviteCode, trustedCircleService } from '../services/trustedCircleService';
import { trustedCircleAlertService } from '../services/trustedCircleAlertService';
import { emergencyAudioManager } from '../services/emergencyAudioManager';

// Mock localStorage and window in node environment if needed
if (typeof globalThis.localStorage === 'undefined') {
  const store: Record<string, string> = {};
  globalThis.localStorage = {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, val: string) => {
      store[key] = val;
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      for (const k in store) delete store[k];
    },
    length: 0,
    key: () => null,
  };
}

function assert(condition: boolean, message: string) {
  if (!condition) {
    console.error(`❌ FAILED: ${message}`);
    throw new Error(`Test assertion failed: ${message}`);
  }
  console.log(`✅ PASSED: ${message}`);
}

async function runTests() {
  console.log('====================================================');
  console.log('RUNNING TRUSTED CIRCLE 2.0 AUTOMATED TEST SUITE');
  console.log('====================================================\n');

  // ----------------------------------------------------
  // 1. INVITATION CODE SECURITY & GENERATION
  // ----------------------------------------------------
  console.log('--- 1. Secure Invitation Code Generation ---');
  const code1 = generateSecureInviteCode();
  const code2 = generateSecureInviteCode();

  assert(code1.startsWith('SC-'), `Code must start with SC- prefix (got ${code1})`);
  assert(code1.length === 9, `Code must be exactly 9 characters with SC- (got length ${code1.length})`);
  assert(code1 !== code2, `Generated codes must be cryptographically unique (${code1} !== ${code2})`);

  // Ensure forbidden confusing glyphs (0, O, 1, I, l) are never used
  const forbiddenChars = ['0', 'O', '1', 'I', 'l'];
  const hasForbidden = forbiddenChars.some((c) => code1.slice(3).includes(c));
  assert(!hasForbidden, `Invite code must not contain ambiguous characters 0, O, 1, I, l (${code1})`);

  // ----------------------------------------------------
  // 2. CIRCLE CREATION & OWNER PROVISIONING
  // ----------------------------------------------------
  console.log('\n--- 2. Circle Creation & Owner Provisioning ---');
  const userAanchal = {
    id: 'usr_aanchal_001',
    name: 'Aanchal',
    email: 'aanchal@sakhishield.test',
    phone: '+919876543210',
  };

  const familyCircle = await trustedCircleService.createCircle({
    name: 'Family',
    description: 'Immediate trusted safety network',
    ownerId: userAanchal.id,
    ownerName: userAanchal.name,
    ownerPhone: userAanchal.phone,
    ownerEmail: userAanchal.email,
    joinMode: 'APPROVAL_REQUIRED',
  });

  assert(familyCircle.name === 'Family', 'Circle name must match');
  assert(familyCircle.owner_id === userAanchal.id, 'Owner ID must match Aanchal');
  assert(familyCircle.join_mode === 'APPROVAL_REQUIRED', 'Join mode must be APPROVAL_REQUIRED');

  // Check owner membership
  const members = await trustedCircleService.getCircleMembers(familyCircle.id);
  assert(members.length === 1, `Must have 1 member initially (got ${members.length})`);
  assert(members[0].user_id === userAanchal.id, 'First member must be Aanchal');
  assert(members[0].role === 'OWNER', 'Aanchal role must be OWNER');
  assert(members[0].status === 'APPROVED', 'Owner status must be APPROVED');

  // ----------------------------------------------------
  // 3. GUARDIAN JOIN REQUEST LIFECYCLE (Mom joins)
  // ----------------------------------------------------
  console.log('\n--- 3. Guardian Join Request & Approval Lifecycle ---');
  const userMom = {
    id: 'usr_mom_002',
    name: 'Mom',
    email: 'mom@sakhishield.test',
    phone: '+919876543211',
  };

  // Mom enters the code SC-XXXXXX
  const joinResult = await trustedCircleService.joinCircleByCode({
    code: familyCircle.invite_code,
    userId: userMom.id,
    userName: userMom.name,
    userPhone: userMom.phone,
    userEmail: userMom.email,
  });

  assert(joinResult.isPending === true, 'Join result must be pending under APPROVAL_REQUIRED mode');
  assert(joinResult.circle.id === familyCircle.id, 'Joined circle ID must match Family Circle');

  // Aanchal inspects circle members and pending requests
  const membersAfterJoin = await trustedCircleService.getCircleMembers(familyCircle.id);
  const pendingRequests = membersAfterJoin.filter((m) => m.status === 'PENDING');
  assert(pendingRequests.length === 1, `Must have 1 pending join request (got ${pendingRequests.length})`);
  assert(pendingRequests[0].user_id === userMom.id, 'Pending request user must be Mom');

  // Aanchal approves Mom
  await trustedCircleService.approveMember(pendingRequests[0].id, userAanchal.id);

  const membersAfterApproval = await trustedCircleService.getCircleMembers(familyCircle.id);
  const activeMembers = membersAfterApproval.filter((m) => m.status === 'APPROVED');
  assert(activeMembers.length === 2, `Active members count must now be 2 (got ${activeMembers.length})`);
  const momMember = activeMembers.find((m) => m.user_id === userMom.id);
  assert(Boolean(momMember), 'Mom must be in active members list');
  assert(momMember?.role === 'MEMBER', 'Mom role must be MEMBER');

  // ----------------------------------------------------
  // 4. MULTI-MEMBER GUARDIAN ADDITION (Sister joins)
  // ----------------------------------------------------
  console.log('\n--- 4. Multi-Member Guardian Addition ---');
  const userSister = {
    id: 'usr_sister_003',
    name: 'Sister',
    email: 'sister@sakhishield.test',
    phone: '+919876543212',
  };

  await trustedCircleService.joinCircleByCode({
    code: familyCircle.invite_code,
    userId: userSister.id,
    userName: userSister.name,
    userPhone: userSister.phone,
    userEmail: userSister.email,
  });

  const pendingSister = (await trustedCircleService.getCircleMembers(familyCircle.id)).find(
    (m) => m.user_id === userSister.id
  );
  if (pendingSister) {
    await trustedCircleService.approveMember(pendingSister.id, userAanchal.id);
  }

  const finalMembers = (await trustedCircleService.getCircleMembers(familyCircle.id)).filter(
    (m) => m.status === 'APPROVED'
  );
  assert(finalMembers.length === 3, `Family circle must now have 3 active guardians (got ${finalMembers.length})`);

  // ----------------------------------------------------
  // 5. FAIL-SAFE ASYNCHRONOUS SOS & IDEMPOTENCY
  // ----------------------------------------------------
  console.log('\n--- 5. Fail-Safe SOS Alert Dispatch & Idempotency ---');
  const sourceEventId = 'sos_test_event_9918';

  const alert1 = await trustedCircleAlertService.triggerAlert({
    circleId: familyCircle.id,
    triggeredByUserId: userAanchal.id,
    triggeredByUserName: userAanchal.name,
    alertType: 'manual_sos',
    severity: 'CRITICAL',
    message: 'Manual SOS Emergency beacon activated.',
    locationShared: false,
    sourceEventId,
  });

  assert(alert1 !== null, 'Alert must be created');
  assert(alert1?.status === 'ACTIVE', `Alert status must be ACTIVE (got ${alert1?.status})`);
  assert(alert1?.severity === 'CRITICAL', 'Alert severity must be CRITICAL');
  assert(alert1?.recipients?.length === 2, `Alert must have 2 recipients (Mom and Sister, got ${alert1?.recipients?.length})`);

  // Test Idempotency: double-trigger with same event ID must not duplicate
  const alert2 = await trustedCircleAlertService.triggerAlert({
    circleId: familyCircle.id,
    triggeredByUserId: userAanchal.id,
    triggeredByUserName: userAanchal.name,
    alertType: 'manual_sos',
    severity: 'CRITICAL',
    message: 'Manual SOS Emergency beacon activated (retry).',
    locationShared: false,
    sourceEventId,
  });

  assert(alert1?.id === alert2?.id, `Idempotency verified: alert IDs must be identical (${alert1?.id} === ${alert2?.id})`);

  // ----------------------------------------------------
  // 6. MULTI-RECIPIENT STATE MACHINE & ACKNOWLEDGEMENT
  // ----------------------------------------------------
  console.log('\n--- 6. Multi-Recipient Independent State Machine ---');
  // Mom acknowledges
  await trustedCircleAlertService.acknowledgeAlert(alert1!.id, userMom.id, userMom.name);

  const { outgoingAlerts } = await trustedCircleAlertService.getActiveAlertsForUser(userAanchal.id);
  const activeAlert = outgoingAlerts.find((a) => a.id === alert1!.id);

  assert(Boolean(activeAlert), 'Active alert must exist in outgoing alerts');
  const momRecip = activeAlert?.recipients?.find((r) => r.user_id === userMom.id);
  const sisterRecip = activeAlert?.recipients?.find((r) => r.user_id === userSister.id);

  assert(momRecip?.status === 'ACKNOWLEDGED', `Mom recipient status must be ACKNOWLEDGED (got ${momRecip?.status})`);
  assert(sisterRecip?.status === 'SENT', `Sister recipient status must remain SENT (got ${sisterRecip?.status})`);
  assert(Boolean(momRecip?.acknowledged_at), 'Mom acknowledged_at timestamp must be recorded');

  // ----------------------------------------------------
  // 7. EMERGENCY LOCATION TRANSMISSION
  // ----------------------------------------------------
  console.log('\n--- 7. Emergency Location Transmission ---');
  await trustedCircleAlertService.shareLocation(alert1!.id, 28.6139, 77.209, 12);

  const { incomingAlerts: momAlerts } = await trustedCircleAlertService.getActiveAlertsForUser(userMom.id);
  const momReceivedAlert = momAlerts.find((a) => a.id === alert1!.id);

  assert(momReceivedAlert?.location_shared === true, 'Location shared flag must be true');
  assert(momReceivedAlert?.latitude === 28.6139, 'Latitude must match');
  assert(momReceivedAlert?.longitude === 77.209, 'Longitude must match');
  assert(momReceivedAlert?.location_accuracy === 12, 'Accuracy must match');

  // ----------------------------------------------------
  // 8. ALERT RESOLUTION (I'M SAFE)
  // ----------------------------------------------------
  console.log('\n--- 8. Alert Resolution (I\'m Safe) ---');
  await trustedCircleAlertService.resolveAlert(alert1!.id, userAanchal.id);

  const { outgoingAlerts: afterResolveOutgoing } = await trustedCircleAlertService.getActiveAlertsForUser(userAanchal.id);
  assert(afterResolveOutgoing.length === 0, 'Active outgoing alerts must now be 0 after resolution');

  const resolvedAlert = trustedCircleAlertService.getAlertById(alert1!.id);
  assert(resolvedAlert?.status === 'RESOLVED', `Alert status must transition to RESOLVED (got ${resolvedAlert?.status})`);
  assert(Boolean(resolvedAlert?.resolved_at), 'Alert resolved_at must be populated');

  // Siren must be stopped
  assert(emergencyAudioManager.isPlaying() === false, 'Audio siren must be stopped upon resolution');

  // ----------------------------------------------------
  // 9. INVITATION CODE REGENERATION
  // ----------------------------------------------------
  console.log('\n--- 9. Invitation Code Regeneration ---');
  const oldCode = familyCircle.invite_code;
  const newCode = await trustedCircleService.regenerateInviteCode(familyCircle.id);

  assert(newCode !== oldCode, `New code must differ from old code (${newCode} !== ${oldCode})`);
  assert(newCode.startsWith('SC-'), 'New code must start with SC-');

  // Old code must no longer allow joining
  let oldCodeFailed = false;
  try {
    await trustedCircleService.joinCircleByCode({
      code: oldCode,
      userId: 'usr_stranger_004',
      userName: 'Stranger',
    });
  } catch {
    oldCodeFailed = true;
  }
  assert(oldCodeFailed, 'Attempting to join with old revoked code must fail');

  console.log('\n====================================================');
  console.log('ALL TRUSTED CIRCLE 2.0 AUTOMATED TESTS PASSED! 🎉');
  console.log('====================================================');
}

runTests().catch((err) => {
  console.error('Test suite failed:', err);
  process.exit(1);
});
