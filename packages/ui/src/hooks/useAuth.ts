import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import apiClient from "../lib/axios";
import type {
  LoginFormData,
  SignupFormData,
  ResetPasswordFormData,
  SetNewPasswordFormData,
  LoginResponse,
  AuthResponse,
  BlockUserData,
  UnblockUserData,
  DeleteUserData,
  ExtendTrialData,
} from "../types";
import { ApiError } from "../types/common";

export const useLogin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (credentials: LoginFormData) => {
      const response = await apiClient.post<LoginResponse>(
        "/api/auth/login",
        credentials
      );
      return response.data;
    },
    onSuccess: (data: LoginResponse) => {
      localStorage.setItem("amy_token", data.accessToken);
      localStorage.setItem("amy_refresh_token", data.refreshToken);
      queryClient.setQueryData(["auth", "user"], data.user);
      toast.success("Login successful");
    },
    onError: (error: ApiError) => {
      const message =
        error.response?.data?.error || "Invalid email or password";
      toast.error(message);
    },
  });
};

export const useSignup = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: SignupFormData) => {
      const response = await apiClient.post<LoginResponse>(
        "/api/auth/signup",
        data
      );
      return response.data;
    },
    onSuccess: (data: LoginResponse) => {
      localStorage.setItem("amy_token", data.accessToken);
      localStorage.setItem("amy_refresh_token", data.refreshToken);
      queryClient.setQueryData(["auth", "user"], data.user);
      toast.success("Account created successfully!");
    },
    onError: (error: ApiError) => {
      const message = error.response?.data?.error || "Failed to create account";
      toast.error(message);
    },
  });
};

export const useRequestPasswordReset = () => {
  return useMutation({
    mutationFn: async (data: ResetPasswordFormData) => {
      const response = await apiClient.post("/api/auth/reset-password", data);
      return response.data;
    },
    onSuccess: () => {
      toast.success("Reset email sent successfully!");
    },
    onError: (error: ApiError) => {
      const message =
        error.response?.data?.error || "Failed to send reset email";
      toast.error(message);
    },
  });
};

export const useSetNewPassword = () => {
  return useMutation({
    mutationFn: async (data: SetNewPasswordFormData) => {
      const response = await apiClient.post(
        "/api/auth/reset-password/set",
        data
      );
      return response.data;
    },
    onSuccess: () => {
      toast.success("Password updated successfully!");
    },
    onError: (error: ApiError) => {
      const message =
        error.response?.data?.error || "Failed to update password";
      toast.error(message);
    },
  });
};

export const useLogout = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      await apiClient.post("/api/auth/logout");
    },
    onSuccess: () => {
      localStorage.removeItem("amy_token");
      localStorage.removeItem("amy_refresh_token");
      queryClient.clear();
      toast.success("Logged out successfully");
    },
    onError: () => {
      // Even if logout fails, clear local storage
      localStorage.removeItem("amy_token");
      localStorage.removeItem("amy_refresh_token");
      queryClient.clear();
    },
  });
};

export const useAuth = () => {
  return useQuery({
    queryKey: ["auth", "user"],
    queryFn: async (): Promise<AuthResponse["user"]> => {
      const response = await apiClient.get<AuthResponse>("/api/auth/me");
      return response.data.user;
    },
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useRefreshToken = () => {
  return useMutation({
    mutationFn: async (refreshToken: string) => {
      const response = await apiClient.post<LoginResponse>(
        "/api/auth/refresh",
        {
          refreshToken,
        }
      );
      return response.data;
    },
    onSuccess: (data: LoginResponse) => {
      localStorage.setItem("amy_token", data.accessToken);
      localStorage.setItem("amy_refresh_token", data.refreshToken);
    },
  });
};

// Admin mutations
export const useBlockUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: BlockUserData) => {
      const response = await apiClient.post("/api/admin/users/block", data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "overview"] });
      toast.success("User blocked successfully");
    },
    onError: () => {
      toast.error("Failed to block user");
    },
  });
};

export const useUnblockUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: UnblockUserData) => {
      const response = await apiClient.post("/api/admin/users/unblock", data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "overview"] });
      toast.success("User unblocked successfully");
    },
    onError: () => {
      toast.error("Failed to unblock user");
    },
  });
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: DeleteUserData) => {
      const response = await apiClient.post("/api/admin/users/delete", data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "overview"] });
      toast.success("User deleted successfully");
    },
    onError: () => {
      toast.error("Failed to delete user");
    },
  });
};

export const useExtendTrial = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: ExtendTrialData) => {
      const response = await apiClient.post(
        "/api/admin/subscriptions/extend-trial",
        data
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "overview"] });
      toast.success("Trial extended successfully");
    },
    onError: () => {
      toast.error("Failed to extend trial");
    },
  });
};
