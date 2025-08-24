import { Router, Request } from "express";
import { PrismaClient } from "@amy/db";
import { requireAdmin } from "@amy/auth";
import { asyncHandler } from "../middleware/errorHandler";
import { z } from "zod";

const blockUserSchema = z.object({ userId: z.string() });
const unblockUserSchema = z.object({ userId: z.string() });
const deleteUserSchema = z.object({ userId: z.string() });
const extendTrialSchema = z.object({ userId: z.string(), days: z.number() });
const createCompanySchema = z.object({ name: z.string(), slug: z.string() });
const updateCompanySchema = z.object({
  id: z.string(),
  name: z.string(),
  slug: z.string(),
});

const router = Router();
const prisma = new PrismaClient();

router.use(requireAdmin());

router.get(
  "/overview",
  asyncHandler(async (req: Request, res) => {
    const [totalUsers, totalCandidates, totalCompanies, activeTrials] =
      await Promise.all([
        prisma.user.count({ where: { deletedAt: null } }),
        prisma.candidate.count(),
        prisma.company.count(),
        prisma.subscription.count({ where: { status: "trial" } }),
      ]);

    const importJobsRunning = await prisma.importJob.count({
      where: { status: "RUNNING" },
    });

    const importJobsFailed = await prisma.importJob.count({
      where: {
        status: "FAILED",
        completedAt: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) },
      },
    });

    res.json({
      metrics: {
        totalUsers,
        totalCandidates,
        totalCompanies,
        activeTrials,
        importJobsRunning,
        importJobsFailed,
      },
    });
  })
);

router.get(
  "/users",
  asyncHandler(async (req: Request, res) => {
    const users = await prisma.user.findMany({
      include: {
        company: true,
        status: true,
      },
      orderBy: { createdAt: "desc" },
    });

    res.json({ users });
  })
);

router.post(
  "/users/block",
  asyncHandler(async (req: Request, res) => {
    const { userId } = blockUserSchema.parse(req.body);

    await prisma.userStatus.upsert({
      where: { userId },
      update: { isBlocked: true },
      create: { userId, isBlocked: true },
    });

    res.json({ message: "User blocked successfully" });
  })
);

router.post(
  "/users/unblock",
  asyncHandler(async (req: Request, res) => {
    const { userId } = unblockUserSchema.parse(req.body);

    await prisma.userStatus.update({
      where: { userId },
      data: { isBlocked: false },
    });

    res.json({ message: "User unblocked successfully" });
  })
);

router.post(
  "/users/delete",
  asyncHandler(async (req: Request, res) => {
    const { userId } = deleteUserSchema.parse(req.body);

    await prisma.user.update({
      where: { id: userId },
      data: { deletedAt: new Date() },
    });

    res.json({ message: "User deleted successfully" });
  })
);

router.get(
  "/companies",
  asyncHandler(async (req: Request, res) => {
    const companies = await prisma.company.findMany({
      include: {
        users: {
          select: {
            id: true,
            email: true,
            name: true,
            role: true,
          },
        },
        _count: {
          select: { users: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    const formattedCompanies = companies.map((company) => ({
      id: company.id,
      name: company.name,
      slug: company.slug,
      userCount: company._count.users,
      users: company.users,
      createdAt: company.createdAt,
    }));

    res.json({ companies: formattedCompanies });
  })
);

router.post(
  "/companies",
  asyncHandler(async (req: Request, res) => {
    const data = createCompanySchema.parse(req.body);
    const company = await prisma.company.create({
      data: {
        name: data.name!,
        slug: data.slug!,
      },
    });
    res.json({ company });
  })
);

router.put(
  "/companies/:id",
  asyncHandler(async (req: Request, res) => {
    const data = updateCompanySchema.parse(req.body);
    const company = await prisma.company.update({
      where: { id: req.params.id },
      data,
    });
    res.json({ company });
  })
);

router.post(
  "/subscriptions/extend-trial",
  asyncHandler(async (req: Request, res) => {
    const { userId, days } = extendTrialSchema.parse(req.body);

    const subscription = await prisma.subscription.findFirst({
      where: { userId },
    });

    if (!subscription) {
      return res.status(404).json({ error: "Subscription not found" });
    }

    const newEndDate = new Date(subscription.trialEndsAt || new Date());
    newEndDate.setDate(newEndDate.getDate() + days);

    await prisma.subscription.update({
      where: { id: subscription.id },
      data: { trialEndsAt: newEndDate },
    });

    res.json({ message: "Trial extended successfully" });
  })
);

router.get(
  "/skills",
  asyncHandler(async (_req: Request, res) => {
    const skills = await prisma.skill.findMany({ orderBy: { label: "asc" } });
    res.json({ skills });
  })
);

router.post(
  "/skills",
  asyncHandler(async (req: Request, res) => {
    const { slug, label, category } = req.body as {
      slug: string;
      label: string;
      category: string;
    };
    const skill = await prisma.skill.create({
      data: { slug, label, category: category as any },
    });
    res.json({ skill });
  })
);

router.put(
  "/skills/:id",
  asyncHandler(async (req: Request, res) => {
    const data = req.body as {
      slug?: string;
      label?: string;
      category?: string;
    };
    const skill = await prisma.skill.update({
      where: { id: req.params.id },
      data: { ...data, category: data.category as any },
    });
    res.json({ skill });
  })
);

router.delete(
  "/skills/:id",
  asyncHandler(async (req: Request, res) => {
    await prisma.skill.delete({ where: { id: req.params.id } });
    res.json({ ok: true });
  })
);

router.get(
  "/imports",
  asyncHandler(async (req: Request, res) => {
    const status = (req.query.status as string) || undefined;
    const where = status ? { status } : undefined;
    const jobs = await prisma.importJob.findMany({
      where: { status: where.status as any },
      orderBy: { createdAt: "desc" },
      take: 100,
    });
    res.json({ jobs });
  })
);

router.post(
  "/imports/:id/retry",
  asyncHandler(async (req: Request, res) => {
    const job = await prisma.importJob.update({
      where: { id: req.params.id },
      data: { status: "PENDING", error: null },
    });
    res.json({ job });
  })
);

router.get(
  "/audit-logs",
  asyncHandler(async (req: Request, res) => {
    const limit = parseInt(req.query.limit as string) || 50;
    const offset = parseInt(req.query.offset as string) || 0;

    const [items, total] = await Promise.all([
      prisma.auditLog.findMany({
        include: {
          actor: {
            select: { name: true, email: true },
          },
        },
        orderBy: { createdAt: "desc" },
        take: limit,
        skip: offset,
      }),
      prisma.auditLog.count(),
    ]);

    res.json({ items, total, limit, offset });
  })
);

export { router as adminRoutes };
