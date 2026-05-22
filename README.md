# Marketplace Provider SDK

> JWT-based session management for application providers in the General Wisdom marketplace ecosystem

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)](https://www.typescriptlang.org/)
[![npm version](https://img.shields.io/npm/v/@mission_sciences/provider-sdk)](https://www.npmjs.com/package/@mission_sciences/provider-sdk)
[![GitHub Actions](https://github.com/Mission-Sciences/provider-sdk/workflows/Publish%20Package/badge.svg)](https://github.com/Mission-Sciences/provider-sdk/actions)

## Quick Start

```bash
npm install @mission_sciences/provider-sdk
```

```javascript
import { MarketplaceSDK } from '@mission_sciences/provider-sdk';

const sdk = new MarketplaceSDK({
  applicationId: 'your-app-id',
  autoStart: true,
  hooks: {
    async onSessionStart(context) {
      // context.jwt      - raw JWT string
      // context.userId   - GW user ID
      // context.email    - user email
      // context.sessionId, context.orgId, context.applicationId, etc.

      // Exchange the GW JWT for your app's auth tokens
      const res = await fetch('/auth/marketplace', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jwt: context.jwt }),
      });
      const { token } = await res.json();
      localStorage.setItem('auth_token', token);
    },
    async onSessionEnd(context) {
      // context.reason = 'expired' | 'manual' | 'error'
      localStorage.clear();
    },
  },
});

await sdk.initialize();
```

## Documentation

- **[Integration Guide](./INTEGRATION_GUIDE.md)** -- Comprehensive guide for all frameworks (vanilla JS, React, Vue, Chrome Extensions)
- **[Quick Start Guide](./QUICKSTART.md)** -- Get started in 3 minutes
- **[JWT Specification](./jwt-specification.md)** -- Token format and claim details
- **[Validation Guide](./VALIDATION.md)** -- Testing and validation strategies
- **[Auth Integration Demo](./examples/auth-integration/)** -- Full working demo with 5 identity providers and 2 frontend implementations

## Features

### Core
- **Zero Config**: Extracts JWT from URL, validates via JWKS, starts session timer
- **Framework Agnostic**: Works with vanilla JS, React, Vue, or any framework
- **TypeScript First**: Full type definitions with all interfaces exported
- **Lightweight**: Single dependency (`jose` for JWT/JWKS)
- **Secure**: RS256 JWT verification with JWKS rotation support

### Lifecycle Hooks
- **`onSessionStart`** -- Fires after JWT validation, before timer starts. Use to exchange tokens with your auth system. Hook failure prevents session start (strict mode).
- **`onSessionEnd`** -- Fires on expiration or manual end. Use to revoke sessions. Errors are logged but don't block teardown (lenient mode).
- **`onSessionWarning`** -- Fires when session nears expiration (configurable threshold).
- **`onSessionExtend`** -- Fires after session extension. Use to refresh auth tokens.

### Advanced (Phase 2)
- **Heartbeat**: Automatic server sync at configurable intervals
- **Multi-Tab Sync**: Master tab election via BroadcastChannel API
- **Session Extension**: Self-service renewal with `extendSession(minutes)`
- **Early Completion**: End sessions early with `completeSession(actualMinutes)`
- **Visibility API**: Auto-pause timer when tab is hidden
- **Backend Validation**: Alternative to JWKS for sensitive apps

## How It Works

```
Marketplace --> JWT in URL --> SDK validates via JWKS --> Lifecycle hooks fire --> Session active
```

1. User launches your app from the marketplace with `?gwSession=<token>` in the URL (parameter name configurable via `jwtParamName`)
2. SDK extracts the JWT and verifies it against the JWKS endpoint (RS256)
3. `hooks.onSessionStart` fires with the validated session context
4. Session timer starts counting down
5. `hooks.onSessionWarning` fires at the configured threshold
6. When the timer expires or `endSession()` is called, `hooks.onSessionEnd` fires

## Installation

```bash
# npm (public registry)
npm install @mission_sciences/provider-sdk

# yarn
yarn add @mission_sciences/provider-sdk

# pnpm
pnpm add @mission_sciences/provider-sdk
```

### AWS CodeArtifact (Private Registry)

```bash
aws codeartifact login \
  --tool npm \
  --domain general-wisdom-dev \
  --repository sdk-packages \
  --region us-east-1

npm install @mission_sciences/provider-sdk
```

## Usage

### Vanilla JavaScript

```javascript
import { MarketplaceSDK } from '@mission_sciences/provider-sdk';

const sdk = new MarketplaceSDK({
  // REQUIRED: Environment-aware JWKS URL for JWT signature validation
  jwksUri: 'https://api.dev.generalwisdom.com/.well-known/jwks.json',
  // REQUIRED: Environment-aware marketplace URL for session end redirects
  marketplaceUrl: 'https://dev.generalwisdom.com/',
  applicationId: 'my-app',
  autoStart: true,
  warningThresholdSeconds: 120,
  hooks: {
    async onSessionStart(context) {
      // Exchange GW JWT for your app's tokens
      const res = await fetch('/auth/exchange', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jwt: context.jwt }),
      });
      const data = await res.json();
      sessionStorage.setItem('access_token', data.access_token);
    },
    async onSessionEnd(context) {
      sessionStorage.clear();
    },
  },
});

// Event handlers (separate from hooks -- these fire after hooks complete)
sdk.on('onSessionStart', (sessionData) => {
  document.getElementById('app').style.display = 'block';
});

sdk.on('onSessionEnd', () => {
  document.getElementById('app').style.display = 'none';
});

sdk.on('onError', (error) => {
  console.error('SDK error:', error.message);
});

await sdk.initialize();

// Timer display
setInterval(() => {
  document.getElementById('timer').textContent = sdk.getFormattedTime();
}, 1000);
```

### React

```typescript
import { useEffect, useState, useRef, useCallback } from 'react';
import { MarketplaceSDK } from '@mission_sciences/provider-sdk';

function useMarketplaceSession() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [time, setTime] = useState('--:--');
  const sdkRef = useRef(null);

  useEffect(() => {
    const sdk = new MarketplaceSDK({
      // REQUIRED: Environment-aware JWKS URL for JWT signature validation
      jwksUri: 'https://api.dev.generalwisdom.com/.well-known/jwks.json',
      // REQUIRED: Environment-aware marketplace URL for session end redirects
      marketplaceUrl: 'https://dev.generalwisdom.com/',
      applicationId: 'my-react-app',
      autoStart: true,
      hooks: {
        async onSessionStart(context) {
          await authenticateUser(context.jwt);
        },
        async onSessionEnd(context) {
          await logout();
        },
      },
    });

    sdk.on('onSessionStart', (data) => {
      setSession(data);
      setLoading(false);
    });

    sdk.on('onError', (err) => {
      console.error(err);
      setLoading(false);
    });

    sdkRef.current = sdk;
    sdk.initialize();

    const interval = setInterval(() => {
      if (sdkRef.current) setTime(sdkRef.current.getFormattedTime());
    }, 1000);

    return () => {
      clearInterval(interval);
      sdk.destroy();
    };
  }, []);

  return { session, loading, time, sdk: sdkRef };
}
```

See the [Integration Guide](./INTEGRATION_GUIDE.md) for Vue, Chrome Extensions, and more patterns.

### Auth Integration Demo

A complete working example with Docker, 5 identity providers, and 2 frontend implementations lives in `examples/auth-integration/`:

```bash
# Build the SDK first
npm run build

# Start the demo (defaults to mock IdP + React storefront + Auth0 protocol)
cd examples/auth-integration
cp .env.mock .env
docker compose up --build

# Open http://localhost:8080/generate-test-url
```

The demo includes:
- **Mock IdP** that speaks Auth0, Okta, Azure AD, and Cognito protocols
- **React ecommerce storefront** with product shop, cart, role-gated admin panel
- **Vanilla JS reference** with auth hooks and event log
- **Backend** with provider-agnostic auth exchange using the `AuthProvider` interface
- **Role-based access control** showing `gw-user` vs `org-admin` UI gating

See [examples/auth-integration/README.md](./examples/auth-integration/README.md) for full documentation, and [examples/auth-integration/docs/DEMO_WALKTHROUGH.md](./examples/auth-integration/docs/DEMO_WALKTHROUGH.md) for a step-by-step walkthrough.

## Configuration

```typescript
interface SDKConfig {
  // JWT & Validation (REQUIRED)
  jwksUri: string;                    // REQUIRED: Environment-aware JWKS endpoint (NO default)
  marketplaceUrl: string;             // REQUIRED: Environment-aware marketplace URL for redirects (NO default)
  
  jwtParamName?: string;              // URL query parameter name (default: 'gwSession')
  applicationId?: string;             // Your application ID
  useBackendValidation?: boolean;     // Use backend instead of JWKS (default: false)

  // Session Behavior
  autoStart?: boolean;                // Auto-start from URL JWT (default: true)
  warningThresholdSeconds?: number;   // Warning before expiry (default: 300)

  // Lifecycle Hooks
  hooks?: {
    onSessionStart?: (ctx: SessionStartContext) => Promise<void> | void;
    onSessionEnd?: (ctx: SessionEndContext) => Promise<void> | void;
    onSessionExtend?: (ctx: SessionExtendContext) => Promise<void> | void;
    onSessionWarning?: (ctx: SessionWarningContext) => Promise<void> | void;
  };
  hookTimeoutMs?: number;             // Hook timeout (default: 5000)

  // Phase 2 Features
  enableHeartbeat?: boolean;          // Server heartbeat (default: false)
  heartbeatIntervalSeconds?: number;  // Heartbeat interval (default: 30)
  enableTabSync?: boolean;            // Multi-tab sync (default: false)
  pauseOnHidden?: boolean;            // Pause when tab hidden (default: false)

  // UI
  themeMode?: 'light' | 'dark' | 'auto';
  debug?: boolean;                    // Console logging (default: false)
}
```

### Environment-Specific URLs (REQUIRED)

⚠️ **Breaking Change (v0.4.0+)**: `jwksUri` and `marketplaceUrl` are now **required** and have **no default values**. Previous versions silently defaulted to production URLs, which caused dev/demo sessions to fail JWT validation. You must explicitly provide environment-aware values.

| Environment | `jwksUri` | `marketplaceUrl` |
|-------------|-----------|------------------|
| **dev** | `https://api.dev.generalwisdom.com/.well-known/jwks.json` | `https://dev.generalwisdom.com/` |
| **demo** | `https://api.demo.generalwisdom.com/.well-known/jwks.json` | `https://demo.generalwisdom.com/` |
| **prod** | `https://api.platform.generalwisdom.com/.well-known/jwks.json` | `https://platform.generalwisdom.com/` |

**Why this matters:** The SDK validates session JWTs using the JWKS endpoint. If you pass a dev JWT but point `jwksUri` at production, signature validation will fail. Similarly, `marketplaceUrl` determines where users are redirected when their session ends — pointing at the wrong environment breaks the session lifecycle.

## API Reference

### MarketplaceSDK

```typescript
class MarketplaceSDK {
  constructor(config: SDKConfig)

  // Initialization
  async initialize(): Promise<SessionData>

  // Event handlers (fire after hooks complete)
  on(event: 'onSessionStart', handler: (data: SessionData) => void): void
  on(event: 'onSessionEnd', handler: () => void): void
  on(event: 'onSessionWarning', handler: (data: { remainingSeconds: number }) => void): void
  on(event: 'onError', handler: (error: Error) => void): void

  // Timer
  startTimer(): void
  pauseTimer(): void
  resumeTimer(): void
  isTimerRunning(): boolean
  getRemainingTime(): number          // Seconds remaining
  getFormattedTime(): string          // "M:SS" format
  getFormattedTimeWithHours(): string // "H:MM:SS" format

  // Session control
  async endSession(): Promise<void>
  async extendSession(additionalMinutes: number): Promise<void>
  async completeSession(actualUsageMinutes?: number): Promise<void>

  // Data
  getSessionData(): SessionData | null

  // Cleanup
  destroy(): void
}
```

### Context Types

```typescript
interface SessionStartContext {
  sessionId: string;
  userId: string;
  email?: string;
  orgId: string;
  applicationId: string;
  durationMinutes: number;
  expiresAt: number;        // Unix seconds
  jwt: string;              // Raw JWT for backend exchange
}

interface SessionEndContext {
  sessionId: string;
  userId: string;
  reason: 'expired' | 'manual' | 'error';
  actualDurationMinutes?: number;
}

interface SessionExtendContext {
  sessionId: string;
  userId: string;
  additionalMinutes: number;
  newExpiresAt: number;
}

interface SessionWarningContext {
  sessionId: string;
  userId: string;
  remainingSeconds: number;
}
```

### Exports

```typescript
// Main class
export { MarketplaceSDK } from '@mission_sciences/provider-sdk';
export { MarketplaceSDK as default } from '@mission_sciences/provider-sdk';

// UI components
export { SessionHeader } from '@mission_sciences/provider-sdk';
export { WarningModal } from '@mission_sciences/provider-sdk';

// Core utilities
export { JWTParser, JWKSValidator, TimerManager } from '@mission_sciences/provider-sdk';
export { HeartbeatManager, TabSyncManager } from '@mission_sciences/provider-sdk';

// Theming
export { lightTheme, darkTheme, getTheme, generateCSSVariables } from '@mission_sciences/provider-sdk';

// Types
export type {
  SDKConfig, SessionData, SDKEvents,
  SessionStartContext, SessionEndContext, SessionExtendContext, SessionWarningContext,
  SessionLifecycleHooks, ThemeMode,
} from '@mission_sciences/provider-sdk';
```

### JWT Structure

```json
{
  "sessionId": "35iiYDoY1fSwSpYX22H8GP7x61o",
  "applicationId": "your-app-id",
  "userId": "a47884c8-50d1-7040-2de8-b7801699643c",
  "orgId": "org-123",
  "email": "user@example.com",
  "startTime": 1763599337,
  "durationMinutes": 60,
  "exp": 1763602937,
  "iat": 1763599337,
  "iss": "generalwisdom.com",
  "sub": "a47884c8-50d1-7040-2de8-b7801699643c"
}
```

> **Note:** `email` is optional. It is included when available from the user's identity provider but may not be present in all JWTs. Always check for its presence before using it.

## Testing

### Generate Test JWT

```bash
npm run generate-keys     # Create RSA key pair (dev only)
npm run generate-jwt 60   # Generate 60-minute JWT
```

### Dev Server

```bash
npm run test-server       # Start dev server at localhost:3000
npm run test-server-p2    # Phase 2 dev server with heartbeat/tab-sync
```

Open: `http://localhost:3000?gwSession=<YOUR_JWT>`

### Unit Tests

```bash
npm run test              # Run all tests
npm run test:watch        # Watch mode
npm run test:coverage     # Coverage report
npm run test:integration  # Integration tests
```

## Development

```bash
npm run build         # Build for production (tsc + vite)
npm run dev           # Vite dev server with HMR
npm run lint          # ESLint
npm run format        # Prettier
```

### Build Output

```
dist/
├── marketplace-sdk.es.js       # ESM bundle
├── marketplace-sdk.es.js.map
├── marketplace-sdk.umd.js      # UMD bundle
├── marketplace-sdk.umd.js.map
└── index.d.ts                  # TypeScript declarations
```

## Infrastructure & CI/CD

The package is built and published using an 8-job GitHub Actions pipeline:

1. **Test & Build** -- Unit tests, type checking, linting, production build
2. **Terraform Plan** -- Review infrastructure changes (CodeArtifact)
3. **Terraform Apply** -- Create/update AWS infrastructure
4. **Publish CodeArtifact** -- Publish to private AWS registry
5. **Verify CodeArtifact** -- Confirm publication
6. **Publish npm** -- Publish to public npm with provenance
7. **Verify npm** -- Confirm publication
8. **Create Release** -- GitHub release with artifacts

**Authentication**: AWS via OIDC (no access keys), npm via Trusted Publishing with cryptographic provenance (no tokens).

## Secure Publishing & Provenance

- **Dual Publishing**: [npm](https://www.npmjs.com/package/@mission_sciences/provider-sdk) (public) + AWS CodeArtifact (private)
- **Cryptographic Signatures**: All releases signed with GitHub Actions OIDC
- **Provenance Transparency**: Build provenance in [Sigstore transparency log](https://search.sigstore.dev)
- **No Hardcoded Secrets**: CI/CD uses OIDC for all authentication

```bash
# Verify provenance
npm view @mission_sciences/provider-sdk --json | jq .dist
```

## Production Checklist

- [ ] Set correct `applicationId`
- [ ] Set `hookTimeoutMs` appropriately for your auth provider latency
- [ ] Enable HTTPS on all endpoints
- [ ] Configure CORS headers
- [ ] Set up secrets management for backend token exchange
- [ ] Enable rate limiting on auth endpoints
- [ ] Verify tokens server-side (not just client-side JWKS)
- [ ] Test with production JWTs

## Troubleshooting

**"No token found in URL parameter 'gwSession' or storage"** -- The SDK looks for the JWT in the URL query parameter configured via `jwtParamName` (default: `gwSession`). Make sure the marketplace redirect includes the JWT as `?gwSession=<token>` (or your custom parameter name).

**JWT validation failed** -- Check that `jwksUri` points to the correct JWKS endpoint and that the JWT hasn't expired.

**Hook timeout** -- The default `hookTimeoutMs` is 5000ms. If your auth exchange involves multiple API calls (user lookup + creation + token grant), increase it to 10000ms or more.

**Session header not rendering** -- `SessionHeader` is a separate exported class, not a method on `MarketplaceSDK`. Import and instantiate it directly.

**Multi-tab conflicts** -- Enable `enableTabSync: true` to elect a master tab and sync session state across tabs via BroadcastChannel.

## License

MIT -- see [LICENSE](./LICENSE)

## Support

- **Issues**: [GitHub Issues](https://github.com/Mission-Sciences/provider-sdk/issues)
- **Discord**: [Discord](https://discord.com/invite/RN5gFEzXhB)
