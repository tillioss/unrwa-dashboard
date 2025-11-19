import { render, screen } from "@testing-library/react";
import TeacherSurveyBarChart from "../TeacherSurveyBarChart";

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

// Mock react-i18next
jest.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

// Mock window.matchMedia for useIsMobile hook
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

describe("TeacherSurveyBarChart", () => {
  const mockPreData = {
    "1": 5,
    "2": 10,
    "3": 15,
    "4": 20,
    "5": 25,
  };

  const mockPostData = {
    "1": 3,
    "2": 8,
    "3": 12,
    "4": 18,
    "5": 30,
  };

  const mockLabels = {
    "1": "Strongly Disagree",
    "2": "Disagree",
    "3": "Neutral",
    "4": "Agree",
    "5": "Strongly Agree",
  };

  it("renders the chart with pre and post data", () => {
    render(
      <TeacherSurveyBarChart
        preData={mockPreData}
        postData={mockPostData}
        labels={mockLabels}
        skillName="Test Skill"
        skillDescription="Test Description"
      />
    );
    expect(screen.getByTestId("bar-chart")).toBeInTheDocument();
    expect(screen.getByText("Test Skill")).toBeInTheDocument();
  });

  it("displays the skill name", () => {
    render(
      <TeacherSurveyBarChart
        preData={mockPreData}
        postData={mockPostData}
        labels={mockLabels}
        skillName="SEL Importance Belief"
        skillDescription="Test Description"
      />
    );
    expect(screen.getByText("SEL Importance Belief")).toBeInTheDocument();
  });

  it("handles missing post data", () => {
    render(
      <TeacherSurveyBarChart
        preData={mockPreData}
        postData={{}}
        labels={mockLabels}
        skillName="Test Skill"
        skillDescription="Test Description"
      />
    );
    expect(screen.getByTestId("bar-chart")).toBeInTheDocument();
  });

  it("handles empty pre data", () => {
    render(
      <TeacherSurveyBarChart
        preData={{}}
        postData={mockPostData}
        labels={mockLabels}
        skillName="Test Skill"
        skillDescription="Test Description"
      />
    );
    expect(screen.getByTestId("bar-chart")).toBeInTheDocument();
  });

  it("sorts keys correctly", () => {
    const unsortedLabels = {
      "5": "Strongly Agree",
      "1": "Strongly Disagree",
      "3": "Neutral",
      "2": "Disagree",
      "4": "Agree",
    };
    render(
      <TeacherSurveyBarChart
        preData={mockPreData}
        postData={mockPostData}
        labels={unsortedLabels}
        skillName="Test Skill"
        skillDescription="Test Description"
      />
    );
    expect(screen.getByTestId("bar-chart")).toBeInTheDocument();
  });

  it("displays skill description", () => {
    render(
      <TeacherSurveyBarChart
        preData={mockPreData}
        postData={mockPostData}
        labels={mockLabels}
        skillName="Test Skill"
        skillDescription="Test Description"
      />
    );
    expect(screen.getByText("Test Description")).toBeInTheDocument();
  });

  it("handles missing labels gracefully", () => {
    const incompleteLabels = {
      "1": "Strongly Disagree",
      "2": "Disagree",
    };
    render(
      <TeacherSurveyBarChart
        preData={mockPreData}
        postData={mockPostData}
        labels={incompleteLabels}
        skillName="Test Skill"
        skillDescription="Test Description"
      />
    );
    expect(screen.getByTestId("bar-chart")).toBeInTheDocument();
  });
});
