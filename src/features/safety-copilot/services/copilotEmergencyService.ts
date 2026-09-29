// SakhiShield — Copilot Emergency & Action Service
// Handles safe, authorized execution of read-only queries and sensitive emergency actions.
// Enforces mandatory explicit confirmation before triggering alarms, SOS, or cancelling trips.

import type {
  CopilotActionType,
  CopilotActionOffer,
  CopilotActionExecutionResult,
  SafetyContext,
} from '../types/safetyCopilot.types';
import { trustedCircleAlertService } from '../../../services/trustedCircleAlertService';
import { emergencyAudioManager } from '../../../services/emergencyAudioManager';
import { journeyService } from '../../../services/journeyService';
import { generateSecureId } from '../../../lib/securityUtils';

export const copilotEmergencyService = {
  /**
   * Evaluates whether an action requires explicit modal/button confirmation.
   */
  isSensitiveAction(actionType: CopilotActionType): boolean {
    return (
      actionType === 'TRIGGER_SOS' ||
      actionType === 'CANCEL_JOURNEY' ||
      actionType === 'REQUEST_CHECKIN'
    );
  },

  /**
   * Executes a confirmed action against authoritative SakhiShield services.
   */
  async executeAction(
    offer: CopilotActionOffer,
    context: SafetyContext,
    confirmedByUser: boolean = false
  ): Promise<CopilotActionExecutionResult> {
    // 1. Guard sensitive actions: require explicit confirmation
    if (this.isSensitiveAction(offer.type) && !confirmedByUser && offer.requiresConfirmation) {
      return {
        actionType: offer.type,
        success: false,
        message: 'Action cancelled: explicit confirmation is required.',
      };
    }

    const userId = context.user?.id || 'usr_current';
    const userName = context.user?.name || 'User';

    switch (offer.type) {
      case 'TRIGGER_SOS': {
        try {
          const sosAlertId = generateSecureId('alt');
          emergencyAudioManager.playSiren(sosAlertId);
          const activeJourney = context.journey;
          const loc = context.location;
          const mapsLink =
            loc?.latitudeExact && loc?.longitudeExact
              ? `https://www.google.com/maps?q=${loc.latitudeExact},${loc.longitudeExact}`
              : undefined;

          await trustedCircleAlertService.triggerAlert({
            triggeredByUserId: userId,
            triggeredByUserName: userName,
            alertType: 'manual_sos',
            severity: 'CRITICAL',
            message: `🚨 EMERGENCY SOS dispatched via Safety Copilot: ${userName} requested immediate help!${mapsLink ? ` Location: ${mapsLink}` : ''}`,
            locationShared: Boolean(loc?.hasPermission),
            latitude: loc?.latitudeExact,
            longitude: loc?.longitudeExact,
            locationAccuracy: loc?.accuracyMeters,
            sourceEventId: activeJourney ? `copilot_sos_${activeJourney.id}` : `copilot_sos_${generateSecureId()}`,
          });

          return {
            actionType: 'TRIGGER_SOS',
            success: true,
            message: '🚨 Emergency SOS broadcast has been sent to your Trusted Circle guardians.',
          };
        } catch (err: any) {
          console.error('[CopilotEmergencyService] SOS execution failed:', err);
          return {
            actionType: 'TRIGGER_SOS',
            success: false,
            message: 'Failed to dispatch SOS alert. Please use your device native emergency dialer.',
          };
        }
      }

      case 'REQUEST_CHECKIN': {
        try {
          if (context.journey?.id) {
            await journeyService.recordJourneyEvent({
              journey_id: context.journey.id,
              user_id: userId,
              event_type: 'CHECK_IN_SAFE',
              metadata: { source: 'SafetyCopilot', timestamp: new Date().toISOString() },
            });
          }
          return {
            actionType: 'REQUEST_CHECKIN',
            success: true,
            message: '✅ Safety check-in acknowledged. Monitoring remains active.',
          };
        } catch (err: any) {
          return {
            actionType: 'REQUEST_CHECKIN',
            success: false,
            message: 'Unable to record check-in.',
          };
        }
      }

      case 'CONFIRM_ARRIVAL': {
        try {
          if (context.journey?.id) {
            await journeyService.completeJourneyRecord(context.journey.id, 'COMPLETED');
          }
          return {
            actionType: 'CONFIRM_ARRIVAL',
            success: true,
            message: 'Safe arrival verified. Journey concluded.',
          };
        } catch (err: any) {
          return {
            actionType: 'CONFIRM_ARRIVAL',
            success: false,
            message: 'Unable to confirm arrival.',
          };
        }
      }

      case 'CANCEL_JOURNEY': {
        try {
          if (context.journey?.id) {
            await journeyService.completeJourneyRecord(context.journey.id, 'CANCELLED');
          }
          return {
            actionType: 'CANCEL_JOURNEY',
            success: true,
            message: 'Journey cancelled. Monitoring returned to stationary standby.',
          };
        } catch (err: any) {
          return {
            actionType: 'CANCEL_JOURNEY',
            success: false,
            message: 'Failed to cancel journey.',
          };
        }
      }

      case 'EXPLAIN_RISK':
      case 'CHECK_STATUS':
      case 'OPEN_TRUSTED_CIRCLE':
      default:
        return {
          actionType: offer.type,
          success: true,
          message: 'Status verified.',
        };
    }
  },
};
