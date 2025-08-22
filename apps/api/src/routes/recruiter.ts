import { Router, Request } from "express";
import { PrismaClient } from "@amy/db";
import { requireRecruiter } from "@amy/auth";
import { asyncHandler } from "../middleware/errorHandler";
import { z } from "zod";

const router = Router();
const prisma = new PrismaClient();

// Type for authenticated requests
interface AuthenticatedRequest extends Request {
  user?: any;
}

// Zod schemas
const candidateCreateSchema = z.object({
  firstName: z.string(),
  lastName: z.string(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  location: z.string().optional(),
  experienceLevel: z.string().optional(),
  headline: z.string().optional(),
  summary: z.string().optional(),
});

const candidateUpdateSchema = candidateCreateSchema.partial();

const skillAddSchema = z.object({
  skillId: z.string(),
  proficiency: z.number().min(1).max(5).optional(),
});

// Helper function for audit logging
async function createAuditLog(
  actorUserId: string,
  action: string,
  entity: string,
  entityId: string,
  meta?: any
) {
  await prisma.auditLog.create({
    data: {
      actorUserId,
      action,
      entity,
      entityId,
      meta: meta || {},
    },
  });
}

// 3.1 Candidates - Basic CRUD
router.get(
  "/candidates",
  asyncHandler(async (req: AuthenticatedRequest, res) => {
    const session = await requireRecruiter(req);
    const { page = "1", perPage = "10" } = req.query;

    const where = {
      ownerRecruiterId: session.id,
    };

    const [candidates, total] = await Promise.all([
      prisma.candidate.findMany({
        where,
        skip: (Number(page) - 1) * Number(perPage),
        take: Number(perPage),
        include: {
          skills: {
            include: {
              skill: true,
            },
          },
          documents: true,
        },
        orderBy: { createdAt: "desc" },
      }),
      prisma.candidate.count({ where }),
    ]);

    res.json({
      ok: true,
      data: {
        items: candidates,
        page: Number(page),
        perPage: Number(perPage),
        total,
      },
    });
  })
);

router.post(
  "/candidates",
  asyncHandler(async (req: AuthenticatedRequest, res) => {
    const session = await requireRecruiter(req);
    const body = candidateCreateSchema.parse(req.body);

    const candidate = await prisma.candidate.create({
      data: {
        ...body,
        ownerRecruiterId: session.id,
        source: "MANUAL",
      },
    });

    await createAuditLog(session.id, "CREATE_CANDIDATE", "CANDIDATE", candidate.id);

    res.json({ ok: true, data: candidate });
  })
);

router.get(
  "/candidates/:id",
  asyncHandler(async (req: AuthenticatedRequest, res) => {
    const session = await requireRecruiter(req);
    const { id } = req.params;

    const candidate = await prisma.candidate.findUnique({
      where: { id, ownerRecruiterId: session.id },
      include: {
        skills: {
          include: {
            skill: true,
          },
        },
        documents: true,
        applications: true,
      },
    });

    if (!candidate) {
      return res.status(404).json({ ok: false, error: "Candidate not found" });
    }

    res.json({ ok: true, data: candidate });
  })
);

router.patch(
  "/candidates/:id",
  asyncHandler(async (req: AuthenticatedRequest, res) => {
    const session = await requireRecruiter(req);
    const { id } = req.params;
    const body = candidateUpdateSchema.parse(req.body);

    const candidate = await prisma.candidate.findUnique({
      where: { id, ownerRecruiterId: session.id },
    });

    if (!candidate) {
      return res.status(404).json({ ok: false, error: "Candidate not found" });
    }

    const updatedCandidate = await prisma.candidate.update({
      where: { id },
      data: body,
    });

    await createAuditLog(session.id, "UPDATE_CANDIDATE", "CANDIDATE", id);

    res.json({ ok: true, data: updatedCandidate });
  })
);

// 3.2 Skills
router.post(
  "/candidates/:id/skills",
  asyncHandler(async (req: AuthenticatedRequest, res) => {
    const session = await requireRecruiter(req);
    const { id } = req.params;
    const body = skillAddSchema.parse(req.body);

    const candidate = await prisma.candidate.findUnique({
      where: { id, ownerRecruiterId: session.id },
    });

    if (!candidate) {
      return res.status(404).json({ ok: false, error: "Candidate not found" });
    }

    const candidateSkill = await prisma.candidateSkill.upsert({
      where: {
        candidateId_skillId: {
          candidateId: id,
          skillId: body.skillId,
        },
      },
      update: {
        proficiency: body.proficiency,
      },
      create: {
        candidateId: id,
        skillId: body.skillId,
        proficiency: body.proficiency,
      },
    });

    await createAuditLog(session.id, "ADD_SKILL", "CANDIDATE", id);

    res.json({ ok: true, data: candidateSkill });
  })
);

// 3.3 Pipeline
router.get(
  "/pipeline",
  asyncHandler(async (req: AuthenticatedRequest, res) => {
    const session = await requireRecruiter(req);

    const stages = await prisma.pipelineStage.findMany({
      where: { recruiterId: session.id },
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

    res.json({ ok: true, data: stages });
  })
);

// 3.4 Search
router.get(
  "/search",
  asyncHandler(async (req: AuthenticatedRequest, res) => {
    const session = await requireRecruiter(req);
    const { q, page = "1", perPage = "10" } = req.query;

    if (!q) {
      return res.json({
        ok: true,
        data: {
          candidates: [],
          skills: [],
          page: Number(page),
          perPage: Number(perPage),
          total: 0,
        },
      });
    }

    const where = {
      ownerRecruiterId: session.id,
      OR: [
        { firstName: { contains: q as string, mode: "insensitive" as any } },
        { lastName: { contains: q as string, mode: "insensitive" as any } },
        { email: { contains: q as string, mode: "insensitive" as any } },
        { summary: { contains: q as string, mode: "insensitive" as any } },
      ],
    };

    const [candidates, total] = await Promise.all([
      prisma.candidate.findMany({
        where,
        skip: (Number(page) - 1) * Number(perPage),
        take: Number(perPage),
        include: {
          skills: {
            include: {
              skill: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
      }),
      prisma.candidate.count({ where }),
    ]);

    const skills = await prisma.skill.findMany({
      where: {
        label: { contains: q as string, mode: "insensitive" as any },
      },
      take: 10,
    });

    res.json({
      ok: true,
      data: {
        candidates,
        skills,
        page: Number(page),
        perPage: Number(perPage),
        total,
      },
    });
  })
);

// 3.5 Notifications
router.get(
  "/notifications",
  asyncHandler(async (req: AuthenticatedRequest, res) => {
    const session = await requireRecruiter(req);
    const { page = "1", perPage = "20" } = req.query;

    const where = {
      userId: session.id,
    };

    const [notifications, total] = await Promise.all([
      prisma.notification.findMany({
        where,
        skip: (Number(page) - 1) * Number(perPage),
        take: Number(perPage),
        orderBy: { createdAt: "desc" },
      }),
      prisma.notification.count({ where }),
    ]);

    res.json({
      ok: true,
      data: {
        items: notifications,
        page: Number(page),
        perPage: Number(perPage),
        total,
      },
    });
  })
);

router.post(
  "/notifications/:id/read",
  asyncHandler(async (req: AuthenticatedRequest, res) => {
    const session = await requireRecruiter(req);
    const { id } = req.params;

    await prisma.notification.update({
      where: { id, userId: session.id },
      data: { readAt: new Date() },
    });

    res.json({ ok: true });
  })
);

// 3.6 Settings
router.get(
  "/settings",
  asyncHandler(async (req: AuthenticatedRequest, res) => {
    const session = await requireRecruiter(req);

    const profile = await prisma.recruiterProfile.findUnique({
      where: { userId: session.id },
    });

    res.json({ ok: true, data: profile });
  })
);

router.patch(
  "/settings",
  asyncHandler(async (req: AuthenticatedRequest, res) => {
    const session = await requireRecruiter(req);
    const body = req.body;

    const profile = await prisma.recruiterProfile.upsert({
      where: { userId: session.id },
      update: {
        notifyEmail: body.notifyEmail,
        driveConnected: body.driveConnected,
        driveFolderId: body.driveFolderId,
      },
      create: {
        userId: session.id,
        notifyEmail: body.notifyEmail,
        driveConnected: body.driveConnected,
        driveFolderId: body.driveFolderId,
      },
    });

    res.json({ ok: true, data: profile });
  })
);

export { router as recruiterRoutes };
