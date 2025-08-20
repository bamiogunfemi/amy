import { Router } from 'express'
import { z } from 'zod'
import { PrismaClient } from '@prisma/client'
import { AuthenticatedRequest } from '../middleware/auth'
import { createError } from '../middleware/errorHandler'
import { asyncHandler } from '../middleware/errorHandler'

const router = Router()
const prisma = new PrismaClient()

// Get current user profile
router.get('/profile', asyncHandler(async (req: AuthenticatedRequest, res) => {
  const session = req.user!

  const user = await prisma.user.findUnique({
    where: { id: session.id },
    include: {
      company: true,
      recruiter: true,
      status: true
    }
  })

  res.json({ user })
}))

// Update profile
router.put('/profile', asyncHandler(async (req: AuthenticatedRequest, res) => {
  const { name, notifyEmail } = z.object({
    name: z.string().optional(),
    notifyEmail: z.string().email().optional()
  }).parse(req.body)
  const session = req.user!

  const user = await prisma.user.update({
    where: { id: session.id },
    data: { name },
    include: {
      company: true,
      recruiter: true
    }
  })

  // Update recruiter profile if exists
  if (notifyEmail && user.recruiter) {
    await prisma.recruiterProfile.update({
      where: { userId: session.id },
      data: { notifyEmail }
    })
  }

  res.json({ user })
}))

// Get notifications
router.get('/notifications', asyncHandler(async (req: AuthenticatedRequest, res) => {
  const session = req.user!
  const { page = 1, limit = 20 } = req.query
  const skip = (Number(page) - 1) * Number(limit)

  const [notifications, total] = await Promise.all([
    prisma.notification.findMany({
      where: { userId: session.id },
      skip,
      take: Number(limit),
      orderBy: { createdAt: 'desc' }
    }),
    prisma.notification.count({
      where: { userId: session.id }
    })
  ])

  res.json({
    notifications,
    pagination: {
      page: Number(page),
      limit: Number(limit),
      total,
      pages: Math.ceil(total / Number(limit))
    }
  })
}))

// Mark notification as read
router.post('/notifications/:id/read', asyncHandler(async (req: AuthenticatedRequest, res) => {
  const { id } = req.params
  const session = req.user!

  await prisma.notification.updateMany({
    where: {
      id,
      userId: session.id
    },
    data: {
      readAt: new Date()
    }
  })

  res.json({ message: 'Notification marked as read' })
}))

// Mark all notifications as read
router.post('/notifications/read-all', asyncHandler(async (req: AuthenticatedRequest, res) => {
  const session = req.user!

  await prisma.notification.updateMany({
    where: {
      userId: session.id,
      readAt: null
    },
    data: {
      readAt: new Date()
    }
  })

  res.json({ message: 'All notifications marked as read' })
}))

export { router as userRoutes }
