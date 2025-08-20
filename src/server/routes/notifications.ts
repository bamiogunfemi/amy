import { Router } from 'express'
import { PrismaClient } from '@prisma/client'
import { AuthenticatedRequest } from '../middleware/auth'
import { createError } from '../middleware/errorHandler'
import { asyncHandler } from '../middleware/errorHandler'

const router = Router()
const prisma = new PrismaClient()

// Get notifications
router.get('/', asyncHandler(async (req: AuthenticatedRequest, res) => {
  const session = req.user!
  const { page = 1, limit = 20, unreadOnly = false } = req.query

  const where: any = { userId: session.id }
  if (unreadOnly === 'true') {
    where.readAt = null
  }

  const skip = (Number(page) - 1) * Number(limit)

  const [notifications, total] = await Promise.all([
    prisma.notification.findMany({
      where,
      skip,
      take: Number(limit),
      orderBy: { createdAt: 'desc' }
    }),
    prisma.notification.count({ where })
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
router.post('/:id/read', asyncHandler(async (req: AuthenticatedRequest, res) => {
  const { id } = req.params
  const session = req.user!

  const notification = await prisma.notification.findFirst({
    where: {
      id,
      userId: session.id
    }
  })

  if (!notification) {
    throw createError('Notification not found', 404, 'NOTIFICATION_NOT_FOUND')
  }

  await prisma.notification.update({
    where: { id },
    data: { readAt: new Date() }
  })

  res.json({ message: 'Notification marked as read' })
}))

// Mark all notifications as read
router.post('/read-all', asyncHandler(async (req: AuthenticatedRequest, res) => {
  const session = req.user!

  await prisma.notification.updateMany({
    where: {
      userId: session.id,
      readAt: null
    },
    data: { readAt: new Date() }
  })

  res.json({ message: 'All notifications marked as read' })
}))

// Delete notification
router.delete('/:id', asyncHandler(async (req: AuthenticatedRequest, res) => {
  const { id } = req.params
  const session = req.user!

  const notification = await prisma.notification.findFirst({
    where: {
      id,
      userId: session.id
    }
  })

  if (!notification) {
    throw createError('Notification not found', 404, 'NOTIFICATION_NOT_FOUND')
  }

  await prisma.notification.delete({
    where: { id }
  })

  res.json({ message: 'Notification deleted successfully' })
}))

export { router as notificationRoutes }
