import { Router, Request } from "express";
import { PrismaClient } from "@amy/db";
import { requireAuth, requireRecruiter } from "@amy/auth";
import { AuthService } from "@amy/auth";
import { asyncHandler } from "../middleware/errorHandler";
import { z } from "zod";

const router = Router();
const prisma = new PrismaClient();
const authService = new AuthService(prisma);

// First authenticate the user, then check if they're a recruiter
router.use(requireAuth(authService));
router.use(requireRecruiter());

interface AuthenticatedRequest extends Request {
  user?: any;
}

const candidateCreateSchema = z.object({
  firstName: z.string(),
  lastName: z.string(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  location: z.string().optional(),
  experienceLevel: z.string().optional(),
  headline: z.string().optional(),
  summary: z.string().optional(),
  source: z
    .enum([
      "MANUAL",
      "UPLOAD",
      "DRIVE",
      "CSV",
      "EXCEL",
      "AIRTABLE",
      "GOOGLE_SHEETS",
      "ADMIN_ASSIGN",
    ])
    .optional(),
});

const candidateSkillsSchema = z.array(
  z.object({
    id: z.string(),
    name: z.string(),
    category: z.string(),
    proficiency: z.number().min(1).max(5),
  })
);

const candidateUpdateSchema = candidateCreateSchema.partial();

const skillAddSchema = z.object({
  skillId: z.string(),
  proficiency: z.number().min(1).max(5).optional(),
});

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

/**
 * @swagger
 * /candidates:
 *   get:
 *     tags:
 *       - Recruiter
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
router.get(
  "/candidates",
  asyncHandler(async (req: AuthenticatedRequest, res) => {
    const session = req.user!;
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
    const session = req.user!;
    const body = candidateCreateSchema.parse(req.body);

    // Parse skills separately to avoid schema conflicts
    const skillsData = req.body.skills
      ? candidateSkillsSchema.parse(req.body.skills)
      : [];

    const candidate = await prisma.candidate.create({
      data: {
        firstName: body.firstName,
        lastName: body.lastName,
        email: body.email,
        phone: body.phone,
        location: body.location,
        experienceLevel: body.experienceLevel,
        headline: body.headline,
        summary: body.summary,
        source: body.source || "MANUAL",

        ownerRecruiterId: session.id,
      },
    });

    // Add skills if provided
    if (skillsData.length > 0) {
      const skillsToCreate = skillsData.map((skill) => ({
        candidateId: candidate.id,
        skillId: skill.id,
        proficiency: skill.proficiency,
      }));

      await prisma.candidateSkill.createMany({
        data: skillsToCreate,
        skipDuplicates: true, // Skip if skill already exists for this candidate
      });

      await createAuditLog(
        session.id,
        "ADD_SKILLS_TO_CANDIDATE",
        "CANDIDATE",
        candidate.id,
        { skillsCount: skillsData.length }
      );
    }

    await createAuditLog(
      session.id,
      "CREATE_CANDIDATE",
      "CANDIDATE",
      candidate.id
    );

    // Return candidate with skills
    const candidateWithSkills = await prisma.candidate.findUnique({
      where: { id: candidate.id },
      include: {
        skills: {
          include: {
            skill: true,
          },
        },
      },
    });

    res.json({ ok: true, data: candidateWithSkills });
  })
);

/**
 * @swagger
 * /candidates/:id:
 *   get:
 *     tags:
 *       - Recruiter
 *     summary: Recruiter candidate details
 *     description: View detailed candidate information with recruiter-specific data
 *     responses:
 *       200:
 *         description: Success
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.get(
  "/candidates/:id",
  asyncHandler(async (req: AuthenticatedRequest, res) => {
    const session = req.user!;
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
    const session = req.user!;
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

/**
 * @swagger
 * /candidates/:id/skills:
 *   post:
 *     tags:
 *       - Recruiter
 *     summary: POST /candidates/:id/skills
 *     description: Post operation for /candidates/:id/skills
 *     responses:
 *       201:
 *         $ref: '#/components/responses/Created'
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.post(
  "/candidates/:id/skills",
  asyncHandler(async (req: AuthenticatedRequest, res) => {
    const session = req.user!;
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

/**
 * @swagger
 * /pipeline:
 *   get:
 *     tags:
 *       - Recruiter
 *     summary: GET /pipeline
 *     description: Get operation for /pipeline
 *     responses:
 *       200:
 *         description: Get operation for /pipeline
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.get(
  "/pipeline",
  asyncHandler(async (req: AuthenticatedRequest, res) => {
    const session = req.user!;

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

/**
 * @swagger
 * /search:
 *   get:
 *     tags:
 *       - Recruiter
 *     summary: Search candidates
 *     description: Full-text search across candidate profiles using PostgreSQL with ranking
 *     responses:
 *       200:
 *         description: Full-text search across candidate profiles using PostgreSQL with ranking
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.get(
  "/search",
  asyncHandler(async (req: AuthenticatedRequest, res) => {
    const session = req.user!;
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

/**
 * @swagger
 * /notifications:
 *   get:
 *     tags:
 *       - Recruiter
 *     summary: List notifications
 *     description: Retrieve user notifications with read status and timestamps
 *     responses:
 *       200:
 *         description: Retrieve user notifications with read status and timestamps
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.get(
  "/notifications",
  asyncHandler(async (req: AuthenticatedRequest, res) => {
    const session = req.user!;
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

/**
 * @swagger
 * /notifications/:id/read:
 *   post:
 *     tags:
 *       - Recruiter
 *     summary: Mark notification read
 *     description: Mark a specific notification as read by the recruiter
 *     responses:
 *       201:
 *         $ref: '#/components/responses/Created'
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.post(
  "/notifications/:id/read",
  asyncHandler(async (req: AuthenticatedRequest, res) => {
    const session = req.user!;
    const { id } = req.params;

    await prisma.notification.update({
      where: { id, userId: session.id },
      data: { readAt: new Date() },
    });

    res.json({ ok: true });
  })
);

/**
 * @swagger
 * /settings:
 *   get:
 *     tags:
 *       - Recruiter
 *     summary: Get user settings
 *     description: Retrieve user preferences and configuration options
 *     responses:
 *       200:
 *         description: Retrieve user preferences and configuration options
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.get(
  "/settings",
  asyncHandler(async (req: AuthenticatedRequest, res) => {
    const session = req.user!;

    const profile = await prisma.recruiterProfile.findUnique({
      where: { userId: session.id },
    });

    res.json({ ok: true, data: profile });
  })
);

router.patch(
  "/settings",
  asyncHandler(async (req: AuthenticatedRequest, res) => {
    const session = req.user!;
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
