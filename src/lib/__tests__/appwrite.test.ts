import {
  loginWithGoogle,
  logoutUser,
  getCurrentUser,
  getScores,
  getAllScores,
  getTeacherSurveys,
} from "../appwrite";
import { OAuthProvider } from "appwrite";

// Mock appwrite modules
jest.mock("appwrite", () => {
  const mockAccount = {
    get: jest.fn(),
    createOAuth2Session: jest.fn(),
    deleteSession: jest.fn(),
  };

  const mockDatabases = {
    listDocuments: jest.fn(),
  };

  const mockClient = {
    setEndpoint: jest.fn().mockReturnThis(),
    setProject: jest.fn().mockReturnThis(),
  };

  return {
    Account: jest.fn().mockImplementation(() => mockAccount),
    Client: jest.fn().mockImplementation(() => mockClient),
    Databases: jest.fn().mockImplementation(() => mockDatabases),
    Storage: jest.fn(),
    OAuthProvider: {
      Google: "google",
    },
    Query: {
      equal: jest.fn((field, value) => ({ field, value })),
    },
  };
});

// Get the mocked instances
import { account, databases } from "../appwrite";
const mockAccount = account as any;
const mockDatabases = databases as any;

// Mock environment variables
const originalEnv = process.env;

beforeEach(() => {
  process.env = {
    ...originalEnv,
    NEXT_PUBLIC_APPWRITE_PROJECT_ID: "test-project-id",
    NEXT_PUBLIC_APPWRITE_DATABASE_ID: "test-database-id",
    NEXT_PUBLIC_APPWRITE_SCORES_COLLECTION_ID: "test-collection-id",
    NEXT_PUBLIC_TEACHER_SURVEY_API: "https://api.example.com/teacher-survey",
  };
});

afterEach(() => {
  process.env = originalEnv;
  jest.clearAllMocks();
});

describe("appwrite", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("loginWithGoogle", () => {
    it("calls createOAuth2Session with correct parameters", async () => {
      (mockAccount.createOAuth2Session as jest.Mock).mockResolvedValue(
        undefined
      );

      await loginWithGoogle("http://success.com", "http://failure.com");

      expect(mockAccount.createOAuth2Session).toHaveBeenCalledWith(
        OAuthProvider.Google,
        "http://success.com",
        "http://failure.com"
      );
    });

    it("throws error on failure", async () => {
      (mockAccount.createOAuth2Session as jest.Mock).mockRejectedValue(
        new Error("Login failed")
      );

      await expect(
        loginWithGoogle("http://success.com", "http://failure.com")
      ).rejects.toThrow("Login failed");
    });
  });

  describe("logoutUser", () => {
    it("calls deleteSession with current", async () => {
      (mockAccount.deleteSession as jest.Mock).mockResolvedValue(undefined);

      await logoutUser();

      expect(mockAccount.deleteSession).toHaveBeenCalledWith("current");
    });

    it("throws error on failure", async () => {
      (mockAccount.deleteSession as jest.Mock).mockRejectedValue(
        new Error("Logout failed")
      );

      await expect(logoutUser()).rejects.toThrow("Logout failed");
    });
  });

  describe("getCurrentUser", () => {
    it("returns user data on success", async () => {
      const mockUser = {
        $id: "1",
        name: "Test User",
        email: "test@test.com",
      };
      (mockAccount.get as jest.Mock).mockResolvedValue(mockUser);

      const result = await getCurrentUser();

      expect(result).toEqual(mockUser);
      expect(mockAccount.get).toHaveBeenCalled();
    });

    it("returns null on error", async () => {
      (mockAccount.get as jest.Mock).mockRejectedValue(new Error("No user"));

      const result = await getCurrentUser();

      expect(result).toBeNull();
    });
  });

  describe("getScores", () => {
    it("fetches scores with correct filters", async () => {
      const mockDocuments = [
        {
          $id: "1",
          school: "School 1",
          grade: "Grade 1",
          assessment: "child",
          total_students: 10,
          testType: "PRE",
          overall_level_distribution: '{"beginner":5,"growth":3,"expert":2}',
          category_level_distributions:
            '{"self_awareness":{"beginner":2,"growth":1,"expert":1}}',
        },
      ];

      (mockDatabases.listDocuments as jest.Mock).mockResolvedValue({
        documents: mockDocuments,
      });

      const result = await getScores({
        school: "School 1",
        grade: "Grade 1",
        assessment: "child",
      });

      expect(mockDatabases.listDocuments).toHaveBeenCalledWith(
        "test-database-id",
        "test-collection-id",
        expect.any(Array)
      );

      expect(result).toHaveLength(1);
      expect(result[0].school).toBe("School 1");
      expect(result[0].overall_level_distribution).toEqual({
        beginner: 5,
        growth: 3,
        expert: 2,
      });
    });
  });

  describe("getAllScores", () => {
    it("fetches all scores without filters", async () => {
      const mockDocuments = [
        {
          $id: "1",
          school: "School 1",
          grade: "Grade 1",
          assessment: "child",
          total_students: 10,
          testType: "PRE",
          overall_level_distribution: '{"beginner":5,"growth":3,"expert":2}',
          category_level_distributions: "{}",
        },
      ];

      (mockDatabases.listDocuments as jest.Mock).mockResolvedValue({
        documents: mockDocuments,
      });

      const result = await getAllScores();

      expect(mockDatabases.listDocuments).toHaveBeenCalledWith(
        "test-database-id",
        "test-collection-id"
      );

      expect(result).toHaveLength(1);
    });
  });

  describe("getTeacherSurveys", () => {
    it("fetches teacher survey data", async () => {
      const mockData = {
        preTest: {
          "School 1": {
            sel_importance_belief: { "1": 5, "2": 10 },
          },
        },
      };

      global.fetch = jest.fn().mockResolvedValue({
        json: jest.fn().mockResolvedValue(mockData),
      });

      const result = await getTeacherSurveys();

      expect(global.fetch).toHaveBeenCalledWith(
        "https://api.example.com/teacher-survey"
      );
      expect(result).toEqual(mockData);
    });

    it("handles fetch errors", async () => {
      global.fetch = jest.fn().mockRejectedValue(new Error("Network error"));

      await expect(getTeacherSurveys()).rejects.toThrow("Network error");
    });
  });
});
