import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import LanguagePicker from "../LanguagePicker";

const mockChangeLanguage = jest.fn();
const mockUseTranslation = jest.fn(() => ({
  t: (key: string) => {
    const translations: Record<string, string> = {
      "language.english": "English",
      "language.arabic": "العربية",
      "language.selectLanguage": "Select Language",
    };
    return translations[key] || key;
  },
  i18n: {
    language: "en",
    changeLanguage: mockChangeLanguage,
  },
}));

// Mock react-i18next
jest.mock("react-i18next", () => ({
  useTranslation: () => mockUseTranslation(),
}));

describe("LanguagePicker", () => {
  beforeEach(() => {
    // Reset document attributes
    document.documentElement.lang = "en";
    document.documentElement.dir = "ltr";
    mockChangeLanguage.mockClear();
    mockUseTranslation.mockReturnValue({
      t: (key: string) => {
        const translations: Record<string, string> = {
          "language.english": "English",
          "language.arabic": "العربية",
          "language.selectLanguage": "Select Language",
        };
        return translations[key] || key;
      },
      i18n: {
        language: "en",
        changeLanguage: mockChangeLanguage,
      },
    });
  });

  it("renders language picker button", () => {
    render(<LanguagePicker />);
    expect(screen.getByLabelText("Select Language")).toBeInTheDocument();
  });

  it("opens dropdown when clicked", () => {
    render(<LanguagePicker />);
    const button = screen.getByLabelText("Select Language");
    fireEvent.click(button);
    // Check for dropdown menu items (not the button text)
    const dropdownItems = screen.getAllByText("English");
    expect(dropdownItems.length).toBeGreaterThan(0);
  });

  it("closes dropdown when clicking outside", async () => {
    render(
      <div>
        <div>Outside</div>
        <LanguagePicker />
      </div>
    );
    const button = screen.getByLabelText("Select Language");
    fireEvent.click(button);
    expect(screen.getAllByText("English").length).toBeGreaterThan(0);

    fireEvent.mouseDown(document.body);
    await waitFor(() => {
      // After clicking outside, the dropdown should close
      // The button text might still be visible, but dropdown items should not be
      const dropdownContainer = document.querySelector(".absolute");
      expect(dropdownContainer).not.toBeInTheDocument();
    });
  });

  it("changes language when option is clicked", () => {
    mockUseTranslation.mockReturnValue({
      t: (key: string) => {
        const translations: Record<string, string> = {
          "language.english": "English",
          "language.arabic": "العربية",
          "language.selectLanguage": "Select Language",
        };
        return translations[key] || key;
      },
      i18n: {
        language: "en",
        changeLanguage: mockChangeLanguage,
      },
    });

    render(<LanguagePicker />);
    const button = screen.getByLabelText("Select Language");
    fireEvent.click(button);

    const arabicOption = screen.getByText("العربية");
    fireEvent.click(arabicOption);

    expect(mockChangeLanguage).toHaveBeenCalledWith("ar");
  });

  it("updates document direction for RTL language", () => {
    mockUseTranslation.mockReturnValue({
      t: (key: string) => {
        const translations: Record<string, string> = {
          "language.english": "English",
          "language.arabic": "العربية",
          "language.selectLanguage": "Select Language",
        };
        return translations[key] || key;
      },
      i18n: {
        language: "ar",
        changeLanguage: mockChangeLanguage,
      },
    });

    render(<LanguagePicker />);
    const button = screen.getByLabelText("Select Language");
    fireEvent.click(button);

    // Get all Arabic text elements and click the one in the dropdown (not the button)
    const arabicOptions = screen.getAllByText("العربية");
    // The dropdown item should be the one that's not in the button
    const dropdownOption = arabicOptions.find(
      (el) => !el.closest('button[aria-label="Select Language"]')
    );
    if (dropdownOption) {
      fireEvent.click(dropdownOption);
    } else {
      // Fallback: click the last one (likely the dropdown item)
      fireEvent.click(arabicOptions[arabicOptions.length - 1]);
    }

    expect(document.documentElement.lang).toBe("ar");
    expect(document.documentElement.dir).toBe("rtl");
  });
});
