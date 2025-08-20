import { Router } from 'express'
import { z } from 'zod'
import { PrismaClient } from '@prisma/client'
import { AuthenticatedRequest } from '../middleware/auth'
import { requireAdmin } from '../middleware/auth'
import { createError } from '../middleware/errorHandler'
import { asyncHandler } from '../middleware/errorHandler'

const router = Router()
const prisma = new PrismaClient()

// Apply admin middleware to all routes
router.use(requireAdmin)

// Get admin overview
router.get('/overview', asyncHandler(async (req: AuthenticatedRequest, res) => {
  const [
    totalCompanies,
    totalRecruiters,
    activeUsers,
    activeTrials,
    totalAssignments,
    failedImports
  ] = await Promise.all([
    prisma.company.count(),
    prisma.user.count({ where: { role: 'RECRUITER' } }),
    prisma.user.count({ where: { deletedAt: null } }),
    prisma.subscription.count({ where: { status: 'trialing' } }),
    prisma.assignment.count(),
    prisma.importJob.count({ where: { status: 'FAILED' } })
  ])

  res.json({
    overview: {
      totalCompanies,
      totalRecruiters,
      activeUsers,
      activeTrials,
      totalAssignments,
      failedImports
    }
  })
}))

// User management
router.get('/users', asyncHandler(async (req: AuthenticatedRequest, res) => {
  const { page = 1, limit = 20, q } = req.query
  const skip = (Number(page) - 1) * Number(limit)

  const where: any = {}
  if (q) {
    where.OR = [
      { email: { contains: q as string, mode: 'insensitive' } },
      { name: { contains: q as string, mode: 'insensitive' } }
    ]
  }

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where,
      include: {
        company: true,
        status: true,
        recruiter: true
      },
      skip,
      take: Number(limit),
      orderBy: { createdAt: 'desc' }
    }),
    prisma.user.count({ where })
  ])

  res.json({
    users,
    pagination: {
      page: Number(page),
      limit: Number(limit),
      total,
      pages: Math.ceil(total / Number(limit))
    }
  })
}))

// Block user
router.post('/users/:id/block', asyncHandler(async (req: AuthenticatedRequest, res) => {
  const { id } = req.params
  const { reason } = z.object({ reason: z.string().optional() }).parse(req.body)

  const user = await prisma.user.findUnique({
    where: { id },
    include: { status: true }
  })

  if (!user) {
    throw createError('User not found', 404, 'USER_NOT_FOUND')
  }

  await prisma.userStatus.upsert({
    where: { userId: id },
    update: {
      isBlocked: true,
      notes: reason
    },
    create: {
      userId: id,
      isBlocked: true,
      notes: reason
    }
  })

  // Log audit
  await prisma.auditLog.create({
    data: {
      actorUserId: req.user!.id,
      action: 'BLOCK_USER',
      entity: 'USER',
      entityId: id,
      meta: { reason }
    }
  })

  res.json({ message: 'User blocked successfully' })
}))

// Unblock user
router.post('/users/:id/unblock', asyncHandler(async (req: AuthenticatedRequest, res) => {
  const { id } = req.params

  await prisma.userStatus.update({
    where: { userId: id },
    data: { isBlocked: false }
  })

  // Log audit
  await prisma.auditLog.create({
    data: {
      actorUserId: req.user!.id,
      action: 'UNBLOCK_USER',
      entity: 'USER',
      entityId: id,
      meta: {}
    }
  })

  res.json({ message: 'User unblocked successfully' })
}))

// Delete user
router.post('/users/:id/delete', asyncHandler(async (req: AuthenticatedRequest, res) => {
  const { id } = req.params
  const { reason } = z.object({ reason: z.string().optional() }).parse(req.body)

  // Soft delete
  await prisma.user.update({
    where: { id },
    data: { deletedAt: new Date() }
  })

  await prisma.userStatus.upsert({
    where: { userId: id },
    update: {
      isDeleted: true,
      notes: reason
    },
    create: {
      userId: id,
      isDeleted: true,
      notes: reason
    }
  })

  // Log audit
  await prisma.auditLog.create({
    data: {
      actorUserId: req.user!.id,
      action: 'DELETE_USER',
      entity: 'USER',
      entityId: id,
      meta: { reason }
    }
  })

  res.json({ message: 'User deleted successfully' })
}))

// Company management
router.get('/companies', asyncHandler(async (req: AuthenticatedRequest, res) => {
  const companies = await prisma.company.findMany({
    include: {
      users: {
        include: {
          status: true
        }
      },
      subscriptions: {
        include: {
          plan: true
        }
      }
    },
    orderBy: { createdAt: 'desc' }
  })

  res.json({ companies })
}))

// Assign candidate to recruiter
router.post('/assignments', asyncHandler(async (req: AuthenticatedRequest, res) => {
  const { candidateId, recruiterId } = z.object({
    candidateId: z.string(),
    recruiterId: z.string()
  }).parse(req.body)

  // Verify recruiter exists and is active
  const recruiter = await prisma.user.findFirst({
    where: {
      id: recruiterId,
      role: 'RECRUITER',
      deletedAt: null
    }
  })

  if (!recruiter) {
    throw createError('Recruiter not found', 404, 'RECRUITER_NOT_FOUND')
  }

  // Create assignment
  const assignment = await prisma.assignment.create({
    data: {
      candidateId,
      assignedToRecruiterId: recruiterId,
      assignedByAdminId: req.user!.id
    },
    include: {
      candidate: true,
      assignedToRecruiter: {
        select: { id: true, name: true, email: true }
      }
    }
  })

  // Log audit
  await prisma.auditLog.create({
    data: {
      actorUserId: req.user!.id,
      action: 'ASSIGN_CANDIDATE',
      entity: 'CANDIDATE',
      entityId: candidateId,
      meta: { recruiterId, recruiterName: recruiter.name }
    }
  })

  res.json({ assignment })
}))

// Get assignments
router.get('/assignments', asyncHandler(async (req: AuthenticatedRequest, res) => {
  const assignments = await prisma.assignment.findMany({
    include: {
      candidate: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true
        }
      },
      assignedToRecruiter: {
        select: {
          id: true,
          name: true,
          email: true
        }
      },
      assignedByAdmin: {
        select: {
          id: true,
          name: true,
          email: true
        }
      }
    },
    orderBy: { createdAt: 'desc' }
  })

  res.json({ assignments })
}))

// Skills management
router.get('/skills', asyncHandler(async (req: AuthenticatedRequest, res) => {
  const skills = await prisma.skill.findMany({
    include: {
      _count: {
        select: { candidates: true }
      }
    },
    orderBy: { label: 'asc' }
  })

  res.json({ skills })
}))

router.post('/skills', asyncHandler(async (req: AuthenticatedRequest, res) => {
  const { slug, label, category } = z.object({
    slug: z.string(),
    label: z.string(),
    category: z.enum(['LANG', 'FRAMEWORK', 'DB', 'CLOUD', 'TOOL', 'SOFT', 'CERT', 'DOMAIN'])
  }).parse(req.body)

  const skill = await prisma.skill.create({
    data: { slug, label, category }
  })

  res.json({ skill })
}))

// Get audit logs
router.get('/audit', asyncHandler(async (req: AuthenticatedRequest, res) => {
  const { page = 1, limit = 50 } = req.query
  const skip = (Number(page) - 1) * Number(limit)

  const [logs, total] = await Promise.all([
    prisma.auditLog.findMany({
      include: {
        actor: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      },
      skip,
      take: Number(limit),
      orderBy: { createdAt: 'desc' }
    }),
    prisma.auditLog.count()
  ])

  res.json({
    logs,
    pagination: {
      page: Number(page),
      limit: Number(limit),
      total,
      pages: Math.ceil(total / Number(limit))
    }
  })
}))

export { router as adminRoutes }
