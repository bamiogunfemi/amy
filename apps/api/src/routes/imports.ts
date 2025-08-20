import { Router, Request } from 'express'
import { PrismaClient } from '@amy/db'


const router = Router()
const prisma = new PrismaClient()

// Get import sources
router.get('/sources', async (req: Request, res) => {
  const session = req.user!
  
  const sources = await prisma.importSource.findMany({
    where: {
      userId: session.id
    },
    include: {
      jobs: {
        orderBy: { createdAt: 'desc' },
        take: 5
      }
    }
  })

  res.json({ sources })
})

// Create import source
router.post('/sources', async (req: Request, res) => {
  const session = req.user!
  
  const source = await prisma.importSource.create({
    data: {
      ...req.body,
      userId: session.id
    }
  })

  res.status(201).json({ source })
})

// Get import jobs
router.get('/jobs', async (req: Request, res) => {
  const session = req.user!
  
  const jobs = await prisma.importJob.findMany({
    where: {
      source: {
        userId: session.id
      }
    },
    include: {
      source: true
    },
    orderBy: { createdAt: 'desc' }
  })

  res.json({ jobs })
})

export { router as importRoutes }
