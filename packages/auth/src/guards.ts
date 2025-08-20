import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { AuthService } from "./auth";
import { AuthUser } from "./types";
import { env } from "@amy/config";

export interface AuthenticatedRequest extends Request {
  user?: AuthUser;
  headers: Request["headers"];
}

export function requireAuth(authService: AuthService) {
  return async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ error: "No token provided" });
      }

      const token = authHeader.substring(7);
      const decoded = jwt.verify(token, env.JWT_SECRET) as any;
      
      // Get user from database to ensure they still exist and are not blocked
      const user = await authService.prisma.user.findUnique({
        where: { id: decoded.userId },
        include: { company: true, status: true },
      });

      if (!user || user.status?.isBlocked || user.status?.isDeleted) {
        return res.status(401).json({ error: "Invalid token" });
      }

      req.user = {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role as "ADMIN" | "RECRUITER",
        companyId: user.companyId || undefined,
        company: user.company || undefined,
        status: user.status?.isDeleted ? "DELETED" : user.status?.isBlocked ? "BLOCKED" : "ACTIVE",
        trialEndsAt: undefined,
      };
      
      next();
    } catch (error) {
      return res.status(401).json({ error: "Invalid token" });
    }
  };
}

export function requireAdmin() {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ error: "Authentication required" });
    }

    if (req.user.role !== "ADMIN") {
      return res.status(403).json({ error: "Admin access required" });
    }

    next();
  };
}

export function requireRecruiter() {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ error: "Authentication required" });
    }

    if (req.user.role !== "RECRUITER") {
      return res.status(403).json({ error: "Recruiter access required" });
    }

    next();
  };
}

export function ensureActiveOrTrial() {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ error: "Authentication required" });
    }

    // Check if user is blocked or deleted
    if (req.user.status === "BLOCKED" || req.user.status === "DELETED") {
      return res.status(403).json({ error: "Account is blocked or deleted" });
    }

    // Check trial status
    if (req.user.trialEndsAt && req.user.trialEndsAt < new Date()) {
      return res.status(403).json({ error: "Trial period has expired" });
    }

    next();
  };
}
