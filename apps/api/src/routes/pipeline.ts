import { Router } from "express";
import { PrismaClient } from "@amy/db";
import { AuthenticatedRequest } from "../middleware/auth";

const router = Router();
const prisma = new PrismaClient();

/**
 * @swagger
 * /stages:
 *   get:
 *     tags:
 *       - Pipeline
 *     summary: Get pipeline stages
 *     description: Retrieve recruiter's custom pipeline stages with candidate counts
 *     responses:
 *       200:
 *         description: Retrieve recruiter's custom pipeline stages with candidate counts
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
  */
router.get("/stages", async (req: AuthenticatedRequest, res) => {
  const session = req.user!;

  const stages = await prisma.pipelineStage.findMany({
    where: {
      recruiterId: session.id,
    },
    include: {
      applications: {
        include: {
          application: {
            include: {
              candidate: true,
            },
          },
        },
      },
    },
    orderBy: { order: "asc" },
  });

  res.json({ stages });
});

/**
 * @swagger
 * /applications:
 *   get:
 *     tags:
 *       - Pipeline
 *     summary: List applications
 *     description: Get all job applications in the recruiter's pipeline
 *     responses:
 *       200:
 *         description: Get all job applications in the recruiter's pipeline
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
  */
router.get("/applications", async (req: AuthenticatedRequest, res) => {
  const session = req.user!;

  const applications = await prisma.application.findMany({
    where: {
      recruiterId: session.id,
    },
    include: {
      candidate: true,
      stages: {
        include: {
          stage: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  res.json({ applications });
});

export { router as pipelineRoutes };
