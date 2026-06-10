// @vitest-environment jsdom

/**
 * GW-6674: WarningModal extend-failure behavior.
 *
 * Regression coverage for the bug where a failed session extension destroyed
 * the user's app tab (window.location.href redirect to the marketplace). The
 * modal must instead stay open and surface a retryable inline error.
 */

import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";

import { WarningModal } from "../../../src/ui/WarningModal";

describe("WarningModal extend failure (GW-6674)", () => {
  let modal: WarningModal;

  beforeEach(() => {
    document.body.innerHTML = "";
    modal = new WarningModal("light");
  });

  afterEach(() => {
    modal.hide();
    vi.restoreAllMocks();
  });

  it("keeps the modal open when Extend is clicked (does not hide before async resolves)", () => {
    const onExtend = vi.fn();
    modal.show({ remainingSeconds: 60, onExtend, onEnd: vi.fn() });

    const extendBtn = document.getElementById(
      "gw-extend-btn",
    ) as HTMLButtonElement;
    expect(extendBtn).not.toBeNull();

    extendBtn.click();

    // onExtend fired, but the modal must remain on screen so the async result
    // can either hide it (success) or show an inline error (failure).
    expect(onExtend).toHaveBeenCalledTimes(1);
    expect(modal.isShown()).toBe(true);
  });

  it("disables the Extend button and shows a pending label while extending", () => {
    modal.show({ remainingSeconds: 60, onExtend: vi.fn(), onEnd: vi.fn() });

    const extendBtn = document.getElementById(
      "gw-extend-btn",
    ) as HTMLButtonElement;
    extendBtn.click();

    expect(extendBtn.disabled).toBe(true);
    expect(extendBtn.textContent).toContain("Extending");
  });

  it("showError renders a retryable inline error and re-enables Extend", () => {
    modal.show({ remainingSeconds: 60, onExtend: vi.fn(), onEnd: vi.fn() });

    const extendBtn = document.getElementById(
      "gw-extend-btn",
    ) as HTMLButtonElement;
    extendBtn.click(); // pending
    modal.showError("Could not extend the session. Please try again.");

    // Modal stays open with an alert role error message.
    expect(modal.isShown()).toBe(true);
    const errorEl = document.getElementById("gw-extend-error");
    expect(errorEl).not.toBeNull();
    expect(errorEl?.getAttribute("role")).toBe("alert");
    expect(errorEl?.textContent).toContain("Could not extend");

    // Extend button is re-enabled so the user can retry.
    expect(extendBtn.disabled).toBe(false);
    expect(extendBtn.textContent).toBe("Extend Session");
  });

  it("does not navigate away (no window.location change) on extend failure", () => {
    modal.show({ remainingSeconds: 60, onExtend: vi.fn(), onEnd: vi.fn() });

    const before = window.location.href;
    const extendBtn = document.getElementById(
      "gw-extend-btn",
    ) as HTMLButtonElement;
    extendBtn.click();
    modal.showError("Not enough tokens to extend.");

    expect(window.location.href).toBe(before);
    expect(modal.isShown()).toBe(true);
  });

  it("showError is a no-op when the modal is not shown", () => {
    expect(modal.isShown()).toBe(false);
    expect(() => modal.showError("whatever")).not.toThrow();
    expect(document.getElementById("gw-extend-error")).toBeNull();
  });
});
