import { render, screen } from "@testing-library/react";
import StatusBadge from "../StatusBadge";

describe("StatusBadge", () => {
  it("renders completed status", () => {
    render(<StatusBadge status="completed" />);
    const badge = screen.getByText("Completed");
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass("bg-success-100", "text-success-600");
  });

  it("renders ongoing status", () => {
    render(<StatusBadge status="ongoing" />);
    const badge = screen.getByText("Ongoing");
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass("bg-primary-100", "text-primary-600");
  });

  it("renders pending status", () => {
    render(<StatusBadge status="pending" />);
    const badge = screen.getByText("Pending");
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass("bg-secondary-100", "text-secondary-600");
  });

  it("applies custom className", () => {
    const { container } = render(
      <StatusBadge status="completed" className="custom-class" />
    );
    const badge = container.querySelector("span");
    expect(badge).toHaveClass("custom-class");
  });

  it("capitalizes status text correctly", () => {
    render(<StatusBadge status="completed" />);
    expect(screen.getByText("Completed")).toBeInTheDocument();

    const { rerender } = render(<StatusBadge status="ongoing" />);
    expect(screen.getByText("Ongoing")).toBeInTheDocument();

    rerender(<StatusBadge status="pending" />);
    expect(screen.getByText("Pending")).toBeInTheDocument();
  });

  it("handles default status case", () => {
    const { container } = render(<StatusBadge status={"unknown" as any} />);
    const badge = container.querySelector("span");
    expect(badge).toHaveClass("bg-gray-100", "text-gray-600");
  });
});
