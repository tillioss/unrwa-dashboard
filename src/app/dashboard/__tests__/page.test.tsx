import { render, screen } from "@testing-library/react";
import { useRouter } from "next/navigation";
import DashboardPage from "../page";

// Mock next/navigation
const mockPush = jest.fn();
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
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

describe("DashboardPage", () => {
  beforeEach(() => {
    mockPush.mockClear();
  });

  it("renders redirecting message", () => {
    render(<DashboardPage />);
    expect(screen.getByText("Redirecting to dashboard...")).toBeInTheDocument();
  });

  it("redirects to home on mount", () => {
    render(<DashboardPage />);
    expect(mockPush).toHaveBeenCalledWith("/");
  });
});
