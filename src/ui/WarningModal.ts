import { ModalStyles, ThemeMode } from "../types";
import { getTheme, Theme } from "../styles/theme";

/**
 * Warning Modal for session expiration alerts
 */
export class WarningModal {
  private modal: HTMLDivElement | null = null;
  private theme: Theme;
  private legacyStyles: ModalStyles | null = null;
  private updateInterval: number | null = null;
  private timeDisplay: HTMLElement | null = null;
  private startTime: number = 0;
  private initialSeconds: number = 0;
  private onEndCallback: (() => void) | undefined = undefined;

  constructor(
    themeMode: ThemeMode = "light",
    customStyles?: Partial<ModalStyles>,
  ) {
    // Use new theme system
    const prefersDark =
      themeMode === "dark" || (themeMode === "auto" && this.detectDarkMode());
    this.theme = getTheme(prefersDark);

    // Keep legacy styles for backward compatibility
    if (customStyles) {
      this.legacyStyles = {
        backgroundColor: customStyles.backgroundColor || "#ffffff",
        textColor: customStyles.textColor || "#333333",
        primaryColor: customStyles.primaryColor || "#007bff",
        borderRadius: customStyles.borderRadius || "8px",
        fontFamily:
          customStyles.fontFamily ||
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      };
    }
  }

  private detectDarkMode(): boolean {
    if (typeof window !== "undefined" && window.matchMedia) {
      return window.matchMedia("(prefers-color-scheme: dark)").matches;
    }
    return false;
  }

  /**
   * Show warning modal
   */
  show(options: {
    remainingSeconds: number;
    onExtend?: () => void;
    onEnd?: () => void;
  }): void {
    // Remove existing modal if any
    this.hide();

    // Create modal
    this.modal = document.createElement("div");
    this.modal.id = "gw-session-warning-modal";
    this.modal.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 99999;
      font-family: ${this.legacyStyles?.fontFamily || this.theme.typography.fontFamily};
    `;

    // Create modal content
    const content = document.createElement("div");
    const bgColor =
      this.legacyStyles?.backgroundColor || this.theme.colors.card;
    const textColor =
      this.legacyStyles?.textColor || this.theme.colors.cardForeground;
    const borderRadius =
      this.legacyStyles?.borderRadius || this.theme.spacing.borderRadius.lg;

    content.style.cssText = `
      background-color: ${bgColor};
      color: ${textColor};
      border-radius: ${borderRadius};
      padding: ${this.theme.spacing.padding.lg};
      max-width: 400px;
      width: 90%;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      border: 1px solid ${this.theme.colors.border};
    `;

    this.initialSeconds = options.remainingSeconds;
    this.startTime = Date.now();
    this.onEndCallback = options.onEnd;

    const minutes = Math.floor(options.remainingSeconds / 60);
    const seconds = options.remainingSeconds % 60;

    content.innerHTML = `
      <h2 style="margin: 0 0 ${this.theme.spacing.padding.md} 0; font-size: ${this.theme.typography.fontSize.xl}; font-weight: ${this.theme.typography.fontWeight.semibold}; color: ${textColor};">
        ⏱️ Time Running Low
      </h2>
      <p style="margin: 0 0 ${this.theme.spacing.padding.lg} 0; font-size: ${this.theme.typography.fontSize.base}; line-height: ${this.theme.typography.lineHeight.normal}; color: ${this.theme.colors.mutedForeground};">
        Your session will expire in <strong id="gw-time-display" style="color: ${textColor};">${minutes}:${seconds.toString().padStart(2, "0")}</strong>.
      </p>
      <div style="display: flex; gap: ${this.theme.spacing.gap.md}; justify-content: flex-end;">
        <button id="gw-dismiss-btn" style="
          padding: 10px 20px;
          background-color: ${this.theme.colors.secondary};
          color: ${this.theme.colors.secondaryForeground};
          border: 1px solid ${this.theme.colors.border};
          border-radius: ${this.theme.spacing.borderRadius.sm};
          font-size: ${this.theme.typography.fontSize.sm};
          font-weight: ${this.theme.typography.fontWeight.medium};
          cursor: pointer;
          transition: all 0.2s;
          font-family: ${this.theme.typography.fontFamily};
        ">
          Continue
        </button>
        ${
          options.onExtend
            ? `<button id="gw-extend-btn" style="
                padding: 10px 20px;
                background-color: ${this.theme.colors.success};
                color: ${this.theme.colors.successForeground};
                border: none;
                border-radius: ${this.theme.spacing.borderRadius.sm};
                font-size: ${this.theme.typography.fontSize.sm};
                font-weight: ${this.theme.typography.fontWeight.medium};
                cursor: pointer;
                transition: all 0.2s;
                font-family: ${this.theme.typography.fontFamily};
              ">
                Extend Session
              </button>`
            : ""
        }
        ${
          options.onEnd
            ? `<button id="gw-end-btn" style="
                padding: 10px 20px;
                background-color: ${this.theme.colors.destructive};
                color: ${this.theme.colors.destructiveForeground};
                border: none;
                border-radius: ${this.theme.spacing.borderRadius.sm};
                font-size: ${this.theme.typography.fontSize.sm};
                font-weight: ${this.theme.typography.fontWeight.medium};
                cursor: pointer;
                transition: all 0.2s;
                font-family: ${this.theme.typography.fontFamily};
              ">
                End Session
              </button>`
            : ""
        }
      </div>
    `;

    this.modal.appendChild(content);
    document.body.appendChild(this.modal);

    // Add event listeners
    const extendBtn = document.getElementById("gw-extend-btn");
    if (extendBtn && options.onExtend) {
      extendBtn.addEventListener("click", () => {
        // GW-6674: Do NOT hide the modal here. Extension is async — the caller
        // hides the modal on success or calls showError() on failure. Hiding
        // immediately previously left the SDK with no modal on a failed extend,
        // so it fell back to redirecting the app tab to the marketplace (killing
        // the user's work). Keep the modal open and show a pending state instead.
        this.setExtendPending();
        options.onExtend?.();
      });
    }

    const dismissBtn = document.getElementById("gw-dismiss-btn");
    if (dismissBtn) {
      dismissBtn.addEventListener("click", () => {
        this.hide();
      });
    }

    const endBtn = document.getElementById("gw-end-btn");
    if (endBtn && options.onEnd) {
      endBtn.addEventListener("click", () => {
        options.onEnd?.();
        // Don't call this.hide() here - the onEnd callback will handle showing
        // the ending modal, and calling hide() would remove it immediately
      });
    }

    // Add hover effects
    const buttons = content.querySelectorAll("button");
    buttons.forEach((button) => {
      button.addEventListener("mouseenter", () => {
        (button as HTMLElement).style.opacity = "0.9";
      });
      button.addEventListener("mouseleave", () => {
        (button as HTMLElement).style.opacity = "1";
      });
      // Add focus ring
      button.addEventListener("focus", () => {
        (button as HTMLElement).style.outline =
          `2px solid ${this.theme.colors.ring}`;
        (button as HTMLElement).style.outlineOffset = "2px";
      });
      button.addEventListener("blur", () => {
        (button as HTMLElement).style.outline = "none";
      });
    });

    // Start updating the timer display
    this.timeDisplay = document.getElementById("gw-time-display");
    this.updateInterval = window.setInterval(() => {
      const elapsed = Math.floor((Date.now() - this.startTime) / 1000);
      const remaining = Math.max(0, this.initialSeconds - elapsed);

      const minutes = Math.floor(remaining / 60);
      const seconds = remaining % 60;

      if (this.timeDisplay) {
        this.timeDisplay.textContent = `${minutes}:${seconds.toString().padStart(2, "0")}`;
      }

      // If time runs out, trigger session end if callback exists
      if (remaining === 0) {
        if (this.onEndCallback) {
          this.onEndCallback();
        }
        this.hide();
      }
    }, 1000);
  }

  /**
   * Hide and remove modal
   */
  hide(): void {
    // Clear the update interval
    if (this.updateInterval !== null) {
      clearInterval(this.updateInterval);
      this.updateInterval = null;
    }

    // Remove modal from DOM
    if (this.modal && this.modal.parentNode) {
      this.modal.parentNode.removeChild(this.modal);
      this.modal = null;
      this.timeDisplay = null;
    }
  }

  /**
   * Check if modal is currently shown
   */
  isShown(): boolean {
    return this.modal !== null;
  }

  /**
   * GW-6674: Put the Extend button into a pending state while the async
   * extension request is in flight. Disables the button so the user can't
   * double-click and clears any prior inline error. No-op if the modal is gone.
   */
  setExtendPending(): void {
    if (!this.modal) return;
    const extendBtn =
      this.modal.querySelector<HTMLButtonElement>("#gw-extend-btn");
    if (extendBtn) {
      extendBtn.disabled = true;
      extendBtn.style.opacity = "0.6";
      extendBtn.style.cursor = "not-allowed";
      extendBtn.textContent = "Extending…";
    }
    const existingError = this.modal.querySelector("#gw-extend-error");
    if (existingError && existingError.parentNode) {
      existingError.parentNode.removeChild(existingError);
    }
  }

  /**
   * GW-6674: Show an inline error inside the open warning modal when an
   * extension attempt fails, and re-enable the Extend button so the user can
   * retry. This replaces the previous behavior of redirecting the whole app
   * tab to the marketplace (which destroyed the user's in-progress work on any
   * extend failure). No-op if the modal is no longer shown.
   */
  showError(message: string): void {
    if (!this.modal) return;
    const content = this.modal.firstElementChild as HTMLElement | null;
    if (!content) return;

    // Re-enable the Extend button for a retry.
    const extendBtn =
      this.modal.querySelector<HTMLButtonElement>("#gw-extend-btn");
    if (extendBtn) {
      extendBtn.disabled = false;
      extendBtn.style.opacity = "1";
      extendBtn.style.cursor = "pointer";
      extendBtn.textContent = "Extend Session";
    }

    // Reuse an existing error node or create one.
    let errorEl = this.modal.querySelector<HTMLElement>("#gw-extend-error");
    if (!errorEl) {
      errorEl = document.createElement("p");
      errorEl.id = "gw-extend-error";
      errorEl.setAttribute("role", "alert");
      errorEl.style.cssText = `
        margin: ${this.theme.spacing.padding.md} 0 0 0;
        font-size: ${this.theme.typography.fontSize.sm};
        color: ${this.theme.colors.destructive};
      `;
      content.appendChild(errorEl);
    }
    errorEl.textContent = message;
  }

  /**
   * Show "Session Ending" modal before redirect
   * Displays for a fixed duration (3 seconds) then calls callback
   */
  showEndingMessage(onComplete: () => void, durationMs: number = 3000): void {
    // Hide any existing modal first
    this.hide();

    const bgColor =
      this.legacyStyles?.backgroundColor || this.theme.colors.card;
    const textColor =
      this.legacyStyles?.textColor || this.theme.colors.cardForeground;
    const borderRadius =
      this.legacyStyles?.borderRadius || this.theme.spacing.borderRadius.lg;

    // Create modal overlay
    this.modal = document.createElement("div");
    this.modal.id = "gw-session-ending-modal";
    this.modal.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 99999;
      font-family: ${this.legacyStyles?.fontFamily || this.theme.typography.fontFamily};
      animation: fadeIn 0.2s ease-in;
    `;

    // Create modal content
    const content = document.createElement("div");
    content.style.cssText = `
      background-color: ${bgColor};
      color: ${textColor};
      border-radius: ${borderRadius};
      padding: ${this.theme.spacing.padding.xl};
      max-width: 400px;
      width: 90%;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      text-align: center;
      animation: slideIn 0.3s ease-out;
      border: 1px solid ${this.theme.colors.border};
    `;

    content.innerHTML = `
      <div style="font-size: 48px; margin-bottom: ${this.theme.spacing.padding.lg};">⏱️</div>
      <h2 style="margin: 0 0 ${this.theme.spacing.padding.md} 0; font-size: ${this.theme.typography.fontSize["2xl"]}; font-weight: ${this.theme.typography.fontWeight.semibold}; color: ${this.theme.colors.destructive};">
        Session Ending
      </h2>
      <p style="margin: 0 0 ${this.theme.spacing.padding.lg} 0; font-size: ${this.theme.typography.fontSize.base}; line-height: ${this.theme.typography.lineHeight.normal}; color: ${this.theme.colors.mutedForeground};">
        Your session has expired.<br/>
        Redirecting to marketplace...
      </p>
      <div style="
        width: 100%;
        height: 4px;
        background: ${this.theme.colors.muted};
        border-radius: ${this.theme.spacing.borderRadius.sm};
        overflow: hidden;
        margin-top: ${this.theme.spacing.padding.lg};
      ">
        <div id="gw-progress-bar" style="
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, ${this.theme.colors.destructive}, ${this.theme.colors.primary});
          animation: progressBar ${durationMs}ms linear forwards;
        "></div>
      </div>
    `;

    // Add animations
    const style = document.createElement("style");
    style.textContent = `
      @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }
      @keyframes slideIn {
        from { transform: translateY(-20px); opacity: 0; }
        to { transform: translateY(0); opacity: 1; }
      }
      @keyframes progressBar {
        from { width: 100%; }
        to { width: 0%; }
      }
    `;
    document.head.appendChild(style);

    this.modal.appendChild(content);
    document.body.appendChild(this.modal);

    // Call callback after duration
    setTimeout(() => {
      this.hide();
      onComplete();
    }, durationMs);
  }
}
