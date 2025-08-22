import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "../lib/axios";
import { toast } from "sonner";
import type {
  CandidateWithCounts,
  CandidateDetail,
  PipelineData,
  RecruiterMetrics,
  CreateCandidateData,
  UpdateCandidateData,
} from "../types";
import { ApiResponse, SkillData } from "../types/common";

// Candidates
export const useCandidates = () => {
  return useQuery({
    queryKey: ["recruiter", "candidates"],
    queryFn: async (): Promise<CandidateWithCounts[]> => {
      const res = await apiClient.get<{
        ok: boolean;
        data: { items: CandidateWithCounts[] };
      }>("/api/recruiter/candidates");
      return res.data.data.items;
    },
  });
};

export const useCandidate = (id: string) => {
  return useQuery({
    queryKey: ["recruiter", "candidates", id],
    queryFn: async (): Promise<CandidateDetail> => {
      const res = await apiClient.get<{ ok: boolean; data: CandidateDetail }>(
        `/api/recruiter/candidates/${id}`
      );
      return res.data.data;
    },
    enabled: !!id,
  });
};

export const useCreateCandidate = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: CreateCandidateData) => {
      const res = await apiClient.post<{ ok: boolean; data: CandidateDetail }>(
        "/api/recruiter/candidates",
        data
      );
      return res.data.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["recruiter", "candidates"] });
      toast.success("Candidate created successfully");
    },
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
      const res = await apiClient.patch<{ ok: boolean; data: CandidateDetail }>(
        `/api/recruiter/candidates/${id}`,
        data
      );
      return res.data.data;
    },
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: ["recruiter", "candidates"] });
      qc.invalidateQueries({ queryKey: ["recruiter", "candidates", id] });
      toast.success("Candidate updated successfully");
    },
  });
};

export const useDeleteCandidate = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(`/api/recruiter/candidates/${id}`);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["recruiter", "candidates"] });
      toast.success("Candidate deleted successfully");
    },
  });
};

// Pipeline
export const usePipelineStages = () => {
  return useQuery({
    queryKey: ["recruiter", "pipeline"],
    queryFn: async (): Promise<PipelineData> => {
      const res = await apiClient.get<{ ok: boolean; data: PipelineData }>(
        "/api/recruiter/pipeline"
      );
      return res.data.data;
    },
  });
};

export const useApplications = () => {
  return useMutation({
    mutationFn: async (data: { candidateId: string; jobId: string }) => {
      const res = await apiClient.post<ApiResponse<{ id: string }>>(
        "/api/recruiter/applications",
        data
      );
      return res.data.data;
    },
    onSuccess: () => {
      toast.success("Application created successfully");
    },
  });
};

// Search
export const useSearch = (query: string) => {
  return useQuery({
    queryKey: ["recruiter", "search", query],
    queryFn: async (): Promise<CandidateWithCounts[]> => {
      const res = await apiClient.get<{
        ok: boolean;
        data: { items: CandidateWithCounts[] };
      }>("/api/recruiter/search", { params: { q: query } });
      return res.data.data.items;
    },
    enabled: !!query && query.length > 2,
  });
};

export const useSearchSkills = (query: string) => {
  return useQuery({
    queryKey: ["recruiter", "search", "skills", query],
    queryFn: async (): Promise<{ skills: SkillData[] }> => {
      const res = await apiClient.get<ApiResponse<{ skills: SkillData[] }>>(
        "/api/admin/skills",
        { params: { q: query } }
      );
      return res.data.data!;
    },
    enabled: !!query && query.length > 1,
  });
};

// Dashboard Metrics
export const useRecruiterMetrics = () => {
  return useQuery({
    queryKey: ["recruiter", "metrics"],
    queryFn: async (): Promise<RecruiterMetrics> => {
      const res = await apiClient.get<{ ok: boolean; data: RecruiterMetrics }>(
        "/api/recruiter/metrics"
      );
      return res.data.data;
    },
  });
};
