import { Router } from 'express'
import { z } from 'zod'
import { PrismaClient } from '@prisma/client'
import { AuthenticatedRequest } from '../middleware/auth'
import { createError } from '../middleware/errorHandler'
import { asyncHandler } from '../middleware/errorHandler'
import { checkCandidateLimit } from '../middleware/subscription'

const router = Router()
const prisma = new PrismaClient()

// Validation schemas
const createCandidateSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  location: z.string().optional(),
  experienceLevel: z.string().optional(),
  headline: z.string().optional(),
  summary: z.string().optional(),
  skills: z.array(z.object({
    skillId: z.string(),
    proficiency: z.number().min(1).max(5).optional()
  })).optional()
})

const updateCandidateSchema = createCandidateSchema.partial()

const searchSchema = z.object({
  q: z.string().optional(),
  skills: z.array(z.string()).optional(),
  experienceLevel: z.string().optional(),
  hasDocument: z.boolean().optional(),
  source: z.enum(['MANUAL', 'UPLOAD', 'DRIVE', 'CSV', 'EXCEL', 'AIRTABLE', 'GOOGLE_SHEETS', 'ADMIN_ASSIGN']).optional(),
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(20)
})

// Get candidates (with search)
router.get('/', asyncHandler(async (req: AuthenticatedRequest, res) => {
  const { q, skills, experienceLevel, hasDocument, source, page, limit } = searchSchema.parse(req.query)
  const session = req.user!

  // Build where clause for isolation
  const where: any = {
    ownerRecruiterId: session.id
  }

  // Add search filters
  if (q) {
    where.OR = [
      { firstName: { contains: q, mode: 'insensitive' } },
      { lastName: { contains: q, mode: 'insensitive' } },
      { email: { contains: q, mode: 'insensitive' } },
      { headline: { contains: q, mode: 'insensitive' } },
      { summary: { contains: q, mode: 'insensitive' } }
    ]
  }

  if (experienceLevel) {
    where.experienceLevel = experienceLevel
  }

  if (source) {
    where.source = source
  }

  if (hasDocument !== undefined) {
    if (hasDocument) {
      where.documents = { some: {} }
    } else {
      where.documents = { none: {} }
    }
  }

  // Get candidates with pagination
  const [candidates, total] = await Promise.all([
    prisma.candidate.findMany({
      where,
      include: {
        skills: {
          include: {
            skill: true
          }
        },
        documents: {
          select: {
            id: true,
            originalName: true,
            mimeType: true,
            size: true
          }
        },
        applications: {
          select: {
            id: true,
            jobTitle: true,
            companyName: true,
            status: true
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit
    }),
    prisma.candidate.count({ where })
  ])

  // Filter by skills if provided
  let filteredCandidates = candidates
  if (skills && skills.length > 0) {
    filteredCandidates = candidates.filter(candidate =>
      candidate.skills.some(cs => skills.includes(cs.skill.slug))
    )
  }

  res.json({
    candidates: filteredCandidates,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit)
    }
  })
}))

// Get single candidate
router.get('/:id', asyncHandler(async (req: AuthenticatedRequest, res) => {
  const { id } = req.params
  const session = req.user!

  const candidate = await prisma.candidate.findFirst({
    where: {
      id,
      ownerRecruiterId: session.id
    },
    include: {
      skills: {
        include: {
          skill: true
        }
      },
      documents: true,
      applications: {
        include: {
          stages: {
            include: {
              stage: true
            }
          }
        }
      },
      assignments: {
        include: {
          assignedByAdmin: {
            select: {
              id: true,
              name: true,
              email: true
            }
          }
        }
      }
    }
  })

  if (!candidate) {
    throw createError('Candidate not found', 404, 'CANDIDATE_NOT_FOUND')
  }

  res.json({ candidate })
}))

// Create candidate
router.post('/', checkCandidateLimit, asyncHandler(async (req: AuthenticatedRequest, res) => {
  const data = createCandidateSchema.parse(req.body)
  const session = req.user!

  const candidate = await prisma.candidate.create({
    data: {
      ...data,
      ownerRecruiterId: session.id,
      companyId: session.companyId,
      source: 'MANUAL',
      skills: data.skills ? {
        create: data.skills.map(s => ({
          skillId: s.skillId,
          proficiency: s.proficiency
        }))
      } : undefined
    },
    include: {
      skills: {
        include: {
          skill: true
        }
      }
    }
  })

  res.status(201).json({ candidate })
}))

// Update candidate
router.put('/:id', asyncHandler(async (req: AuthenticatedRequest, res) => {
  const { id } = req.params
  const data = updateCandidateSchema.parse(req.body)
  const session = req.user!

  // Check ownership
  const existing = await prisma.candidate.findFirst({
    where: {
      id,
      ownerRecruiterId: session.id
    }
  })

  if (!existing) {
    throw createError('Candidate not found', 404, 'CANDIDATE_NOT_FOUND')
  }

  const candidate = await prisma.candidate.update({
    where: { id },
    data: {
      ...data,
      skills: data.skills ? {
        deleteMany: {},
        create: data.skills.map(s => ({
          skillId: s.skillId,
          proficiency: s.proficiency
        }))
      } : undefined
    },
    include: {
      skills: {
        include: {
          skill: true
        }
      }
    }
  })

  res.json({ candidate })
}))

// Delete candidate
router.delete('/:id', asyncHandler(async (req: AuthenticatedRequest, res) => {
  const { id } = req.params
  const session = req.user!

  // Check ownership
  const candidate = await prisma.candidate.findFirst({
    where: {
      id,
      ownerRecruiterId: session.id
    }
  })

  if (!candidate) {
    throw createError('Candidate not found', 404, 'CANDIDATE_NOT_FOUND')
  }

  await prisma.candidate.delete({
    where: { id }
  })

  res.json({ message: 'Candidate deleted successfully' })
}))

// Add skill to candidate
router.post('/:id/skills', asyncHandler(async (req: AuthenticatedRequest, res) => {
  const { id } = req.params
  const { skillId, proficiency } = z.object({
    skillId: z.string(),
    proficiency: z.number().min(1).max(5).optional()
  }).parse(req.body)
  const session = req.user!

  // Check ownership
  const candidate = await prisma.candidate.findFirst({
    where: {
      id,
      ownerRecruiterId: session.id
    }
  })

  if (!candidate) {
    throw createError('Candidate not found', 404, 'CANDIDATE_NOT_FOUND')
  }

  const candidateSkill = await prisma.candidateSkill.upsert({
    where: {
      candidateId_skillId: {
        candidateId: id,
        skillId
      }
    },
    update: {
      proficiency
    },
    create: {
      candidateId: id,
      skillId,
      proficiency
    },
    include: {
      skill: true
    }
  })

  res.json({ candidateSkill })
}))

// Remove skill from candidate
router.delete('/:id/skills/:skillId', asyncHandler(async (req: AuthenticatedRequest, res) => {
  const { id, skillId } = req.params
  const session = req.user!

  // Check ownership
  const candidate = await prisma.candidate.findFirst({
    where: {
      id,
      ownerRecruiterId: session.id
    }
  })

  if (!candidate) {
    throw createError('Candidate not found', 404, 'CANDIDATE_NOT_FOUND')
  }

  await prisma.candidateSkill.delete({
    where: {
      candidateId_skillId: {
        candidateId: id,
        skillId
      }
    }
  })

  res.json({ message: 'Skill removed successfully' })
}))

export { router as candidateRoutes }
