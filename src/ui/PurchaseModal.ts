import { ModalStyles, ThemeMode } from "../types";
import { getTheme, Theme } from "../styles/theme";

/**
 * Purchase confirmation modal for marketplace transactions
 */
export class PurchaseModal {
  private modal: HTMLDivElement | null = null;
  private theme: Theme;
  private legacyStyles: ModalStyles | null = null;

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

  private escapeHtml(text: string): string {
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  /**
   * Show purchase confirmation modal
   */
  show(options: {
    itemId: string;
    onConfirm?: () => void;
    onCancel?: () => void;
  }): void {
    // Remove existing modal if any
    this.hide();

    // Create modal
    this.modal = document.createElement("div");
    this.modal.id = "gw-purchase-modal";
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

    content.innerHTML = `
      <h2 style="margin: 0 0 ${this.theme.spacing.padding.md} 0; font-size: ${this.theme.typography.fontSize.xl}; font-weight: ${this.theme.typography.fontWeight.semibold}; color: ${textColor};">
        🛒 Confirm Purchase
      </h2>
      <p style="margin: 0 0 ${this.theme.spacing.padding.lg} 0; font-size: ${this.theme.typography.fontSize.base}; line-height: ${this.theme.typography.lineHeight.normal}; color: ${this.theme.colors.mutedForeground};">
        Are you sure you want to purchase item <strong style="color: ${textColor};">${this.escapeHtml(options.itemId)}</strong>?
      </p>
      <div style="display: flex; gap: ${this.theme.spacing.gap.md}; justify-content: flex-end;">
        <button id="gw-cancel-btn" style="
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
          Cancel
        </button>
        <button id="gw-confirm-btn" style="
          padding: 10px 20px;
          background-color: ${this.theme.colors.primary};
          color: ${this.theme.colors.primaryForeground};
          border: none;
          border-radius: ${this.theme.spacing.borderRadius.sm};
          font-size: ${this.theme.typography.fontSize.sm};
          font-weight: ${this.theme.typography.fontWeight.medium};
          cursor: pointer;
          transition: all 0.2s;
          font-family: ${this.theme.typography.fontFamily};
        ">
          Confirm Purchase
        </button>
      </div>
    `;

    this.modal.appendChild(content);
    document.body.appendChild(this.modal);

    // Add event listeners
    const confirmBtn = document.getElementById("gw-confirm-btn");
    if (confirmBtn && options.onConfirm) {
      confirmBtn.addEventListener("click", () => {
        options.onConfirm?.();
        this.hide();
      });
    }

    const cancelBtn = document.getElementById("gw-cancel-btn");
    if (cancelBtn) {
      cancelBtn.addEventListener("click", () => {
        options.onCancel?.();
        this.hide();
      });
    }

    // Add hover effects and focus rings
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

    // Close modal on ESC key
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        options.onCancel?.();
        this.hide();
        document.removeEventListener("keydown", handleKeyDown);
      }
    };
    document.addEventListener("keydown", handleKeyDown);

    // Close modal on outside click
    this.modal.addEventListener("click", (e) => {
      if (e.target === this.modal) {
        options.onCancel?.();
        this.hide();
      }
    });
  }

  /**
   * Hide and remove modal
   */
  hide(): void {
    // Remove modal from DOM
    if (this.modal && this.modal.parentNode) {
      this.modal.parentNode.removeChild(this.modal);
      this.modal = null;
    }
  }

  /**
   * Check if modal is currently shown
   */
  isShown(): boolean {
    return this.modal !== null;
  }
}
