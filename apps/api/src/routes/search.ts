import { Router } from "express";
import { PrismaClient } from "@amy/db";
import { AuthenticatedRequest } from "../middleware/auth";

const router = Router();
const prisma = new PrismaClient();

/**
 * @swagger
 * /candidates:
 *   get:
 *     tags:
 *       - Search
 *     summary: GET /candidates
 *     description: Get operation for /candidates
 *     responses:
 *       200:
 *         description: Get operation for /candidates
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
  */
router.get("/candidates", async (req: AuthenticatedRequest, res) => {
  const session = req.user!;
  const { q } = req.query;

  const candidates = await prisma.candidate.findMany({
    where: {
      ownerRecruiterId: session.id,
      ...(q && {
        OR: [
          { firstName: { contains: q as string, mode: "insensitive" } },
          { lastName: { contains: q as string, mode: "insensitive" } },
          { email: { contains: q as string, mode: "insensitive" } },
          { headline: { contains: q as string, mode: "insensitive" } },
          { summary: { contains: q as string, mode: "insensitive" } },
        ],
      }),
    },
    include: {
      skills: {
        include: {
          skill: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  res.json({ candidates });
});

/**
 * @swagger
 * /skills:
 *   get:
 *     tags:
 *       - Search
 *     summary: List skills
 *     description: Retrieve all skills in the system with categories and usage statistics
 *     responses:
 *       200:
 *         description: Retrieve all skills in the system with categories and usage statistics
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
  */
router.get("/skills", async (req: AuthenticatedRequest, res) => {
  const { q } = req.query;

  const skills = await prisma.skill.findMany({
    where: {
      ...(q && {
        OR: [
          { label: { contains: q as string, mode: "insensitive" } },
          { slug: { contains: q as string, mode: "insensitive" } },
        ],
      }),
    },
    orderBy: { label: "asc" },
  });

  res.json({ skills });
});

export { router as searchRoutes };
