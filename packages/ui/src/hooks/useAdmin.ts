import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import apiClient from "../lib/axios";
import type {
  Skill,
  CreateSkillData,
  UpdateSkillData,
  ImportJob,
  AdminMetrics,
  AdminUser,
  Company,
  CreateCompanyData,
  UpdateCompanyData,
} from "../types";
import type { AuditLog } from "../types";

export const useAdminOverview = () => {
  return useQuery({
    queryKey: ["admin", "overview"],
    queryFn: async () => {
      const res = await apiClient.get<{ metrics: AdminMetrics }>(
        "/api/admin/overview"
      );
      return res.data.metrics;
    },
  });
};

export const useAdminUsers = () => {
  return useQuery({
    queryKey: ["admin", "users"],
    queryFn: async () => {
      const res = await apiClient.get<{ users: AdminUser[] }>(
        "/api/admin/users"
      );
      return res.data.users;
    },
  });
};

export const useAdminCompanies = () => {
  return useQuery({
    queryKey: ["admin", "companies"],
    queryFn: async () => {
      const res = await apiClient.get<{ companies: Company[] }>(
        "/api/admin/companies"
      );
      return res.data.companies;
    },
  });
};

export const useCreateCompany = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: CreateCompanyData) => {
      const res = await apiClient.post("/api/admin/companies", data);
      return res.data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin", "companies"] }),
  });
};

export const useUpdateCompany = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: UpdateCompanyData;
    }) => {
      const res = await apiClient.put(`/api/admin/companies/${id}`, data);
      return res.data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin", "companies"] }),
  });
};

export const useSkills = () => {
  return useQuery({
    queryKey: ["admin", "skills"],
    queryFn: async (): Promise<Skill[]> => {
      const res = await apiClient.get<{ skills: Skill[] }>("/api/admin/skills");
      return res.data.skills;
    },
  });
};

export const useCreateSkill = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: CreateSkillData) => {
      const res = await apiClient.post("/api/admin/skills", data);
      return res.data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin", "skills"] }),
  });
};

export const useUpdateSkill = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateSkillData }) => {
      const res = await apiClient.put(`/api/admin/skills/${id}`, data);
      return res.data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin", "skills"] }),
  });
};

export const useDeleteSkill = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await apiClient.delete(`/api/admin/skills/${id}`);
      return res.data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin", "skills"] }),
  });
};

export const useImports = (status?: string) => {
  return useQuery({
    queryKey: ["admin", "imports", status],
    queryFn: async (): Promise<ImportJob[]> => {
      const res = await apiClient.get<{ jobs: ImportJob[] }>(
        "/api/admin/imports",
        { params: { status } }
      );
      return res.data.jobs;
    },
  });
};

export const useRetryImport = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await apiClient.post(`/api/admin/imports/${id}/retry`);
      return res.data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin", "imports"] }),
  });
};

export const useAdminAuditLogs = (limit = 10) => {
  return useQuery({
    queryKey: ["admin", "audit", limit],
    queryFn: async (): Promise<AuditLog[]> => {
      const res = await apiClient.get<{ items: AuditLog[] }>(
        "/api/admin/audit-logs",
        { params: { limit } }
      );
      return res.data.items;
    },
  });
};
