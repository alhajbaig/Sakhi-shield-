// SakhiShield — Security Recommendations Generator
// Generates prioritized, actionable advice without alarmist or misleading terminology.

import type { SecurityFinding, SecurityRecommendation } from '../types';

export function generateRecommendations(findings: SecurityFinding[]): SecurityRecommendation[] {
  const recommendations: SecurityRecommendation[] = [];

  // Prioritize findings by severity
  const sortedFindings = [...findings].sort((a, b) => {
    const priorityMap = { critical: 4, high: 3, medium: 2, low: 1 };
    return priorityMap[b.severity] - priorityMap[a.severity];
  });

  sortedFindings.forEach((finding) => {
    let actionLabel = 'Review Finding';
    let actionType: SecurityRecommendation['actionType'] = 'TRIGGER_ACTION';
    let target: string | undefined = finding.actionId;

    if (finding.category === 'PRIVACY_EXPOSURE') {
      actionLabel = 'Configure Circle';
      actionType = 'NAVIGATE';
      target = '/trusted-circle';
    } else if (finding.category === 'AUTHENTICATION') {
      actionLabel = 'Sign In / Register';
      actionType = 'NAVIGATE';
      target = '/login';
    } else if (finding.category === 'TWO_FACTOR') {
      actionLabel = '2FA Setup Guide';
      actionType = 'TRIGGER_ACTION';
      target = 'GUIDE_2FA';
    }

    recommendations.push({
      id: `rec_${finding.id}`,
      title: `Remediate: ${finding.title}`,
      description: `${finding.remediationStep} ${finding.impact}`,
      priority: finding.severity,
      category: finding.category,
      actionLabel,
      actionType,
      target,
    });
  });

  // Always append standard best practice hygiene recommendations
  if (recommendations.length === 0) {
    recommendations.push({
      id: 'rec_audit_passwords',
      title: 'Periodic Password & Credential Audit',
      description: 'Use the local password analyzer to test credential complexity without transmitting it over the network.',
      priority: 'low',
      category: 'PASSWORD_HYGIENE',
      actionLabel: 'Analyze Password',
      actionType: 'TRIGGER_ACTION',
      target: 'FOCUS_PASSWORD_TOOL',
    });

    recommendations.push({
      id: 'rec_review_links',
      title: 'Verify Inbound Message Links',
      description: 'Before tapping links received in SMS or chat apps, inspect domain structure and protocol with the link analyzer.',
      priority: 'low',
      category: 'PHISHING_PROTECTION',
      actionLabel: 'Analyze a Link',
      actionType: 'TRIGGER_ACTION',
      target: 'FOCUS_LINK_TOOL',
    });
  }

  return recommendations;
}
