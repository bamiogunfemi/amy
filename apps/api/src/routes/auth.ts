import { Router, Request } from "express";
import { PrismaClient } from "@amy/db";
import { AuthService } from "@amy/auth";
import { requireAuth } from "@amy/auth";
import { asyncHandler } from "../middleware/errorHandler";
import {
  loginSchema,
  signupSchema,
  resetPasswordSchema,
  setNewPasswordSchema,
  changePasswordSchema,
} from "@amy/ui";

const router = Router();
const prisma = new PrismaClient();
const authService = new AuthService(prisma);

// Login
router.post(
  "/login",
  asyncHandler(async (req, res) => {
    try {
      const credentials = loginSchema.parse(req.body);
      const result = await authService.login(credentials);
      return res.json(result);
    } catch (error) {
      return res.status(403).json({ error: "Invalid email or password" });
    }
  })
);

// Refresh token
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

// Logout
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

// Signup
router.post(
  "/signup",
  asyncHandler(async (req, res) => {
    const data = signupSchema.parse(req.body);
    const result = await authService.signup(data);

    res.json(result);
  })
);

// Request password reset
router.post(
  "/reset-password",
  asyncHandler(async (req, res) => {
    const { email } = resetPasswordSchema.parse(req.body);
    await authService.resetPassword(email);

    res.json({ message: "Password reset email sent" });
  })
);

// Verify reset token
router.get(
  "/reset-password/verify/:token",
  asyncHandler(async (req, res) => {
    const { token } = req.params;
    await authService.verifyResetToken(token);

    res.json({ valid: true });
  })
);

// Set new password with token
router.post(
  "/reset-password/set",
  asyncHandler(async (req, res) => {
    const { token, newPassword } = setNewPasswordSchema.parse(req.body);
    await authService.setNewPassword(token, newPassword);

    res.json({ message: "Password updated successfully" });
  })
);

// Change password (authenticated)
router.post(
  "/change-password",
  requireAuth(authService),
  asyncHandler(async (req: Request, res) => {
    const data = changePasswordSchema.parse(req.body);
    await authService.changePassword((req as any).user!.id, data);

    res.json({ message: "Password changed successfully" });
  })
);

// Get current user
router.get(
  "/me",
  requireAuth(authService),
  asyncHandler(async (req: Request, res) => {
    res.json({ user: (req as any).user });
  })
);

// Verify token (for client-side auth checks)
router.get(
  "/verify",
  requireAuth(authService),
  asyncHandler(async (req: Request, res) => {
    res.json({ user: (req as any).user });
  })
);

export { router as authRoutes };
