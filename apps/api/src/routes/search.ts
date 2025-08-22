import { Router } from 'express'
import { PrismaClient } from '@amy/db'
import { AuthenticatedRequest } from '../middleware/auth'

const router = Router()
const prisma = new PrismaClient()

// Search candidates
router.get('/candidates', async (req: AuthenticatedRequest, res) => {
  const session = req.user!
  const { q } = req.query
  
  const candidates = await prisma.candidate.findMany({
    where: {
      ownerRecruiterId: session.id,
      ...(q && {
        OR: [
          { firstName: { contains: q as string, mode: 'insensitive' } },
          { lastName: { contains: q as string, mode: 'insensitive' } },
          { email: { contains: q as string, mode: 'insensitive' } },
          { headline: { contains: q as string, mode: 'insensitive' } },
          { summary: { contains: q as string, mode: 'insensitive' } }
        ]
      })
    },
    include: {
      skills: {
        include: {
          skill: true
        }
      }
    },
    orderBy: { createdAt: 'desc' }
  })

  res.json({ candidates })
})

// Search skills
router.get('/skills', async (req: AuthenticatedRequest, res) => {
  const { q } = req.query
  
  const skills = await prisma.skill.findMany({
    where: {
      ...(q && {
        OR: [
          { label: { contains: q as string, mode: 'insensitive' } },
          { slug: { contains: q as string, mode: 'insensitive' } }
        ]
      })
    },
    orderBy: { label: 'asc' }
  })

  res.json({ skills })
})

export { router as searchRoutes };
