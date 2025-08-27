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

/**
 * @swagger
 * /auth/login:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: User login
 *     description: Authenticate user with email and password, returns JWT tokens for API access
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: recruiter@demo.com
 *               password:
 *                 type: string
 *                 minLength: 8
 *                 example: recruiter123
 *     responses:
 *       200:
 *         description: Authenticate user with email and password, returns JWT tokens for API access
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 accessToken:
 *                   type: string
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *                 refreshToken:
 *                   type: string
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       403:
 *         description: Authenticate user with email and password, returns JWT tokens for API access
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Invalid email or password
 *     security: []
 */
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
    try {
      const data = signupSchema.parse(req.body);

      const companySlug = data.companyName
        ? data.companyName
            .toLowerCase()
            .replace(/[^a-z0-9]/g, "-")
            .replace(/-+/g, "-")
            .replace(/^-|-$/g, "")
        : undefined;

      const result = await authService.signup({
        email: data.email!,
        password: data.password!,
        name: data.name!,
        role: "RECRUITER" as const,
        companyName: data.companyName,
        companySlug,
      });

      res.json(result);
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === "User already exists") {
          return res.status(409).json({ error: "User already exists" });
        }
        return res.status(400).json({ error: error.message });
      }
      throw error;
    }
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
