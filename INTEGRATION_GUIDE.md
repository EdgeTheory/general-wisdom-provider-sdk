# Marketplace Provider SDK - Comprehensive Integration Guide

> Complete guide to integrating the Marketplace Provider SDK into any web application

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)](https://www.typescriptlang.org/)

> **📦 Package Renamed**: This package is now `@mission_sciences/provider-sdk` (formerly `@marketplace/provider-sdk`). All examples use the new package name.

## Table of Contents

- [Introduction](#introduction)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Quick Start](#quick-start)
- [Core Concepts](#core-concepts)
- [Integration Patterns](#integration-patterns)
  - [Vanilla JavaScript](#vanilla-javascript)
  - [React/Preact](#reactpreact)
  - [Vue](#vue)
  - [Chrome Extensions](#chrome-extensions)
- [Authentication Integration](#authentication-integration)
- [Lifecycle Hooks](#lifecycle-hooks)
- [Session Management](#session-management)
- [UI Components](#ui-components)
- [Advanced Features](#advanced-features)
- [Security Best Practices](#security-best-practices)
- [Testing](#testing)
- [Troubleshooting](#troubleshooting)
- [Production Deployment](#production-deployment)
- [API Reference](#api-reference)

---

## Introduction

The Marketplace Provider SDK enables third-party applications to integrate with the General Wisdom marketplace platform through JWT-based session management. When users launch your app from the marketplace, the SDK handles:

- **JWT Validation**: Cryptographic verification of session tokens
- **Session Timing**: Automatic countdown and expiration handling
- **UI Components**: Pre-built session header with timer
- **Authentication**: Integration with your app's auth system
- **Lifecycle Management**: Hooks for session events

### How It Works

```
┌──────────────┐         ┌───────────────┐         ┌─────────────┐
│  Marketplace │ ─JWT──> │   Your App    │ ─Hooks─>│  Your Auth  │
│     PWA      │         │   (SDK Init)  │         │   System    │
└──────────────┘         └───────────────┘         └─────────────┘
       │                         │                         │
       │                    Validates JWT              Provisions
       │                    Starts timer               User account
       │                         │                         │
       └────<Redirect On End>────┴────<Session Data>──────┘
```

---

## Prerequisites

### Required

- **Node.js**: >= 16.x
- **Package Manager**: npm, yarn, or pnpm
- **Build Tool**: Vite, Webpack, or similar (for bundling)
- **TypeScript** (optional but recommended): >= 5.0

### Recommended

- **Framework**: React, Vue, or vanilla JS
- **Auth System**: Existing authentication (Cognito, Auth0, Firebase, etc.)
- **Storage**: LocalStorage, SessionStorage, or chrome.storage

### Marketplace Requirements

Your application must be registered in the General Wisdom marketplace with:
- Unique `applicationId`
- Redirect URL for session end
- JWKS public key endpoint (production)

---

## Installation

The SDK is available on the public npm registry. No special configuration required!

### NPM

```bash
npm install @mission_sciences/provider-sdk
```

### Yarn

```bash
yarn add @mission_sciences/provider-sdk
```

### PNPM

```bash
pnpm add @mission_sciences/provider-sdk
```

### CDN (Development Only)

```html
<script src="https://unpkg.com/@mission_sciences/provider-sdk/dist/index.umd.js"></script>
```

### Serving SDK in Non-Bundled Applications

For simple applications without a bundler (like the JWT demo), you can serve the SDK files directly:

**Express.js example:**

```javascript
const path = require('path');

// Serve SDK from node_modules
app.use(
  '/sdk',
  express.static(
    path.join(__dirname, 'node_modules/@mission_sciences/provider-sdk/dist')
  )
);
```

**HTML usage:**

```html
<!-- Load SDK via UMD build -->
<script src="/sdk/marketplace-sdk.umd.js"></script>
<script>
  const { MarketplaceSDK } = window.MarketplaceSDK;
  // Initialize SDK...
</script>
```

---

## Quick Start

### 1. Basic Initialization

```typescript
import MarketplaceSDK from '@mission_sciences/provider-sdk';

// Initialize SDK
const sdk = new MarketplaceSDK({
  jwtParamName: 'gwSession',  // URL parameter name (default)
  applicationId: 'your-app-id',
  onSessionStart: async (context) => {
    console.log('Session started for user:', context.userId);
    // Your auth logic here
  },
  onSessionEnd: async (context) => {
    console.log('Session ended:', context.reason);
    // Cleanup logic here
  },
});

// Initialize on page load
await sdk.initialize();
```

### 2. Add Session Header

```html
<div id="gw-session-header"></div>
```

```typescript
// Mount session header to show timer
const sessionHeader = sdk.createSessionHeader({
  containerId: 'gw-session-header',
});

sessionHeader.mount('#gw-session-header');
```

### 3. Test with Sample JWT

```bash
# Generate test JWT (development only)
npm run generate-jwt 60  # 60-minute session

# Open your app with JWT
http://localhost:3000/app?gwSession=eyJhbGciOiJSUzI1NiIsImtpZCI6...
```

---

## Core Concepts

### JWT Structure

The marketplace JWT contains:

```json
{
  "sessionId": "35iiYDoY1fSwSpYX22H8GP7x61o",
  "applicationId": "your-app-id",
  "userId": "a47884c8-50d1-7040-2de8-b7801699643c",
  "orgId": "org-123",
  "email": "user@example.com",
  "startTime": 1763599337,
  "durationMinutes": 60,
  "iss": "generalwisdom.com",
  "sub": "a47884c8-50d1-7040-2de8-b7801699643c",
  "exp": 1763602937,
  "iat": 1763599337
}
```

> **Note:** `email` is optional. It is included when available from the user's identity provider but may not be present in all JWTs. Always check for its presence before using it.

### Session Lifecycle

```
1. URL Detection    → SDK checks for JWT parameter
2. JWT Validation   → Verify signature, expiration, claims
3. onSessionStart   → Your hook provisions user
4. Timer Start      → Countdown begins
5. Session Active   → User interacts with app
6. Warning          → Alert at 5 minutes remaining
7. onSessionEnd     → Your hook cleans up
8. Redirect         → Return to marketplace (optional)
```

### Lifecycle Hooks

**Three hooks control your app's integration:**

1. **`onSessionStart`**: Called after JWT validation, before timer starts
   - Provision user account
   - Generate app authentication token
   - Store session data

2. **`onSessionWarning`**: Called at threshold (default: 5 minutes remaining)
   - Show custom warning UI
   - Offer session extension
   - Save user work

3. **`onSessionEnd`**: Called when session ends (expiration or manual)
   - Clear authentication state
   - Report analytics
   - Cleanup resources

---

## Integration Patterns

### Vanilla JavaScript

**File**: `src/marketplace.js`

```javascript
import MarketplaceSDK from '@mission_sciences/provider-sdk';

// Initialize SDK
const sdk = new MarketplaceSDK({
  jwtParamName: 'gwSession',
  applicationId: 'my-vanilla-app',

  onSessionStart: async (context) => {
    // Store user info in localStorage
    localStorage.setItem('marketplace_user', JSON.stringify({
      userId: context.userId,
      email: context.email,
      sessionId: context.sessionId,
      expiresAt: context.expiresAt,
    }));
    
    // Show authenticated UI
    document.getElementById('login-section').style.display = 'none';
    document.getElementById('app-section').style.display = 'block';
    document.getElementById('user-email').textContent = context.email;
  },
  
  onSessionEnd: async (context) => {
    // Clear local storage
    localStorage.removeItem('marketplace_user');
    
    // Show login UI
    document.getElementById('login-section').style.display = 'block';
    document.getElementById('app-section').style.display = 'none';
  },
});

// Initialize
sdk.initialize().then(() => {
  console.log('Marketplace SDK initialized');
  
  // Mount session header
  const header = sdk.createSessionHeader({
    containerId: 'session-header',
  });
  header.mount('#session-header');
});

// Export for global access
window.marketplaceSDK = sdk;
```

**HTML**: `index.html`

```html
<!DOCTYPE html>
<html>
<head>
  <title>My App</title>
</head>
<body>
  <!-- Session Header -->
  <div id="session-header"></div>
  
  <!-- Login Section -->
  <div id="login-section">
    <h1>Please log in via marketplace</h1>
  </div>
  
  <!-- App Section (hidden by default) -->
  <div id="app-section" style="display: none;">
    <h1>Welcome, <span id="user-email"></span></h1>
    <p>Your app content here</p>
  </div>
  
  <script type="module" src="/src/marketplace.js"></script>
  <script type="module" src="/src/main.js"></script>
</body>
</html>
```

### React/Preact

**Hook**: `src/hooks/useMarketplaceSession.ts`

```typescript
import { useEffect, useState } from 'react';
import MarketplaceSDK from '@mission_sciences/provider-sdk';
import type { SessionStartContext, SessionEndContext } from '@mission_sciences/provider-sdk';

interface SessionState {
  isActive: boolean;
  userId?: string;
  email?: string;
  expiresAt?: number;
}

export function useMarketplaceSession() {
  const [session, setSession] = useState<SessionState>({ isActive: false });
  const [sdk, setSdk] = useState<MarketplaceSDK | null>(null);

  useEffect(() => {
    const initSDK = async () => {
      const marketplaceSDK = new MarketplaceSDK({
        jwtParamName: 'gwSession',
        applicationId: 'my-react-app',
        onSessionStart: async (context: SessionStartContext) => {
          console.log('[Marketplace] Session started', context);
          
          // Update React state
          setSession({
            isActive: true,
            userId: context.userId,
            email: context.email,
            expiresAt: context.expiresAt,
          });
          
          // Call your auth API
          await authenticateMarketplaceUser(context);
        },
        
        onSessionEnd: async (context: SessionEndContext) => {
          console.log('[Marketplace] Session ended', context);
          
          // Update React state
          setSession({ isActive: false });
          
          // Clear auth state
          await clearAuthState();
        },
      });

      await marketplaceSDK.initialize();
      setSdk(marketplaceSDK);
    };

    initSDK();

    // Cleanup
    return () => {
      sdk?.destroy();
    };
  }, []);

  return { session, sdk };
}

// Helper functions
async function authenticateMarketplaceUser(context: SessionStartContext) {
  // Example: Exchange JWT for your app's auth token
  const response = await fetch('/api/auth/marketplace', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      jwt: context.jwt,
      userId: context.userId,
    }),
  });
  
  const { token } = await response.json();
  localStorage.setItem('auth_token', token);
}

async function clearAuthState() {
  localStorage.removeItem('auth_token');
  // Clear any other auth state
}
```

**Component**: `src/components/App.tsx`

```typescript
import { useMarketplaceSession } from '@/hooks/useMarketplaceSession';
import SessionHeader from '@/components/SessionHeader';

export function App() {
  const { session, sdk } = useMarketplaceSession();

  if (!session.isActive) {
    return (
      <div>
        <h1>Please access via marketplace</h1>
        <p>This app requires a valid marketplace session.</p>
      </div>
    );
  }

  return (
    <div>
      {/* Session Header */}
      <SessionHeader sdk={sdk} />
      
      {/* Your App */}
      <main>
        <h1>Welcome, {session.email}</h1>
        <YourAppContent />
      </main>
    </div>
  );
}
```

**Session Header Component**: `src/components/SessionHeader.tsx`

```typescript
import { useEffect, useRef } from 'react';
import type MarketplaceSDK from '@mission_sciences/provider-sdk';

interface Props {
  sdk: MarketplaceSDK | null;
}

export default function SessionHeader({ sdk }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sdk || !containerRef.current) return;

    const header = sdk.createSessionHeader({
      containerId: 'session-header-container',
    });

    header.mount('#session-header-container');

    return () => {
      header.unmount();
    };
  }, [sdk]);

  return <div id="session-header-container" ref={containerRef} />;
}
```

### Vue

**Composable**: `src/composables/useMarketplaceSession.ts`

```typescript
import { ref, onMounted, onUnmounted } from 'vue';
import MarketplaceSDK from '@mission_sciences/provider-sdk';
import type { SessionStartContext, SessionEndContext } from '@mission_sciences/provider-sdk';

export function useMarketplaceSession() {
  const sdk = ref<MarketplaceSDK | null>(null);
  const session = ref({
    isActive: false,
    userId: '',
    email: '',
    expiresAt: 0,
  });

  onMounted(async () => {
    const marketplaceSDK = new MarketplaceSDK({
      jwtParamName: 'gwSession',
      applicationId: 'my-vue-app',
      onSessionStart: async (context: SessionStartContext) => {
        session.value = {
          isActive: true,
          userId: context.userId,
          email: context.email || '',
          expiresAt: context.expiresAt,
        };
        
        // Your auth logic
        await authenticateUser(context);
      },
      
      onSessionEnd: async (context: SessionEndContext) => {
        session.value = {
          isActive: false,
          userId: '',
          email: '',
          expiresAt: 0,
        };
        
        // Cleanup logic
        await clearAuth();
      },
    });

    await marketplaceSDK.initialize();
    sdk.value = marketplaceSDK;
  });

  onUnmounted(() => {
    sdk.value?.destroy();
  });

  return { sdk, session };
}
```

**Component**: `src/components/App.vue`

```vue
<template>
  <div>
    <SessionHeader :sdk="sdk" />
    
    <div v-if="!session.isActive">
      <h1>Please access via marketplace</h1>
    </div>
    
    <main v-else>
      <h1>Welcome, {{ session.email }}</h1>
      <YourAppContent />
    </main>
  </div>
</template>

<script setup lang="ts">
import { useMarketplaceSession } from '@/composables/useMarketplaceSession';
import SessionHeader from './SessionHeader.vue';

const { sdk, session } = useMarketplaceSession();
</script>
```

### Chrome Extensions

**Background Script**: `src/background.ts`

```typescript
import MarketplaceSDK from '@mission_sciences/provider-sdk';

// Initialize SDK in background
const sdk = new MarketplaceSDK({
  jwtParamName: 'gwSession',
  applicationId: 'my-chrome-extension',
  onSessionStart: async (context) => {
    // Store in chrome.storage
    await chrome.storage.local.set({
      marketplace_session: {
        userId: context.userId,
        email: context.email,
        expiresAt: context.expiresAt,
        jwt: context.jwt,
      },
    });
    
    // Notify content scripts
    chrome.runtime.sendMessage({
      type: 'MARKETPLACE_SESSION_START',
      session: context,
    });
  },
  
  onSessionEnd: async (context) => {
    // Clear storage
    await chrome.storage.local.remove('marketplace_session');
    
    // Notify content scripts
    chrome.runtime.sendMessage({
      type: 'MARKETPLACE_SESSION_END',
      reason: context.reason,
    });
  },
});

// Initialize
sdk.initialize();

// Listen for messages from content scripts
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'GET_SESSION') {
    chrome.storage.local.get('marketplace_session', (result) => {
      sendResponse(result.marketplace_session || null);
    });
    return true; // Keep channel open for async response
  }
});
```

**Content Script**: `src/content.ts`

```typescript
// Query session from background
chrome.runtime.sendMessage(
  { type: 'GET_SESSION' },
  (session) => {
    if (session) {
      console.log('Active marketplace session:', session);
      // Inject session UI
      injectSessionHeader(session);
    }
  }
);

// Listen for session events
chrome.runtime.onMessage.addListener((request) => {
  if (request.type === 'MARKETPLACE_SESSION_START') {
    console.log('Session started:', request.session);
    // Update UI
  }
  
  if (request.type === 'MARKETPLACE_SESSION_END') {
    console.log('Session ended:', request.reason);
    // Clean up UI
  }
});
```

---

## Authentication Integration

### Backend Token Exchange Pattern

**Recommended approach for production apps:**

```typescript
// Frontend: Send marketplace JWT to your backend
onSessionStart: async (context: SessionStartContext) => {
  try {
    // Exchange marketplace JWT for your app's auth token
    const response = await fetch('https://your-api.com/auth/marketplace', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${context.jwt}`,
      },
      body: JSON.stringify({
        userId: context.userId,
        email: context.email,
        sessionId: context.sessionId,
      }),
    });
    
    if (!response.ok) {
      throw new Error(`Auth failed: ${response.status}`);
    }
    
    const { token, refreshToken, expiresIn } = await response.json();
    
    // Store your app's tokens
    localStorage.setItem('auth_token', token);
    localStorage.setItem('refresh_token', refreshToken);
    localStorage.setItem('token_expires', Date.now() + (expiresIn * 1000));
    
    console.log('[Auth] User authenticated via marketplace');
  } catch (error) {
    console.error('[Auth] Failed:', error);
    throw error; // Prevents session from starting
  }
},
```

**Backend**: API endpoint to handle exchange

```python
# Python/Flask example
@app.route('/auth/marketplace', methods=['POST'])
def marketplace_auth():
    # Get marketplace JWT from header
    auth_header = request.headers.get('Authorization')
    if not auth_header or not auth_header.startswith('Bearer '):
        return jsonify({'error': 'Missing token'}), 401
    
    marketplace_jwt = auth_header.replace('Bearer ', '')
    
    # Validate JWT (verify signature, expiration, etc.)
    try:
        claims = validate_marketplace_jwt(marketplace_jwt)
        user_id = claims['userId']
        email = claims.get('email')
    except Exception as e:
        return jsonify({'error': 'Invalid JWT'}), 401
    
    # Create or update user in your database
    user = get_or_create_user(user_id, email)
    
    # Generate your app's auth token
    app_token = generate_app_token(user)
    refresh_token = generate_refresh_token(user)
    
    return jsonify({
        'token': app_token,
        'refreshToken': refresh_token,
        'expiresIn': 3600,  # 1 hour
        'user': {
            'id': user.id,
            'email': user.email,
        }
    })
```

### Cognito Integration (AWS)

**For apps using AWS Cognito:**

```typescript
import { CognitoIdentityProviderClient, AdminCreateUserCommand, AdminSetUserPasswordCommand } from '@aws-sdk/client-cognito-identity-provider';
import { Cognito } from 'pycognito';  // For SRP authentication

// Backend: Auth server that exchanges marketplace JWT for Cognito tokens
onSessionStart: async (context: SessionStartContext) => {
  // Call your auth server
  const response = await fetch('http://your-auth-server/auth/marketplace-exchange', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${context.jwt}`,
      'Content-Type': 'application/json',
    },
  });
  
  const { idToken, accessToken, refreshToken, expiresIn } = await response.json();
  
  // Store Cognito tokens
  localStorage.setItem('cognito_id_token', idToken);
  localStorage.setItem('cognito_access_token', accessToken);
  localStorage.setItem('cognito_refresh_token', refreshToken);
  localStorage.setItem('token_expires', Date.now() + (expiresIn * 1000));
},
```

**Auth Server** (Python example from GhostDog):

```python
def exchange_marketplace_jwt():
    """Exchange marketplace JWT for Cognito tokens"""
    # 1. Get and validate marketplace JWT
    marketplace_jwt = request.headers.get('Authorization').replace('Bearer ', '')
    claims = jwt.decode(marketplace_jwt, options={"verify_signature": False})
    
    user_id = claims.get('userId')
    email = claims.get('email', f'marketplace-{user_id}@your-app.com')
    
    # 2. Create or update user in Cognito
    cognito_client = boto3.client('cognito-idp')
    
    try:
        # Check if user exists
        cognito_client.admin_get_user(
            UserPoolId=USER_POOL_ID,
            Username=user_id
        )
        # User exists, update password
        cognito_client.admin_set_user_password(
            UserPoolId=USER_POOL_ID,
            Username=user_id,
            Password=generate_password(),
            Permanent=True
        )
    except cognito_client.exceptions.UserNotFoundException:
        # Create new user
        cognito_client.admin_create_user(
            UserPoolId=USER_POOL_ID,
            Username=user_id,
            TemporaryPassword=generate_password(),
            MessageAction='SUPPRESS',
            UserAttributes=[
                {"Name": "email", "Value": email},
                {"Name": "email_verified", "Value": "true"},
            ]
        )
    
    # 3. Authenticate with Cognito SRP
    u = Cognito(
        user_pool_id=USER_POOL_ID,
        client_id=CLIENT_ID,
        client_secret=CLIENT_SECRET,  # Required for SRP
        user_pool_region='us-east-1',
        username=user_id
    )
    
    u.authenticate(password=password)
    
    # 4. Return Cognito tokens
    return jsonify({
        'idToken': u.id_token,
        'accessToken': u.access_token,
        'refreshToken': u.refresh_token,
        'expiresIn': 3600
    })
```

### Firebase Integration

```typescript
import { signInWithCustomToken } from 'firebase/auth';
import { auth } from './firebase';

onSessionStart: async (context: SessionStartContext) => {
  // Exchange marketplace JWT for Firebase custom token
  const response = await fetch('https://your-api.com/auth/firebase-token', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${context.jwt}`,
    },
  });
  
  const { customToken } = await response.json();
  
  // Sign in to Firebase
  await signInWithCustomToken(auth, customToken);
  
  console.log('[Firebase] User authenticated');
},
```

### Auth0 Integration

```typescript
onSessionStart: async (context: SessionStartContext) => {
  // Exchange marketplace JWT for Auth0 token
  const response = await fetch(`https://your-domain.auth0.com/oauth/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion: context.jwt,
      client_id: 'your-auth0-client-id',
      client_secret: 'your-auth0-client-secret',
      scope: 'openid profile email',
    }),
  });
  
  const { access_token, id_token } = await response.json();
  
  // Store Auth0 tokens
  localStorage.setItem('auth0_access_token', access_token);
  localStorage.setItem('auth0_id_token', id_token);
},
```

---

## Lifecycle Hooks

### onSessionStart

**Purpose**: Provision user and initialize app state

**When Called**: After JWT validation, before timer starts

**Common Tasks**:
- Create user account in your system
- Generate app authentication token
- Store session data
- Initialize user preferences
- Load user data

**Example**:

```typescript
onSessionStart: async (context: SessionStartContext) => {
  console.log('[Session] Starting for user:', context.userId);
  
  // 1. Check if user exists
  let user = await getUser(context.userId);
  
  // 2. Create if new user
  if (!user) {
    user = await createUser({
      id: context.userId,
      email: context.email,
      source: 'marketplace',
      createdAt: new Date(),
    });
    console.log('[Session] Created new user:', user.id);
  }
  
  // 3. Generate session token
  const token = await generateSessionToken({
    userId: user.id,
    sessionId: context.sessionId,
    expiresAt: context.expiresAt,
  });
  
  // 4. Store in app state
  appState.setAuth({
    token,
    user,
    expiresAt: context.expiresAt,
    source: 'marketplace',
  });
  
  // 5. Load user data
  await loadUserPreferences(user.id);
  await loadUserContent(user.id);
  
  console.log('[Session] User authenticated and initialized');
},
```

**Error Handling**:

If `onSessionStart` throws an error, the session will not start:

```typescript
onSessionStart: async (context: SessionStartContext) => {
  try {
    await authenticateUser(context);
  } catch (error) {
    console.error('[Session] Failed to start:', error);
    
    // Show error to user
    showError('Failed to initialize session. Please try again.');
    
    // Throw to prevent session from starting
    throw new Error('Session initialization failed');
  }
},
```

### onSessionWarning

**Purpose**: Alert user before session expires

**When Called**: At warning threshold (default: 5 minutes remaining)

**Common Tasks**:
- Show warning modal/notification
- Offer session extension
- Auto-save user work
- Prompt to save changes

**Example**:

```typescript
onSessionWarning: async (context: SessionWarningContext) => {
  console.log('[Session] Warning! Only', context.minutesRemaining, 'minutes left');
  
  // 1. Auto-save user work
  await autoSaveUserWork();
  
  // 2. Show warning modal
  showModal({
    title: 'Session Expiring Soon',
    message: `Your session will expire in ${context.minutesRemaining} minutes.`,
    buttons: [
      {
        label: 'Extend Session',
        action: async () => {
          try {
            await sdk.extendSession(30); // Request 30 more minutes
            showNotification('Session extended!');
          } catch (error) {
            showError('Failed to extend session');
          }
        },
      },
      {
        label: 'Save & Exit',
        action: async () => {
          await saveAllChanges();
          sdk.endSession('manual');
        },
      },
      {
        label: 'Continue',
        action: () => {
          // Dismiss modal, continue working
        },
      },
    ],
  });
},
```

**Customizing Warning Threshold**:

```typescript
const sdk = new MarketplaceSDK({
  // ... other options
  warningThresholdMinutes: 10, // Warn 10 minutes before expiration
});
```

### onSessionEnd

**Purpose**: Clean up app state when session ends

**When Called**: When session expires or user manually ends

**Common Tasks**:
- Clear authentication state
- Log user out
- Save analytics
- Clear cached data
- Redirect to marketplace (optional)

**Example**:

```typescript
onSessionEnd: async (context: SessionEndContext) => {
  console.log('[Session] Ending. Reason:', context.reason);
  console.log('[Session] Duration:', context.actualDurationMinutes, 'minutes');
  
  // 1. Save analytics
  await logSessionEnd({
    userId: context.userId,
    sessionId: context.sessionId,
    duration: context.actualDurationMinutes,
    reason: context.reason,
    timestamp: Date.now(),
  });
  
  // 2. Clear authentication
  localStorage.removeItem('auth_token');
  localStorage.removeItem('user_data');
  appState.clearAuth();
  
  // 3. Clear any cached data
  await clearUserCache();
  
  // 4. Show farewell message
  if (context.reason === 'manual') {
    showNotification('Session ended. Thank you for using our app!');
  } else if (context.reason === 'expired') {
    showNotification('Session expired. Please return via marketplace to continue.');
  }
  
  console.log('[Session] Cleanup complete');
},
```

**Custom Redirect Handling**:

By default, SDK redirects to the marketplace after session ends. To customize this behavior, handle redirects in your `onSessionEnd` hook:

```typescript
const sdk = new MarketplaceSDK({
  jwksUri: 'https://api.dev.generalwisdom.com/.well-known/jwks.json',
  marketplaceUrl: 'https://dev.generalwisdom.com/', // Required
  // ... other options
});

// Handle redirect manually in onSessionEnd:
onSessionEnd: async (context: SessionEndContext) => {
  await cleanup();
  
  // Custom redirect logic
  if (context.reason === 'expired') {
    window.location.href = 'https://dev.generalwisdom.com/?session=expired';
  } else {
    window.location.href = 'https://dev.generalwisdom.com/';
  }
},
```

### onSessionExtend

**Purpose**: Handle session extension requests

**When Called**: After successful session extension

**Common Tasks**:
- Update stored expiration time
- Refresh auth tokens
- Show confirmation
- Update UI timer

**Example**:

```typescript
onSessionExtend: async (context: SessionExtendContext) => {
  console.log('[Session] Extended by', context.extensionMinutes, 'minutes');
  console.log('[Session] New expiration:', new Date(context.newExpiresAt * 1000));
  
  // 1. Update stored expiration
  const auth = appState.getAuth();
  auth.expiresAt = context.newExpiresAt;
  appState.setAuth(auth);
  
  // 2. Refresh app auth token if needed
  if (needsTokenRefresh(auth)) {
    const newToken = await refreshAppToken(auth.token);
    auth.token = newToken;
    appState.setAuth(auth);
  }
  
  // 3. Show confirmation
  showNotification(`Session extended! You have ${context.extensionMinutes} more minutes.`);
  
  // 4. Log analytics
  await logSessionExtension({
    userId: context.userId,
    sessionId: context.sessionId,
    extensionMinutes: context.extensionMinutes,
    timestamp: Date.now(),
  });
},
```

---

## Session Management

### Checking Session Status

```typescript
// Check if session is active
if (sdk.hasActiveSession()) {
  console.log('Session is active');
}

// Get current session data
const session = sdk.getSession();
if (session) {
  console.log('User ID:', session.userId);
  console.log('Expires at:', new Date(session.expiresAt * 1000));
  console.log('Time remaining:', session.getRemainingSeconds(), 'seconds');
}
```

### Manually Ending Session

```typescript
// End session early
await sdk.endSession('manual');

// With reason
await sdk.endSession('user_requested');
```

### Extending Session

**Request more time (requires backend support):**

```typescript
// Request 30 more minutes
try {
  await sdk.extendSession(30);
  console.log('Session extended successfully');
} catch (error) {
  console.error('Failed to extend:', error);
  showError('Could not extend session. Please try again.');
}
```

**Backend endpoint required:**

```python
@app.route('/api/sessions/<session_id>/extend', methods=['POST'])
def extend_session(session_id):
    data = request.json
    extension_minutes = data.get('extensionMinutes', 30)
    
    # Validate request
    if not validate_session(session_id):
        return jsonify({'error': 'Invalid session'}), 401
    
    # Check if extension allowed (business rules)
    max_extension = 120  # Maximum 2 hours
    if extension_minutes > max_extension:
        return jsonify({'error': 'Extension too long'}), 400
    
    # Update session in database
    new_expires_at = update_session_expiration(session_id, extension_minutes)
    
    # Calculate cost (if applicable)
    cost_tokens = calculate_extension_cost(extension_minutes)
    
    # Deduct tokens from user (if applicable)
    if not deduct_user_tokens(session_id, cost_tokens):
        return jsonify({'error': 'Insufficient tokens'}), 402
    
    # Generate new JWT with extended expiration
    new_jwt = generate_session_jwt(
        session_id=session_id,
        expires_at=new_expires_at,
        duration_minutes=extension_minutes
    )
    
    return jsonify({
        'jwt': new_jwt,
        'expiresAt': new_expires_at,
        'extensionMinutes': extension_minutes,
        'costTokens': cost_tokens
    })
```

### Pausing/Resuming Timer (UI Only)

```typescript
// Pause timer (visual only, session still expires)
sdk.pauseTimer();

// Resume timer
sdk.resumeTimer();

// Check if paused
if (sdk.isTimerPaused()) {
  console.log('Timer is paused');
}
```

**Note**: Pausing only affects the UI display. The actual session expiration continues.

---

## UI Components

### Session Header

**Pre-built component showing timer and controls:**

```typescript
const header = sdk.createSessionHeader({
  containerId: 'session-header',
  theme: 'dark', // 'light' | 'dark' | 'auto'
  showControls: true, // Show pause/resume buttons
  showEndButton: true, // Show "End Session" button
  position: 'fixed', // 'fixed' | 'relative' | 'sticky'
});

header.mount('#session-header');
```

**Custom Styling**:

```css
/* Override default styles */
.gw-session-header {
  background: #1a1a1a;
  border-bottom: 2px solid #333;
  padding: 12px 24px;
}

.gw-session-timer {
  font-size: 18px;
  font-weight: 600;
  color: #00ff88;
}

.gw-session-timer--warning {
  color: #ff6b00;
  animation: pulse 1s infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.6; }
}
```

**Unmounting**:

```typescript
// Remove header from DOM
header.unmount();
```

### Custom Timer Display

**Build your own UI using SDK data:**

```typescript
// Get timer data
const timer = sdk.getTimer();

// Update UI every second
setInterval(() => {
  const remaining = timer.getRemainingSeconds();
  const minutes = Math.floor(remaining / 60);
  const seconds = remaining % 60;
  
  document.getElementById('timer').textContent = 
    `${minutes}:${seconds.toString().padStart(2, '0')}`;
  
  // Warning style
  if (remaining < 300) { // Less than 5 minutes
    document.getElementById('timer').classList.add('warning');
  }
}, 1000);
```

### Warning Modal

**Customize warning UI:**

```typescript
onSessionWarning: async (context) => {
  // Show your custom modal
  const modal = document.getElementById('warning-modal');
  modal.style.display = 'block';
  
  modal.querySelector('.minutes-remaining').textContent = context.minutesRemaining;
  
  // Extend button
  modal.querySelector('.extend-btn').onclick = async () => {
    await sdk.extendSession(30);
    modal.style.display = 'none';
  };
  
  // Continue button
  modal.querySelector('.continue-btn').onclick = () => {
    modal.style.display = 'none';
  };
},
```

**HTML**:

```html
<div id="warning-modal" class="modal" style="display: none;">
  <div class="modal-content">
    <h2>⏰ Session Expiring Soon</h2>
    <p>Your session will expire in <span class="minutes-remaining"></span> minutes.</p>
    <div class="modal-buttons">
      <button class="extend-btn">Extend Session (+30 min)</button>
      <button class="continue-btn">Continue</button>
    </div>
  </div>
</div>
```

---

## Advanced Features

### Multi-Tab Coordination

**SDK automatically coordinates sessions across tabs:**

- Master tab election (first tab becomes master)
- Automatic timer synchronization
- Shared session state via BroadcastChannel
- Seamless master failover if tab closes

**No configuration needed** - works out of the box!

**Listening for multi-tab events**:

```typescript
window.addEventListener('marketplace-session-sync', (event) => {
  console.log('[MultiTab] Session synced:', event.detail);
});
```

### Heartbeat System

**Periodic server communication for time sync:**

```typescript
const sdk = new MarketplaceSDK({
  // ... other options
  heartbeat: {
    enabled: true,
    intervalSeconds: 30, // Send heartbeat every 30 seconds
    endpoint: 'https://api.example.com/sessions/heartbeat',
  },
});
```

**Backend heartbeat handler**:

```python
@app.route('/sessions/heartbeat', methods=['POST'])
def session_heartbeat():
    data = request.json
    session_id = data['sessionId']
    client_time = data['timestamp']
    
    # Validate session still active
    session = get_session(session_id)
    if not session or session.is_expired():
        return jsonify({'error': 'Session expired'}), 410
    
    # Return server time for sync
    server_time = int(time.time())
    
    # Update last heartbeat
    update_session_heartbeat(session_id, server_time)
    
    return jsonify({
        'serverTime': server_time,
        'expiresAt': session.expires_at,
        'remainingSeconds': session.get_remaining_seconds()
    })
```

### Visibility API Integration

**Auto-pause when tab hidden (battery-friendly):**

```typescript
const sdk = new MarketplaceSDK({
  // ... other options
  pauseWhenHidden: true, // Auto-pause when tab not visible
});
```

SDK automatically:
- Pauses timer when tab hidden
- Resumes when tab visible again
- Syncs time with server on resume

### Backend JWT Validation

**Alternative to JWKS for sensitive apps:**

```typescript
const sdk = new MarketplaceSDK({
  // ... other options
  validateJWTBackend: true,
  validationEndpoint: 'https://api.example.com/validate-jwt',
});
```

**Backend validation endpoint**:

```python
@app.route('/validate-jwt', methods=['POST'])
def validate_jwt():
    jwt_token = request.json['jwt']
    
    try:
        # Validate with marketplace API
        response = requests.post(
            'https://api.platform.generalwisdom.com/validate-session',
            headers={'Authorization': f'Bearer {jwt_token}'}
        )
        
        if response.status_code == 200:
            claims = response.json()
            return jsonify({'valid': True, 'claims': claims})
        else:
            return jsonify({'valid': False, 'error': 'Invalid JWT'}), 401
            
    except Exception as e:
        return jsonify({'valid': False, 'error': str(e)}), 500
```

---

## Security Best Practices

### JWT Validation

✅ **Do**:
- Always validate JWT signature (SDK does this automatically)
- Check expiration time
- Verify issuer matches marketplace
- Validate applicationId matches your app
- Use JWKS for signature verification (production)

❌ **Don't**:
- Skip JWT validation
- Trust client-side validation only
- Store JWT in localStorage without encryption
- Share JWT across origins

### Token Storage

✅ **Do**:
- Use httpOnly cookies for sensitive tokens (if possible)
- Use chrome.storage for extensions (browser-encrypted)
- Clear tokens immediately on session end
- Set appropriate expiration times

❌ **Don't**:
- Store sensitive data in localStorage without encryption
- Keep tokens after session ends
- Share tokens between users/sessions

### HTTPS Requirements

✅ **Production Must Have**:
- HTTPS for all API endpoints
- Valid SSL certificate
- Secure WebSocket connections (wss://)
- HSTS headers enabled

### Rate Limiting

**Protect your backend endpoints:**

```python
from flask_limiter import Limiter

limiter = Limiter(app, key_func=lambda: request.headers.get('X-Session-ID'))

@app.route('/auth/marketplace', methods=['POST'])
@limiter.limit("10 per minute")  # Max 10 auth requests per minute per session
def marketplace_auth():
    # ... auth logic
```

### Secrets Management

✅ **Do**:
- Use environment variables for secrets
- Use AWS Secrets Manager / Azure Key Vault
- Rotate secrets regularly
- Never commit secrets to git

❌ **Don't**:
- Hard-code API keys
- Commit `.env` files
- Share secrets in plain text

### Input Validation

**Always validate user input:**

```typescript
onSessionStart: async (context: SessionStartContext) => {
  // Validate email format
  if (context.email && !isValidEmail(context.email)) {
    throw new Error('Invalid email format');
  }
  
  // Validate userId format
  if (!isValidUUID(context.userId)) {
    throw new Error('Invalid user ID format');
  }
  
  // Sanitize inputs before database queries
  const sanitizedEmail = sanitize(context.email);
  
  // ... rest of logic
},
```

---

## Testing

### Unit Tests

**Test SDK initialization:**

```typescript
import { describe, it, expect, beforeEach } from 'vitest';
import MarketplaceSDK from '@mission_sciences/provider-sdk';

describe('MarketplaceSDK', () => {
  let sdk: MarketplaceSDK;
  
  beforeEach(() => {
    sdk = new MarketplaceSDK({
      jwtParamName: 'gwSession',
      applicationId: 'test-app',
      jwksUrl: 'https://test.example.com/.well-known/jwks.json',
      onSessionStart: async () => {},
      onSessionEnd: async () => {},
    });
  });
  
  it('initializes without errors', async () => {
    await expect(sdk.initialize()).resolves.not.toThrow();
  });
  
  it('detects JWT in URL', () => {
    window.location.href = 'http://test.com?gwSession=test-token';
    expect(sdk.hasJWTInURL()).toBe(true);
  });
  
  it('extracts JWT from URL', () => {
    window.location.href = 'http://test.com?gwSession=test-token';
    expect(sdk.getJWTFromURL()).toBe('test-token');
  });
});
```

### Integration Tests

**Test complete flow:**

```typescript
import { describe, it, expect } from 'vitest';
import MarketplaceSDK from '@mission_sciences/provider-sdk';

describe('Session Flow', () => {
  it('completes full session lifecycle', async () => {
    let sessionStarted = false;
    let sessionEnded = false;
    
    const sdk = new MarketplaceSDK({
      jwtParamName: 'gwSession',
      applicationId: 'test-app',
      jwksUrl: 'https://test.example.com/.well-known/jwks.json',
      
      onSessionStart: async (context) => {
        sessionStarted = true;
        expect(context.userId).toBeDefined();
      },
      
      onSessionEnd: async (context) => {
        sessionEnded = true;
        expect(context.reason).toBe('manual');
      },
    });
    
    // Set test JWT in URL
    window.location.href = 'http://test.com?gwSession=' + generateTestJWT();
    
    // Initialize
    await sdk.initialize();
    expect(sessionStarted).toBe(true);
    expect(sdk.hasActiveSession()).toBe(true);
    
    // End session
    await sdk.endSession('manual');
    expect(sessionEnded).toBe(true);
    expect(sdk.hasActiveSession()).toBe(false);
  });
});
```

### Mock JWT Generation

**For testing without real JWT:**

```typescript
import jwt from 'jsonwebtoken';
import fs from 'fs';

export function generateTestJWT(options = {}) {
  const privateKey = fs.readFileSync('./keys/private-key.pem');
  
  const payload = {
    sessionId: options.sessionId || 'test-session-123',
    applicationId: options.applicationId || 'test-app',
    userId: options.userId || 'test-user-456',
    orgId: options.orgId || 'test-org-789',
    email: options.email || 'test@example.com',
    startTime: Math.floor(Date.now() / 1000),
    durationMinutes: options.durationMinutes || 60,
    iss: 'generalwisdom.com',
    sub: options.userId || 'test-user-456',
    exp: Math.floor(Date.now() / 1000) + (options.durationMinutes || 60) * 60,
    iat: Math.floor(Date.now() / 1000),
  };
  
  return jwt.sign(payload, privateKey, {
    algorithm: 'RS256',
    keyid: 'test-key-id',
  });
}
```

### E2E Tests (Playwright)

```typescript
import { test, expect } from '@playwright/test';

test('marketplace session flow', async ({ page }) => {
  // Generate test JWT
  const jwt = generateTestJWT({ durationMinutes: 5 });
  
  // Navigate with JWT
  await page.goto(`http://localhost:3000?gwSession=${jwt}`);
  
  // Wait for session to start
  await expect(page.locator('.session-timer')).toBeVisible();
  
  // Verify session header shows
  const timer = await page.locator('.session-timer').textContent();
  expect(timer).toMatch(/\d+:\d{2}/); // Format: MM:SS
  
  // Click end session button
  await page.click('button[data-testid="end-session"]');
  
  // Verify redirect or cleanup
  await expect(page).toHaveURL(/marketplace/);
});
```

---

## Troubleshooting

### Common Issues

#### Issue: "JWT validation failed"

**Symptoms**: Session doesn't start, console shows JWT error

**Causes**:
1. Invalid JWT signature
2. JWT expired
3. Wrong JWKS URL
4. applicationId mismatch

**Solutions**:
```typescript
// Verify applicationId matches JWT claim
applicationId: 'your-registered-app-id',

// Check console for detailed error
console.log('[SDK] JWT validation error:', error);
```

#### Issue: Session header not showing

**Symptoms**: Timer UI doesn't appear

**Causes**:
1. Mount element doesn't exist
2. SDK not initialized
3. No active session

**Solutions**:
```typescript
// Ensure element exists before mounting
const container = document.getElementById('session-header');
if (container) {
  header.mount('#session-header');
} else {
  console.error('Mount container not found');
}

// Check SDK initialized
if (sdk.hasActiveSession()) {
  header.mount('#session-header');
}
```

#### Issue: "Cognito SECRET_HASH required"

**Symptoms**: Auth server returns 500 error

**Cause**: Cognito client requires client_secret

**Solution**:
```python
# Add client_secret to Cognito configuration
cognito_config = {
    'user_pool_id': 'us-east-1_XXXXXXXXX',
    'client_id': 'xxxxxxxxxxxxx',
    'client_secret': 'your-client-secret',  # Add this
}

# Pass to Cognito constructor
u = Cognito(
    user_pool_id=cognito_config['user_pool_id'],
    client_id=cognito_config['client_id'],
    client_secret=cognito_config['client_secret'],  # Required for SRP
    username=user_id
)
```

#### Issue: Multi-tab sync not working

**Symptoms**: Timers out of sync across tabs

**Causes**:
1. BroadcastChannel not supported
2. Different origins

**Solutions**:
```typescript
// Check BroadcastChannel support
if ('BroadcastChannel' in window) {
  console.log('Multi-tab sync supported');
} else {
  console.warn('BroadcastChannel not supported, fallback to localStorage');
}

// Ensure same origin
// http://localhost:3000 !== http://127.0.0.1:3000
```

#### Issue: Session extends but timer doesn't update

**Symptoms**: Extension succeeds but UI still shows old time

**Cause**: Not updating timer after extension

**Solution**:
```typescript
onSessionExtend: async (context: SessionExtendContext) => {
  // SDK automatically updates internal timer
  // But you may need to refresh UI
  const newExpiration = new Date(context.newExpiresAt * 1000);
  updateUIExpiration(newExpiration);
  
  // Force session header refresh
  sdk.refreshSessionHeader();
},
```

### Debugging

**Enable debug logging:**

```typescript
const sdk = new MarketplaceSDK({
  // ... options
  debug: true, // Enable verbose logging
});
```

**Check SDK state:**

```typescript
// Log SDK state
console.log('SDK initialized:', sdk.isInitialized());
console.log('Has active session:', sdk.hasActiveSession());
console.log('Session data:', sdk.getSession());
console.log('Timer state:', sdk.getTimer());
```

**Monitor lifecycle events:**

```typescript
const sdk = new MarketplaceSDK({
  onSessionStart: async (context) => {
    console.log('[Lifecycle] Session start:', context);
  },
  onSessionWarning: async (context) => {
    console.log('[Lifecycle] Warning:', context);
  },
  onSessionEnd: async (context) => {
    console.log('[Lifecycle] Session end:', context);
  },
  onSessionExtend: async (context) => {
    console.log('[Lifecycle] Extension:', context);
  },
});
```

---

## Production Deployment

### Checklist

- [ ] Update `applicationId` to registered value
- [ ] Enable HTTPS for all endpoints
- [ ] Configure proper CORS headers
- [ ] Set up secrets management (AWS Secrets Manager, etc.)
- [ ] Enable rate limiting on auth endpoints
- [ ] Configure logging and monitoring
- [ ] Test JWT validation with production keys
- [ ] Test session extension flow
- [ ] Test multi-tab coordination
- [ ] Set proper CSP headers
- [ ] Enable HSTS
- [ ] Configure marketplace redirect URL
- [ ] Test error handling and fallbacks
- [ ] Load test auth endpoints
- [ ] Set up alerts for auth failures

### Environment Configuration

**Development** (local testing):
```typescript
const config = {
  jwksUri: 'http://localhost:3000/.well-known/jwks.json',
  marketplaceUrl: 'http://localhost:8080',
  applicationId: 'test-app',
  debug: true,
};
```

**General Wisdom Dev Environment**:
```typescript
const config = {
  jwksUri: 'https://api.dev.generalwisdom.com/.well-known/jwks.json',
  marketplaceUrl: 'https://dev.generalwisdom.com/',
  applicationId: process.env.MARKETPLACE_APP_ID,
  debug: true,
};
```

**Production**:
```typescript
const config = {
  jwksUri: 'https://api.platform.generalwisdom.com/.well-known/jwks.json',
  marketplaceUrl: 'https://platform.generalwisdom.com/',
  applicationId: process.env.MARKETPLACE_APP_ID,
  debug: false,
};
```

### Performance Optimization

**Bundle Size**:
- SDK is ~8KB gzipped
- Tree-shake unused features
- Use code splitting for session header

**Network**:
- Cache JWKS response (SDK does this automatically)
- Use CDN for static assets
- Enable HTTP/2

**Rendering**:
- Lazy load session header component
- Debounce timer updates (SDK does 1s intervals)
- Use `requestAnimationFrame` for animations

### Monitoring

**Track key metrics:**

```typescript
// Log session events to analytics
onSessionStart: async (context) => {
  analytics.track('marketplace_session_start', {
    userId: context.userId,
    sessionId: context.sessionId,
    durationMinutes: context.durationMinutes,
  });
},

onSessionEnd: async (context) => {
  analytics.track('marketplace_session_end', {
    userId: context.userId,
    sessionId: context.sessionId,
    reason: context.reason,
    actualDuration: context.actualDurationMinutes,
  });
},
```

**Monitor errors:**

```typescript
onSessionStart: async (context) => {
  try {
    await authenticateUser(context);
  } catch (error) {
    // Log to error tracking service
    errorTracker.captureException(error, {
      extra: {
        userId: context.userId,
        sessionId: context.sessionId,
      },
    });
    throw error;
  }
},
```

---

## API Reference

### MarketplaceSDK Class

#### Constructor

```typescript
new MarketplaceSDK(options: SDKOptions)
```

#### Options

```typescript
interface SDKOptions {
  // Required (v0.4.0+)
  jwksUri: string;                   // REQUIRED: Environment-aware JWKS endpoint URL
  marketplaceUrl: string;            // REQUIRED: Environment-aware marketplace redirect URL
  
  // Required
  applicationId: string;             // Your registered app ID
  onSessionStart: (context: SessionStartContext) => Promise<void>;
  onSessionEnd: (context: SessionEndContext) => Promise<void>;
  
  // Optional
  jwtParamName?: string;             // URL parameter name for JWT (default: 'gwSession')
  onSessionWarning?: (context: SessionWarningContext) => Promise<void>;
  onSessionExtend?: (context: SessionExtendContext) => Promise<void>;
  warningThresholdMinutes?: number;  // Warning threshold (default: 5)
  debug?: boolean;                   // Enable debug logging
  pauseWhenHidden?: boolean;         // Auto-pause when tab hidden
  validateJWTBackend?: boolean;      // Use backend validation
  validationEndpoint?: string;       // Backend validation URL
  heartbeat?: {
    enabled: boolean;
    intervalSeconds: number;
    endpoint: string;
  };
}
```

#### Methods

```typescript
// Initialize SDK
async initialize(): Promise<void>

// Check if session active
hasActiveSession(): boolean

// Get session data
getSession(): Session | null

// Get timer instance
getTimer(): TimerManager | null

// End session manually
async endSession(reason: string): Promise<void>

// Extend session
async extendSession(minutes: number): Promise<void>

// Create session header component
createSessionHeader(options: HeaderOptions): SessionHeader

// Pause/resume timer (UI only)
pauseTimer(): void
resumeTimer(): void
isTimerPaused(): boolean

// Destroy SDK instance
destroy(): void
```

### Context Types

```typescript
interface SessionStartContext {
  sessionId: string;
  applicationId: string;
  userId: string;
  orgId?: string;
  email?: string;
  startTime: number;        // Unix timestamp
  expiresAt: number;        // Unix timestamp
  durationMinutes: number;
  jwt: string;              // Original JWT token
}

interface SessionEndContext {
  sessionId: string;
  userId: string;
  reason: 'expired' | 'manual' | 'error';
  actualDurationMinutes: number;
}

interface SessionWarningContext {
  sessionId: string;
  userId: string;
  minutesRemaining: number;
  expiresAt: number;
}

interface SessionExtendContext {
  sessionId: string;
  userId: string;
  extensionMinutes: number;
  newExpiresAt: number;
  previousExpiresAt: number;
}
```

---

## Additional Resources

- **GitHub Repository**: [github.com/Mission-Sciences/provider-sdk](https://github.com/Mission-Sciences/provider-sdk)
- **API Documentation**: [docs.generalwisdom.com/provider-sdk](https://docs.generalwisdom.com/provider-sdk)
- **Example Apps**: See `examples/` directory in SDK repository
- **Support**: support@generalwisdom.com
- **Marketplace Portal**: [marketplace.generalwisdom.com/developers](https://marketplace.generalwisdom.com/developers)

---

## License

MIT License - see [LICENSE](./LICENSE) file for details

---

## Changelog

### v2.0.0 (Phase 2)
- Added heartbeat system
- Multi-tab coordination
- Session extension support
- Early completion
- Visibility API integration
- Backend JWT validation option

### v1.0.0 (Phase 1)
- Initial release
- JWT validation with JWKS
- Session timer management
- Lifecycle hooks
- Session header component
- TypeScript support

---

**Questions? Issues? Feedback?**

Open an issue on [GitHub](https://github.com/Mission-Sciences/provider-sdk/issues) or contact support@generalwisdom.com
