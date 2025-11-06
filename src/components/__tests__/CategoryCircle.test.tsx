import { render, screen } from "@testing-library/react";
import CategoryCircle from "../CategoryCircle";

describe("CategoryCircle", () => {
  it("renders with default props", () => {
    render(<CategoryCircle category="beginner" count={5} />);
    expect(screen.getByText("5")).toBeInTheDocument();
    expect(screen.getByText("Beginner")).toBeInTheDocument();
  });

  it("renders beginner category with correct styling", () => {
    const { container } = render(
      <CategoryCircle category="beginner" count={10} />
    );
    const circle = container.querySelector(".bg-\\[\\#FEE2E2\\]");
    expect(circle).toBeInTheDocument();
    expect(screen.getByText("10")).toBeInTheDocument();
  });

  it("renders growth category with correct styling", () => {
    const { container } = render(
      <CategoryCircle category="growth" count={15} />
    );
    const circle = container.querySelector(".bg-\\[\\#DBEAFE\\]");
    expect(circle).toBeInTheDocument();
    expect(screen.getByText("15")).toBeInTheDocument();
  });

  it("renders expert category with correct styling", () => {
    const { container } = render(
      <CategoryCircle category="expert" count={20} />
    );
    const circle = container.querySelector(".bg-\\[\\#DCFCE7\\]");
    expect(circle).toBeInTheDocument();
    expect(screen.getByText("20")).toBeInTheDocument();
  });

  it("renders with small size", () => {
    const { container } = render(
      <CategoryCircle category="beginner" count={5} size="sm" />
    );
    const circle = container.querySelector(".w-12");
    expect(circle).toBeInTheDocument();
  });

  it("renders with medium size (default)", () => {
    const { container } = render(
      <CategoryCircle category="beginner" count={5} size="md" />
    );
    const circle = container.querySelector(".w-16");
    expect(circle).toBeInTheDocument();
  });

  it("renders with large size", () => {
    const { container } = render(
      <CategoryCircle category="beginner" count={5} size="lg" />
    );
    const circle = container.querySelector(".w-20");
    expect(circle).toBeInTheDocument();
  });

  it("hides label when showLabel is false", () => {
    render(<CategoryCircle category="beginner" count={5} showLabel={false} />);
    expect(screen.queryByText("Beginner")).not.toBeInTheDocument();
    expect(screen.getByText("5")).toBeInTheDocument();
  });

  it("applies custom className", () => {
    const { container } = render(
      <CategoryCircle category="beginner" count={5} className="custom-class" />
    );
    expect(container.firstChild).toHaveClass("custom-class");
  });

  it("capitalizes category name correctly", () => {
    render(<CategoryCircle category="beginner" count={5} />);
    expect(screen.getByText("Beginner")).toBeInTheDocument();

    const { rerender } = render(<CategoryCircle category="growth" count={5} />);
    expect(screen.getByText("Growth")).toBeInTheDocument();

    rerender(<CategoryCircle category="expert" count={5} />);
    expect(screen.getByText("Expert")).toBeInTheDocument();
  });

  it("handles default category case", () => {
    const { container } = render(
      <CategoryCircle category={"unknown" as any} count={5} />
    );
    const circle = container.querySelector(".bg-gray-500");
    expect(circle).toBeInTheDocument();
  });

  it("handles default size case", () => {
    const { container } = render(
      <CategoryCircle category="beginner" count={5} size={"unknown" as any} />
    );
    const circle = container.querySelector(".w-16");
    expect(circle).toBeInTheDocument();
  });
});
