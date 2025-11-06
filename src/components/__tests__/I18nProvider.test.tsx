import { render, screen, waitFor } from "@testing-library/react";
import I18nProvider from "../I18nProvider";
import i18n from "../../lib/i18n";

describe("I18nProvider", () => {
  beforeEach(() => {
    // Reset i18n state
    i18n.isInitialized = false;
  });

  it("renders children when i18n is initialized", async () => {
    i18n.isInitialized = true;
    render(
      <I18nProvider>
        <div>Test Content</div>
      </I18nProvider>
    );
    await waitFor(() => {
      expect(screen.getByText("Test Content")).toBeInTheDocument();
    });
  });

  it("shows loading spinner when i18n is not initialized", () => {
    i18n.isInitialized = false;
    const { container } = render(
      <I18nProvider>
        <div>Test Content</div>
      </I18nProvider>
    );
    const spinner = container.querySelector(".animate-spin");
    expect(spinner).toBeInTheDocument();
  });

  it("waits for i18n initialization event", async () => {
    i18n.isInitialized = false;
    const { container } = render(
      <I18nProvider>
        <div>Test Content</div>
      </I18nProvider>
    );

    // Initially shows spinner
    expect(container.querySelector(".animate-spin")).toBeInTheDocument();

    // Simulate initialization
    i18n.isInitialized = true;
    i18n.emit("initialized");

    await waitFor(() => {
      expect(screen.getByText("Test Content")).toBeInTheDocument();
    });
  });
});
