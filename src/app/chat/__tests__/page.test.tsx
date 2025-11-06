import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
} from "@testing-library/react";
import ChatPage from "../page";
import { useAuth } from "@/contexts/AuthContext";
import { getAllScores } from "@/lib/appwrite";

// Mock AuthContext
const mockLogout = jest.fn();
const mockUseAuth = useAuth as jest.MockedFunction<typeof useAuth>;
jest.mock("@/contexts/AuthContext", () => ({
  useAuth: jest.fn(),
}));

// Mock appwrite
jest.mock("@/lib/appwrite", () => ({
  getAllScores: jest.fn(),
}));

// Mock react-i18next
jest.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        "chat.title": "AI Assistant",
        "chat.subtitle": "Ask me anything",
        "chat.welcomeMessage": "Hello! I'm your AI assistant.",
        "chat.inputPlaceholder": "Ask me about...",
        "chat.responses.response1": "Response 1",
        "chat.responses.response2": "Response 2",
        "chat.responses.response3": "Response 3",
        "chat.responses.response4": "Response 4",
        "chat.responses.response5": "Response 5",
        "common.home": "Home",
        "common.aiChat": "AI Chat",
        "common.dataView": "Data View",
      };
      return translations[key] || key;
    },
  }),
}));

// Mock ProtectedRoute
jest.mock("@/components/ProtectedRoute", () => {
  return function MockProtectedRoute({
    children,
  }: {
    children: React.ReactNode;
  }) {
    return <>{children}</>;
  };
});

// Mock LanguagePicker
jest.mock("@/components/LanguagePicker", () => {
  return function MockLanguagePicker() {
    return <div data-testid="language-picker">Language Picker</div>;
  };
});

// Mock ReactMarkdown
jest.mock("react-markdown", () => {
  return function MockReactMarkdown({ children }: { children: string }) {
    return <div>{children}</div>;
  };
});

// Mock fetch
global.fetch = jest.fn();

describe("ChatPage", () => {
  beforeEach(() => {
    mockLogout.mockClear();
    (getAllScores as jest.Mock).mockResolvedValue([]);
    (global.fetch as jest.Mock).mockClear();
    sessionStorage.clear();
  });

  it("renders chat page with welcome message", () => {
    mockUseAuth.mockReturnValue({
      user: {
        $id: "1",
        name: "Test",
        email: "test@test.com",
        emailVerification: true,
        prefs: {},
      },
      loading: false,
      login: jest.fn(),
      logout: mockLogout,
      isAuthenticated: true,
    });

    render(<ChatPage />);
    expect(
      screen.getByText("Hello! I'm your AI assistant.")
    ).toBeInTheDocument();
  });

  it("allows user to type and send message", async () => {
    mockUseAuth.mockReturnValue({
      user: {
        $id: "1",
        name: "Test",
        email: "test@test.com",
        emailVerification: true,
        prefs: {},
      },
      loading: false,
      login: jest.fn(),
      logout: mockLogout,
      isAuthenticated: true,
    });
    (global.fetch as jest.Mock).mockResolvedValue({
      json: jest.fn().mockResolvedValue({ message: "AI Response" }),
    });

    render(<ChatPage />);
    const textarea = screen.getByPlaceholderText("Ask me about...");

    await act(async () => {
      fireEvent.change(textarea, { target: { value: "Test message" } });
    });

    const sendButton = screen.getByRole("button", { name: "" });

    await act(async () => {
      fireEvent.click(sendButton);
    });

    await waitFor(() => {
      expect(screen.getByText("Test message")).toBeInTheDocument();
    });
  });

  it("handles API errors gracefully", async () => {
    mockUseAuth.mockReturnValue({
      user: {
        $id: "1",
        name: "Test",
        email: "test@test.com",
        emailVerification: true,
        prefs: {},
      },
      loading: false,
      login: jest.fn(),
      logout: mockLogout,
      isAuthenticated: true,
    });
    (global.fetch as jest.Mock).mockRejectedValue(new Error("API Error"));

    render(<ChatPage />);
    const textarea = screen.getByPlaceholderText("Ask me about...");
    fireEvent.change(textarea, { target: { value: "Test" } });

    const sendButton = screen.getByRole("button", { name: "" });
    fireEvent.click(sendButton);

    // Should show fallback response
    await waitFor(() => {
      const responses = [
        "Response 1",
        "Response 2",
        "Response 3",
        "Response 4",
        "Response 5",
      ];
      const displayedResponse = responses.find((r) => screen.queryByText(r));
      expect(displayedResponse).toBeDefined();
    });
  });

  it("starts new chat when button is clicked", () => {
    mockUseAuth.mockReturnValue({
      user: {
        $id: "1",
        name: "Test",
        email: "test@test.com",
        emailVerification: true,
        prefs: {},
      },
      loading: false,
      login: jest.fn(),
      logout: mockLogout,
      isAuthenticated: true,
    });

    render(<ChatPage />);
    const newChatButton = screen.getByText("New Chat");
    fireEvent.click(newChatButton);

    expect(
      screen.getByText("Hello! I'm your AI assistant.")
    ).toBeInTheDocument();
  });

  it("renders navigation links", () => {
    mockUseAuth.mockReturnValue({
      user: {
        $id: "1",
        name: "Test",
        email: "test@test.com",
        emailVerification: true,
        prefs: {},
      },
      loading: false,
      login: jest.fn(),
      logout: mockLogout,
      isAuthenticated: true,
    });

    render(<ChatPage />);
    expect(screen.getByText("Home")).toBeInTheDocument();
    expect(screen.getByText("AI Chat")).toBeInTheDocument();
    expect(screen.getByText("Data View")).toBeInTheDocument();
  });
});
