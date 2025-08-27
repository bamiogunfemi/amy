import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  loginSchema,
  signupSchema,
  resetPasswordSchema,
  setNewPasswordSchema,
  changePasswordSchema,
  createCandidateSchema,
  updateCandidateSchema,
  createCompanySchema,
  updateCompanySchema,
  blockUserSchema,
  unblockUserSchema,
  deleteUserSchema,
  extendTrialSchema,
  type LoginFormData,
  type SignupFormData,
  type ResetPasswordFormData,
  type SetNewPasswordFormData,
  type ChangePasswordFormData,
  type CreateCandidateData,
  type UpdateCandidateData,
  type CreateCompanyData,
  type UpdateCompanyData,
  type BlockUserData,
  type UnblockUserData,
  type DeleteUserData,
  type ExtendTrialData,
} from "../types";

export const useLoginForm = () => {
  return useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
};

export const useSignupForm = () => {
  return useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      email: "",
      password: "",
      name: "",
      role: "RECRUITER",
      companyName: "",
      companySlug: "",
    },
  });
};

export const useResetPasswordForm = () => {
  return useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      email: "",
    },
  });
};

export const useSetNewPasswordForm = () => {
  return useForm<SetNewPasswordFormData>({
    resolver: zodResolver(setNewPasswordSchema),
    defaultValues: {
      token: "",
      newPassword: "",
    },
  });
};

export const useChangePasswordForm = () => {
  return useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
    },
  });
};

export const useCreateCandidateForm = () => {
  return useForm<CreateCandidateData>({
    resolver: zodResolver(createCandidateSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      location: "",
      experienceLevel: "",
      headline: "",
      summary: "",
    },
  });
};

export const useUpdateCandidateForm = (
  defaultValues?: Partial<UpdateCandidateData>
) => {
  return useForm<UpdateCandidateData>({
    resolver: zodResolver(updateCandidateSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      location: "",
      experienceLevel: "",
      headline: "",
      summary: "",
      ...defaultValues,
    },
  });
};

export const useCreateCompanyForm = () => {
  return useForm<CreateCompanyData>({
    resolver: zodResolver(createCompanySchema),
    defaultValues: {
      name: "",
      slug: "",
    },
  });
};

export const useUpdateCompanyForm = (
  defaultValues?: Partial<UpdateCompanyData>
) => {
  return useForm<UpdateCompanyData>({
    resolver: zodResolver(updateCompanySchema),
    defaultValues: {
      name: "",
      slug: "",
      ...defaultValues,
    },
  });
};

export const useBlockUserForm = () => {
  return useForm<BlockUserData>({
    resolver: zodResolver(blockUserSchema),
    defaultValues: {
      userId: "",
    },
  });
};

export const useUnblockUserForm = () => {
  return useForm<UnblockUserData>({
    resolver: zodResolver(unblockUserSchema),
    defaultValues: {
      userId: "",
    },
  });
};

export const useDeleteUserForm = () => {
  return useForm<DeleteUserData>({
    resolver: zodResolver(deleteUserSchema),
    defaultValues: {
      userId: "",
    },
  });
};

export const useExtendTrialForm = () => {
  return useForm<ExtendTrialData>({
    resolver: zodResolver(extendTrialSchema),
    defaultValues: {
      userId: "",
      days: 30,
    },
  });
};
