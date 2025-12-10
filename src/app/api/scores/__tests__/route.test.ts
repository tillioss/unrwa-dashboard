/**
 * @jest-environment node
 */
import { GET, OPTIONS } from "../route";
import { getAllScores, getScores } from "@/lib/appwrite";
import { NextResponse } from "next/server";

// Mock appwrite functions
jest.mock("@/lib/appwrite", () => ({
  getAllScores: jest.fn(),
  getScores: jest.fn(),
}));

const mockGetAllScores = getAllScores as jest.MockedFunction<typeof getAllScores>;
const mockGetScores = getScores as jest.MockedFunction<typeof getScores>;

// Mock console.error to avoid noise in test output
const consoleErrorSpy = jest
  .spyOn(console, "error")
  .mockImplementation(() => {});

describe("/api/scores route", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterAll(() => {
    consoleErrorSpy.mockRestore();
  });

  describe("OPTIONS", () => {
    it("should return CORS headers", async () => {
      const response = await OPTIONS();
      const json = await response.json();

      expect(response).toBeInstanceOf(NextResponse);
      expect(response.status).toBe(200);
      expect(response.headers.get("Access-Control-Allow-Origin")).toBe("*");
      expect(response.headers.get("Access-Control-Allow-Methods")).toBe("GET, OPTIONS");
      expect(response.headers.get("Access-Control-Allow-Headers")).toBe("Content-Type, Authorization");
      expect(json).toEqual({});
    });
  });

  describe("GET", () => {
    it("should return all scores when no filter parameters are provided", async () => {
      const mockScores = [
        {
          $id: "1",
          school: "School 1",
          grade: "grade1",
          assessment: "child" as const,
          total_students: 10,
          testType: "pre",
          overall_level_distribution: { beginner: 5, growth: 3, expert: 2 },
          category_level_distributions: {},
        },
      ];

      mockGetAllScores.mockResolvedValue(mockScores);

      const request = new Request("http://localhost/api/scores");
      const response = await GET(request);
      const json = await response.json();

      expect(mockGetAllScores).toHaveBeenCalled();
      expect(mockGetScores).not.toHaveBeenCalled();
      expect(response.status).toBe(200);
      expect(response.headers.get("Access-Control-Allow-Origin")).toBe("*");
      expect(json).toEqual({ scores: mockScores });
    });

    it("should return filtered scores when all filter parameters are provided", async () => {
      const mockScores = [
        {
          $id: "1",
          school: "School 1",
          grade: "grade1",
          assessment: "child" as const,
          total_students: 10,
          testType: "pre",
          overall_level_distribution: { beginner: 5, growth: 3, expert: 2 },
          category_level_distributions: {},
        },
      ];

      mockGetScores.mockResolvedValue(mockScores);

      const request = new Request(
        "http://localhost/api/scores?school=School%201&grade=grade1&assessment=child&section=a&zone=irbid"
      );
      const response = await GET(request);
      const json = await response.json();

      expect(mockGetScores).toHaveBeenCalledWith({
        school: "School 1",
        grade: "grade1",
        assessment: "child",
        section: "a",
        zone: "irbid",
      });
      expect(mockGetAllScores).not.toHaveBeenCalled();
      expect(response.status).toBe(200);
      expect(response.headers.get("Access-Control-Allow-Origin")).toBe("*");
      expect(json).toEqual({ scores: mockScores });
    });

    it("should return all scores when some filter parameters are missing", async () => {
      const mockScores = [
        {
          $id: "1",
          school: "School 1",
          grade: "grade1",
          assessment: "child" as const,
          total_students: 10,
          testType: "pre",
          overall_level_distribution: { beginner: 5, growth: 3, expert: 2 },
          category_level_distributions: {},
        },
      ];

      mockGetAllScores.mockResolvedValue(mockScores);

      const request = new Request(
        "http://localhost/api/scores?school=School%201&grade=grade1"
      );
      const response = await GET(request);
      const json = await response.json();

      expect(mockGetAllScores).toHaveBeenCalled();
      expect(mockGetScores).not.toHaveBeenCalled();
      expect(response.status).toBe(200);
      expect(json).toEqual({ scores: mockScores });
    });

    it("should handle errors and return 500 status", async () => {
      const error = new Error("Database error");
      mockGetAllScores.mockRejectedValue(error);

      const request = new Request("http://localhost/api/scores");
      const response = await GET(request);
      const json = await response.json();

      expect(consoleErrorSpy).toHaveBeenCalledWith("Error fetching scores:", error);
      expect(response.status).toBe(500);
      expect(response.headers.get("Access-Control-Allow-Origin")).toBe("*");
      expect(json).toEqual({
        error: "Failed to fetch scores",
        message: "Database error",
      });
    });

    it("should handle non-Error exceptions", async () => {
      mockGetAllScores.mockRejectedValue("String error");

      const request = new Request("http://localhost/api/scores");
      const response = await GET(request);
      const json = await response.json();

      expect(response.status).toBe(500);
      expect(json).toEqual({
        error: "Failed to fetch scores",
        message: "Unknown error",
      });
    });

    it("should handle errors from filtered query", async () => {
      const error = new Error("Query error");
      mockGetScores.mockRejectedValue(error);

      const request = new Request(
        "http://localhost/api/scores?school=School%201&grade=grade1&assessment=child&section=a&zone=irbid"
      );
      const response = await GET(request);
      const json = await response.json();

      expect(consoleErrorSpy).toHaveBeenCalledWith("Error fetching scores:", error);
      expect(response.status).toBe(500);
      expect(json).toEqual({
        error: "Failed to fetch scores",
        message: "Query error",
      });
    });
  });
});

