// SakhiShield — Digital Safety Assessment Service
// Gathers observable session and privacy telemetry, performs deterministic checks, and derives findings.

import type {
  DigitalSafetyState,
  SecurityScore,
  SecurityRecommendation,
  SessionSecurityContext,
  PrivacySecurityContext,
} from '../types';
import type { AuthUser } from '../../../lib/auth';
import { inspectBrowserEnvironment, inspectPrivacyContext } from '../utils/privacyAnalyzer';
import { buildVerifiableSecurityChecks, calculateDeterministicSecurityScore } from '../utils/securityScoring';
import { generateRecommendations } from '../utils/securityRecommendations';
import { trustedCircleService } from '../../../services/trustedCircleService';

export class DigitalSafetyService {
  /**
   * Conducts a full assessment across observable browser and account signals
   */
  public async runFullAssessment(authUser: AuthUser | null): Promise<DigitalSafetyState> {
    const session: SessionSecurityContext = inspectBrowserEnvironment(authUser);

    // Fetch trusted circle count from local/cloud service
    let circleCount = 0;
    try {
      const circles = await trustedCircleService.getUserCircles(authUser?.id || 'local');
      if (circles && circles.length > 0) {
        const members = await trustedCircleService.getCircleMembers(circles[0].id);
        circleCount = members.length;
      }
    } catch {
      circleCount = 0;
    }

    const privacy: PrivacySecurityContext = await inspectPrivacyContext(circleCount);

    const { checks, findings } = buildVerifiableSecurityChecks(session, privacy);
    const score: SecurityScore = calculateDeterministicSecurityScore(checks);
    const recommendations: SecurityRecommendation[] = generateRecommendations(findings);

    return {
      score,
      checks,
      findings,
      recommendations,
      session,
      privacy,
      lastAssessedAt: new Date().toISOString(),
      isLoading: false,
    };
  }
}

export const digitalSafetyService = new DigitalSafetyService();
