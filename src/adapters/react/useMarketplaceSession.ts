import { useEffect, useState, useCallback, useRef } from 'react';
import { MarketplaceSDK } from '../../core/MarketplaceSDK';
import type { SDKConfig, SessionData } from '../../types';

export interface UseMarketplaceSessionOptions extends Omit<SDKConfig, 'hooks'> {
  onSessionStart?: (data: SessionData) => void;
  onSessionWarning?: (data: { remainingSeconds: number }) => void;
  onSessionEnd?: () => void;
  onError?: (error: Error) => void;
  hooks?: SDKConfig['hooks'];
}

export interface UseMarketplaceSessionReturn {
  session: SessionData | null;
  loading: boolean;
  error: string | null;
  remainingTime: number;
  formattedTime: string;
  formattedTimeWithHours: string;
  isTimerRunning: boolean;
  startTimer: () => void;
  pauseTimer: () => void;
  resumeTimer: () => void;
  endSession: () => void;
  extendSession: (minutes: number) => Promise<void>;
  sdk: MarketplaceSDK | null;
}

export function useMarketplaceSession(
  options: UseMarketplaceSessionOptions
): UseMarketplaceSessionReturn {
  const [session, setSession] = useState<SessionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [remainingTime, setRemainingTime] = useState(0);
  const [formattedTime, setFormattedTime] = useState('0:00');
  const [formattedTimeWithHours, setFormattedTimeWithHours] = useState('0:00:00');
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  const sdkRef = useRef<MarketplaceSDK | null>(null);
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    const initializeSDK = async () => {
      try {
        const sdk = new MarketplaceSDK({
          jwksUri: options.jwksUri,
          marketplaceUrl: options.marketplaceUrl,
          apiEndpoint: options.apiEndpoint,
          debug: options.debug,
          autoStart: options.autoStart,
          warningThresholdSeconds: options.warningThresholdSeconds,
          customStyles: options.customStyles,
          applicationId: options.applicationId,
          enableHeartbeat: options.enableHeartbeat ?? false,
          heartbeatIntervalSeconds: options.heartbeatIntervalSeconds ?? 30,
          enableTabSync: options.enableTabSync ?? false,
          pauseOnHidden: options.pauseOnHidden ?? false,
          useBackendValidation: options.useBackendValidation ?? false,
          hooks: options.hooks,
        });

        sdk.on('onSessionStart', (data) => {
          setSession(data);
          setLoading(false);
          setIsTimerRunning(sdk.isTimerRunning());
          options.onSessionStart?.(data);
        });

        sdk.on('onSessionWarning', (data) => {
          options.onSessionWarning?.(data);
        });

        sdk.on('onSessionEnd', () => {
          setIsTimerRunning(false);
          options.onSessionEnd?.();
        });

        sdk.on('onError', (err) => {
          setError(err.message);
          setLoading(false);
          options.onError?.(err);
        });

        sdkRef.current = sdk;
        await sdk.initialize();

        intervalRef.current = window.setInterval(() => {
          if (sdkRef.current) {
            setRemainingTime(sdkRef.current.getRemainingTime());
            setFormattedTime(sdkRef.current.getFormattedTime());
            setFormattedTimeWithHours(sdkRef.current.getFormattedTimeWithHours());
            setIsTimerRunning(sdkRef.current.isTimerRunning());
          }
        }, 1000);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error';
        setError(errorMessage);
        setLoading(false);
      }
    };

    initializeSDK();

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      if (sdkRef.current) {
        sdkRef.current.destroy();
      }
    };
  }, []);

  const startTimer = useCallback(() => {
    sdkRef.current?.startTimer();
    setIsTimerRunning(true);
  }, []);

  const pauseTimer = useCallback(() => {
    sdkRef.current?.pauseTimer();
    setIsTimerRunning(false);
  }, []);

  const resumeTimer = useCallback(() => {
    sdkRef.current?.resumeTimer();
    setIsTimerRunning(true);
  }, []);

  const endSession = useCallback(() => {
    sdkRef.current?.endSession();
    setIsTimerRunning(false);
  }, []);

  const extendSession = useCallback(async (minutes: number) => {
    if (!sdkRef.current) throw new Error('SDK not initialized');
    await sdkRef.current.extendSession(minutes);
  }, []);

  return {
    session,
    loading,
    error,
    remainingTime,
    formattedTime,
    formattedTimeWithHours,
    isTimerRunning,
    startTimer,
    pauseTimer,
    resumeTimer,
    endSession,
    extendSession,
    sdk: sdkRef.current,
  };
}
