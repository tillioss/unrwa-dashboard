import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import DataPage from "../page";
import { useAuth } from "@/contexts/AuthContext";
import { getScores, getTeacherSurveys } from "@/lib/appwrite";

// Mock AuthContext
const mockLogout = jest.fn();
const mockUseAuth = useAuth as jest.MockedFunction<typeof useAuth>;
jest.mock("@/contexts/AuthContext", () => ({
  useAuth: jest.fn(),
}));

// Mock appwrite
jest.mock("@/lib/appwrite", () => ({
  getScores: jest.fn(),
  getTeacherSurveys: jest.fn(),
}));

// Mock react-i18next
jest.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string, options?: { count?: number }) => {
      const translations: Record<string, string> = {
        "dashboard.title": "Tilli Assessment Dashboard",
        "data.assessment": "Assessment",
        "data.loading": "Loading...",
        "data.quickSummary": "Quick Summary",
        "data.classesProgress": "Classes Progress",
        "data.totalStudents": "Total Students",
        "data.assessmentEntries": "Assessment Entries",
        "data.status": "Status",
        "data.classAssessmentInsights": "Class Assessment Insights",
        "data.overall": "Overall",
        "data.overallDescription": "See overall data",
        "data.totalStudentsOutOf": `Total number (out of ${
          options?.count || 0
        } students)`,
        "data.details": "Details",
        "data.detailsDescription": "See each category",
        "data.selSkillCategories": "SEL Skill Categories",
        "data.selfAwareness": "Self Awareness",
        "data.selfManagement": "Self Management",
        "data.socialAwareness": "Social Awareness",
        "data.relationshipSkills": "Relationship Skills",
        "data.responsibleDecisionMaking": "Responsible Decision Making",
        "data.metacognition": "Metacognition",
        "data.empathy": "Empathy",
        "data.criticalThinking": "Critical Thinking",
        "data.beginner": "Beginner",
        "data.growth": "Growth",
        "data.expert": "Expert",
        "data.beginnerDescription": "Beginner description",
        "data.growthDescription": "Growth description",
        "data.expertDescription": "Expert description",
        "data.understandingCategories": "Understanding Categories",
        "common.home": "Home",
        "common.aiChat": "AI Chat",
        "common.dataView": "Data View",
        "common.show": "Show",
        "common.hide": "Hide",
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

// Mock recharts
jest.mock("recharts", () => ({
  BarChart: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="bar-chart">{children}</div>
  ),
  Bar: () => <div data-testid="bar" />,
  XAxis: () => <div data-testid="x-axis" />,
  YAxis: () => <div data-testid="y-axis" />,
  CartesianGrid: () => <div data-testid="cartesian-grid" />,
  Tooltip: () => <div data-testid="tooltip" />,
  Legend: () => <div data-testid="legend" />,
  ResponsiveContainer: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="responsive-container">{children}</div>
  ),
}));

describe("DataPage", () => {
  beforeEach(() => {
    mockLogout.mockClear();
    (getScores as jest.Mock).mockClear();
    (getTeacherSurveys as jest.Mock).mockClear();
  });

  it("renders data page", () => {
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
    (getScores as jest.Mock).mockResolvedValue([]);

    render(<DataPage />);
    expect(screen.getByText("Tilli Assessment Dashboard")).toBeInTheDocument();
  });

  it("shows loading state", () => {
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
    (getScores as jest.Mock).mockImplementation(
      () => new Promise(() => {}) // Never resolves
    );

    render(<DataPage />);
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("fetches and displays assessment data", async () => {
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

    const mockScores = [
      {
        $id: "1",
        school: "School 1",
        grade: "Grade 1",
        assessment: "teacher_report",
        total_students: 10,
        testType: "PRE",
        overall_level_distribution: { beginner: 5, growth: 3, expert: 2 },
        category_level_distributions: {
          self_awareness: { beginner: 2, growth: 1, expert: 1 },
          social_management: { beginner: 1, growth: 1, expert: 0 },
          social_awareness: { beginner: 1, growth: 1, expert: 0 },
          relationship_skills: { beginner: 1, growth: 0, expert: 1 },
          responsible_decision_making: { beginner: 0, growth: 0, expert: 0 },
          metacognition: { beginner: 0, growth: 0, expert: 0 },
          empathy: { beginner: 0, growth: 0, expert: 0 },
          critical_thinking: { beginner: 0, growth: 0, expert: 0 },
        },
      },
    ];

    (getScores as jest.Mock).mockResolvedValue(mockScores);

    render(<DataPage />);

    await waitFor(() => {
      expect(getScores).toHaveBeenCalled();
    });
  });

  it("toggles quick summary visibility", async () => {
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
    (getScores as jest.Mock).mockResolvedValue([]);

    render(<DataPage />);

    await waitFor(() => {
      const toggleButton = screen.getByText("Hide");
      fireEvent.click(toggleButton);
      expect(screen.getByText("Show")).toBeInTheDocument();
    });
  });

  it("handles teacher survey data", async () => {
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

    const mockTeacherSurvey = {
      preTest: {
        "School 1": {
          sel_importance_belief: { "1": 5, "2": 10 },
          sel_incorporation_frequency: { "1": 3, "2": 7 },
          sel_confidence_level: {},
          sel_performance_frequency: {},
          disciplinary_issues_frequency: {},
          student_safety_respect_agreement: {},
          student_self_awareness_management: {},
          tilli_curriculum_confidence: {},
        },
      },
      postTest: {},
      post12WeekTest: {},
      post36WeekTest: {},
    };

    (getTeacherSurveys as jest.Mock).mockResolvedValue(mockTeacherSurvey);

    render(<DataPage />);

    // Change to teacher survey - need to wait for select to be available
    await waitFor(() => {
      const assessmentSelect = screen.getByDisplayValue(
        "Assessment 1: Teacher Report"
      );
      fireEvent.change(assessmentSelect, {
        target: { value: "teacher_survey" },
      });
    });

    await waitFor(() => {
      expect(getTeacherSurveys).toHaveBeenCalled();
    });
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
    (getScores as jest.Mock).mockResolvedValue([]);

    render(<DataPage />);
    expect(screen.getByText("Home")).toBeInTheDocument();
    expect(screen.getByText("AI Chat")).toBeInTheDocument();
    expect(screen.getByText("Data View")).toBeInTheDocument();
  });
});
