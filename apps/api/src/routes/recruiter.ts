import { Router } from "express";
import { PrismaClient } from "@amy/db";
import { AuthenticatedRequest } from "../middleware/auth";
import { asyncHandler } from "../middleware/errorHandler";
import { z } from "zod";

const router = Router();
const prisma = new PrismaClient();

// Helper function to require recruiter session
const requireRecruiter = async (req: AuthenticatedRequest) => {
  const session = req.user;
  if (!session || session.role !== "RECRUITER") {
    throw new Error("Unauthorized");
  }
  return session;
};

// Helper function to ensure candidate ownership
const assertCandidateOwner = async (
  candidateId: string,
  recruiterId: string
) => {
  const candidate = await prisma.candidate.findUnique({
    where: { id: candidateId },
  });
  if (!candidate || candidate.ownerRecruiterId !== recruiterId) {
    throw new Error("Candidate not found");
  }
  return candidate;
};

// Helper function to create audit log
const createAuditLog = async (
  actorId: string,
  action: string,
  entity: string,
  entityId: string,
  meta: any = {}
) => {
  await prisma.auditLog.create({
    data: {
      actorId,
      action,
      entity,
      entityId,
      meta,
    },
  });
};

// Schemas
const candidateCreateSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  location: z.string().optional(),
  experienceLevel: z.string().optional(),
  headline: z.string().optional(),
  summary: z.string().optional(),
});

const candidateUpdateSchema = candidateCreateSchema.partial();

const skillAddSchema = z.object({
  skillId: z.string().uuid(),
  proficiency: z.string().optional(),
});

const parseAcceptSchema = z.object({
  summary: z.string().optional(),
  skillsAdd: z
    .array(
      z.object({
        skillId: z.string().uuid(),
        proficiency: z.string().optional(),
      })
    )
    .optional(),
  skillsRemove: z.array(z.string().uuid()).optional(),
});

const applicationCreateSchema = z.object({
  candidateId: z.string().uuid(),
  jobId: z.string().uuid(),
});

const applicationMoveSchema = z.object({
  stageId: z.string().uuid(),
});

const jobCreateSchema = z.object({
  title: z.string().min(1),
  location: z.string().optional(),
  seniority: z.string().optional(),
  salaryMin: z.number().optional(),
  salaryMax: z.number().optional(),
  type: z.string().optional(),
  jdMarkdown: z.string().optional(),
});

const jobUpdateSchema = jobCreateSchema.partial();

const emailSendSchema = z.object({
  templateId: z.string().optional(),
  content: z.string().optional(),
  subject: z.string().min(1),
  candidateIds: z.array(z.string().uuid()),
});

// 3.1 Candidates
router.get(
  "/candidates",
  asyncHandler(async (req: AuthenticatedRequest, res) => {
    const session = await requireRecruiter(req);
    const {
      page = 1,
      perPage = 20,
      q,
      skillsInclude,
      skillsExclude,
      hasDoc,
      source,
      from,
      to,
    } = req.query;

    const where: any = {
      ownerRecruiterId: session.id,
      deletedAt: null,
    };

    if (q) {
      where.OR = [
        { firstName: { contains: q as string, mode: "insensitive" } },
        { lastName: { contains: q as string, mode: "insensitive" } },
        { email: { contains: q as string, mode: "insensitive" } },
      ];
    }

    if (source) {
      where.source = source;
    }

    if (from || to) {
      where.createdAt = {};
      if (from) where.createdAt.gte = new Date(from as string);
      if (to) where.createdAt.lte = new Date(to as string);
    }

    if (hasDoc === "true") {
      where.documents = { some: {} };
    }

    const [candidates, total] = await Promise.all([
      prisma.candidate.findMany({
        where,
        include: {
          _count: {
            select: {
              skills: true,
              documents: true,
            },
          },
        },
        skip: (Number(page) - 1) * Number(perPage),
        take: Number(perPage),
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

    await createAuditLog(
      session.id,
      "CREATE_CANDIDATE",
      "CANDIDATE",
      candidate.id
    );

    res.json({ ok: true, data: candidate });
  })
);

router.get(
  "/candidates/:id",
  asyncHandler(async (req: AuthenticatedRequest, res) => {
    const session = await requireRecruiter(req);
    const { id } = req.params;

    await assertCandidateOwner(id, session.id);

    const candidate = await prisma.candidate.findUnique({
      where: { id },
      include: {
        documents: true,
        skills: {
          include: {
            skill: true,
          },
        },
        applications: {
          include: {
            job: true,
            stages: {
              include: {
                stage: true,
              },
            },
          },
        },
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

    await assertCandidateOwner(id, session.id);

    const candidate = await prisma.candidate.update({
      where: { id },
      data: body,
    });

    await createAuditLog(session.id, "UPDATE_CANDIDATE", "CANDIDATE", id);

    res.json({ ok: true, data: candidate });
  })
);

router.delete(
  "/candidates/:id",
  asyncHandler(async (req: AuthenticatedRequest, res) => {
    const session = await requireRecruiter(req);
    const { id } = req.params;

    await assertCandidateOwner(id, session.id);

    await prisma.candidate.update({
      where: { id },
      data: { deletedAt: new Date() },
    });

    await createAuditLog(session.id, "DELETE_CANDIDATE", "CANDIDATE", id);

    res.json({ ok: true });
  })
);

// Skills on candidate
router.post(
  "/candidates/:id/skills",
  asyncHandler(async (req: AuthenticatedRequest, res) => {
    const session = await requireRecruiter(req);
    const { id } = req.params;
    const body = skillAddSchema.parse(req.body);

    await assertCandidateOwner(id, session.id);

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

    await createAuditLog(session.id, "ADD_SKILL", "CANDIDATE", id, {
      skillId: body.skillId,
    });

    res.json({ ok: true, data: candidateSkill });
  })
);

router.delete(
  "/candidates/:id/skills/:skillId",
  asyncHandler(async (req: AuthenticatedRequest, res) => {
    const session = await requireRecruiter(req);
    const { id, skillId } = req.params;

    await assertCandidateOwner(id, session.id);

    await prisma.candidateSkill.delete({
      where: {
        candidateId_skillId: {
          candidateId: id,
          skillId,
        },
      },
    });

    await createAuditLog(session.id, "REMOVE_SKILL", "CANDIDATE", id, {
      skillId,
    });

    res.json({ ok: true });
  })
);

// Documents / Parsing
router.post(
  "/candidates/:id/documents",
  asyncHandler(async (req: AuthenticatedRequest, res) => {
    const session = await requireRecruiter(req);
    const { id } = req.params;

    await assertCandidateOwner(id, session.id);

    // For now, we'll create a placeholder document
    // In production, you'd handle file upload here
    const document = await prisma.candidateDocument.create({
      data: {
        candidateId: id,
        originalName: "uploaded-document.pdf",
        mimeType: "application/pdf",
        size: 0,
        storageKey: "placeholder",
      },
    });

    await createAuditLog(session.id, "UPLOAD_DOCUMENT", "CANDIDATE", id, {
      documentId: document.id,
    });

    res.json({ ok: true, data: { documentId: document.id } });
  })
);

router.post(
  "/documents/:documentId/parse",
  asyncHandler(async (req: AuthenticatedRequest, res) => {
    const session = await requireRecruiter(req);
    const { documentId } = req.params;

    const document = await prisma.candidateDocument.findUnique({
      where: { id: documentId },
      include: { candidate: true },
    });

    if (!document || document.candidate.ownerRecruiterId !== session.id) {
      return res.status(404).json({ ok: false, error: "Document not found" });
    }

    // In production, you'd enqueue a parsing job here
    await createAuditLog(session.id, "PARSE_DOCUMENT", "DOCUMENT", documentId);

    res.json({ ok: true, data: { jobId: "parse-job-" + documentId } });
  })
);

router.post(
  "/candidates/:id/accept-parse",
  asyncHandler(async (req: AuthenticatedRequest, res) => {
    const session = await requireRecruiter(req);
    const { id } = req.params;
    const body = parseAcceptSchema.parse(req.body);

    await assertCandidateOwner(id, session.id);

    if (body.summary) {
      await prisma.candidate.update({
        where: { id },
        data: { summary: body.summary },
      });
    }

    if (body.skillsAdd) {
      for (const skill of body.skillsAdd) {
        await prisma.candidateSkill.upsert({
          where: {
            candidateId_skillId: {
              candidateId: id,
              skillId: skill.skillId,
            },
          },
          update: { proficiency: skill.proficiency },
          create: {
            candidateId: id,
            skillId: skill.skillId,
            proficiency: skill.proficiency,
          },
        });
      }
    }

    if (body.skillsRemove) {
      await prisma.candidateSkill.deleteMany({
        where: {
          candidateId: id,
          skillId: { in: body.skillsRemove },
        },
      });
    }

    await createAuditLog(session.id, "ACCEPT_PARSE", "CANDIDATE", id);

    res.json({ ok: true });
  })
);

// 3.2 Applications & Pipeline
router.get(
  "/pipeline",
  asyncHandler(async (req: AuthenticatedRequest, res) => {
    const session = await requireRecruiter(req);

    const stages = await prisma.pipelineStage.findMany({
      orderBy: { order: "asc" },
    });

    const applications = await prisma.application.findMany({
      where: { recruiterId: session.id },
      include: {
        candidate: true,
        stages: {
          include: {
            stage: true,
          },
          orderBy: { createdAt: "desc" },
          take: 1,
        },
      },
    });

    const columns: any = {};
    for (const stage of stages) {
      columns[stage.id] = applications.filter(
        (app) => app.stages[0]?.stageId === stage.id
      );
    }

    res.json({ ok: true, data: { stages, columns } });
  })
);

router.post(
  "/applications",
  asyncHandler(async (req: AuthenticatedRequest, res) => {
    const session = await requireRecruiter(req);
    const body = applicationCreateSchema.parse(req.body);

    await assertCandidateOwner(body.candidateId, session.id);

    const application = await prisma.application.create({
      data: {
        candidateId: body.candidateId,
        jobId: body.jobId,
        recruiterId: session.id,
      },
    });

    // Add initial stage
    const initialStage = await prisma.pipelineStage.findFirst({
      where: { order: 1 },
    });

    if (initialStage) {
      await prisma.applicationStage.create({
        data: {
          applicationId: application.id,
          stageId: initialStage.id,
        },
      });
    }

    await createAuditLog(
      session.id,
      "CREATE_APPLICATION",
      "APPLICATION",
      application.id
    );

    res.json({ ok: true, data: application });
  })
);

router.post(
  "/applications/:applicationId/move",
  asyncHandler(async (req: AuthenticatedRequest, res) => {
    const session = await requireRecruiter(req);
    const { applicationId } = req.params;
    const body = applicationMoveSchema.parse(req.body);

    const application = await prisma.application.findUnique({
      where: { id: applicationId },
      include: { candidate: true },
    });

    if (!application || application.recruiterId !== session.id) {
      return res
        .status(404)
        .json({ ok: false, error: "Application not found" });
    }

    await prisma.applicationStage.create({
      data: {
        applicationId,
        stageId: body.stageId,
      },
    });

    await createAuditLog(
      session.id,
      "MOVE_APPLICATION",
      "APPLICATION",
      applicationId,
      { stageId: body.stageId }
    );

    res.json({ ok: true });
  })
);

// 3.3 Search
router.get(
  "/search",
  asyncHandler(async (req: AuthenticatedRequest, res) => {
    const session = await requireRecruiter(req);
    const { page = 1, perPage = 20, q } = req.query;

    if (!q) {
      return res.json({
        ok: true,
        data: {
          items: [],
          page: Number(page),
          perPage: Number(perPage),
          total: 0,
        },
      });
    }

    const where = {
      ownerRecruiterId: session.id,
      deletedAt: null,
      OR: [
        { firstName: { contains: q as string, mode: "insensitive" } },
        { lastName: { contains: q as string, mode: "insensitive" } },
        { email: { contains: q as string, mode: "insensitive" } },
        { summary: { contains: q as string, mode: "insensitive" } },
      ],
    };

    const [candidates, total] = await Promise.all([
      prisma.candidate.findMany({
        where,
        include: {
          _count: {
            select: {
              skills: true,
              documents: true,
            },
          },
        },
        skip: (Number(page) - 1) * Number(perPage),
        take: Number(perPage),
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

// 3.4 Jobs & JD
router.get(
  "/jobs",
  asyncHandler(async (req: AuthenticatedRequest, res) => {
    const session = await requireRecruiter(req);
    const { page = 1, perPage = 20, q, status } = req.query;

    const where: any = {
      recruiterId: session.id,
      deletedAt: null,
    };

    if (q) {
      where.title = { contains: q as string, mode: "insensitive" };
    }

    if (status) {
      where.status = status;
    }

    const [jobs, total] = await Promise.all([
      prisma.job.findMany({
        where,
        skip: (Number(page) - 1) * Number(perPage),
        take: Number(perPage),
        orderBy: { createdAt: "desc" },
      }),
      prisma.job.count({ where }),
    ]);

    res.json({
      ok: true,
      data: {
        items: jobs,
        page: Number(page),
        perPage: Number(perPage),
        total,
      },
    });
  })
);

router.post(
  "/jobs",
  asyncHandler(async (req: AuthenticatedRequest, res) => {
    const session = await requireRecruiter(req);
    const body = jobCreateSchema.parse(req.body);

    const job = await prisma.job.create({
      data: {
        ...body,
        recruiterId: session.id,
      },
    });

    await createAuditLog(session.id, "CREATE_JOB", "JOB", job.id);

    res.json({ ok: true, data: job });
  })
);

router.get(
  "/jobs/:id",
  asyncHandler(async (req: AuthenticatedRequest, res) => {
    const session = await requireRecruiter(req);
    const { id } = req.params;

    const job = await prisma.job.findUnique({
      where: { id, recruiterId: session.id },
      include: {
        applications: {
          include: {
            candidate: true,
          },
        },
      },
    });

    if (!job) {
      return res.status(404).json({ ok: false, error: "Job not found" });
    }

    res.json({ ok: true, data: job });
  })
);

router.patch(
  "/jobs/:id",
  asyncHandler(async (req: AuthenticatedRequest, res) => {
    const session = await requireRecruiter(req);
    const { id } = req.params;
    const body = jobUpdateSchema.parse(req.body);

    const job = await prisma.job.findUnique({
      where: { id, recruiterId: session.id },
    });

    if (!job) {
      return res.status(404).json({ ok: false, error: "Job not found" });
    }

    const updatedJob = await prisma.job.update({
      where: { id },
      data: body,
    });

    await createAuditLog(session.id, "UPDATE_JOB", "JOB", id);

    res.json({ ok: true, data: updatedJob });
  })
);

router.post(
  "/jobs/:id/applicants",
  asyncHandler(async (req: AuthenticatedRequest, res) => {
    const session = await requireRecruiter(req);
    const { id } = req.params;
    const { candidateId } = req.body;

    const job = await prisma.job.findUnique({
      where: { id, recruiterId: session.id },
    });

    if (!job) {
      return res.status(404).json({ ok: false, error: "Job not found" });
    }

    await assertCandidateOwner(candidateId, session.id);

    const application = await prisma.application.create({
      data: {
        candidateId,
        jobId: id,
        recruiterId: session.id,
      },
    });

    await createAuditLog(session.id, "ADD_APPLICANT", "JOB", id, {
      candidateId,
    });

    res.json({ ok: true, data: application });
  })
);

// 3.5 Imports
router.post(
  "/import/drive",
  asyncHandler(async (req: AuthenticatedRequest, res) => {
    const session = await requireRecruiter(req);
    const { folderId, mapping } = req.body;

    const importJob = await prisma.importJob.create({
      data: {
        recruiterId: session.id,
        source: "GOOGLE_DRIVE",
        status: "PENDING",
        config: { folderId, mapping },
      },
    });

    await createAuditLog(
      session.id,
      "CREATE_IMPORT",
      "IMPORT_JOB",
      importJob.id
    );

    res.json({ ok: true, data: importJob });
  })
);

router.post(
  "/import/airtable",
  asyncHandler(async (req: AuthenticatedRequest, res) => {
    const session = await requireRecruiter(req);
    const { token, baseId, tableId, viewId, mapping } = req.body;

    const importJob = await prisma.importJob.create({
      data: {
        recruiterId: session.id,
        source: "AIRTABLE",
        status: "PENDING",
        config: { token, baseId, tableId, viewId, mapping },
      },
    });

    await createAuditLog(
      session.id,
      "CREATE_IMPORT",
      "IMPORT_JOB",
      importJob.id
    );

    res.json({ ok: true, data: importJob });
  })
);

router.post(
  "/import/sheets",
  asyncHandler(async (req: AuthenticatedRequest, res) => {
    const session = await requireRecruiter(req);
    const { sheetId, range, authMode, mapping } = req.body;

    const importJob = await prisma.importJob.create({
      data: {
        recruiterId: session.id,
        source: "GOOGLE_SHEETS",
        status: "PENDING",
        config: { sheetId, range, authMode, mapping },
      },
    });

    await createAuditLog(
      session.id,
      "CREATE_IMPORT",
      "IMPORT_JOB",
      importJob.id
    );

    res.json({ ok: true, data: importJob });
  })
);

router.post(
  "/import/csv",
  asyncHandler(async (req: AuthenticatedRequest, res) => {
    const session = await requireRecruiter(req);
    const { uploadId, mapping } = req.body;

    const importJob = await prisma.importJob.create({
      data: {
        recruiterId: session.id,
        source: "CSV",
        status: "PENDING",
        config: { uploadId, mapping },
      },
    });

    await createAuditLog(
      session.id,
      "CREATE_IMPORT",
      "IMPORT_JOB",
      importJob.id
    );

    res.json({ ok: true, data: importJob });
  })
);

router.get(
  "/import/jobs",
  asyncHandler(async (req: AuthenticatedRequest, res) => {
    const session = await requireRecruiter(req);
    const { status, page = 1, perPage = 20 } = req.query;

    const where: any = {
      recruiterId: session.id,
    };

    if (status) {
      where.status = status;
    }

    const [jobs, total] = await Promise.all([
      prisma.importJob.findMany({
        where,
        skip: (Number(page) - 1) * Number(perPage),
        take: Number(perPage),
        orderBy: { createdAt: "desc" },
      }),
      prisma.importJob.count({ where }),
    ]);

    res.json({
      ok: true,
      data: {
        items: jobs,
        page: Number(page),
        perPage: Number(perPage),
        total,
      },
    });
  })
);

// 3.6 Communications
router.get(
  "/templates",
  asyncHandler(async (req: AuthenticatedRequest, res) => {
    const session = await requireRecruiter(req);

    const templates = await prisma.emailTemplate.findMany({
      where: { recruiterId: session.id },
    });

    res.json({ ok: true, data: templates });
  })
);

router.post(
  "/send-email",
  asyncHandler(async (req: AuthenticatedRequest, res) => {
    const session = await requireRecruiter(req);
    const body = emailSendSchema.parse(req.body);

    // In production, you'd send emails here
    // For now, we'll just log the action
    for (const candidateId of body.candidateIds) {
      await createAuditLog(session.id, "SEND_EMAIL", "CANDIDATE", candidateId, {
        subject: body.subject,
        templateId: body.templateId,
      });
    }

    res.json({ ok: true, data: { sent: body.candidateIds.length } });
  })
);

// 3.7 Notifications
router.get(
  "/notifications",
  asyncHandler(async (req: AuthenticatedRequest, res) => {
    const session = await requireRecruiter(req);
    const { page = 1, perPage = 20, unreadOnly } = req.query;

    const where: any = {
      recipientId: session.id,
    };

    if (unreadOnly === "true") {
      where.readAt = null;
    }

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
      where: { id, recipientId: session.id },
      data: { readAt: new Date() },
    });

    res.json({ ok: true });
  })
);

// 3.8 Metrics
router.get(
  "/metrics",
  asyncHandler(async (req: AuthenticatedRequest, res) => {
    const session = await requireRecruiter(req);

    const [
      totalCandidates,
      activeApplications,
      interviewsScheduled,
      offersExtended,
      recentActivity,
    ] = await Promise.all([
      prisma.candidate.count({
        where: { ownerRecruiterId: session.id, deletedAt: null },
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
                name: { contains: "Interview" },
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
                name: { contains: "Offer" },
              },
            },
          },
        },
      }),
      prisma.auditLog.findMany({
        where: { actorId: session.id },
        include: {
          candidate: true,
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
        candidateName: log.candidate?.name || "Unknown",
        timestamp: log.createdAt,
      })),
    };

    res.json({ ok: true, data: metrics });
  })
);

// 3.9 Settings
router.get(
  "/settings",
  asyncHandler(async (req: AuthenticatedRequest, res) => {
    const session = await requireRecruiter(req);

    const settings = await prisma.recruiterProfile.findUnique({
      where: { userId: session.id },
    });

    res.json({ ok: true, data: settings });
  })
);

router.patch(
  "/settings",
  asyncHandler(async (req: AuthenticatedRequest, res) => {
    const session = await requireRecruiter(req);
    const { notifyEmail, mappingPresets } = req.body;

    const settings = await prisma.recruiterProfile.upsert({
      where: { userId: session.id },
      update: {
        notifyEmail,
        mappingPresets,
      },
      create: {
        userId: session.id,
        notifyEmail,
        mappingPresets,
      },
    });

    res.json({ ok: true, data: settings });
  })
);

router.post(
  "/connect-drive",
  asyncHandler(async (req: AuthenticatedRequest, res) => {
    const session = await requireRecruiter(req);

    // In production, you'd handle OAuth flow here
    await createAuditLog(session.id, "CONNECT_DRIVE", "USER", session.id);

    res.json({ ok: true, data: { connected: true } });
  })
);

export { router as recruiterRoutes };
