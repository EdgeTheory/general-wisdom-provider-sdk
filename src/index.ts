/**
 * Marketplace Provider SDK
 * JWT-based session management for application providers
 */

// Main SDK class
export { MarketplaceSDK } from './core/MarketplaceSDK';

// Core utilities
export { JWTParser } from './core/JWTParser';
export { JWKSValidator } from './core/JWKSValidator';
export { TimerManager } from './core/TimerManager';

// Phase 2 utilities
export { HeartbeatManager } from './core/HeartbeatManager';
export { TabSyncManager } from './core/TabSyncManager';
export type { TabSyncMessage } from './core/TabSyncManager';

// UI Components
export { WarningModal } from './ui/WarningModal';
export { SessionHeader } from './ui/SessionHeader';
export { PurchaseModal } from './ui/PurchaseModal';

// Styling & Theme
export { lightTheme, darkTheme, getTheme, generateCSSVariables } from './styles/theme';
export type { Theme, ThemeColors, ThemeTypography, ThemeSpacing } from './styles/theme';

// Types
export type {
  SDKConfig,
  SessionData,
  SDKEvents,
  ModalStyles,
  ThemeMode,
  JWTHeader,
  JWTClaims,
  JWKSKey,
  JWKSResponse,
  SessionLifecycleHooks,
  SessionStartContext,
  SessionEndContext,
  SessionExtendContext,
  SessionWarningContext,
} from './types';

export { SDKError, PurchaseError } from './types';
export type { PurchaseResult } from './types';

// Utilities
export { extractTokenFromURL, isBrowser } from './utils/url';
export { Logger } from './utils/logger';

// Default export
export { MarketplaceSDK as default } from './core/MarketplaceSDK';
