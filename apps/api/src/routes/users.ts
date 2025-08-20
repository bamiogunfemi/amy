import { Router } from 'express'
import { PrismaClient } from '@amy/db'
import { AuthenticatedRequest } from '../middleware/auth'

const router = Router()
const prisma = new PrismaClient()

// Get current user profile
router.get('/profile', async (req: AuthenticatedRequest, res) => {
  const session = req.user!
  
  const user = await prisma.user.findUnique({
    where: { id: session.id },
    include: {
      company: true,
      recruiter: true
    }
  })

  res.json({ user })
})

// Update user profile
router.put('/profile', async (req: AuthenticatedRequest, res) => {
  const session = req.user!
  
  const user = await prisma.user.update({
    where: { id: session.id },
    data: req.body,
    include: {
      company: true,
      recruiter: true
    }
  })

  res.json({ user })
})

export { router as userRoutes }
