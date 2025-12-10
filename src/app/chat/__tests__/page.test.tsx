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
const mockGetAllScores = getAllScores as jest.MockedFunction<
  typeof getAllScores
>;
jest.mock("@/contexts/AuthContext", () => ({
  useAuth: jest.fn(),
}));

// Mock appwrite
jest.mock("@/lib/appwrite", () => ({
  getAllScores: jest.fn(),
}));

// Mock react-i18next
jest.mock("react-i18next", () => ({
  useTranslation: () => {
    const translations: Record<string, string> = {
      "chat.title": "Ask Tilli",
      "chat.subtitle": "Ask me anything about your students",
      "chat.welcomeMessage":
        "Hello! I'm your AI assistant. I can help you with questions about your students' assessments, provide insights on their progress, and suggest teaching strategies. What would you like to know?",
      "chat.inputPlaceholder":
        "Ask me about your students' assessments, progress, or teaching strategies...",
      "chat.clearChat": "Clear Chat",
      "chat.sendMessage": "Send Message",
      "chat.responses.response1": "Response 1",
      "chat.responses.response2": "Response 2",
      "chat.responses.response3": "Response 3",
      "chat.responses.response4": "Response 4",
      "chat.responses.response5": "Response 5",
      "common.home": "Home",
      "common.aiChat": "Ask Tilli",
    };

    return {
      t: (key: string) => translations[key] || key,
      i18n: {
        language: "en",
        changeLanguage: jest.fn(),
      },
      ready: true,
    };
  },
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
    mockGetAllScores.mockClear();
    mockGetAllScores.mockResolvedValue([]);
    (global.fetch as jest.Mock).mockClear();
    sessionStorage.clear();
  });

  it("renders chat page with welcome message", async () => {
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

    await waitFor(() => {
      expect(mockGetAllScores).toHaveBeenCalled();
    });
    expect(
      screen.getByText((content) =>
        content.startsWith("Hello! I'm your AI assistant.")
      )
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
    await waitFor(() => {
      expect(mockGetAllScores).toHaveBeenCalled();
    });
    const textarea = screen.getByPlaceholderText(
      "Ask me about your students' assessments, progress, or teaching strategies..."
    );

    await act(async () => {
      fireEvent.change(textarea, { target: { value: "Test message" } });
    });

    const sendButton = screen.getByRole("button", { name: "Send Message" });

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
    await waitFor(() => {
      expect(mockGetAllScores).toHaveBeenCalled();
    });
    const textarea = screen.getByPlaceholderText(
      "Ask me about your students' assessments, progress, or teaching strategies..."
    );
    fireEvent.change(textarea, { target: { value: "Test" } });

    const sendButton = screen.getByRole("button", { name: "Send Message" });
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

  it("starts new chat when button is clicked", async () => {
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
    await waitFor(() => {
      expect(mockGetAllScores).toHaveBeenCalled();
    });
    const newChatButton = screen.getByTitle("Clear Chat");
    fireEvent.click(newChatButton);

    expect(
      screen.getByText((content) =>
        content.startsWith("Hello! I'm your AI assistant.")
      )
    ).toBeInTheDocument();
  });

  it("renders navigation links", async () => {
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
    await waitFor(() => {
      expect(mockGetAllScores).toHaveBeenCalled();
    });
    expect(screen.getByText("Home")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Ask Tilli" })).toBeInTheDocument();
  });

  it("handles Enter key to send message", async () => {
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
    await waitFor(() => {
      expect(mockGetAllScores).toHaveBeenCalled();
    });

    const textarea = screen.getByPlaceholderText(
      "Ask me about your students' assessments, progress, or teaching strategies..."
    );

    await act(async () => {
      fireEvent.change(textarea, { target: { value: "Test message" } });
    });

    await act(async () => {
      fireEvent.keyPress(textarea, { key: "Enter", code: "Enter", shiftKey: false });
    });

    await waitFor(() => {
      expect(screen.getByText("Test message")).toBeInTheDocument();
    });
  });

  it("does not send message on Shift+Enter", async () => {
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
    await waitFor(() => {
      expect(mockGetAllScores).toHaveBeenCalled();
    });

    const textarea = screen.getByPlaceholderText(
      "Ask me about your students' assessments, progress, or teaching strategies..."
    );

    await act(async () => {
      fireEvent.change(textarea, { target: { value: "Test message" } });
    });

    await act(async () => {
      fireEvent.keyPress(textarea, { key: "Enter", code: "Enter", shiftKey: true });
    });

    // Message should not be sent
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it("does not send empty message", async () => {
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
    await waitFor(() => {
      expect(mockGetAllScores).toHaveBeenCalled();
    });

    const textarea = screen.getByPlaceholderText(
      "Ask me about your students' assessments, progress, or teaching strategies..."
    );

    await act(async () => {
      fireEvent.change(textarea, { target: { value: "   " } });
    });

    const sendButton = screen.getByRole("button", { name: "Send Message" });
    await act(async () => {
      fireEvent.click(sendButton);
    });

    // Should not send empty message
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it("loads messages from sessionStorage on mount", async () => {
    const storedMessages = [
      {
        id: "1",
        text: "Stored message",
        sender: "user",
        timestamp: new Date().toISOString(),
      },
    ];
    sessionStorage.setItem("chat", JSON.stringify(storedMessages));

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

    await waitFor(() => {
      expect(screen.getByText("Stored message")).toBeInTheDocument();
    });
  });

  it("handles logout errors gracefully", async () => {
    const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation();
    mockLogout.mockRejectedValue(new Error("Logout failed"));

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
    await waitFor(() => {
      expect(mockGetAllScores).toHaveBeenCalled();
    });

    const logoutButton = screen.getByTitle("Logout");
    fireEvent.click(logoutButton);

    await waitFor(() => {
      expect(mockLogout).toHaveBeenCalled();
    });

    expect(consoleErrorSpy).toHaveBeenCalledWith("Logout failed:", expect.any(Error));

    consoleErrorSpy.mockRestore();
  });

  it("saves messages to sessionStorage", async () => {
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
    await waitFor(() => {
      expect(mockGetAllScores).toHaveBeenCalled();
    });

    const textarea = screen.getByPlaceholderText(
      "Ask me about your students' assessments, progress, or teaching strategies..."
    );

    await act(async () => {
      fireEvent.change(textarea, { target: { value: "Test message" } });
    });

    const sendButton = screen.getByRole("button", { name: "Send Message" });
    await act(async () => {
      fireEvent.click(sendButton);
    });

    await waitFor(() => {
      const stored = sessionStorage.getItem("chat");
      expect(stored).toBeTruthy();
      const parsed = JSON.parse(stored!);
      expect(parsed.length).toBeGreaterThan(1);
    });
  });
});
