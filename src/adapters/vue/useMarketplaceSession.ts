import { ref, onMounted, onUnmounted } from 'vue';
import { MarketplaceSDK } from '../../core/MarketplaceSDK';
import type { SDKConfig, SessionData, SessionStartContext, SessionEndContext } from '../../types';

export interface UseMarketplaceSessionOptions extends Omit<SDKConfig, 'hooks'> {
  onSessionStart?: (context: SessionStartContext) => void | Promise<void>;
  onSessionEnd?: (context: SessionEndContext) => void | Promise<void>;
  onError?: (error: Error) => void;
  hooks?: SDKConfig['hooks'];
}

export function useMarketplaceSession(options: UseMarketplaceSessionOptions = {} as UseMarketplaceSessionOptions) {
  const sdk = ref<MarketplaceSDK | null>(null);
  const session = ref<SessionData | null>(null);
  const loading = ref(true);
  const error = ref<string | null>(null);
  const remainingTime = ref(0);
  const formattedTime = ref('0:00');
  const isTimerRunning = ref(false);

  let timerInterval: ReturnType<typeof setInterval> | null = null;

  onMounted(async () => {
    try {
      const marketplaceSDK = new MarketplaceSDK({
        jwksUri: options.jwksUri,
        marketplaceUrl: options.marketplaceUrl,
        apiEndpoint: options.apiEndpoint,
        debug: options.debug,
        autoStart: options.autoStart,
        warningThresholdSeconds: options.warningThresholdSeconds,
        applicationId: options.applicationId,
        enableHeartbeat: options.enableHeartbeat ?? false,
        enableTabSync: options.enableTabSync ?? false,
        pauseOnHidden: options.pauseOnHidden ?? false,
        hooks: options.hooks,
      });

      marketplaceSDK.on('onSessionStart', (data) => {
        session.value = data;
        loading.value = false;
        isTimerRunning.value = marketplaceSDK.isTimerRunning();
        options.onSessionStart?.(data as unknown as SessionStartContext);
      });

      marketplaceSDK.on('onSessionEnd', () => {
        isTimerRunning.value = false;
        options.onSessionEnd?.({} as SessionEndContext);
      });

      marketplaceSDK.on('onError', (err) => {
        error.value = err.message;
        loading.value = false;
        options.onError?.(err);
      });

      await marketplaceSDK.initialize();
      sdk.value = marketplaceSDK;

      timerInterval = setInterval(() => {
        if (sdk.value) {
          remainingTime.value = sdk.value.getRemainingTime();
          formattedTime.value = sdk.value.getFormattedTime();
          isTimerRunning.value = sdk.value.isTimerRunning();
        }
      }, 1000);
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Unknown error';
      loading.value = false;
    }
  });

  onUnmounted(() => {
    if (timerInterval) clearInterval(timerInterval);
    sdk.value?.destroy();
  });

  const pauseTimer = () => {
    sdk.value?.pauseTimer();
    isTimerRunning.value = false;
  };

  const resumeTimer = () => {
    sdk.value?.resumeTimer();
    isTimerRunning.value = true;
  };

  const endSession = () => {
    sdk.value?.endSession();
    isTimerRunning.value = false;
  };

  return {
    sdk,
    session,
    loading,
    error,
    remainingTime,
    formattedTime,
    isTimerRunning,
    pauseTimer,
    resumeTimer,
    endSession,
  };
}
