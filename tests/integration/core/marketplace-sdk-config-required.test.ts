/**
 * GW-6196 — SDK must fail loudly when jwksUri / marketplaceUrl are missing.
 *
 * Today the constructor silently defaults to prod URLs:
 *   jwksUri      -> https://api.platform.generalwisdom.com/.well-known/jwks.json
 *   marketplaceUrl -> https://platform.generalwisdom.com/
 *
 * That hides config errors in dev/demo until users notice tabs aren't redirecting
 * at session expiry. The SDK should refuse to construct (or initialize) when these
 * env-aware values are absent, OR at minimum surface a loud, machine-detectable
 * signal so integrations cannot silently boot against prod.
 *
 * These tests are RED on main; they are the regression seal for GW-6196.
 */
import { describe, it, expect } from 'vitest';
import { MarketplaceSDK } from '../../../src/core/MarketplaceSDK.js';

describe('GW-6196 MarketplaceSDK config — fail loudly on missing env-aware URLs', () => {
  it('throws when constructed without jwksUri', () => {
    expect(
      () =>
        new MarketplaceSDK({
          applicationId: 'app-1',
          marketplaceUrl: 'https://dev.generalwisdom.com/',
          autoStart: false,
        } as any),
    ).toThrow(/jwksUri/i);
  });

  it('throws when constructed without marketplaceUrl', () => {
    expect(
      () =>
        new MarketplaceSDK({
          applicationId: 'app-1',
          jwksUri: 'https://api.dev.generalwisdom.com/.well-known/jwks.json',
          autoStart: false,
        } as any),
    ).toThrow(/marketplaceUrl/i);
  });

  it('does NOT silently default jwksUri to api.platform.generalwisdom.com', () => {
    // Constructor should refuse rather than fall back to prod JWKS.
    // If somebody re-introduces the silent default, this will fail.
    let sdk: MarketplaceSDK | null = null;
    try {
      sdk = new MarketplaceSDK({
        applicationId: 'app-1',
        autoStart: false,
      } as any);
    } catch {
      // Expected — refusing to construct is the correct behaviour.
      return;
    }

    // If construction was permitted, the resolved jwksUri MUST NOT be the prod default.
    const resolved = (sdk as any)?.config?.jwksUri ?? '';
    expect(resolved).not.toMatch(/api\.platform\.generalwisdom\.com/);
  });

  it('does NOT silently default marketplaceUrl to platform.generalwisdom.com', () => {
    let sdk: MarketplaceSDK | null = null;
    try {
      sdk = new MarketplaceSDK({
        applicationId: 'app-1',
        autoStart: false,
      } as any);
    } catch {
      return;
    }

    const resolved = (sdk as any)?.config?.marketplaceUrl ?? '';
    expect(resolved).not.toMatch(/^https:\/\/platform\.generalwisdom\.com\/?$/);
  });

  it('accepts a fully-specified env-aware config', () => {
    expect(
      () =>
        new MarketplaceSDK({
          applicationId: 'app-1',
          jwksUri: 'https://api.dev.generalwisdom.com/.well-known/jwks.json',
          marketplaceUrl: 'https://dev.generalwisdom.com/',
          autoStart: false,
        }),
    ).not.toThrow();
  });
});
