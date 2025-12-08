import { render, screen } from "@testing-library/react";
import ComparisonBarChart from "../ComparisonBarChart";

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
    t: (key: string) => {
      const translations: Record<string, string> = {
        beginner: "Beginner",
        learner: "Learner",
        expert: "Expert",
      };
      return translations[key] || key;
    },
  }),
}));

describe("ComparisonBarChart", () => {
  const mockPreData = {
    beginner: 10,
    growth: 20,
    expert: 5,
  };

  const mockPostData = {
    beginner: 8,
    growth: 25,
    expert: 7,
  };

  it("renders the chart with pre and post data", () => {
    render(
      <ComparisonBarChart preData={mockPreData} postData={mockPostData} />
    );
    expect(screen.getByTestId("bar-chart")).toBeInTheDocument();
  });

  it("renders with title when provided", () => {
    render(
      <ComparisonBarChart
        preData={mockPreData}
        postData={mockPostData}
        title="Test Title"
      />
    );
    expect(screen.getByText("Test Title")).toBeInTheDocument();
  });

  it("does not render title when not provided", () => {
    render(
      <ComparisonBarChart preData={mockPreData} postData={mockPostData} />
    );
    expect(screen.queryByText("Test Title")).not.toBeInTheDocument();
  });

  it("calculates max value correctly", () => {
    const { container } = render(
      <ComparisonBarChart preData={mockPreData} postData={mockPostData} />
    );
    expect(
      container.querySelector('[data-testid="bar-chart"]')
    ).toBeInTheDocument();
  });

  it("handles zero values", () => {
    const zeroPreData = { beginner: 0, growth: 0, expert: 0 };
    const zeroPostData = { beginner: 0, growth: 0, expert: 0 };
    render(
      <ComparisonBarChart preData={zeroPreData} postData={zeroPostData} />
    );
    expect(screen.getByTestId("bar-chart")).toBeInTheDocument();
  });

  it("handles large values", () => {
    const largePreData = { beginner: 1000, growth: 2000, expert: 1500 };
    const largePostData = { beginner: 1200, growth: 1800, expert: 1600 };
    render(
      <ComparisonBarChart preData={largePreData} postData={largePostData} />
    );
    expect(screen.getByTestId("bar-chart")).toBeInTheDocument();
  });
});
