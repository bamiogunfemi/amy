import { Router } from "express";
import { PrismaClient } from "@amy/db";
import { AuthenticatedRequest } from "../middleware/auth";

const router = Router();
const prisma = new PrismaClient();

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
