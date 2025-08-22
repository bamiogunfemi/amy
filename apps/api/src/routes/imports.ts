import { Router, Request, Response } from "express";
import { PrismaClient } from "@amy/db";
import { asyncHandler } from "../middleware/errorHandler";

interface AuthenticatedRequest extends Request {
  user?: any;
}

const router = Router();
const prisma = new PrismaClient();

// Get import sources
router.get("/sources", asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
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
}));

// Create import source
router.post("/sources", asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const session = req.user!;

  const source = await prisma.importSource.create({
    data: {
      ...(req as any).body,
      userId: session.id,
    },
  });

  res.status(201).json({ source });
}));

// Get import jobs
router.get("/jobs", asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
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
}));

export { router as importRoutes };
