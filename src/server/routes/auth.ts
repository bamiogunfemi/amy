import { Router } from 'express'
import passport from 'passport'
import { z } from 'zod'
import { PrismaClient } from '@prisma/client'
import { hashPassword } from '../config/passport'
import { createError } from '../middleware/errorHandler'
import { asyncHandler } from '../middleware/errorHandler'

const router = Router()
const prisma = new PrismaClient()

// Validation schemas
const signupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().min(1),
  role: z.enum(['RECRUITER', 'ADMIN']).default('RECRUITER'),
  companyName: z.string().optional(),
  companySlug: z.string().optional()
})

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string()
})

// Signup
router.post('/signup', asyncHandler(async (req, res) => {
  const { email, password, name, role, companyName, companySlug } = signupSchema.parse(req.body)

  // Check if user already exists
  const existingUser = await prisma.user.findUnique({
    where: { email }
  })

  if (existingUser) {
    throw createError('User already exists', 409, 'USER_EXISTS')
  }

  // Create company if provided
  let companyId: string | undefined
  if (companyName && companySlug) {
    const company = await prisma.company.create({
      data: {
        name: companyName,
        slug: companySlug
      }
    })
    companyId = company.id
  }

  // Hash password
  const hashedPassword = await hashPassword(password)

  // Create user
  const user = await prisma.user.create({
    data: {
      email,
      hash: hashedPassword,
      name,
      role,
      companyId
    },
    include: {
      company: true,
      status: true
    }
  })

  // Create trial subscription
  const trialDays = parseInt(process.env.TRIAL_DAYS_DEFAULT || '14')
  const trialEndsAt = new Date()
  trialEndsAt.setDate(trialEndsAt.getDate() + trialDays)

  await prisma.subscription.create({
    data: {
      userId: companyId ? undefined : user.id,
      companyId,
      planId: 'free-trial', // You'll need to create this plan
      status: 'trialing',
      trialEndsAt
    }
  })

  // Auto-login
  req.login(user, (err) => {
    if (err) {
      throw createError('Login failed', 500, 'LOGIN_FAILED')
    }
    res.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        companyId: user.companyId
      }
    })
  })
}))

// Login
router.post('/login', asyncHandler(async (req, res) => {
  const { email, password } = loginSchema.parse(req.body)

  passport.authenticate('local', (err: any, user: any, info: any) => {
    if (err) {
      throw createError('Authentication error', 500, 'AUTH_ERROR')
    }

    if (!user) {
      throw createError(info?.message || 'Invalid credentials', 401, 'INVALID_CREDENTIALS')
    }

    req.login(user, (loginErr) => {
      if (loginErr) {
        throw createError('Login failed', 500, 'LOGIN_FAILED')
      }

      res.json({
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          companyId: user.companyId
        }
      })
    })
  })(req, res)
}))

// Google OAuth
router.get('/google', passport.authenticate('google', {
  scope: ['profile', 'email']
}))

router.get('/google/callback', 
  passport.authenticate('google', { failureRedirect: '/login' }),
  (req, res) => {
    // Redirect to frontend with success
    res.redirect('/auth/success')
  }
)

// Logout
router.post('/logout', (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({ error: 'Logout failed' })
    }
    res.json({ message: 'Logged out successfully' })
  })
})

// Get current user
router.get('/me', (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ error: 'Not authenticated' })
  }

  const user = req.user as any
  res.json({
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      companyId: user.companyId
    }
  })
})

// Check authentication status
router.get('/status', (req, res) => {
  res.json({
    authenticated: req.isAuthenticated(),
    user: req.isAuthenticated() ? {
      id: (req.user as any).id,
      email: (req.user as any).email,
      name: (req.user as any).name,
      role: (req.user as any).role,
      companyId: (req.user as any).companyId
    } : null
  })
})

export { router as authRoutes }
