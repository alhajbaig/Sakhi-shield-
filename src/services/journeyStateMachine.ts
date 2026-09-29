// Walk With Me - Deterministic Journey State Machine Validator
// Enforces strict allowed lifecycle transitions and prevents race conditions across multi-tab events.

import type { JourneyLifecycleState } from '../types/journey';

const VALID_TRANSITIONS: Record<JourneyLifecycleState, readonly JourneyLifecycleState[]> = {
  IDLE: ['SETTING_UP', 'ROUTE_READY', 'STARTING', 'ACTIVE', 'ERROR'],
  SETTING_UP: ['IDLE', 'ROUTE_READY', 'CANCELLED', 'ERROR'],
  ROUTE_READY: ['IDLE', 'SETTING_UP', 'STARTING', 'ACTIVE', 'CANCELLED', 'ERROR'],
  STARTING: ['ACTIVE', 'CANCELLED', 'ERROR', 'IDLE'],
  ACTIVE: [
    'CHECK_IN_REQUIRED',
    'SUSPICION',
    'FINAL_CHECK_IN',
    'UNCOMFORTABLE',
    'HELP_REQUESTED',
    'ESCALATING',
    'ARRIVED',
    'COMPLETING',
    'COMPLETED',
    'CANCELLED',
    'ERROR',
  ],
  CHECK_IN_REQUIRED: [
    'ACTIVE',
    'SUSPICION',
    'FINAL_CHECK_IN',
    'UNCOMFORTABLE',
    'HELP_REQUESTED',
    'ESCALATING',
    'COMPLETING',
    'COMPLETED',
    'CANCELLED',
    'ERROR',
  ],
  SUSPICION: [
    'ACTIVE',
    'FINAL_CHECK_IN',
    'UNCOMFORTABLE',
    'HELP_REQUESTED',
    'ESCALATING',
    'COMPLETING',
    'COMPLETED',
    'CANCELLED',
    'ERROR',
  ],
  FINAL_CHECK_IN: [
    'ACTIVE',
    'HELP_REQUESTED',
    'ESCALATING',
    'COMPLETING',
    'COMPLETED',
    'CANCELLED',
    'ERROR',
  ],
  UNCOMFORTABLE: [
    'ACTIVE',
    'HELP_REQUESTED',
    'ESCALATING',
    'COMPLETING',
    'COMPLETED',
    'CANCELLED',
    'ERROR',
  ],
  HELP_REQUESTED: [
    'ACTIVE',
    'ESCALATING',
    'COMPLETING',
    'COMPLETED',
    'CANCELLED',
    'ERROR',
  ],
  ESCALATING: [
    'ACTIVE', // User explicitly resolves escalation or confirms safe
    'COMPLETING',
    'COMPLETED',
    'CANCELLED',
    'ERROR',
  ],
  ARRIVED: ['COMPLETING', 'COMPLETED', 'CANCELLED', 'ACTIVE'],
  COMPLETING: ['COMPLETED', 'CANCELLED', 'ERROR'],
  // Terminal states cannot transition back to ACTIVE, SUSPICION, or ESCALATING
  COMPLETED: ['IDLE', 'SETTING_UP'],
  CANCELLED: ['IDLE', 'SETTING_UP'],
  ERROR: ['IDLE', 'CANCELLED', 'SETTING_UP'],
};

/**
 * Validates whether a state transition from `fromState` to `toState` is mathematically legal.
 */
export function isValidJourneyTransition(
  fromState: JourneyLifecycleState,
  toState: JourneyLifecycleState
): boolean {
  if (fromState === toState) return true; // Idempotent self-transition is safe
  const allowed = VALID_TRANSITIONS[fromState];
  if (!allowed) return false;
  return allowed.includes(toState);
}

/**
 * Transition logger and safety gate for state mutations.
 */
export function safeJourneyTransition(
  current: JourneyLifecycleState,
  target: JourneyLifecycleState,
  triggerReason?: string
): { allowed: boolean; nextState: JourneyLifecycleState; warning?: string } {
  if (current === target) {
    return { allowed: true, nextState: target };
  }

  const allowed = isValidJourneyTransition(current, target);
  if (!allowed) {
    const warning = `[JourneyStateMachine] Rejected illegal transition: ${current} ➔ ${target} (trigger: ${triggerReason || 'unknown'})`;
    console.warn(warning);
    return { allowed: false, nextState: current, warning };
  }

  return { allowed: true, nextState: target };
}
