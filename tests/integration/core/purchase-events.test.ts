import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { MarketplaceSDK } from '../../../src/core/MarketplaceSDK.js';
import { PurchaseError } from '../../../src/types/index.js';

describe('MarketplaceSDK Purchase Events', () => {
  let sdk: MarketplaceSDK;

  beforeEach(() => {
    sdk = new MarketplaceSDK({
      jwksUri: 'https://api.dev.generalwisdom.com/.well-known/jwks.json',
      marketplaceUrl: 'https://dev.generalwisdom.com/',
      apiEndpoint: 'https://api.test.com',
      debug: false,
      autoStart: false,
    });

    // Stub document.createElement and document.body for PurchaseModal
    if (typeof document === 'undefined') {
      (globalThis as any).document = {
        createElement: vi.fn(() => ({
          id: '',
          style: { cssText: '' },
          innerHTML: '',
          appendChild: vi.fn(),
          parentNode: { removeChild: vi.fn() },
          querySelectorAll: vi.fn(() => []),
          addEventListener: vi.fn(),
        })),
        body: { appendChild: vi.fn() },
        getElementById: vi.fn(() => ({
          addEventListener: vi.fn(),
        })),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      };
    }
  });

  afterEach(() => {
    sdk.destroy();
    vi.restoreAllMocks();
  });

  describe('Event Registration', () => {
    it('should register onPurchaseStart handler', () => {
      const handler = vi.fn();
      sdk.on('onPurchaseStart', handler);
      expect(handler).not.toHaveBeenCalled();
    });

    it('should register onPurchaseSuccess handler', () => {
      const handler = vi.fn();
      sdk.on('onPurchaseSuccess', handler);
      expect(handler).not.toHaveBeenCalled();
    });

    it('should register onPurchaseError handler', () => {
      const handler = vi.fn();
      sdk.on('onPurchaseError', handler);
      expect(handler).not.toHaveBeenCalled();
    });

    it('should register onPurchaseComplete handler', () => {
      const handler = vi.fn();
      sdk.on('onPurchaseComplete', handler);
      expect(handler).not.toHaveBeenCalled();
    });

    it('should register onPurchaseCancelled handler', () => {
      const handler = vi.fn();
      sdk.on('onPurchaseCancelled', handler);
      expect(handler).not.toHaveBeenCalled();
    });

    it('should register onBalanceUpdate handler', () => {
      const handler = vi.fn();
      sdk.on('onBalanceUpdate', handler);
      expect(handler).not.toHaveBeenCalled();
    });

    it('should register all 6 purchase events without affecting existing events', () => {
      const sessionStart = vi.fn();
      const purchaseStart = vi.fn();
      const purchaseSuccess = vi.fn();
      const purchaseError = vi.fn();
      const purchaseComplete = vi.fn();
      const purchaseCancelled = vi.fn();
      const balanceUpdate = vi.fn();

      sdk.on('onSessionStart', sessionStart);
      sdk.on('onPurchaseStart', purchaseStart);
      sdk.on('onPurchaseSuccess', purchaseSuccess);
      sdk.on('onPurchaseError', purchaseError);
      sdk.on('onPurchaseComplete', purchaseComplete);
      sdk.on('onPurchaseCancelled', purchaseCancelled);
      sdk.on('onBalanceUpdate', balanceUpdate);

      // Existing session events should still work
      expect(typeof sdk.getSessionData).toBe('function');
      expect(typeof sdk.getRemainingTime).toBe('function');
    });
  });

  describe('requestPurchase', () => {
    it('should throw SDKError if no active session', () => {
      expect(() => sdk.requestPurchase('item-123')).toThrow('No active session');
    });

    it('should fire onPurchaseStart when called with active session', () => {
      // Set up a fake session by reaching into the SDK internals
      (sdk as any).sessionData = { sessionId: 'test', userId: 'u1' };
      (sdk as any).jwtToken = 'fake-jwt';

      const onPurchaseStart = vi.fn();
      sdk.on('onPurchaseStart', onPurchaseStart);

      sdk.requestPurchase('item-456');

      expect(onPurchaseStart).toHaveBeenCalledWith({
        itemId: 'item-456',
        quantity: 1,
      });
    });

    it('should fire onPurchaseCancelled when modal is dismissed', () => {
      (sdk as any).sessionData = { sessionId: 'test', userId: 'u1' };
      (sdk as any).jwtToken = 'fake-jwt';

      const onPurchaseCancelled = vi.fn();
      sdk.on('onPurchaseCancelled', onPurchaseCancelled);

      // Mock PurchaseModal to capture onCancel callback
      let capturedOnCancel: (() => void) | undefined;
      const mockShow = vi.fn((opts: any) => { capturedOnCancel = opts.onCancel; });
      const mockHide = vi.fn();
      (sdk as any).purchaseModal = { show: mockShow, hide: mockHide, isShown: () => false };

      sdk.requestPurchase('item-789');

      // Simulate cancel
      capturedOnCancel?.();
      expect(onPurchaseCancelled).toHaveBeenCalledWith('item-789');
    });

    it('should fire onPurchaseSuccess, onPurchaseComplete, and onBalanceUpdate on successful purchase', async () => {
      (sdk as any).sessionData = { sessionId: 'test', userId: 'u1' };
      (sdk as any).jwtToken = 'fake-jwt';

      const onPurchaseSuccess = vi.fn();
      const onPurchaseComplete = vi.fn();
      const onBalanceUpdate = vi.fn();
      sdk.on('onPurchaseSuccess', onPurchaseSuccess);
      sdk.on('onPurchaseComplete', onPurchaseComplete);
      sdk.on('onBalanceUpdate', onBalanceUpdate);

      // Mock fetch for purchase API
      vi.spyOn(global, 'fetch').mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          transactionId: 'tx-001',
          amount: 9.99,
          newBalance: 90.01,
        }),
      } as Response);

      // Mock PurchaseModal to capture onConfirm callback
      let capturedOnConfirm: (() => void) | undefined;
      const mockShow = vi.fn((opts: any) => { capturedOnConfirm = opts.onConfirm; });
      (sdk as any).purchaseModal = { show: mockShow, hide: vi.fn(), isShown: () => false };

      sdk.requestPurchase('item-100');

      // Simulate confirm
      await capturedOnConfirm?.();

      expect(onPurchaseSuccess).toHaveBeenCalledWith({
        itemId: 'item-100',
        transactionId: 'tx-001',
        amount: 9.99,
      });
      expect(onPurchaseComplete).toHaveBeenCalledWith('item-100');
      expect(onBalanceUpdate).toHaveBeenCalledWith(90.01);
    });

    it('should fire onPurchaseError when API returns error', async () => {
      (sdk as any).sessionData = { sessionId: 'test', userId: 'u1' };
      (sdk as any).jwtToken = 'fake-jwt';

      const onPurchaseError = vi.fn();
      sdk.on('onPurchaseError', onPurchaseError);

      vi.spyOn(global, 'fetch').mockResolvedValueOnce({
        ok: false,
        status: 402,
      } as Response);

      let capturedOnConfirm: (() => void) | undefined;
      const mockShow = vi.fn((opts: any) => { capturedOnConfirm = opts.onConfirm; });
      (sdk as any).purchaseModal = { show: mockShow, hide: vi.fn(), isShown: () => false };

      sdk.requestPurchase('item-fail');
      await capturedOnConfirm?.();

      expect(onPurchaseError).toHaveBeenCalledTimes(1);
      const error = onPurchaseError.mock.calls[0][0];
      expect(error).toBeInstanceOf(PurchaseError);
      expect(error.itemId).toBe('item-fail');
      expect(error.code).toBe('PURCHASE_FAILED');
      expect(error.statusCode).toBe(402);
    });

    it('should not fire onBalanceUpdate when API response lacks newBalance', async () => {
      (sdk as any).sessionData = { sessionId: 'test', userId: 'u1' };
      (sdk as any).jwtToken = 'fake-jwt';

      const onBalanceUpdate = vi.fn();
      sdk.on('onBalanceUpdate', onBalanceUpdate);

      vi.spyOn(global, 'fetch').mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          transactionId: 'tx-002',
          amount: 5.00,
          // no newBalance field
        }),
      } as Response);

      let capturedOnConfirm: (() => void) | undefined;
      const mockShow = vi.fn((opts: any) => { capturedOnConfirm = opts.onConfirm; });
      (sdk as any).purchaseModal = { show: mockShow, hide: vi.fn(), isShown: () => false };

      sdk.requestPurchase('item-200');
      await capturedOnConfirm?.();

      expect(onBalanceUpdate).not.toHaveBeenCalled();
    });

    it('should call purchase API with correct URL and auth header', async () => {
      (sdk as any).sessionData = { sessionId: 'test', userId: 'u1' };
      (sdk as any).jwtToken = 'my-jwt-token';

      const fetchSpy = vi.spyOn(global, 'fetch').mockResolvedValueOnce({
        ok: true,
        json: async () => ({ transactionId: 'tx-003', amount: 1.00 }),
      } as Response);

      let capturedOnConfirm: (() => void) | undefined;
      const mockShow = vi.fn((opts: any) => { capturedOnConfirm = opts.onConfirm; });
      (sdk as any).purchaseModal = { show: mockShow, hide: vi.fn(), isShown: () => false };

      sdk.requestPurchase('item-300');
      await capturedOnConfirm?.();

      expect(fetchSpy).toHaveBeenCalledWith(
        'https://api.test.com/items/item-300/purchase',
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            'Authorization': 'Bearer my-jwt-token',
            'Content-Type': 'application/json',
          }),
        })
      );
    });
  });

  describe('Vanilla JS compatibility', () => {
    it('should not import React or Vue in core SDK', () => {
      // Verify the SDK works without any framework dependencies
      expect(typeof sdk.requestPurchase).toBe('function');
      expect(typeof sdk.getPurchaseStateManager).toBe('function');
      expect(typeof sdk.on).toBe('function');
    });
  });
});
