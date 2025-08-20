import { Router } from 'express'
import { z } from 'zod'
import { PrismaClient } from '@prisma/client'
import { AuthenticatedRequest } from '../middleware/auth'
import { createError } from '../middleware/errorHandler'
import { asyncHandler } from '../middleware/errorHandler'
import { checkImportLimit } from '../middleware/subscription'

const router = Router()
const prisma = new PrismaClient()

// Validation schemas
const createImportSourceSchema = z.object({
  kind: z.enum(['GOOGLE_DRIVE', 'AIRTABLE', 'GOOGLE_SHEETS', 'CSV', 'EXCEL']),
  externalKey: z.string().optional(),
  meta: z.record(z.any()).optional()
})

const startImportSchema = z.object({
  sourceId: z.string(),
  options: z.record(z.any()).optional()
})

// Get import sources
router.get('/sources', asyncHandler(async (req: AuthenticatedRequest, res) => {
  const session = req.user!

  const sources = await prisma.importSource.findMany({
    where: { userId: session.id },
    include: {
      jobs: {
        orderBy: { createdAt: 'desc' },
        take: 5
      }
    },
    orderBy: { createdAt: 'desc' }
  })

  res.json({ sources })
}))

// Create import source
router.post('/sources', asyncHandler(async (req: AuthenticatedRequest, res) => {
  const data = createImportSourceSchema.parse(req.body)
  const session = req.user!

  const source = await prisma.importSource.create({
    data: {
      ...data,
      userId: session.id
    }
  })

  res.status(201).json({ source })
}))

// Get import jobs
router.get('/jobs', asyncHandler(async (req: AuthenticatedRequest, res) => {
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
}))

// Start import job
router.post('/jobs', checkImportLimit, asyncHandler(async (req: AuthenticatedRequest, res) => {
  const { sourceId, options } = startImportSchema.parse(req.body)
  const session = req.user!

  // Verify source ownership
  const source = await prisma.importSource.findFirst({
    where: {
      id: sourceId,
      userId: session.id
    }
  })

  if (!source) {
    throw createError('Import source not found', 404, 'SOURCE_NOT_FOUND')
  }

  const job = await prisma.importJob.create({
    data: {
      sourceId,
      status: 'PENDING'
    },
    include: {
      source: true
    }
  })

  // TODO: Queue background job for processing
  // await queueImportJob(job.id, source, options)

  res.status(201).json({ job })
}))

// Get import job status
router.get('/jobs/:id', asyncHandler(async (req: AuthenticatedRequest, res) => {
  const { id } = req.params
  const session = req.user!

  const job = await prisma.importJob.findFirst({
    where: {
      id,
      source: {
        userId: session.id
      }
    },
    include: {
      source: true
    }
  })

  if (!job) {
    throw createError('Import job not found', 404, 'JOB_NOT_FOUND')
  }

  res.json({ job })
}))

// Google Drive specific routes
router.post('/drive/connect', asyncHandler(async (req: AuthenticatedRequest, res) => {
  // TODO: Implement Google Drive OAuth flow
  res.json({ message: 'Google Drive connection initiated' })
}))

router.post('/drive/folder', asyncHandler(async (req: AuthenticatedRequest, res) => {
  const { folderId } = z.object({ folderId: z.string() }).parse(req.body)
  const session = req.user!

  const source = await prisma.importSource.create({
    data: {
      userId: session.id,
      kind: 'GOOGLE_DRIVE',
      externalKey: folderId,
      meta: { folderId }
    }
  })

  res.json({ source })
}))

// Airtable specific routes
router.post('/airtable/connect', asyncHandler(async (req: AuthenticatedRequest, res) => {
  const { apiKey, baseId, tableId, columnMap } = z.object({
    apiKey: z.string(),
    baseId: z.string(),
    tableId: z.string(),
    columnMap: z.record(z.string())
  }).parse(req.body)
  const session = req.user!

  const source = await prisma.importSource.create({
    data: {
      userId: session.id,
      kind: 'AIRTABLE',
      externalKey: `${baseId}/${tableId}`,
      meta: { apiKey, baseId, tableId, columnMap }
    }
  })

  res.json({ source })
}))

// Google Sheets specific routes
router.post('/sheets/connect', asyncHandler(async (req: AuthenticatedRequest, res) => {
  const { spreadsheetId, range, columnMap } = z.object({
    spreadsheetId: z.string(),
    range: z.string(),
    columnMap: z.record(z.string())
  }).parse(req.body)
  const session = req.user!

  const source = await prisma.importSource.create({
    data: {
      userId: session.id,
      kind: 'GOOGLE_SHEETS',
      externalKey: spreadsheetId,
      meta: { spreadsheetId, range, columnMap }
    }
  })

  res.json({ source })
}))

// CSV/Excel upload
router.post('/upload', asyncHandler(async (req: AuthenticatedRequest, res) => {
  // TODO: Implement file upload and parsing
  res.json({ message: 'File upload endpoint' })
}))

export { router as importRoutes }
