import { Request, Response, NextFunction } from "express";
import { PrismaClient, Role } from "@amy/db";
import { AuthService } from "@amy/auth";

const prisma = new PrismaClient();
const authService = new AuthService(prisma);

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    name?: string;
    role: Role;
    companyId?: string;
  };
}

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Authentication required" });
    }

    const token = authHeader.substring(7);
    const user = await authService.verifyToken(token);

    const freshUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        companyId: true,
        deletedAt: true,
      },
    });

    if (!freshUser || freshUser.deletedAt) {
      return res.status(401).json({ error: "User not found" });
    }

    (req as any).user = {
      id: freshUser.id,
      email: freshUser.email,
      name: freshUser.name || undefined,
      role: freshUser.role,
      companyId: freshUser.companyId || undefined,
    };
    next();
  } catch (error) {
    console.error("Auth middleware error:", error);
    res.status(401).json({ error: "Invalid or expired token" });
  }
};

export const requireAdmin = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  if (!req.user || req.user.role !== "ADMIN") {
    return res.status(403).json({ error: "Admin access required" });
  }
  next();
};

export const requireRecruiter = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  if (!req.user || req.user.role !== "RECRUITER") {
    return res.status(403).json({ error: "Recruiter access required" });
  }
  next();
};

export const getSession = (req: AuthenticatedRequest) => {
  return {
    userId: req.user?.id,
    email: req.user?.email,
    name: req.user?.name,
    role: req.user?.role,
    companyId: req.user?.companyId,
    mode: req.user?.companyId ? "company" : "solo",
  };
};
