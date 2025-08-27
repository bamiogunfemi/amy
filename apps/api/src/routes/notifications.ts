import { Router } from "express";
import { PrismaClient } from "@amy/db";
import { AuthenticatedRequest } from "../middleware/auth";

const router = Router();
const prisma = new PrismaClient();

/**
 * @swagger
 * /:
 *   get:
 *     tags:
 *       - Notifications
 *     summary: List candidates
 *     description: Retrieve all candidates owned by the authenticated recruiter with pagination support
 *     responses:
 *       200:
 *         description: Retrieve all candidates owned by the authenticated recruiter with pagination support
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
  */
router.get("/", async (req: AuthenticatedRequest, res) => {
  const session = req.user!;

  const notifications = await prisma.notification.findMany({
    where: {
      userId: session.id,
    },
    orderBy: { createdAt: "desc" },
  });

  res.json({ notifications });
});

/**
 * @swagger
 * /:id/read:
 *   put:
 *     tags:
 *       - Notifications
 *     summary: Mark notification as read
 *     description: Update notification read status for the current user
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
router.put("/:id/read", async (req: AuthenticatedRequest, res) => {
  const { id } = req.params;
  const session = req.user!;

  await prisma.notification.update({
    where: {
      id,
      userId: session.id,
    },
    data: {
      readAt: new Date(),
    },
  });

  res.json({ message: "Notification marked as read" });
});

export { router as notificationRoutes };
