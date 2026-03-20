import { PurchaseState, PurchaseStateResponse, PrivyEligibilityResponse, PrivyEligibilityDetails } from '../types/index.js';

/**
 * Configuration for PurchaseStateManager
 */
export interface PurchaseStateManagerConfig {
  apiEndpoint: string;
  timeout?: number;
}

/**
 * Manages purchase state logic and API interactions
 * Handles data filtering to expose only safe data to publisher apps
 */
export class PurchaseStateManager {
  private config: PurchaseStateManagerConfig;

  constructor(config: PurchaseStateManagerConfig) {
    this.config = {
      timeout: 5000,
      ...config
    };
  }

  /**
   * Check purchase state for a specific item
   * Filters raw API response to expose only safe data to publisher apps
   */
  async checkItemPurchaseState(itemId: string): Promise<PurchaseStateResponse> {
    try {
      const response = await fetch(`${this.config.apiEndpoint}/items/${itemId}/purchase-state`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        signal: AbortSignal.timeout(this.config.timeout!)
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status} ${response.statusText}`);
      }

      const rawData: PrivyEligibilityResponse = await response.json();

      // Filter the response to expose only safe data to publisher apps
      return this.filterPurchaseStateResponse(rawData);

    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Unknown error occurred while checking purchase state');
    }
  }

  /**
   * Filters raw API response to expose only safe data to publisher apps
   * CRITICAL: Raw privyEligibility map must NEVER be exposed to apps
   */
  private filterPurchaseStateResponse(rawResponse: PrivyEligibilityResponse): PurchaseStateResponse {
    const filteredResponse: PurchaseStateResponse = {
      state: rawResponse.state
    };

    // For PRIVY_REQUIRED state, extract and expose only the requiredLevel
    if (rawResponse.state === PurchaseState.PRIVY_REQUIRED && rawResponse.privyEligibility) {
      // Find the highest required level from all privy eligibility entries
      const requiredLevels = Object.values(rawResponse.privyEligibility)
        .filter((details: PrivyEligibilityDetails) => details.requiresUpgrade)
        .map((details: PrivyEligibilityDetails) => details.requiredLevel);

      if (requiredLevels.length > 0) {
        filteredResponse.requiredLevel = Math.max(...requiredLevels);
      }
    }

    return filteredResponse;
  }
}