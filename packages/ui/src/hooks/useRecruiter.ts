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

// Move application between stages (pipeline persistence)
export const useMoveApplication = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: { applicationId: string; toStage: string }) => {
      const res = await apiClient.patch<ApiResponse<any>>(
        "/api/recruiter/pipeline/move",
        data
      );
      return res.data.data;
    },
    onMutate: async (variables) => {
      await qc.cancelQueries({ queryKey: ["recruiter", "pipeline"] });
      const previous = qc.getQueryData<PipelineData>(["recruiter", "pipeline"]);
      if (previous) {
        // optimistic update: remove from any column and push to target column id if present
        const next: PipelineData = JSON.parse(JSON.stringify(previous));
        Object.keys(next.columns).forEach((stageId) => {
          next.columns[stageId] = next.columns[stageId].filter(
            (a: any) => a.id !== variables.applicationId
          ) as any;
        });
        // We don't know target stageId from label; UI should pass stageId in toStage when backed by enum or map
        if (next.columns[variables.toStage as keyof typeof next.columns]) {
          const moved = (previous as any).columns?.[variables.toStage]?.find?.(
            (a: any) => a.id === variables.applicationId
          );
          if (!moved) {
            // insert lightweight item
            (next.columns as any)[variables.toStage] = [
              ...((next.columns as any)[variables.toStage] || []),
              { id: variables.applicationId },
            ];
          }
        }
        qc.setQueryData(["recruiter", "pipeline"], next);
      }
      return { previous };
    },
    onError: (_err, _vars, ctx) => {
      if (ctx?.previous)
        qc.setQueryData(["recruiter", "pipeline"], ctx.previous);
      toast.error("Failed to move application");
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["recruiter", "pipeline"] });
      toast.success("Application moved");
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
export const useRecruiterMetrics = (jobId?: string) => {
  return useQuery({
    queryKey: ["recruiter", "metrics", jobId || null],
    queryFn: async (): Promise<RecruiterMetrics> => {
      const res = await apiClient.get<{ ok: boolean; data: RecruiterMetrics }>(
        "/api/recruiter/metrics",
        { params: jobId ? { jobId } : undefined }
      );
      return res.data.data;
    },
  });
};

// Jobs CRUD and membership
export interface JobInput {
  title: string;
  description?: string;
  location?: string;
  seniority?: string;
  status?: "ACTIVE" | "DRAFT" | "CLOSED";
}

export const useJobs = (params?: {
  page?: number;
  perPage?: number;
  status?: string;
}) => {
  return useQuery({
    queryKey: ["recruiter", "jobs", params],
    queryFn: async () => {
      const res = await apiClient.get<
        ApiResponse<{
          items: any[];
          page: number;
          perPage: number;
          total: number;
        }>
      >("/api/recruiter/jobs", { params });
      return res.data.data!;
    },
  });
};

export const useJob = (id?: string) => {
  return useQuery({
    queryKey: ["recruiter", "jobs", id],
    enabled: !!id,
    queryFn: async () => {
      const res = await apiClient.get<ApiResponse<any>>(
        `/api/recruiter/jobs/${id}`
      );
      return res.data.data;
    },
  });
};

export const useCreateJob = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: JobInput) => {
      const res = await apiClient.post<ApiResponse<any>>(
        `/api/recruiter/jobs`,
        data
      );
      return res.data.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["recruiter", "jobs"] });
      toast.success("Job created");
    },
  });
};

export const useUpdateJob = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: Partial<JobInput>;
    }) => {
      const res = await apiClient.patch<ApiResponse<any>>(
        `/api/recruiter/jobs/${id}`,
        data
      );
      return res.data.data;
    },
    onSuccess: (_d, { id }) => {
      qc.invalidateQueries({ queryKey: ["recruiter", "jobs"] });
      qc.invalidateQueries({ queryKey: ["recruiter", "jobs", id] });
      toast.success("Job updated");
    },
  });
};

export const useDeleteJob = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(`/api/recruiter/jobs/${id}`);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["recruiter", "jobs"] });
      toast.success("Job deleted");
    },
  });
};

export const useAddToJob = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      jobId,
      candidateId,
    }: {
      jobId: string;
      candidateId: string;
    }) => {
      const res = await apiClient.post<ApiResponse<any>>(
        `/api/recruiter/jobs/${jobId}/applications`,
        { candidateId }
      );
      return res.data.data;
    },
    onSuccess: (_d, { jobId }) => {
      qc.invalidateQueries({
        queryKey: ["recruiter", "jobs", jobId, "applications"],
      });
      toast.success("Added to job");
    },
  });
};

export const useRemoveFromJob = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      jobId,
      applicationId,
    }: {
      jobId: string;
      applicationId: string;
    }) => {
      await apiClient.delete(
        `/api/recruiter/jobs/${jobId}/applications/${applicationId}`
      );
    },
    onSuccess: (_d, { jobId }) => {
      qc.invalidateQueries({
        queryKey: ["recruiter", "jobs", jobId, "applications"],
      });
      toast.success("Removed from job");
    },
  });
};
