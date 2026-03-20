import { describe, it, expect, vi, beforeEach } from 'vitest';
import { PurchaseState, PurchaseStateResponse, PrivyEligibilityResponse } from '../../../src/types/index.js';
import { PurchaseStateManager } from '../../../src/core/PurchaseStateManager.js';

describe('PurchaseStateManager', () => {
  let manager: PurchaseStateManager;

  beforeEach(() => {
    manager = new PurchaseStateManager({
      apiEndpoint: 'https://api.test.com'
    });
  });

  describe('Purchase State Constants', () => {
    it('should have PRIVY_REQUIRED constant', () => {
      expect(PurchaseState.PRIVY_REQUIRED).toBe('PRIVY_REQUIRED');
    });

    it('should have INSUFFICIENT_FUNDS constant', () => {
      expect(PurchaseState.INSUFFICIENT_FUNDS).toBe('INSUFFICIENT_FUNDS');
    });

    it('should have AVAILABLE constant', () => {
      expect(PurchaseState.AVAILABLE).toBe('AVAILABLE');
    });
  });

  describe('checkItemPurchaseState', () => {
    it('should return AVAILABLE state for available items', async () => {
      // Mock API response
      vi.spyOn(global, 'fetch').mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          state: PurchaseState.AVAILABLE
        })
      } as Response);

      const result = await manager.checkItemPurchaseState('item-123');

      expect(result).toEqual({
        state: PurchaseState.AVAILABLE
      });
    });

    it('should return INSUFFICIENT_FUNDS state for insufficient funds', async () => {
      // Mock API response
      vi.spyOn(global, 'fetch').mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          state: PurchaseState.INSUFFICIENT_FUNDS
        })
      } as Response);

      const result = await manager.checkItemPurchaseState('item-123');

      expect(result).toEqual({
        state: PurchaseState.INSUFFICIENT_FUNDS
      });
    });

    it('should return PRIVY_REQUIRED state with filtered requiredLevel only', async () => {
      // Mock API response with raw privyEligibility data
      const mockApiResponse: PrivyEligibilityResponse = {
        state: PurchaseState.PRIVY_REQUIRED,
        privyEligibility: {
          'level-1': {
            requiresUpgrade: true,
            currentLevel: 1,
            requiredLevel: 3
          },
          'level-2': {
            requiresUpgrade: false,
            currentLevel: 5,
            requiredLevel: 2
          }
        }
      };

      vi.spyOn(global, 'fetch').mockResolvedValueOnce({
        ok: true,
        json: async () => mockApiResponse
      } as Response);

      const result = await manager.checkItemPurchaseState('item-123');

      // Should only expose requiredLevel, not raw privyEligibility
      expect(result).toEqual({
        state: PurchaseState.PRIVY_REQUIRED,
        requiredLevel: 3 // Should be the highest required level
      });

      // Ensure raw privyEligibility is NOT exposed
      expect(result).not.toHaveProperty('privyEligibility');
    });

    it('should filter raw privyEligibility and expose only requiredLevel integer', async () => {
      const mockApiResponse: PrivyEligibilityResponse = {
        state: PurchaseState.PRIVY_REQUIRED,
        privyEligibility: {
          'premium': {
            requiresUpgrade: true,
            currentLevel: 1,
            requiredLevel: 5
          }
        }
      };

      vi.spyOn(global, 'fetch').mockResolvedValueOnce({
        ok: true,
        json: async () => mockApiResponse
      } as Response);

      const result = await manager.checkItemPurchaseState('item-456');

      expect(result.state).toBe(PurchaseState.PRIVY_REQUIRED);
      expect(result.requiredLevel).toBe(5);
      expect(typeof result.requiredLevel).toBe('number');

      // Critical: raw privyEligibility should NOT be exposed to publisher app
      expect(result).not.toHaveProperty('privyEligibility');
    });

    it('should handle API errors gracefully', async () => {
      vi.spyOn(global, 'fetch').mockRejectedValueOnce(new Error('Network error'));

      await expect(manager.checkItemPurchaseState('item-123')).rejects.toThrow('Network error');
    });

    it('should handle malformed API responses', async () => {
      vi.spyOn(global, 'fetch').mockResolvedValueOnce({
        ok: false,
        status: 404,
        statusText: 'Not Found'
      } as Response);

      await expect(manager.checkItemPurchaseState('item-123')).rejects.toThrow();
    });
  });

  describe('Data Filtering', () => {
    it('should never expose raw privyEligibility map to publisher apps', async () => {
      const mockResponse: PrivyEligibilityResponse = {
        state: PurchaseState.PRIVY_REQUIRED,
        privyEligibility: {
          'secret-internal-data': {
            requiresUpgrade: true,
            currentLevel: 1,
            requiredLevel: 10
          }
        }
      };

      vi.spyOn(global, 'fetch').mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse
      } as Response);

      const result = await manager.checkItemPurchaseState('item-789');

      // Verify filtering worked correctly
      expect(result).not.toHaveProperty('privyEligibility');
      expect(Object.keys(result)).toEqual(['state', 'requiredLevel']);
      expect(result.requiredLevel).toBe(10);
    });
  });
});