import { Request, Response, NextFunction } from 'express'
import { Prisma } from '@prisma/client'

export interface AppError extends Error {
  statusCode?: number
  code?: string
  isOperational?: boolean
}

export const errorHandler = (
  error: AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error('Error:', {
    message: error.message,
    stack: error.stack,
    url: req.url,
    method: req.method,
    timestamp: new Date().toISOString()
  })

  // Prisma errors
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    switch (error.code) {
      case 'P2002':
        return res.status(409).json({
          error: 'Resource already exists',
          code: 'DUPLICATE_ENTRY'
        })
      case 'P2025':
        return res.status(404).json({
          error: 'Resource not found',
          code: 'NOT_FOUND'
        })
      case 'P2003':
        return res.status(400).json({
          error: 'Invalid reference',
          code: 'FOREIGN_KEY_CONSTRAINT'
        })
      default:
        return res.status(400).json({
          error: 'Database error',
          code: 'DATABASE_ERROR'
        })
    }
  }

  if (error instanceof Prisma.PrismaClientValidationError) {
    return res.status(400).json({
      error: 'Validation error',
      code: 'VALIDATION_ERROR',
      details: error.message
    })
  }

  // JWT errors
  if (error.name === 'JsonWebTokenError') {
    return res.status(401).json({
      error: 'Invalid token',
      code: 'INVALID_TOKEN'
    })
  }

  if (error.name === 'TokenExpiredError') {
    return res.status(401).json({
      error: 'Token expired',
      code: 'TOKEN_EXPIRED'
    })
  }

  // Rate limit errors
  if (error.statusCode === 429) {
    return res.status(429).json({
      error: 'Too many requests',
      code: 'RATE_LIMIT_EXCEEDED'
    })
  }

  // Custom operational errors
  if (error.isOperational) {
    return res.status(error.statusCode || 400).json({
      error: error.message,
      code: error.code || 'OPERATIONAL_ERROR'
    })
  }

  // Default error response
  const statusCode = error.statusCode || 500
  const message = statusCode === 500 
    ? 'Internal server error' 
    : error.message

  res.status(statusCode).json({
    error: message,
    code: error.code || 'INTERNAL_ERROR',
    ...(process.env.NODE_ENV === 'development' && {
      stack: error.stack
    })
  })
}

export const createError = (
  message: string,
  statusCode: number = 400,
  code?: string
): AppError => {
  const error = new Error(message) as AppError
  error.statusCode = statusCode
  error.code = code
  error.isOperational = true
  return error
}

export const asyncHandler = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next)
  }
}
