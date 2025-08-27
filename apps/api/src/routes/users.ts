import { Router } from "express";
import { PrismaClient } from "@amy/db";
import { AuthenticatedRequest } from "../middleware/auth";

const router = Router();
const prisma = new PrismaClient();

/**
 * @swagger
 * /profile:
 *   get:
 *     tags:
 *       - Users
 *     summary: Get user profile
 *     description: Retrieve complete user profile including company and recruiter information
 *     responses:
 *       200:
 *         description: Retrieve complete user profile including company and recruiter information
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
  */
router.get("/profile", async (req: AuthenticatedRequest, res) => {
  const session = req.user!;

  const user = await prisma.user.findUnique({
    where: { id: session.id },
    include: {
      company: true,
      recruiter: true,
    },
  });

  res.json({ user });
});

router.put("/profile", async (req: AuthenticatedRequest, res) => {
  const session = req.user!;

  const user = await prisma.user.update({
    where: { id: session.id },
    data: req.body,
    include: {
      company: true,
      recruiter: true,
    },
  });

  res.json({ user });
});

export { router as userRoutes };
