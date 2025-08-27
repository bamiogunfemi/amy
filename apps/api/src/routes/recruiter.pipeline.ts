import { Router } from "express";
import { PrismaClient } from "@amy/db";
import { requireRecruiter } from "@amy/auth";
import { asyncHandler } from "../middleware/errorHandler";
import { z } from "zod";

const router = Router();
const prisma = new PrismaClient();

router.use(requireRecruiter());

const moveSchema = z.object({
  applicationId: z.string().uuid(),
  toStage: z.enum([
    "APPLIED",
    "SCREEN",
    "INTERVIEW",
    "OFFER",
    "HIRED",
    "REJECTED",
  ]),
});

/**
 * @swagger
 * /pipeline/move:
 *   patch:
 *     tags:
 *       - Recruiter Pipeline
 *     summary: Move candidate in pipeline
  *     summary: Move candidate in pipeline
 *     description: Update candidate's position in the recruitment pipeline
 *     responses:
 *       200:
 *         $ref: '#/components/responses/Success'
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
  */
router.patch(
  "/pipeline/move",
  asyncHandler(async (req: any, res) => {
    const user = req.user!;
    const { applicationId, toStage } = moveSchema.parse(req.body);

    // Ensure application belongs to recruiter via candidate ownership
    const app = await prisma.application.findFirst({
      where: { id: applicationId, recruiterId: user.id },
    });
    if (!app)
      return res
        .status(404)
        .json({ ok: false, error: "Application not found" });

    const updated = await prisma.application.update({
      where: { id: applicationId },
      data: { status: toStage as any },
    });

    res.json({ ok: true, data: updated });
  })
);

export { router as recruiterPipelineRoutes };
