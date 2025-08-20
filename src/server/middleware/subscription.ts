import { Request, Response, NextFunction } from 'express'
import { PrismaClient } from '@prisma/client'
import { AuthenticatedRequest } from './auth'

const prisma = new PrismaClient()

export const subscriptionMiddleware = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ error: 'Authentication required' })
    }

    // Get active subscription
    const subscription = await prisma.subscription.findFirst({
      where: {
        OR: [
          { userId: req.user.id },
          { companyId: req.user.companyId }
        ],
        status: { in: ['active', 'trialing'] }
      },
      include: {
        plan: true
      },
      orderBy: { createdAt: 'desc' }
    })

    // Check if user has active subscription or is in trial
    if (!subscription) {
      return res.status(402).json({ 
        error: 'Payment required',
        code: 'SUBSCRIPTION_REQUIRED'
      })
    }

    // Check trial expiry
    if (subscription.status === 'trialing' && subscription.trialEndsAt) {
      if (subscription.trialEndsAt < new Date()) {
        return res.status(402).json({ 
          error: 'Trial expired',
          code: 'TRIAL_EXPIRED',
          trialEndsAt: subscription.trialEndsAt
        })
      }
    }

    // Check if subscription is past due
    if (subscription.status === 'past_due') {
      return res.status(402).json({ 
        error: 'Payment past due',
        code: 'PAYMENT_PAST_DUE'
      })
    }

    // Add subscription info to request
    req.subscription = subscription
    next()
  } catch (error) {
    console.error('Subscription middleware error:', error)
    res.status(500).json({ error: 'Subscription check failed' })
  }
}

export const checkCandidateLimit = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ error: 'Authentication required' })
    }

    // Count current candidates
    const candidateCount = await prisma.candidate.count({
      where: {
        ownerRecruiterId: req.user.id
      }
    })

    const freeLimit = parseInt(process.env.FREE_CANDIDATE_LIMIT || '200')
    
    if (candidateCount >= freeLimit) {
      return res.status(402).json({ 
        error: 'Candidate limit reached',
        code: 'CANDIDATE_LIMIT_REACHED',
        current: candidateCount,
        limit: freeLimit
      })
    }

    next()
  } catch (error) {
    console.error('Candidate limit check error:', error)
    res.status(500).json({ error: 'Limit check failed' })
  }
}

export const checkImportLimit = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ error: 'Authentication required' })
    }

    // Check daily import limit
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    const todayImports = await prisma.importJob.count({
      where: {
        source: {
          userId: req.user.id
        },
        createdAt: {
          gte: today,
          lt: tomorrow
        }
      }
    })

    const dailyLimit = parseInt(process.env.DAILY_IMPORT_LIMIT || '300')
    
    if (todayImports >= dailyLimit) {
      return res.status(429).json({ 
        error: 'Daily import limit reached',
        code: 'DAILY_IMPORT_LIMIT_REACHED',
        current: todayImports,
        limit: dailyLimit
      })
    }

    next()
  } catch (error) {
    console.error('Import limit check error:', error)
    res.status(500).json({ error: 'Limit check failed' })
  }
}
