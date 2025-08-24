import { Router, Request } from "express";
import { PrismaClient } from "@amy/db";
import { AuthService } from "@amy/auth";
import { requireAuth } from "@amy/auth";
import { asyncHandler } from "../middleware/errorHandler";
import { z } from "zod";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});
const signupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string(),
  companyName: z.string().optional(),
});
const resetPasswordSchema = z.object({ email: z.string().email() });
const setNewPasswordSchema = z.object({
  token: z.string(),
  newPassword: z.string().min(8),
});
const changePasswordSchema = z.object({
  currentPassword: z.string(),
  newPassword: z.string().min(8),
});

const router = Router();
const prisma = new PrismaClient();
const authService = new AuthService(prisma);

router.post(
  "/login",
  asyncHandler(async (req, res) => {
    try {
      const credentials = loginSchema.parse(req.body);
      const result = await authService.login({
        email: credentials.email!,
        password: credentials.password!,
      });
      return res.json(result);
    } catch (error) {
      return res.status(403).json({ error: "Invalid email or password" });
    }
  })
);

router.post(
  "/refresh",
  asyncHandler(async (req, res) => {
    try {
      const { refreshToken } = req.body;
      const result = await authService.refreshToken(refreshToken);
      return res.json(result);
    } catch (_err) {
      return res.status(401).json({ error: "Invalid refresh token" });
    }
  })
);

router.post(
  "/logout",
  requireAuth(authService),
  asyncHandler(async (req: Request, res) => {
    const token = req.headers.authorization?.replace("Bearer ", "");
    if (token) {
      await authService.logout(token);
    }
    res.json({ message: "Logged out successfully" });
  })
);

router.post(
  "/signup",
  asyncHandler(async (req, res) => {
    const data = signupSchema.parse(req.body);
    const result = await authService.signup({
      email: data.email!,
      password: data.password!,
      name: data.name!,
      role: "RECRUITER" as const,
      companyName: data.companyName,
    });

    res.json(result);
  })
);

router.post(
  "/reset-password",
  asyncHandler(async (req, res) => {
    const { email } = resetPasswordSchema.parse(req.body);
    await authService.resetPassword(email);

    res.json({ message: "Password reset email sent" });
  })
);

router.get(
  "/reset-password/verify/:token",
  asyncHandler(async (req, res) => {
    const { token } = req.params;
    await authService.verifyResetToken(token);

    res.json({ valid: true });
  })
);

router.post(
  "/reset-password/set",
  asyncHandler(async (req, res) => {
    const { token, newPassword } = setNewPasswordSchema.parse(req.body);
    await authService.setNewPassword(token, newPassword);

    res.json({ message: "Password updated successfully" });
  })
);

router.post(
  "/change-password",
  requireAuth(authService),
  asyncHandler(async (req: Request, res) => {
    const data = changePasswordSchema.parse(req.body);
    await authService.changePassword((req as any).user!.id, {
      currentPassword: data.currentPassword!,
      newPassword: data.newPassword!,
    });

    res.json({ message: "Password changed successfully" });
  })
);

router.get(
  "/me",
  requireAuth(authService),
  asyncHandler(async (req: Request, res) => {
    const user = (req as any).user;
    console.log("User data in /me endpoint:", user);
    res.json({ user });
  })
);

router.get(
  "/verify",
  requireAuth(authService),
  asyncHandler(async (req: Request, res) => {
    res.json({ user: (req as any).user });
  })
);

export { router as authRoutes };
