import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  useCandidates,
  usePipelineStages,
  useRecruiterMetrics,
} from "./useRecruiter";
import apiClient from "../lib/axios";

// Mock apiClient
vi.mock("../lib/axios", () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn(),
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

describe("useRecruiter", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("useCandidates", () => {
    it("should fetch candidates successfully", async () => {
      const mockCandidates = [
        {
          id: "1",
          name: "John Doe",
          email: "john@example.com",
          source: "MANUAL",
          createdAt: new Date(),
          _count: { skills: 5, documents: 2 },
        },
      ];

      mockApiClient.get.mockResolvedValueOnce({
        data: { ok: true, data: { items: mockCandidates } },
      });

      const { result } = renderHook(() => useCandidates(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual(mockCandidates);
      expect(mockApiClient.get).toHaveBeenCalledWith(
        "/api/recruiter/candidates"
      );
    });

    it("should handle fetch error", async () => {
      mockApiClient.get.mockRejectedValueOnce(new Error("Network error"));

      const { result } = renderHook(() => useCandidates(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });
    });
  });

  describe("usePipelineStages", () => {
    it("should fetch pipeline stages successfully", async () => {
      const mockPipeline = {
        stages: [
          {
            id: "1",
            name: "Applied",
            order: 1,
            color: "#3B82F6",
            applications: [],
          },
        ],
        totalApplications: 10,
        totalCandidates: 5,
        totalJobs: 3,
      };

      mockApiClient.get.mockResolvedValueOnce({
        data: { ok: true, data: mockPipeline },
      });

      const { result } = renderHook(() => usePipelineStages(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual(mockPipeline);
      expect(mockApiClient.get).toHaveBeenCalledWith("/api/recruiter/pipeline");
    });
  });

  describe("useRecruiterMetrics", () => {
    it("should fetch metrics successfully", async () => {
      const mockMetrics = {
        totalCandidates: 25,
        activeApplications: 15,
        interviewsScheduled: 8,
        offersExtended: 3,
        recentActivity: [
          {
            id: "1",
            action: "Application submitted",
            candidateName: "Jane Smith",
            timestamp: new Date().toISOString(),
          },
        ],
      };

      mockApiClient.get.mockResolvedValueOnce({
        data: { ok: true, data: mockMetrics },
      });

      const { result } = renderHook(() => useRecruiterMetrics(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual(mockMetrics);
      expect(mockApiClient.get).toHaveBeenCalledWith("/api/recruiter/metrics");
    });
  });
});
