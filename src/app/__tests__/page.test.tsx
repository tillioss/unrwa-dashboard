import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Dashboard from "../page";
import { useAuth } from "@/contexts/AuthContext";
import { getScores } from "@/lib/appwrite";

// Mock AuthContext
const mockLogout = jest.fn();
const mockUseAuth = useAuth as jest.MockedFunction<typeof useAuth>;
const mockGetScores = getScores as jest.MockedFunction<typeof getScores>;
jest.mock("@/contexts/AuthContext", () => ({
  useAuth: jest.fn(),
}));

// Mock react-i18next
jest.mock("react-i18next", () => ({
  useTranslation: () => {
    const translations: Record<string, string> = {
      "dashboard.title": "Tilli Assessment Dashboard",
      "dashboard.mainHeading": "SEL Skills Development Tips",
      "dashboard.mainDescription":
        "Practical strategies to help children develop essential social and emotional learning skills",
      "tips.nameItToTameIt.title": "Name it to tame it",
      "tips.nameItToTameIt.content":
        "Studies show that when kids label their emotions, their stress levels drop and they calm down faster. Trying this can help with classroom behavior.",
      "tips.keepRoutinesPredictable.title": "Keep routines predictable",
      "tips.keepRoutinesPredictable.content":
        "Research suggests that consistent rituals, like morning greetings or end-of-day reflections, create safety and support SEL growth.",
      "tips.growTheirFeelingWords.title": "Grow their feeling words",
      "tips.growTheirFeelingWords.content":
        "Studies show that teaching one new emotion word at a time (like 'proud' or 'frustrated') improves children's self-control and communication.",
      "tips.checkInOneToOne.title": "Check in one-to-one",
      "tips.checkInOneToOne.content":
        "Research has found that short, personal check-ins build trust and make children feel seen. Even 2 minutes can matter.",
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

jest.mock("@/lib/appwrite", () => ({
  getScores: jest.fn(),
  getTeacherSurveys: jest.fn(),
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
    mockGetScores.mockClear();
    mockGetScores.mockResolvedValue([
      {
        $id: "pre-1",
        school: "School 1",
        grade: "Grade 1",
        assessment: "teacher_report",
        total_students: 30,
        testType: "PRE",
        overall_level_distribution: { beginner: 10, growth: 15, expert: 5 },
        category_level_distributions: {
          self_awareness: { beginner: 10, growth: 10, expert: 10 },
          social_management: { beginner: 10, growth: 10, expert: 10 },
          social_awareness: { beginner: 10, growth: 10, expert: 10 },
          relationship_skills: { beginner: 10, growth: 10, expert: 10 },
          responsible_decision_making: { beginner: 10, growth: 10, expert: 10 },
          metacognition: { beginner: 10, growth: 10, expert: 10 },
          empathy: { beginner: 10, growth: 10, expert: 10 },
          critical_thinking: { beginner: 10, growth: 10, expert: 10 },
        },
      },
      {
        $id: "post-1",
        school: "School 1",
        grade: "Grade 1",
        assessment: "teacher_report",
        total_students: 28,
        testType: "POST",
        overall_level_distribution: { beginner: 5, growth: 15, expert: 8 },
        category_level_distributions: {
          self_awareness: { beginner: 5, growth: 15, expert: 8 },
          social_management: { beginner: 5, growth: 15, expert: 8 },
          social_awareness: { beginner: 5, growth: 15, expert: 8 },
          relationship_skills: { beginner: 5, growth: 15, expert: 8 },
          responsible_decision_making: { beginner: 5, growth: 15, expert: 8 },
          metacognition: { beginner: 5, growth: 15, expert: 8 },
          empathy: { beginner: 5, growth: 15, expert: 8 },
          critical_thinking: { beginner: 5, growth: 15, expert: 8 },
        },
      },
    ]);
  });

  it("renders dashboard with main heading", async () => {
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

    await waitFor(() => {
      expect(mockGetScores).toHaveBeenCalled();
    });
    expect(screen.getByText("SEL Skills Development Tips")).toBeInTheDocument();
  });

  it("displays a random tip", async () => {
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

    await waitFor(() => {
      expect(mockGetScores).toHaveBeenCalled();
    });
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

  it("displays user information when logged in", async () => {
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

    await waitFor(() => {
      expect(mockGetScores).toHaveBeenCalled();
    });
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

    await waitFor(() => {
      expect(mockGetScores).toHaveBeenCalled();
    });
    const logoutButton = screen.getByTitle("Logout");
    fireEvent.click(logoutButton);

    expect(mockLogout).toHaveBeenCalled();
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

    render(<Dashboard />);

    await waitFor(() => {
      expect(mockGetScores).toHaveBeenCalled();
    });
    expect(screen.getByText("Home")).toBeInTheDocument();
    expect(screen.getByText("Ask Tilli")).toBeInTheDocument();
  });

  it("renders language picker", async () => {
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

    await waitFor(() => {
      expect(mockGetScores).toHaveBeenCalled();
    });
    expect(screen.getByTestId("language-picker")).toBeInTheDocument();
  });
});
