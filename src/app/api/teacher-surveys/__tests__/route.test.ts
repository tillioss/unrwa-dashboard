/**
 * @jest-environment node
 */
import { GET, OPTIONS } from "../route";
import { getTeacherSurveys } from "@/lib/appwrite";
import { NextResponse } from "next/server";

// Mock appwrite functions
jest.mock("@/lib/appwrite", () => ({
  getTeacherSurveys: jest.fn(),
}));

const mockGetTeacherSurveys = getTeacherSurveys as jest.MockedFunction<
  typeof getTeacherSurveys
>;

// Mock console.error to avoid noise in test output
const consoleErrorSpy = jest
  .spyOn(console, "error")
  .mockImplementation(() => {});

describe("/api/teacher-surveys route", () => {
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
    it("should return teacher surveys successfully", async () => {
      const mockSurveys = {
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
      };

      mockGetTeacherSurveys.mockResolvedValue(mockSurveys);

      const response = await GET();
      const json = await response.json();

      expect(mockGetTeacherSurveys).toHaveBeenCalled();
      expect(response.status).toBe(200);
      expect(response.headers.get("Access-Control-Allow-Origin")).toBe("*");
      expect(json).toEqual(mockSurveys);
    });

    it("should handle errors and return 500 status", async () => {
      const error = new Error("Database error");
      mockGetTeacherSurveys.mockRejectedValue(error);

      const response = await GET();
      const json = await response.json();

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        "Error fetching teacher surveys:",
        error
      );
      expect(response.status).toBe(500);
      expect(response.headers.get("Access-Control-Allow-Origin")).toBe("*");
      expect(json).toEqual({
        error: "Failed to fetch teacher surveys",
        message: "Database error",
      });
    });

    it("should handle non-Error exceptions", async () => {
      mockGetTeacherSurveys.mockRejectedValue("String error");

      const response = await GET();
      const json = await response.json();

      expect(response.status).toBe(500);
      expect(json).toEqual({
        error: "Failed to fetch teacher surveys",
        message: "Unknown error",
      });
    });
  });
});

