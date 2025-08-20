import { Router } from "express";
import { PrismaClient } from "@amy/db";
import { AuthenticatedRequest } from "../middleware/auth";
import { asyncHandler } from "../middleware/errorHandler";

const router = Router();
const prisma = new PrismaClient();

// Get recruiter dashboard metrics
router.get(
  "/metrics",
  asyncHandler(async (req: AuthenticatedRequest, res) => {
    const session = req.user!;

    const [
      totalCandidates,
      activeApplications,
      interviewsScheduled,
      offersExtended,
      recentActivity,
    ] = await Promise.all([
      prisma.candidate.count({
        where: { ownerRecruiterId: session.id },
      }),
      prisma.application.count({
        where: { recruiterId: session.id },
      }),
      prisma.application.count({
        where: {
          recruiterId: session.id,
          stages: {
            some: {
              stage: {
                name: {
                  in: [
                    "Interview Scheduled",
                    "Technical Interview",
                    "Final Interview",
                  ],
                },
              },
            },
          },
        },
      }),
      prisma.application.count({
        where: {
          recruiterId: session.id,
          stages: {
            some: {
              stage: {
                name: { in: ["Offer Extended", "Offer Accepted"] },
              },
            },
          },
        },
      }),
      prisma.auditLog.findMany({
        where: {
          actorId: session.id,
          entity: "CANDIDATE",
        },
        include: {
          candidate: {
            select: { firstName: true, lastName: true },
          },
        },
        orderBy: { createdAt: "desc" },
        take: 10,
      }),
    ]);

    const metrics = {
      totalCandidates,
      activeApplications,
      interviewsScheduled,
      offersExtended,
      recentActivity: recentActivity.map((log) => ({
        id: log.id,
        action: log.action,
        candidateName: `${log.candidate?.firstName || ""} ${
          log.candidate?.lastName || ""
        }`.trim(),
        timestamp: log.createdAt.toISOString(),
      })),
    };

    res.json(metrics);
  })
);

export { router as recruiterRoutes };
