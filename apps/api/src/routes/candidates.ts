import { Router, Request } from "express";
import { PrismaClient } from "@amy/db";
import { createError } from "../middleware/errorHandler";
import { asyncHandler } from "../middleware/errorHandler";

const router = Router();
const prisma = new PrismaClient();

/**
 * @swagger
 * /:
 *   get:
 *     tags:
 *       - Candidates
 *     summary: List candidates
 *     description: Retrieve all candidates owned by the authenticated recruiter with pagination support
 *     parameters:
 *       - name: page
 *         in: query
 *         description: Retrieve all candidates owned by the authenticated recruiter with pagination support
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *       - name: limit
 *         in: query
 *         description: Retrieve all candidates owned by the authenticated recruiter with pagination support
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 20
 *     responses:
 *       200:
 *         description: Retrieve all candidates owned by the authenticated recruiter with pagination support
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 candidates:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Candidate'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
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

/**
 * @swagger
 * /:id:
 *   get:
 *     tags:
 *       - Candidates
 *     summary: Get candidate details
 *     description: Retrieve detailed information about a specific candidate including skills and documents
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Candidate ID
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Candidate details retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 candidate:
 *                   $ref: '#/components/schemas/Candidate'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
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
