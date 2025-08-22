import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useLogin, useSignup, useAuth, useLogout } from "./useAuth";
import apiClient from "../lib/axios";

// Mock apiClient
vi.mock("../lib/axios", () => ({
  default: {
    post: vi.fn(),
    get: vi.fn(),
  },
}));

const mockApiClient = apiClient as jest.Mocked<typeof apiClient>;

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe("useAuth", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  describe("useLogin", () => {
    it("should login successfully", async () => {
      const mockResponse = {
        data: {
          user: { id: "1", email: "test@example.com", name: "Test User" },
          accessToken: "access-token",
          refreshToken: "refresh-token",
        },
      };

      mockApiClient.post.mockResolvedValueOnce(mockResponse);

      const { result } = renderHook(() => useLogin(), {
        wrapper: createWrapper(),
      });

      const credentials = { email: "test@example.com", password: "password" };
      result.current.mutate(credentials);

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(mockApiClient.post).toHaveBeenCalledWith(
        "/api/auth/login",
        credentials
      );
      expect(localStorage.setItem).toHaveBeenCalledWith(
        "amy_token",
        "access-token"
      );
      expect(localStorage.setItem).toHaveBeenCalledWith(
        "amy_refresh_token",
        "refresh-token"
      );
    });

    it("should handle login error", async () => {
      const error = { response: { data: { error: "Invalid credentials" } } };
      mockApiClient.post.mockRejectedValueOnce(error);

      const { result } = renderHook(() => useLogin(), {
        wrapper: createWrapper(),
      });

      result.current.mutate({ email: "test@example.com", password: "wrong" });

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });
    });
  });

  describe("useSignup", () => {
    it("should signup successfully", async () => {
      const mockResponse = {
        data: {
          user: { id: "1", email: "new@example.com", name: "New User" },
          accessToken: "access-token",
          refreshToken: "refresh-token",
        },
      };

      mockApiClient.post.mockResolvedValueOnce(mockResponse);

      const { result } = renderHook(() => useSignup(), {
        wrapper: createWrapper(),
      });

      const signupData = {
        email: "new@example.com",
        password: "password",
        name: "New User",
      };
      result.current.mutate(signupData);

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(mockApiClient.post).toHaveBeenCalledWith(
        "/api/auth/signup",
        signupData
      );
    });
  });

  describe("useAuth", () => {
    it("should return user data when authenticated", async () => {
      const mockUser = {
        id: "1",
        email: "test@example.com",
        name: "Test User",
      };
      mockApiClient.get.mockResolvedValueOnce({ data: { user: mockUser } });

      const { result } = renderHook(() => useAuth(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.data).toEqual(mockUser);
      });
    });

    it("should handle unauthenticated state", async () => {
      mockApiClient.get.mockRejectedValueOnce(new Error("Unauthorized"));

      const { result } = renderHook(() => useAuth(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.error).toBeDefined();
      });
    });
  });

  describe("useLogout", () => {
    it("should logout successfully", async () => {
      mockApiClient.post.mockResolvedValueOnce({ data: {} });

      const { result } = renderHook(() => useLogout(), {
        wrapper: createWrapper(),
      });

      result.current.mutate();

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(localStorage.removeItem).toHaveBeenCalledWith("amy_token");
      expect(localStorage.removeItem).toHaveBeenCalledWith("amy_refresh_token");
    });
  });
});
