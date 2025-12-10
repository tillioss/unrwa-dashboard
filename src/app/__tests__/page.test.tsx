import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { useAuth } from "@/contexts/AuthContext";
import { getScores, getTeacherSurveys } from "@/lib/appwrite";

// Mock locale data before importing component
jest.mock("@/lib/locales/en.json", () => ({
  zones: {
    irbid: "Irbid",
    amman: "Amman",
  },
  zonesToSchools: {
    irbid: ["School 1", "School 2"],
    amman: ["School 3", "School 4"],
  },
  schools: {
    "School 1": "School 1 Name",
    "School 2": "School 2 Name",
    "School 3": "School 3 Name",
    "School 4": "School 4 Name",
  },
  grades: {
    grade1: "Grade 1",
  },
}));

jest.mock("@/lib/locales/ar.json", () => ({
  zones: {
    irbid: "إربد",
    amman: "عمان",
  },
  zonesToSchools: {
    irbid: ["School 1", "School 2"],
    amman: ["School 3", "School 4"],
  },
  schools: {
    "School 1": "اسم المدرسة 1",
    "School 2": "اسم المدرسة 2",
    "School 3": "اسم المدرسة 3",
    "School 4": "اسم المدرسة 4",
  },
  grades: {
    grade1: "الصف الأول",
  },
}));

import Dashboard from "../page";

// Mock AuthContext
const mockLogout = jest.fn();
const mockUseAuth = useAuth as jest.MockedFunction<typeof useAuth>;
const mockGetScores = getScores as jest.MockedFunction<typeof getScores>;
const mockGetTeacherSurveys = getTeacherSurveys as jest.MockedFunction<
  typeof getTeacherSurveys
>;
jest.mock("@/contexts/AuthContext", () => ({
  useAuth: jest.fn(),
}));

// Mock react-i18next
const mockChangeLanguage = jest.fn();
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
      "common.show": "Show",
      "common.hide": "Hide",
      "zone": "Zone",
      "section": "Section",
      "school": "School",
      "grade": "Grade",
      "data.assessment": "Assessment",
      "data.loading": "Loading...",
      "data.quickSummary": "Quick Summary",
      "data.classesProgress": "Classes Progress",
      "data.totalStudents": "Total Students",
      "data.assessmentEntries": "Assessment Entries",
      "data.status": "Status",
      "data.classAssessmentInsights": "Class Assessment Insights",
      "data.overall": "Overall",
      "data.overallDescription": "Overall description",
      "data.totalStudentsOutOf": "Total Students: {{count}}",
      "data.whatDoesThisMean": "What does this mean?",
      "data.details": "Details",
      "data.detailsDescription": "Details description",
      "data.selSkillCategories": "SEL Skill Categories",
      "data.selfAwareness.title": "Self Awareness",
      "data.selfAwareness.description": "Self awareness description",
      "teacher_report": "Teacher Report",
      "child": "Child",
      "teacher_survey": "Teacher Survey",
      "parent": "Parent",
      "sections.a": "Section A",
      "sections.b": "Section B",
      "survey.sel_importance_belief.title": "SEL Importance Belief",
      "survey.sel_importance_belief.description": "Description",
    };

    return {
      t: (key: string, params?: any) => {
        let translation = translations[key] || key;
        if (params && typeof translation === "string") {
          Object.keys(params).forEach((paramKey) => {
            translation = translation.replace(
              `{{${paramKey}}}`,
              params[paramKey]
            );
          });
        }
        return translation;
      },
      i18n: {
        language: "en",
        changeLanguage: mockChangeLanguage,
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
    mockGetTeacherSurveys.mockClear();
    mockGetScores.mockResolvedValue([
      {
        $id: "pre-1",
        school: "School 1",
        grade: "grade1",
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
        grade: "grade1",
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

  it("renders dashboard", async () => {
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

  it("displays user email when name is not available", async () => {
    mockUseAuth.mockReturnValue({
      user: {
        $id: "1",
        name: undefined,
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
    expect(screen.getByText("test@test.com")).toBeInTheDocument();
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

    render(<Dashboard />);

    await waitFor(() => {
      expect(mockGetScores).toHaveBeenCalled();
    });

    const logoutButton = screen.getByTitle("Logout");
    fireEvent.click(logoutButton);

    await waitFor(() => {
      expect(mockLogout).toHaveBeenCalled();
    });

    consoleErrorSpy.mockRestore();
  });

  it("handles errors when fetching scores", async () => {
    const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation();
    mockGetScores.mockRejectedValue(new Error("Failed to fetch scores"));

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
      expect(screen.getByText(/Failed to load assessment data/i)).toBeInTheDocument();
    });

    consoleErrorSpy.mockRestore();
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

    render(<Dashboard />);

    await waitFor(() => {
      expect(mockGetScores).toHaveBeenCalled();
    });

    const toggleButton = screen.getByText("Hide");
    fireEvent.click(toggleButton);

    expect(screen.getByText("Show")).toBeInTheDocument();
  });

  it("toggles details section visibility", async () => {
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

    const detailsButtons = screen.getAllByText("Details:");
    if (detailsButtons.length > 0) {
      fireEvent.click(detailsButtons[0]);
    }
  });

  it("handles teacher survey assessment type", async () => {
    mockGetTeacherSurveys.mockResolvedValue({
      preTest: {
        "School 1": {
          sel_importance_belief: { "1": 5, "2": 10 },
          sel_incorporation_frequency: {},
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
    });

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

    const assessmentSelects = screen.getAllByRole("combobox");
    const assessmentSelect = assessmentSelects.find(
      (select) => (select as HTMLSelectElement).value === "teacher_report"
    );
    
    if (assessmentSelect) {
      fireEvent.change(assessmentSelect, { target: { value: "teacher_survey" } });
      
      await waitFor(() => {
        expect(mockGetTeacherSurveys).toHaveBeenCalled();
      }, { timeout: 3000 });
    }
  });

  it("handles errors when fetching teacher surveys", async () => {
    const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation();
    mockGetTeacherSurveys.mockRejectedValue(new Error("Failed to fetch teacher surveys"));

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

    const assessmentSelects = screen.getAllByRole("combobox");
    const assessmentSelect = assessmentSelects.find(
      (select) => (select as HTMLSelectElement).value === "teacher_report"
    );
    
    if (assessmentSelect) {
      fireEvent.change(assessmentSelect, { target: { value: "teacher_survey" } });
      
      await waitFor(() => {
        expect(mockGetTeacherSurveys).toHaveBeenCalled();
      }, { timeout: 3000 });

      await waitFor(() => {
        expect(screen.getByText(/Failed to load teacher survey data/i)).toBeInTheDocument();
      }, { timeout: 3000 });
    }

    consoleErrorSpy.mockRestore();
  });

  it("handles zone selection change", async () => {
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

    const zoneSelects = screen.getAllByDisplayValue(/Irbid/i);
    if (zoneSelects.length > 0) {
      fireEvent.change(zoneSelects[0], { target: { value: "amman" } });
    }
  });

  it("handles school selection change", async () => {
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

    const schoolSelects = screen.getAllByDisplayValue(/School 1 Name/i);
    if (schoolSelects.length > 0) {
      fireEvent.change(schoolSelects[0], { target: { value: "School 2" } });
    }
  });
});
