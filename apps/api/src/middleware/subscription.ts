import { Response, NextFunction } from "express";
import { PrismaClient } from "@amy/db";
import { AuthenticatedRequest } from "./auth";

const prisma = new PrismaClient();

export const subscriptionMiddleware = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ error: "Authentication required" });
    }

    const subscription = await prisma.subscription.findFirst({
      where: {
        OR: [{ userId: req.user.id }, { companyId: req.user.companyId }],
        status: { in: ["active", "trialing"] },
      },
      include: {
        plan: true,
      },
      orderBy: { createdAt: "desc" },
    });

    if (!subscription) {
      return res.status(402).json({
        error: "Payment required",
        code: "SUBSCRIPTION_REQUIRED",
      });
    }

    if (subscription.status === "trialing" && subscription.trialEndsAt) {
      if (subscription.trialEndsAt < new Date()) {
        return res.status(402).json({
          error: "Trial expired",
          code: "TRIAL_EXPIRED",
          trialEndsAt: subscription.trialEndsAt,
        });
      }
    }

    (req as any).subscription = subscription;
    next();
  } catch (error) {
    console.error("Subscription middleware error:", error);
    res.status(500).json({ error: "Subscription check failed" });
  }
};
