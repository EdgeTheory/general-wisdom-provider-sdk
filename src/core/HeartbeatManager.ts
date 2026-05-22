import { Logger } from '../utils/logger';
import { SDKError } from '../types';
import { SDK_API_BASE } from './constants';

/**
 * Heartbeat Manager for active session tracking
 * Phase 2 Feature - Sends periodic heartbeats to backend
 */
export class HeartbeatManager {
  private intervalId: number | null = null;
  private heartbeatInterval: number;
  private failureCount: number = 0;
  private maxFailures: number = 3;
  private isEnabled: boolean = false;
  private logger: Logger;

  constructor(
    private sessionId: string,
    private apiEndpoint: string,
    private token: string,
    private onSync?: (remainingSeconds: number) => void,
    private onError?: (error: Error) => void,
    heartbeatIntervalSeconds: number = 30,
    debug: boolean = false
  ) {
    this.heartbeatInterval = heartbeatIntervalSeconds * 1000;
    this.logger = new Logger(debug, '[HeartbeatManager]');
    this.logger.log('Initialized with', heartbeatIntervalSeconds, 'second interval');
  }

  /**
   * Start sending heartbeats
   */
  start(): void {
    if (this.intervalId !== null) {
      this.logger.warn('Heartbeat already running');
      return;
    }

    this.isEnabled = true;
    this.logger.log('Starting heartbeat for session:', this.sessionId);

    // Send initial heartbeat immediately
    this.sendHeartbeat();

    // Then send periodically
    this.intervalId = window.setInterval(() => {
      this.sendHeartbeat();
    }, this.heartbeatInterval);
  }

  /**
   * Stop sending heartbeats
   */
  stop(): void {
    if (this.intervalId !== null) {
      clearInterval(this.intervalId);
      this.intervalId = null;
      this.isEnabled = false;
      this.logger.log('Heartbeat stopped');
    }
  }

  /**
   * Send a single heartbeat to backend
   */
  private async sendHeartbeat(): Promise<void> {
    if (!this.isEnabled) {
      return;
    }

    this.logger.log('Sending heartbeat...');

    try {
      const response = await fetch(
        `${this.apiEndpoint}${SDK_API_BASE}/sessions/${this.sessionId}/heartbeat`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${this.token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            timestamp: Date.now(),
            active: true,
          }),
        }
      );

      if (!response.ok) {
        throw new SDKError(
          `Heartbeat failed with status ${response.status}`,
          'HEARTBEAT_FAILED',
          response.status
        );
      }

      const data = await response.json();

      // Reset failure count on success
      this.failureCount = 0;

      // Sync remaining time with server
      if (typeof data.remaining_seconds === 'number') {
        this.logger.log('Server reports', data.remaining_seconds, 'seconds remaining');
        this.onSync?.(data.remaining_seconds);
      }

      this.logger.log('Heartbeat acknowledged');

    } catch (error) {
      this.failureCount++;
      this.logger.error('Heartbeat failed:', error, `(${this.failureCount}/${this.maxFailures})`);

      if (this.failureCount >= this.maxFailures) {
        this.logger.error('Max heartbeat failures reached, stopping');
        this.stop();

        const sdkError = error instanceof SDKError ? error : new SDKError(
          error instanceof Error ? error.message : 'Heartbeat failed',
          'HEARTBEAT_ERROR'
        );
        this.onError?.(sdkError);
      }
    }
  }

  /**
   * Check if heartbeat is running
   */
  isRunning(): boolean {
    return this.intervalId !== null;
  }

  /**
   * Get failure count
   */
  getFailureCount(): number {
    return this.failureCount;
  }

  /**
   * Update heartbeat interval
   */
  updateInterval(seconds: number): void {
    const wasRunning = this.isRunning();

    if (wasRunning) {
      this.stop();
    }

    this.heartbeatInterval = seconds * 1000;
    this.logger.log('Heartbeat interval updated to', seconds, 'seconds');

    if (wasRunning) {
      this.start();
    }
  }
}
