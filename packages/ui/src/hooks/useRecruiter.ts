import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "../lib/axios";
import type {
  Candidate,
  PipelineStage,
  Application,
  RecruiterMetrics,
  SearchResult,
  CreateCandidateData,
  UpdateCandidateData,
} from "../types";

// Candidates
export const useCandidates = () => {
  return useQuery({
    queryKey: ["recruiter", "candidates"],
    queryFn: async (): Promise<Candidate[]> => {
      const res = await apiClient.get<{ candidates: Candidate[] }>(
        "/api/candidates"
      );
      return res.data.candidates;
    },
  });
};

export const useCandidate = (id: string) => {
  return useQuery({
    queryKey: ["recruiter", "candidates", id],
    queryFn: async (): Promise<Candidate> => {
      const res = await apiClient.get<{ candidate: Candidate }>(
        `/api/candidates/${id}`
      );
      return res.data.candidate;
    },
    enabled: !!id,
  });
};

export const useCreateCandidate = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: CreateCandidateData) => {
      const res = await apiClient.post<{ candidate: Candidate }>(
        "/api/candidates",
        data
      );
      return res.data.candidate;
    },
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: ["recruiter", "candidates"] }),
  });
};

export const useUpdateCandidate = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: UpdateCandidateData;
    }) => {
      const res = await apiClient.put<{ candidate: Candidate }>(
        `/api/candidates/${id}`,
        data
      );
      return res.data.candidate;
    },
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: ["recruiter", "candidates"] });
      qc.invalidateQueries({ queryKey: ["recruiter", "candidates", id] });
    },
  });
};

export const useDeleteCandidate = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(`/api/candidates/${id}`);
    },
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: ["recruiter", "candidates"] }),
  });
};

// Pipeline
export const usePipelineStages = () => {
  return useQuery({
    queryKey: ["recruiter", "pipeline", "stages"],
    queryFn: async (): Promise<PipelineStage[]> => {
      const res = await apiClient.get<{ stages: PipelineStage[] }>(
        "/api/pipeline/stages"
      );
      return res.data.stages;
    },
  });
};

export const useApplications = () => {
  return useQuery({
    queryKey: ["recruiter", "pipeline", "applications"],
    queryFn: async (): Promise<Application[]> => {
      const res = await apiClient.get<{ applications: Application[] }>(
        "/api/pipeline/applications"
      );
      return res.data.applications;
    },
  });
};

// Search
export const useSearch = (query: string) => {
  return useQuery({
    queryKey: ["recruiter", "search", query],
    queryFn: async (): Promise<SearchResult> => {
      const res = await apiClient.get<SearchResult>("/api/search/candidates", {
        params: { q: query },
      });
      return res.data;
    },
    enabled: !!query && query.length > 2,
  });
};

export const useSearchSkills = (query: string) => {
  return useQuery({
    queryKey: ["recruiter", "search", "skills", query],
    queryFn: async (): Promise<{ skills: any[] }> => {
      const res = await apiClient.get<{ skills: any[] }>("/api/search/skills", {
        params: { q: query },
      });
      return res.data;
    },
    enabled: !!query && query.length > 1,
  });
};

// Dashboard Metrics
export const useRecruiterMetrics = () => {
  return useQuery({
    queryKey: ["recruiter", "metrics"],
    queryFn: async (): Promise<RecruiterMetrics> => {
      const res = await apiClient.get<RecruiterMetrics>(
        "/api/recruiter/metrics"
      );
      return res.data;
    },
  });
};
