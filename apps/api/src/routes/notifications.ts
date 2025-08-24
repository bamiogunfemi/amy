import { Router } from "express";
import { PrismaClient } from "@amy/db";
import { AuthenticatedRequest } from "../middleware/auth";

const router = Router();
const prisma = new PrismaClient();

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
