import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import compression from 'compression'
import rateLimit from 'express-rate-limit'
import session from 'express-session'
import passport from 'passport'
import dotenv from 'dotenv'
import { PrismaClient } from '@prisma/client'

import { authRoutes } from './routes/auth'
import { candidateRoutes } from './routes/candidates'
import { importRoutes } from './routes/imports'
import { adminRoutes } from './routes/admin'
import { userRoutes } from './routes/users'
import { searchRoutes } from './routes/search'
import { pipelineRoutes } from './routes/pipeline'
import { notificationRoutes } from './routes/notifications'

import { setupPassport } from './config/passport'
import { errorHandler } from './middleware/errorHandler'
import { authMiddleware } from './middleware/auth'
import { subscriptionMiddleware } from './middleware/subscription'

dotenv.config()

const app = express()
const prisma = new PrismaClient()

// Security middleware
app.use(helmet())
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://your-domain.com'] 
    : ['http://localhost:5173'],
  credentials: true
}))

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'), // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'),
  message: 'Too many requests from this IP, please try again later.'
})
app.use('/api/', limiter)

// Body parsing
app.use(compression())
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true }))

// Session configuration
app.use(session({
  secret: process.env.SESSION_SECRET || 'fallback-secret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}))

// Passport setup
app.use(passport.initialize())
app.use(passport.session())
setupPassport()

// Health check
app.get('/healthz', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// API routes
app.use('/api/auth', authRoutes)
app.use('/api/candidates', authMiddleware, candidateRoutes)
app.use('/api/imports', authMiddleware, importRoutes)
app.use('/api/admin', authMiddleware, adminRoutes)
app.use('/api/users', authMiddleware, userRoutes)
app.use('/api/search', authMiddleware, searchRoutes)
app.use('/api/pipeline', authMiddleware, pipelineRoutes)
app.use('/api/notifications', authMiddleware, notificationRoutes)

// Subscription check for protected routes
app.use('/api/candidates', subscriptionMiddleware)
app.use('/api/imports', subscriptionMiddleware)
app.use('/api/pipeline', subscriptionMiddleware)

// Error handling
app.use(errorHandler)

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' })
})

const PORT = process.env.PORT || 3000

async function startServer() {
  try {
    await prisma.$connect()
    console.log('✅ Database connected')
    
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`)
      console.log(`📊 Environment: ${process.env.NODE_ENV}`)
    })
  } catch (error) {
    console.error('❌ Failed to start server:', error)
    process.exit(1)
  }
}

startServer()

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('🛑 SIGTERM received, shutting down gracefully')
  await prisma.$disconnect()
  process.exit(0)
})

process.on('SIGINT', async () => {
  console.log('🛑 SIGINT received, shutting down gracefully')
  await prisma.$disconnect()
  process.exit(0)
})

export { app, prisma }
