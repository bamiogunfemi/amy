import { Router, Request, Response } from "express";
import { PrismaClient } from "@amy/db";
import { asyncHandler } from "../middleware/errorHandler";

interface AuthenticatedRequest extends Request {
  user?: any;
}

const router = Router();
const prisma = new PrismaClient();

/**
 * @swagger
 * /sources:
 *   get:
 *     tags:
 *       - Imports
 *     summary: List import sources
 *     description: Get available data import sources and their configurations
 *     responses:
 *       200:
 *         description: Get available data import sources and their configurations
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
  */
router.get(
  "/sources",
  asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const session = req.user!;

    const sources = await prisma.importSource.findMany({
      where: {
        userId: session.id,
      },
      include: {
        jobs: {
          orderBy: { createdAt: "desc" },
          take: 5,
        },
      },
    });

    res.json({ sources });
  })
);

router.post(
  "/sources",
  asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const session = req.user!;

    const source = await prisma.importSource.create({
      data: {
        ...(req as any).body,
        userId: session.id,
      },
    });

    res.status(201).json({ source });
  })
);

/**
 * @swagger
 * /jobs:
 *   get:
 *     tags:
 *       - Imports
 *     summary: List jobs
 *     description: Retrieve all job postings with filtering and status information
 *     responses:
 *       200:
 *         description: Retrieve all job postings with filtering and status information
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
  */
router.get(
  "/jobs",
  asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const session = req.user!;

    const jobs = await prisma.importJob.findMany({
      where: {
        source: {
          userId: session.id,
        },
      },
      include: {
        source: true,
      },
      orderBy: { createdAt: "desc" },
    });

    res.json({ jobs });
  })
);

export { router as importRoutes };
