import { Router } from "express";
import { PrismaClient } from "@amy/db";
import { requireRecruiter } from "@amy/auth";
import { asyncHandler } from "../middleware/errorHandler";
import { z } from "zod";

const router = Router();
const prisma = new PrismaClient();

router.use(requireRecruiter());

const jobCreateSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  location: z.string().optional(),
  seniority: z.string().optional(),
  status: z.enum(["ACTIVE", "DRAFT", "CLOSED"]).default("ACTIVE"),
});

const jobUpdateSchema = jobCreateSchema.partial();

router.post(
  "/jobs",
  asyncHandler(async (req: any, res) => {
    const user = req.user!;
    const body = jobCreateSchema.parse(req.body);
    const job = await prisma.job.create({
      data: {
        ownerRecruiterId: user.id,
        title: body.title,
        description: body.description,
        location: body.location,
        seniority: body.seniority,
        status: body.status,
      },
    });
    res.status(201).json({ ok: true, data: job });
  })
);

router.get(
  "/jobs",
  asyncHandler(async (req: any, res) => {
    const user = req.user!;
    const {
      page = "1",
      perPage = "10",
      status,
    } = req.query as Record<string, string>;
    const where: any = { ownerRecruiterId: user.id };
    if (status) where.status = status;

    const [items, total] = await Promise.all([
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
      data: { items, page: Number(page), perPage: Number(perPage), total },
    });
  })
);

router.get(
  "/jobs/:id",
  asyncHandler(async (req: any, res) => {
    const user = req.user!;
    const { id } = req.params;
    const job = await prisma.job.findFirst({
      where: { id, ownerRecruiterId: user.id },
    });
    if (!job)
      return res.status(404).json({ ok: false, error: "Job not found" });
    res.json({ ok: true, data: job });
  })
);

router.patch(
  "/jobs/:id",
  asyncHandler(async (req: any, res) => {
    const user = req.user!;
    const { id } = req.params;
    const body = jobUpdateSchema.parse(req.body);
    const job = await prisma.job.findFirst({
      where: { id, ownerRecruiterId: user.id },
    });
    if (!job)
      return res.status(404).json({ ok: false, error: "Job not found" });
    const updated = await prisma.job.update({ where: { id }, data: body });
    res.json({ ok: true, data: updated });
  })
);

router.delete(
  "/jobs/:id",
  asyncHandler(async (req: any, res) => {
    const user = req.user!;
    const { id } = req.params;
    const job = await prisma.job.findFirst({
      where: { id, ownerRecruiterId: user.id },
    });
    if (!job)
      return res.status(404).json({ ok: false, error: "Job not found" });
    await prisma.job.delete({ where: { id } });
    res.json({ ok: true });
  })
);

const addToJobSchema = z.object({ candidateId: z.string().uuid() });

router.post(
  "/jobs/:id/applications",
  asyncHandler(async (req: any, res) => {
    const user = req.user!;
    const { id } = req.params;
    const { candidateId } = addToJobSchema.parse(req.body);

    const job = await prisma.job.findFirst({
      where: { id, ownerRecruiterId: user.id },
    });
    if (!job)
      return res.status(404).json({ ok: false, error: "Job not found" });

    const application = await prisma.jobApplication.create({
      data: { jobId: id, candidateId },
    });

    res.status(201).json({ ok: true, data: application });
  })
);

router.delete(
  "/jobs/:id/applications/:applicationId",
  asyncHandler(async (req: any, res) => {
    const user = req.user!;
    const { id, applicationId } = req.params;

    const job = await prisma.job.findFirst({
      where: { id, ownerRecruiterId: user.id },
    });
    if (!job)
      return res.status(404).json({ ok: false, error: "Job not found" });

    await prisma.jobApplication.delete({ where: { id: applicationId } });
    res.json({ ok: true });
  })
);

export { router as recruiterJobsRoutes };
