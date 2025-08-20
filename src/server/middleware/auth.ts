import { Request, Response, NextFunction } from 'express'
import { PrismaClient } from '@prisma/client'
import { Role } from '@prisma/client'

const prisma = new PrismaClient()

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string
    email: string
    name?: string
    role: Role
    companyId?: string
  }
}

export const authMiddleware = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ error: 'Authentication required' })
    }

    const user = req.user as any
    if (!user?.id) {
      return res.status(401).json({ error: 'Invalid user session' })
    }

    // Check if user is blocked or deleted
    const userStatus = await prisma.userStatus.findUnique({
      where: { userId: user.id }
    })

    if (userStatus?.isBlocked) {
      return res.status(403).json({ error: 'Account is blocked' })
    }

    if (userStatus?.isDeleted) {
      return res.status(403).json({ error: 'Account is deleted' })
    }

    if (userStatus?.restrictedUntil && userStatus.restrictedUntil > new Date()) {
      return res.status(403).json({ 
        error: 'Account is temporarily restricted',
        restrictedUntil: userStatus.restrictedUntil
      })
    }

    // Get fresh user data
    const freshUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        companyId: true,
        deletedAt: true
      }
    })

    if (!freshUser || freshUser.deletedAt) {
      return res.status(401).json({ error: 'User not found' })
    }

    req.user = freshUser
    next()
  } catch (error) {
    console.error('Auth middleware error:', error)
    res.status(500).json({ error: 'Authentication error' })
  }
}

export const requireAdmin = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  if (!req.user || req.user.role !== 'ADMIN') {
    return res.status(403).json({ error: 'Admin access required' })
  }
  next()
}

export const requireRecruiter = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  if (!req.user || req.user.role !== 'RECRUITER') {
    return res.status(403).json({ error: 'Recruiter access required' })
  }
  next()
}

export const requireCompanyAccess = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  if (!req.user?.companyId) {
    return res.status(403).json({ error: 'Company access required' })
  }
  next()
}

export const getSession = (req: AuthenticatedRequest) => {
  return {
    userId: req.user?.id,
    email: req.user?.email,
    name: req.user?.name,
    role: req.user?.role,
    companyId: req.user?.companyId,
    mode: req.user?.companyId ? 'company' : 'solo'
  }
}
