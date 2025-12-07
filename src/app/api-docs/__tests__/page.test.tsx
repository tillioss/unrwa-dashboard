import { render, screen } from "@testing-library/react";
import ApiDocsPage from "../page";

// Mock swagger-ui-react
jest.mock("swagger-ui-react", () => {
  return function MockSwaggerUI({ url }: { url: string }) {
    return (
      <div data-testid="swagger-ui" data-url={url}>
        Swagger UI Component
      </div>
    );
  };
});

// Mock swagger-ui-react CSS import
jest.mock("swagger-ui-react/swagger-ui.css", () => ({}));

describe("ApiDocsPage", () => {
  it("should render SwaggerUI component", () => {
    render(<ApiDocsPage />);

    const swaggerUI = screen.getByTestId("swagger-ui");
    expect(swaggerUI).toBeInTheDocument();
  });

  it("should pass correct URL to SwaggerUI", () => {
    render(<ApiDocsPage />);

    const swaggerUI = screen.getByTestId("swagger-ui");
    expect(swaggerUI).toHaveAttribute("data-url", "/api/openapi");
  });

  it("should render with correct container styling", () => {
    const { container } = render(<ApiDocsPage />);

    const wrapper = container.firstChild;
    expect(wrapper).toHaveClass("min-h-screen", "bg-white");
  });

  it("should render SwaggerUI content", () => {
    render(<ApiDocsPage />);

    expect(screen.getByText("Swagger UI Component")).toBeInTheDocument();
  });
});

