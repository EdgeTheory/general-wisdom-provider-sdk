/**
 * SDK Configuration
 */
export interface SDKConfig {
  /** JWKS endpoint URL — REQUIRED, environment-aware (e.g., https://api.dev.generalwisdom.com/.well-known/jwks.json) */
  jwksUri: string;
  /** URL query parameter name containing the JWT (default: 'gwSession') */
  jwtParamName?: string;
  /** API endpoint for backend integration (Phase 2) */
  apiEndpoint?: string;
  /** JWT issuer for validation (default: 'generalwisdom.com') */
  jwtIssuer?: string;
  /** Enable debug logging */
  debug?: boolean;
  /** Auto-start timer after initialization */
  autoStart?: boolean;
  /** Warning threshold in seconds (default: 300 = 5 minutes) */
  warningThresholdSeconds?: number;
  /** Custom styling for warning modal (Legacy - prefer using themeMode) */
  customStyles?: Partial<ModalStyles>;
  /** Theme mode for modal styling (default: 'light') */
  themeMode?: ThemeMode;
  /** Application ID for validation */
  applicationId?: string;
  /** Marketplace URL for redirects — REQUIRED, environment-aware (e.g., https://dev.generalwisdom.com/) */
  marketplaceUrl: string;

  // Phase 2 Features
  /** Enable heartbeat system (default: false) */
  enableHeartbeat?: boolean;
  /** Heartbeat interval in seconds (default: 30) */
  heartbeatIntervalSeconds?: number;
  /** Enable multi-tab synchronization (default: false) */
  enableTabSync?: boolean;
  /** Pause timer when tab is hidden (default: false) */
  pauseOnHidden?: boolean;
  /** Use backend validation instead of JWKS (default: false) */
  useBackendValidation?: boolean;

  // Lifecycle Hooks
  /** Optional hooks for synchronizing app auth state with marketplace sessions */
  hooks?: SessionLifecycleHooks;
  /** Hook execution timeout in milliseconds (default: 5000) */
  hookTimeoutMs?: number;
}

/**
 * Session Data extracted from JWT
 */
export interface SessionData {
  /** Unique session UUID */
  sessionId: string;
  /** Application ID */
  applicationId: string;
  /** User ID */
  userId: string;
  /** Organization ID */
  orgId: string;
  /** Session start time (Unix timestamp seconds) */
  startTime: number;
  /** Session duration in minutes */
  durationMinutes: number;
  /** Issued at timestamp (Unix seconds) */
  iat: number;
  /** Expiration timestamp (Unix seconds) */
  exp: number;
  /** Issuer */
  iss: string;
  /** Subject (user ID) */
  sub: string;
}

/**
 * Modal styling options (Legacy - prefer using theme)
 * @deprecated Use theme configuration from src/styles/theme.ts instead
 */
export interface ModalStyles {
  backgroundColor: string;
  textColor: string;
  primaryColor: string;
  borderRadius: string;
  fontFamily: string;
}

/**
 * Theme mode for modal styling
 */
export type ThemeMode = 'light' | 'dark' | 'auto';

/**
 * Purchase Result
 */
export interface PurchaseResult {
  /** Item ID that was purchased */
  itemId: string;
  /** Transaction ID from payment processor */
  transactionId: string;
  /** Purchase amount */
  amount: number;
}


/**
 * Session Lifecycle Hook Contexts
 */
export interface SessionStartContext {
  /** Unique session UUID */
  sessionId: string;
  /** User ID from JWT */
  userId: string;
  /** User email (if available in JWT) */
  email?: string;
  /** Organization ID */
  orgId: string;
  /** Application ID */
  applicationId: string;
  /** Session duration in minutes */
  durationMinutes: number;
  /** Expiration timestamp (Unix seconds) */
  expiresAt: number;
  /** Full JWT token for app use */
  jwt: string;
}

export interface SessionEndContext {
  /** Unique session UUID */
  sessionId: string;
  /** User ID */
  userId: string;
  /** Reason for session end */
  reason: 'expired' | 'manual' | 'error';
  /** Actual session duration in minutes (if available) */
  actualDurationMinutes?: number;
}

export interface SessionExtendContext {
  /** Unique session UUID */
  sessionId: string;
  /** User ID */
  userId: string;
  /** Additional minutes added to session */
  additionalMinutes: number;
  /** New expiration timestamp (Unix seconds) */
  newExpiresAt: number;
}

export interface SessionWarningContext {
  /** Unique session UUID */
  sessionId: string;
  /** User ID */
  userId: string;
  /** Remaining seconds until expiration */
  remainingSeconds: number;
}

/**
 * Session Lifecycle Hooks
 * Optional callbacks that allow applications to synchronize their auth state with marketplace sessions
 */
export interface SessionLifecycleHooks {
  /**
   * Called after JWT validation succeeds but before session timer starts
   * Use to: Auto-login user to your app's auth system
   * Note: Hook failure will prevent session from starting
   */
  onSessionStart?: (context: SessionStartContext) => Promise<void> | void;

  /**
   * Called when session expires or is manually ended, before redirect
   * Use to: Force logout user from your app's auth system
   * Note: Hook failure will be logged but won't prevent session end
   */
  onSessionEnd?: (context: SessionEndContext) => Promise<void> | void;

  /**
   * Called when session extension succeeds
   * Use to: Refresh app auth tokens if needed
   */
  onSessionExtend?: (context: SessionExtendContext) => Promise<void> | void;

  /**
   * Called before session warning modal is shown
   * Use to: Prepare user for session expiration
   */
  onSessionWarning?: (context: SessionWarningContext) => Promise<void> | void;
}

/**
 * Custom SDK Error
 */
export class SDKError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode?: number
  ) {
    super(message);
    this.name = 'SDKError';

    // Maintains proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, SDKError);
    }
  }
}

/**
 * Purchase Error
 */
export class PurchaseError extends SDKError {
  constructor(
    message: string,
    code: string,
    public itemId: string,
    statusCode?: number
  ) {
    super(message, code, statusCode);
    this.name = 'PurchaseError';
  }
}

/**
 * SDK Event Handlers
 */
export interface SDKEvents {
  /** Called when session successfully initialized */
  onSessionStart: (data: SessionData) => void;
  /** Called when warning threshold reached */
  onSessionWarning: (data: { remainingSeconds: number }) => void;
  /** Called when session expires or is ended */
  onSessionEnd: () => void;
  /** Called on any error */
  onError: (error: Error) => void;

  // Purchase Events
  /** Called when purchase process starts */
  onPurchaseStart: (data: { itemId: string; quantity: number }) => void;
  /** Called when purchase succeeds */
  onPurchaseSuccess: (result: PurchaseResult) => void;
  /** Called when purchase fails */
  onPurchaseError: (error: PurchaseError) => void;
  /** Called after successful requestPurchase */
  onPurchaseComplete: (itemId: string) => void;
  /** Called when purchase is cancelled by user */
  onPurchaseCancelled: (itemId: string) => void;
  /** Called when user balance is updated */
  onBalanceUpdate: (balance: number) => void;
}

/**
 * JWT Header
 */
export interface JWTHeader {
  alg: string;
  typ: string;
  kid: string;
}

/**
 * JWT Claims (raw payload from token)
 */
export interface JWTClaims {
  sessionId: string;
  applicationId: string;
  userId: string;
  orgId: string;
  startTime: number;
  durationMinutes: number;
  iat: number;
  exp: number;
  iss: string;
  sub: string;
}

/**
 * JWKS Key
 */
export interface JWKSKey {
  kty: string;
  use: string;
  kid: string;
  alg: string;
  n: string;
  e: string;
}

/**
 * JWKS Response
 */
export interface JWKSResponse {
  keys: JWKSKey[];
}

/**
 * Purchase State Constants
 */
export enum PurchaseState {
  AVAILABLE = 'AVAILABLE',
  PRIVY_REQUIRED = 'PRIVY_REQUIRED',
  INSUFFICIENT_FUNDS = 'INSUFFICIENT_FUNDS'
}

/**
 * Privy Eligibility Details (internal use - not exposed to apps)
 */
export interface PrivyEligibilityDetails {
  requiresUpgrade: boolean;
  currentLevel: number;
  requiredLevel: number;
}

/**
 * Raw Privy Eligibility Response (internal use - not exposed to apps)
 */
export interface PrivyEligibilityResponse {
  state: PurchaseState;
  privyEligibility?: {
    [levelId: string]: PrivyEligibilityDetails;
  };
}

/**
 * Filtered Purchase State Response (exposed to apps)
 */
export interface PurchaseStateResponse {
  state: PurchaseState;
  requiredLevel?: number; // Only exposed for PRIVY_REQUIRED state
}
