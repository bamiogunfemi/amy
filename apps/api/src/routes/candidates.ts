import { Router, Request } from "express";
import { PrismaClient } from "@amy/db";
import { createError } from "../middleware/errorHandler";
import { asyncHandler } from "../middleware/errorHandler";

const router = Router();
const prisma = new PrismaClient();

// Get candidates (with search)
router.get(
  "/",
  asyncHandler(async (req: Request, res) => {
    const session = (req as any).user!;

    const candidates = await prisma.candidate.findMany({
      where: {
        ownerRecruiterId: session.id,
      },
      include: {
        skills: {
          include: {
            skill: true,
          },
        },
        documents: {
          select: {
            id: true,
            originalName: true,
            mimeType: true,
            size: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    res.json({ candidates });
  })
);

// Get single candidate
router.get(
  "/:id",
  asyncHandler(async (req: Request, res) => {
    const { id } = req.params;
    const _session = (req as any).user!;

    const candidate = await prisma.candidate.findFirst({
      where: {
        id,
        ownerRecruiterId: _session.id,
      },
      include: {
        skills: {
          include: {
            skill: true,
          },
        },
        documents: true,
      },
    });

    if (!candidate) {
      throw createError("Candidate not found", 404, "CANDIDATE_NOT_FOUND");
    }

    res.json({ candidate });
  })
);

// Create candidate
router.post(
  "/",
  asyncHandler(async (req: Request, res) => {
    const _session = (req as any).user!;

    const candidate = await prisma.candidate.create({
      data: {
        ...req.body,
        ownerRecruiterId: _session.id,
        companyId: _session.companyId,
        source: "MANUAL",
      },
      include: {
        skills: {
          include: {
            skill: true,
          },
        },
      },
    });

    res.status(201).json({ candidate });
  })
);

// Update candidate
router.put(
  "/:id",
  asyncHandler(async (req: Request, res) => {
    const { id } = req.params;

    const candidate = await prisma.candidate.update({
      where: { id },
      data: req.body,
      include: {
        skills: {
          include: {
            skill: true,
          },
        },
      },
    });

    res.json({ candidate });
  })
);

// Delete candidate
router.delete(
  "/:id",
  asyncHandler(async (req: Request, res) => {
    const { id } = req.params;

    await prisma.candidate.delete({
      where: { id },
    });

    res.json({ message: "Candidate deleted successfully" });
  })
);

export { router as candidateRoutes };
