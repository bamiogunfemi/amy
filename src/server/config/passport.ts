import passport from 'passport'
import { Strategy as LocalStrategy } from 'passport-local'
import { Strategy as GoogleStrategy } from 'passport-google-oauth20'
import bcrypt from 'bcryptjs'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export const setupPassport = () => {
  // Local strategy
  passport.use(new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'password'
    },
    async (email, password, done) => {
      try {
        const user = await prisma.user.findUnique({
          where: { email },
          include: {
            status: true
          }
        })

        if (!user) {
          return done(null, false, { message: 'Invalid credentials' })
        }

        if (user.status?.isBlocked) {
          return done(null, false, { message: 'Account is blocked' })
        }

        if (user.status?.isDeleted) {
          return done(null, false, { message: 'Account is deleted' })
        }

        if (!user.hash) {
          return done(null, false, { message: 'Invalid credentials' })
        }

        const isValidPassword = await bcrypt.compare(password, user.hash)
        if (!isValidPassword) {
          return done(null, false, { message: 'Invalid credentials' })
        }

        return done(null, user)
      } catch (error) {
        return done(error)
      }
    }
  ))

  // Google OAuth strategy
  passport.use(new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: process.env.GOOGLE_REDIRECT_URI!,
      scope: ['profile', 'email']
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails?.[0]?.value
        if (!email) {
          return done(null, false, { message: 'Email not provided by Google' })
        }

        // Check if user exists
        let user = await prisma.user.findUnique({
          where: { email },
          include: {
            status: true,
            oauth: {
              where: { provider: 'google' }
            }
          }
        })

        if (user) {
          // Update or create OAuth token
          await prisma.oAuthToken.upsert({
            where: {
              userId_provider: {
                userId: user.id,
                provider: 'google'
              }
            },
            update: {
              accessToken,
              refreshToken,
              expiresAt: new Date(Date.now() + 3600 * 1000) // 1 hour
            },
            create: {
              userId: user.id,
              provider: 'google',
              accessToken,
              refreshToken,
              expiresAt: new Date(Date.now() + 3600 * 1000)
            }
          })

          return done(null, user)
        }

        // Create new user
        user = await prisma.user.create({
          data: {
            email,
            name: profile.displayName,
            role: 'RECRUITER', // Default role
            oauth: {
              create: {
                provider: 'google',
                accessToken,
                refreshToken,
                expiresAt: new Date(Date.now() + 3600 * 1000)
              }
            }
          },
          include: {
            status: true
          }
        })

        return done(null, user)
      } catch (error) {
        return done(error)
      }
    }
  ))

  // Serialize user
  passport.serializeUser((user: any, done) => {
    done(null, user.id)
  })

  // Deserialize user
  passport.deserializeUser(async (id: string, done) => {
    try {
      const user = await prisma.user.findUnique({
        where: { id },
        include: {
          status: true
        }
      })
      done(null, user)
    } catch (error) {
      done(error)
    }
  })
}

export const hashPassword = async (password: string): Promise<string> => {
  const saltRounds = 12
  return bcrypt.hash(password, saltRounds)
}

export const comparePassword = async (password: string, hash: string): Promise<boolean> => {
  return bcrypt.compare(password, hash)
}
