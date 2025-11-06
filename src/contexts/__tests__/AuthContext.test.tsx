import { renderHook, act, waitFor } from "@testing-library/react";
import { AuthProvider, useAuth } from "../AuthContext";
import { account } from "../../lib/appwrite";
import React from "react";

// Mock appwrite
jest.mock("../../lib/appwrite", () => ({
  account: {
    get: jest.fn(),
    createOAuth2Session: jest.fn(),
    deleteSession: jest.fn(),
  },
}));

const mockAccount = account as jest.Mocked<typeof account>;

describe("AuthContext", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockAccount.get.mockClear();
    mockAccount.createOAuth2Session.mockClear();
    mockAccount.deleteSession.mockClear();
  });

  it("provides initial loading state", () => {
    mockAccount.get.mockRejectedValue(new Error("No session"));

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <AuthProvider>{children}</AuthProvider>
    );

    const { result } = renderHook(() => useAuth(), { wrapper });

    expect(result.current.loading).toBe(true);
    expect(result.current.user).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
  });

  it("loads user on mount when session exists", async () => {
    const mockUser = {
      $id: "1",
      name: "Test User",
      email: "test@test.com",
      emailVerification: true,
      prefs: {},
    };

    mockAccount.get.mockResolvedValue(mockUser as any);

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <AuthProvider>{children}</AuthProvider>
    );

    const { result } = renderHook(() => useAuth(), { wrapper });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.user).toEqual(mockUser);
    expect(result.current.isAuthenticated).toBe(true);
  });

  it("handles no user session gracefully", async () => {
    mockAccount.get.mockRejectedValue(new Error("No session"));

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <AuthProvider>{children}</AuthProvider>
    );

    const { result } = renderHook(() => useAuth(), { wrapper });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.user).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
  });

  it("login function calls createOAuth2Session", async () => {
    mockAccount.get.mockRejectedValue(new Error("No session"));
    mockAccount.createOAuth2Session.mockResolvedValue(undefined as any);

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <AuthProvider>{children}</AuthProvider>
    );

    const { result } = renderHook(() => useAuth(), { wrapper });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    await act(async () => {
      await result.current.login();
    });

    expect(mockAccount.createOAuth2Session).toHaveBeenCalledWith(
      expect.any(String),
      expect.stringContaining("/dashboard"),
      expect.stringContaining("/login")
    );
  });

  it("logout function calls deleteSession", async () => {
    const mockUser = {
      $id: "1",
      name: "Test User",
      email: "test@test.com",
      emailVerification: true,
      prefs: {},
    };

    mockAccount.get.mockResolvedValue(mockUser as any);
    mockAccount.deleteSession.mockResolvedValue(undefined as any);

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <AuthProvider>{children}</AuthProvider>
    );

    const { result } = renderHook(() => useAuth(), { wrapper });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    await act(async () => {
      await result.current.logout();
    });

    expect(mockAccount.deleteSession).toHaveBeenCalledWith("current");
    expect(result.current.user).toBeNull();
  });

  it("throws error when useAuth is used outside provider", () => {
    // Suppress console.error for this test
    const consoleSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});

    expect(() => {
      renderHook(() => useAuth());
    }).toThrow("useAuth must be used within an AuthProvider");

    consoleSpy.mockRestore();
  });

  it("handles login errors gracefully", async () => {
    mockAccount.get.mockRejectedValue(new Error("No session"));
    mockAccount.createOAuth2Session.mockRejectedValue(
      new Error("Login failed")
    );

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <AuthProvider>{children}</AuthProvider>
    );

    const { result } = renderHook(() => useAuth(), { wrapper });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    await act(async () => {
      await result.current.login();
    });

    // Should handle error without crashing
    expect(mockAccount.createOAuth2Session).toHaveBeenCalled();
  });

  it("handles logout errors gracefully", async () => {
    const mockUser = {
      $id: "1",
      name: "Test User",
      email: "test@test.com",
      emailVerification: true,
      prefs: {},
    };

    mockAccount.get.mockResolvedValue(mockUser as any);
    mockAccount.deleteSession.mockRejectedValue(new Error("Logout failed"));

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <AuthProvider>{children}</AuthProvider>
    );

    const { result } = renderHook(() => useAuth(), { wrapper });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    await act(async () => {
      await result.current.logout();
    });

    // Should handle error without crashing
    expect(mockAccount.deleteSession).toHaveBeenCalled();
  });
});
