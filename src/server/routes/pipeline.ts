import { Router } from 'express'
import { z } from 'zod'
import { PrismaClient } from '@prisma/client'
import { AuthenticatedRequest } from '../middleware/auth'
import { createError } from '../middleware/errorHandler'
import { asyncHandler } from '../middleware/errorHandler'

const router = Router()
const prisma = new PrismaClient()

// Get pipeline stages
router.get('/stages', asyncHandler(async (req: AuthenticatedRequest, res) => {
  const session = req.user!

  const stages = await prisma.pipelineStage.findMany({
    where: { recruiterId: session.id },
    include: {
      applications: {
        include: {
          application: {
            include: {
              candidate: {
                select: {
                  id: true,
                  firstName: true,
                  lastName: true,
                  email: true
                }
              }
            }
          }
        }
      }
    },
    orderBy: { order: 'asc' }
  })

  res.json({ stages })
}))

// Create pipeline stage
router.post('/stages', asyncHandler(async (req: AuthenticatedRequest, res) => {
  const { name } = z.object({ name: z.string().min(1) }).parse(req.body)
  const session = req.user!

  // Get max order
  const maxOrder = await prisma.pipelineStage.findFirst({
    where: { recruiterId: session.id },
    orderBy: { order: 'desc' },
    select: { order: true }
  })

  const stage = await prisma.pipelineStage.create({
    data: {
      recruiterId: session.id,
      name,
      order: (maxOrder?.order || 0) + 1
    }
  })

  res.json({ stage })
}))

// Update pipeline stage
router.put('/stages/:id', asyncHandler(async (req: AuthenticatedRequest, res) => {
  const { id } = req.params
  const { name, order } = z.object({
    name: z.string().min(1).optional(),
    order: z.number().min(0).optional()
  }).parse(req.body)
  const session = req.user!

  const stage = await prisma.pipelineStage.findFirst({
    where: {
      id,
      recruiterId: session.id
    }
  })

  if (!stage) {
    throw createError('Stage not found', 404, 'STAGE_NOT_FOUND')
  }

  const updatedStage = await prisma.pipelineStage.update({
    where: { id },
    data: { name, order }
  })

  res.json({ stage: updatedStage })
}))

// Delete pipeline stage
router.delete('/stages/:id', asyncHandler(async (req: AuthenticatedRequest, res) => {
  const { id } = req.params
  const session = req.user!

  const stage = await prisma.pipelineStage.findFirst({
    where: {
      id,
      recruiterId: session.id
    }
  })

  if (!stage) {
    throw createError('Stage not found', 404, 'STAGE_NOT_FOUND')
  }

  await prisma.pipelineStage.delete({
    where: { id }
  })

  res.json({ message: 'Stage deleted successfully' })
}))

// Get applications
router.get('/applications', asyncHandler(async (req: AuthenticatedRequest, res) => {
  const session = req.user!

  const applications = await prisma.application.findMany({
    where: { recruiterId: session.id },
    include: {
      candidate: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true
        }
      },
      stages: {
        include: {
          stage: true
        }
      }
    },
    orderBy: { createdAt: 'desc' }
  })

  res.json({ applications })
}))

// Create application
router.post('/applications', asyncHandler(async (req: AuthenticatedRequest, res) => {
  const { candidateId, jobTitle, companyName } = z.object({
    candidateId: z.string(),
    jobTitle: z.string().min(1),
    companyName: z.string().min(1)
  }).parse(req.body)
  const session = req.user!

  // Verify candidate ownership
  const candidate = await prisma.candidate.findFirst({
    where: {
      id: candidateId,
      ownerRecruiterId: session.id
    }
  })

  if (!candidate) {
    throw createError('Candidate not found', 404, 'CANDIDATE_NOT_FOUND')
  }

  const application = await prisma.application.create({
    data: {
      candidateId,
      recruiterId: session.id,
      jobTitle,
      companyName
    },
    include: {
      candidate: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true
        }
      }
    }
  })

  res.json({ application })
}))

// Move application to stage
router.post('/applications/:id/move', asyncHandler(async (req: AuthenticatedRequest, res) => {
  const { id } = req.params
  const { stageId } = z.object({ stageId: z.string() }).parse(req.body)
  const session = req.user!

  // Verify application ownership
  const application = await prisma.application.findFirst({
    where: {
      id,
      recruiterId: session.id
    }
  })

  if (!application) {
    throw createError('Application not found', 404, 'APPLICATION_NOT_FOUND')
  }

  // Verify stage ownership
  const stage = await prisma.pipelineStage.findFirst({
    where: {
      id: stageId,
      recruiterId: session.id
    }
  })

  if (!stage) {
    throw createError('Stage not found', 404, 'STAGE_NOT_FOUND')
  }

  // Create application stage entry
  await prisma.applicationStage.create({
    data: {
      applicationId: id,
      stageId
    }
  })

  res.json({ message: 'Application moved successfully' })
}))

// Update application status
router.put('/applications/:id', asyncHandler(async (req: AuthenticatedRequest, res) => {
  const { id } = req.params
  const { status } = z.object({
    status: z.enum(['NEW', 'SCREENING', 'INTERVIEW', 'OFFER', 'HIRED', 'REJECTED'])
  }).parse(req.body)
  const session = req.user!

  const application = await prisma.application.findFirst({
    where: {
      id,
      recruiterId: session.id
    }
  })

  if (!application) {
    throw createError('Application not found', 404, 'APPLICATION_NOT_FOUND')
  }

  const updatedApplication = await prisma.application.update({
    where: { id },
    data: { status },
    include: {
      candidate: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true
        }
      }
    }
  })

  res.json({ application: updatedApplication })
}))

export { router as pipelineRoutes }
