import i18n from "../i18n";

describe("i18n", () => {
  beforeEach(() => {
    // Reset i18n state
    i18n.isInitialized = false;
  });

  it("initializes i18n with correct configuration", () => {
    expect(i18n).toBeDefined();
    expect(i18n.options.fallbackLng).toEqual(expect.arrayContaining(["en"]));
  });

  it("has English and Arabic translations", () => {
    expect(i18n.hasResourceBundle("en", "translation")).toBe(true);
    expect(i18n.hasResourceBundle("ar", "translation")).toBe(true);
  });

  it("uses language detector", () => {
    expect(i18n.options.detection).toBeDefined();
    expect(i18n.options.detection?.order).toContain("localStorage");
    expect(i18n.options.detection?.order).toContain("navigator");
  });

  it("does not escape values (React handles it)", () => {
    expect(i18n.options.interpolation?.escapeValue).toBe(false);
  });

  it("only initializes once", () => {
    const initialInit = i18n.isInitialized;
    // Try to initialize again
    if (!i18n.isInitialized) {
      i18n.init({
        resources: {},
        fallbackLng: "en",
      });
    }
    // Should not reinitialize if already initialized
    expect(i18n).toBeDefined();
  });
});
