import { render, screen, fireEvent } from "@testing-library/react";
import Dashboard from "../page";
import { useAuth } from "@/contexts/AuthContext";

// Mock AuthContext
const mockLogout = jest.fn();
const mockUseAuth = useAuth as jest.MockedFunction<typeof useAuth>;
jest.mock("@/contexts/AuthContext", () => ({
  useAuth: jest.fn(),
}));

// Mock react-i18next
jest.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        "dashboard.title": "Tilli Assessment Dashboard",
        "dashboard.mainHeading": "SEL Skills Development Tips",
        "dashboard.mainDescription": "Practical strategies",
        "tips.nameItToTameIt.title": "Name it to tame it",
        "tips.nameItToTameIt.content": "Studies show...",
        "tips.keepRoutinesPredictable.title": "Keep routines predictable",
        "tips.keepRoutinesPredictable.content": "Research suggests...",
        "tips.growTheirFeelingWords.title": "Grow their feeling words",
        "tips.growTheirFeelingWords.content": "Studies show...",
        "tips.checkInOneToOne.title": "Check in one-to-one",
        "tips.checkInOneToOne.content": "Research has found...",
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

// Mock Next.js Image
jest.mock("next/image", () => ({
  __esModule: true,
  default: (props: any) => <img {...props} />,
}));

describe("Dashboard Page", () => {
  beforeEach(() => {
    mockLogout.mockClear();
  });

  it("renders dashboard with main heading", () => {
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

    render(<Dashboard />);
    expect(screen.getByText("SEL Skills Development Tips")).toBeInTheDocument();
  });

  it("displays a random tip", () => {
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

    render(<Dashboard />);
    // Should display at least one tip
    const tipTitles = [
      "Name it to tame it",
      "Keep routines predictable",
      "Grow their feeling words",
      "Check in one-to-one",
    ];
    const displayedTip = tipTitles.find((title) => screen.queryByText(title));
    expect(displayedTip).toBeDefined();
  });

  it("displays user information when logged in", () => {
    mockUseAuth.mockReturnValue({
      user: {
        $id: "1",
        name: "Test User",
        email: "test@test.com",
        emailVerification: true,
        prefs: {},
      },
      loading: false,
      login: jest.fn(),
      logout: mockLogout,
      isAuthenticated: true,
    });

    render(<Dashboard />);
    expect(screen.getByText("Test User")).toBeInTheDocument();
  });

  it("calls logout when logout button is clicked", async () => {
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

    render(<Dashboard />);
    const logoutButton = screen.getByTitle("Logout");
    fireEvent.click(logoutButton);

    expect(mockLogout).toHaveBeenCalled();
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

    render(<Dashboard />);
    expect(screen.getByText("Home")).toBeInTheDocument();
    expect(screen.getByText("AI Chat")).toBeInTheDocument();
    expect(screen.getByText("Data View")).toBeInTheDocument();
  });

  it("renders language picker", () => {
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

    render(<Dashboard />);
    expect(screen.getByTestId("language-picker")).toBeInTheDocument();
  });
});
