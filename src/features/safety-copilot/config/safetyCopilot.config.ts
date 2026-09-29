// SakhiShield — Safety Copilot Configuration

export interface SafetyCopilotConfig {
  provider: 'edge-function' | 'fallback-only';
  edgeFunctionName: string;
  timeoutMs: number;
  maxTokens: number;
  temperature: number;
  enableActionOffers: boolean;
  enableOfflinePersistence: boolean;
}

export const safetyCopilotConfig: SafetyCopilotConfig = {
  provider: 'edge-function',
  edgeFunctionName: 'safety-copilot',
  timeoutMs: 12000,
  maxTokens: 350,
  temperature: 0.2, // Low temperature for deterministic, factual, grounded safety advice
  enableActionOffers: true,
  enableOfflinePersistence: true,
};
