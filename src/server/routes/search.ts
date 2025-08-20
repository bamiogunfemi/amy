import { Router } from 'express'
import { z } from 'zod'
import { PrismaClient } from '@prisma/client'
import { AuthenticatedRequest } from '../middleware/auth'
import { createError } from '../middleware/errorHandler'
import { asyncHandler } from '../middleware/errorHandler'

const router = Router()
const prisma = new PrismaClient()

// Search candidates
router.get('/candidates', asyncHandler(async (req: AuthenticatedRequest, res) => {
  const { q, page = 1, limit = 20 } = req.query
  const session = req.user!

  if (!q || typeof q !== 'string') {
    throw createError('Search query required', 400, 'QUERY_REQUIRED')
  }

  const skip = (Number(page) - 1) * Number(limit)

  // Use full-text search with tsvector
  const candidates = await prisma.$queryRaw`
    SELECT 
      c.*,
      ts_rank(c.search_vector, plainto_tsquery('english', ${q})) as rank
    FROM candidates c
    WHERE 
      c.owner_recruiter_id = ${session.id}
      AND c.search_vector @@ plainto_tsquery('english', ${q})
    ORDER BY rank DESC
    LIMIT ${Number(limit)}
    OFFSET ${skip}
  `

  const total = await prisma.$queryRaw`
    SELECT COUNT(*) as count
    FROM candidates c
    WHERE 
      c.owner_recruiter_id = ${session.id}
      AND c.search_vector @@ plainto_tsquery('english', ${q})
  `

  res.json({
    candidates,
    pagination: {
      page: Number(page),
      limit: Number(limit),
      total: Number((total as any)[0].count),
      pages: Math.ceil(Number((total as any)[0].count) / Number(limit))
    }
  })
}))

// Search skills
router.get('/skills', asyncHandler(async (req: AuthenticatedRequest, res) => {
  const { q } = req.query

  if (!q || typeof q !== 'string') {
    throw createError('Search query required', 400, 'QUERY_REQUIRED')
  }

  const skills = await prisma.skill.findMany({
    where: {
      OR: [
        { label: { contains: q, mode: 'insensitive' } },
        { slug: { contains: q, mode: 'insensitive' } }
      ]
    },
    take: 10,
    orderBy: { label: 'asc' }
  })

  res.json({ skills })
}))

export { router as searchRoutes }
