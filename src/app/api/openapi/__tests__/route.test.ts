/**
 * @jest-environment node
 */
import { GET } from "../route";
import { readFileSync } from "fs";
import { join } from "path";
import yaml from "js-yaml";
import { NextResponse } from "next/server";

// Mock fs module
jest.mock("fs", () => ({
  readFileSync: jest.fn(),
}));

// Mock js-yaml
jest.mock("js-yaml", () => ({
  load: jest.fn(),
}));

// Mock path
jest.mock("path", () => ({
  join: jest.fn((...args) => args.join("/")),
}));

// Mock console.error to avoid noise in test output
const consoleErrorSpy = jest
  .spyOn(console, "error")
  .mockImplementation(() => {});

describe("/api/openapi route", () => {
  const mockReadFileSync = readFileSync as jest.MockedFunction<
    typeof readFileSync
  >;
  const mockYamlLoad = yaml.load as jest.MockedFunction<typeof yaml.load>;

  beforeEach(() => {
    jest.clearAllMocks();
    process.cwd = jest.fn(() => "/test/project");
  });

  afterAll(() => {
    consoleErrorSpy.mockRestore();
  });

  it("should return OpenAPI spec as JSON when file exists", async () => {
    const mockYamlContent = `
openapi: 3.1.0
info:
  title: Test API
  version: 1.0.0
paths:
  /test:
    get:
      summary: Test endpoint
`;

    const mockParsedSpec = {
      openapi: "3.1.0",
      info: {
        title: "Test API",
        version: "1.0.0",
      },
      paths: {
        "/test": {
          get: {
            summary: "Test endpoint",
          },
        },
      },
    };

    mockReadFileSync.mockReturnValue(mockYamlContent);
    mockYamlLoad.mockReturnValue(mockParsedSpec);

    const response = await GET();
    const json = await response.json();

    expect(mockReadFileSync).toHaveBeenCalledWith(
      "/test/project/public/openapi.yaml",
      "utf8"
    );
    expect(mockYamlLoad).toHaveBeenCalledWith(mockYamlContent);
    expect(response).toBeInstanceOf(NextResponse);
    expect(response.status).toBe(200);
    expect(json).toEqual(mockParsedSpec);
  });

  it("should return 500 error when file cannot be read", async () => {
    const error = new Error("File not found");
    mockReadFileSync.mockImplementation(() => {
      throw error;
    });

    const response = await GET();
    const json = await response.json();

    expect(mockReadFileSync).toHaveBeenCalled();
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "Error loading OpenAPI spec:",
      error
    );
    expect(response.status).toBe(500);
    expect(json).toEqual({
      error: "Failed to load OpenAPI specification",
    });
  });

  it("should return 500 error when YAML parsing fails", async () => {
    const mockYamlContent = "invalid: yaml: content: [";
    const parseError = new Error("YAML parse error");

    mockReadFileSync.mockReturnValue(mockYamlContent);
    mockYamlLoad.mockImplementation(() => {
      throw parseError;
    });

    const response = await GET();
    const json = await response.json();

    expect(mockReadFileSync).toHaveBeenCalled();
    expect(mockYamlLoad).toHaveBeenCalledWith(mockYamlContent);
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "Error loading OpenAPI spec:",
      parseError
    );
    expect(response.status).toBe(500);
    expect(json).toEqual({
      error: "Failed to load OpenAPI specification",
    });
  });

  it("should use correct file path", async () => {
    const mockSpec = { openapi: "3.1.0", info: { title: "Test" } };
    mockReadFileSync.mockReturnValue("openapi: 3.1.0");
    mockYamlLoad.mockReturnValue(mockSpec);

    await GET();

    expect(mockReadFileSync).toHaveBeenCalledWith(
      expect.stringContaining("public/openapi.yaml"),
      "utf8"
    );
  });

  it("should return JSON response with correct content type", async () => {
    const mockSpec = { openapi: "3.1.0", info: { title: "Test API" } };
    mockReadFileSync.mockReturnValue("openapi: 3.1.0");
    mockYamlLoad.mockReturnValue(mockSpec);

    const response = await GET();

    expect(response.headers.get("content-type")).toContain("application/json");
  });
});
