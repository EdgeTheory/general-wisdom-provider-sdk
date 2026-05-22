import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { MarketplaceSDK } from '../../../src/core/MarketplaceSDK';
import { HeartbeatManager } from '../../../src/core/HeartbeatManager';
import { PurchaseStateManager } from '../../../src/core/PurchaseStateManager';

describe('GW-6209 SDK URL prefix and /extend rename', () => {
  let sdk: MarketplaceSDK;

  beforeEach(() => {
    sdk = new MarketplaceSDK({
      jwksUri: 'https://api.dev.generalwisdom.com/.well-known/jwks.json',
      marketplaceUrl: 'https://dev.generalwisdom.com/',
      apiEndpoint: 'https://sdk.dev.generalwisdom.com',
      autoStart: false,
    });
    (sdk as any).sessionData = { sessionId: 'sess-1', userId: 'u1', exp: Math.floor(Date.now() / 1000) + 3600 };
    (sdk as any).jwtToken = 'jwt-token';
  });

  afterEach(() => {
    sdk.destroy();
    vi.restoreAllMocks();
  });

  it('extendSession POSTs to /v1/sdk/sessions/{id}/extend with {extensionMinutes, idempotencyKey}', async () => {
    const fetchSpy = vi.spyOn(global, 'fetch').mockResolvedValueOnce({
      ok: true,
      json: async () => ({ 
        sessionId: 'sess-1', 
        newExpiresAt: Math.floor(Date.now() / 1000) + 7200, 
        tokenCost: 50, 
        remainingBalance: 450 
      }),
    } as Response);

    await sdk.extendSession(30);

    expect(fetchSpy).toHaveBeenCalledOnce();
    const [url, options] = fetchSpy.mock.calls[0];
    expect(url).toBe('https://sdk.dev.generalwisdom.com/v1/sdk/sessions/sess-1/extend');
    expect(options.method).toBe('POST');
  });

  it('extendSession sends camelCase body, not snake_case', async () => {
    const fetchSpy = vi.spyOn(global, 'fetch').mockResolvedValueOnce({
      ok: true,
      json: async () => ({ 
        sessionId: 'sess-1', 
        newExpiresAt: Math.floor(Date.now() / 1000) + 7200, 
        tokenCost: 50, 
        remainingBalance: 450 
      }),
    } as Response);

    await sdk.extendSession(30);

    const [, options] = fetchSpy.mock.calls[0];
    const body = JSON.parse(options.body as string);
    expect(body).toHaveProperty('extensionMinutes', 30);
    expect(body).toHaveProperty('idempotencyKey');
    expect(body.idempotencyKey).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i);
    expect(body).not.toHaveProperty('additional_minutes');
  });

  it('validateWithBackend POSTs to /v1/sdk/sessions/validate', async () => {
    const fetchSpy = vi.spyOn(global, 'fetch').mockResolvedValueOnce({
      ok: true,
      json: async () => ({ valid: true, session: { sessionId: 'sess-1', userId: 'u1' } }),
    } as Response);

    // Use a valid JWT structure (header.payload.signature)
    const validToken = 'eyJhbGciOiJIUzI1NiJ9.eyJzZXNzaW9uSWQiOiJzZXNzLTEifQ.abc123';

    // Call private method via type assertion
    await (sdk as any).validateWithBackend(validToken);

    expect(fetchSpy).toHaveBeenCalledOnce();
    const [url, options] = fetchSpy.mock.calls[0];
    expect(url).toBe('https://sdk.dev.generalwisdom.com/v1/sdk/sessions/validate');
    expect(options.method).toBe('POST');
  });

  it('PurchaseStateManager GETs /v1/sdk/items/{id}/purchase-state', async () => {
    const fetchSpy = vi.spyOn(global, 'fetch').mockResolvedValueOnce({
      ok: true,
      json: async () => ({ purchased: false, price: { value: 100, currency: 'GW_TOKEN' } }),
    } as Response);

    const manager = new PurchaseStateManager({ apiEndpoint: 'https://sdk.dev.generalwisdom.com' });
    await manager.checkItemPurchaseState('item-123');

    expect(fetchSpy).toHaveBeenCalledOnce();
    const [url, options] = fetchSpy.mock.calls[0];
    expect(url).toBe('https://sdk.dev.generalwisdom.com/v1/sdk/items/item-123/purchase-state');
    expect(options.method).toBe('GET');
  });

  it('requestPurchase POSTs to /v1/sdk/items/{id}/purchase', async () => {
    const fetchSpy = vi.spyOn(global, 'fetch').mockResolvedValueOnce({
      ok: true,
      json: async () => ({ transactionId: 'tx-1', amount: 100, newBalance: 400 }),
    } as Response);

    // Stub modal.show and hide to immediately call onConfirm
    const modalShowStub = vi.fn((config: any) => {
      setTimeout(() => config.onConfirm(), 0);
    });
    (sdk as any).purchaseModal = { show: modalShowStub, hide: vi.fn() };

    sdk.requestPurchase('item-123');

    await vi.waitFor(() => expect(fetchSpy).toHaveBeenCalledOnce());
    const [url, options] = fetchSpy.mock.calls[0];
    expect(url).toBe('https://sdk.dev.generalwisdom.com/v1/sdk/items/item-123/purchase');
    expect(options.method).toBe('POST');
  });

  it('HeartbeatManager POSTs to /v1/sdk/sessions/{id}/heartbeat', async () => {
    const fetchSpy = vi.spyOn(global, 'fetch').mockResolvedValueOnce({
      ok: true,
      json: async () => ({ remaining_seconds: 1800 }),
    } as Response);

    const manager = new HeartbeatManager(
      'sess-1',
      'https://sdk.dev.generalwisdom.com',
      'jwt-token'
    );
    // Enable the manager so sendHeartbeat will actually send
    (manager as any).isEnabled = true;

    // Don't call start() which uses window.setInterval
    // Just call sendHeartbeat directly
    await (manager as any).sendHeartbeat();

    expect(fetchSpy).toHaveBeenCalledOnce();
    const [url, options] = fetchSpy.mock.calls[0];
    expect(url).toBe('https://sdk.dev.generalwisdom.com/v1/sdk/sessions/sess-1/heartbeat');
    expect(options.method).toBe('POST');
  });

  it('MarketplaceSDK no longer exposes completeSession', () => {
    expect((sdk as any).completeSession).toBeUndefined();
  });
});
