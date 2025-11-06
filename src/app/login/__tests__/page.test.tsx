import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { useRouter } from "next/navigation";
import LoginPage from "../page";
import { useAuth } from "@/contexts/AuthContext";

// Mock next/navigation
const mockPush = jest.fn();
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

// Mock AuthContext
const mockLogin = jest.fn();
const mockUseAuth = useAuth as jest.MockedFunction<typeof useAuth>;
jest.mock("@/contexts/AuthContext", () => ({
  useAuth: jest.fn(),
}));

// Mock react-i18next
jest.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        "auth.welcome": "Welcome to Tilli Assessment",
        "auth.signInDescription": "Please sign in",
        "auth.signIn": "Sign In",
        "auth.useGoogleAccount": "Use your Google account",
        "auth.signInWithGoogle": "Sign in with Google",
        "auth.signingIn": "Signing in...",
        "auth.secureLogin": "Your login is secure",
        "auth.needHelp": "Need help?",
      };
      return translations[key] || key;
    },
    i18n: {
      language: "en",
    },
  }),
}));

// Mock LanguagePicker
jest.mock("@/components/LanguagePicker", () => {
  return function MockLanguagePicker() {
    return <div data-testid="language-picker">Language Picker</div>;
  };
});

describe("LoginPage", () => {
  beforeEach(() => {
    mockPush.mockClear();
    mockLogin.mockClear();
  });

  it("renders login page", () => {
    mockUseAuth.mockReturnValue({
      user: null,
      loading: false,
      login: mockLogin,
      logout: jest.fn(),
      isAuthenticated: false,
    });

    render(<LoginPage />);
    expect(screen.getByText("Welcome to Tilli Assessment")).toBeInTheDocument();
    expect(screen.getByText("Sign in with Google")).toBeInTheDocument();
  });

  it("shows loading state when signing in", () => {
    mockUseAuth.mockReturnValue({
      user: null,
      loading: true,
      login: mockLogin,
      logout: jest.fn(),
      isAuthenticated: false,
    });

    render(<LoginPage />);
    expect(screen.getByText("Signing in...")).toBeInTheDocument();
  });

  it("calls login function when button is clicked", async () => {
    mockUseAuth.mockReturnValue({
      user: null,
      loading: false,
      login: mockLogin,
      logout: jest.fn(),
      isAuthenticated: false,
    });

    render(<LoginPage />);
    const button = screen.getByText("Sign in with Google");
    fireEvent.click(button);

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalled();
    });
  });

  it("redirects to home when authenticated", () => {
    mockUseAuth.mockReturnValue({
      user: {
        $id: "1",
        name: "Test",
        email: "test@test.com",
        emailVerification: true,
        prefs: {},
      },
      loading: false,
      login: mockLogin,
      logout: jest.fn(),
      isAuthenticated: true,
    });

    render(<LoginPage />);
    expect(mockPush).toHaveBeenCalledWith("/");
  });

  it("renders language picker", () => {
    mockUseAuth.mockReturnValue({
      user: null,
      loading: false,
      login: mockLogin,
      logout: jest.fn(),
      isAuthenticated: false,
    });

    render(<LoginPage />);
    expect(screen.getByTestId("language-picker")).toBeInTheDocument();
  });

  it("handles login errors gracefully", async () => {
    const consoleError = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});
    mockLogin.mockRejectedValue(new Error("Login failed"));

    mockUseAuth.mockReturnValue({
      user: null,
      loading: false,
      login: mockLogin,
      logout: jest.fn(),
      isAuthenticated: false,
    });

    render(<LoginPage />);
    const button = screen.getByText("Sign in with Google");
    fireEvent.click(button);

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalled();
    });

    consoleError.mockRestore();
  });
});
