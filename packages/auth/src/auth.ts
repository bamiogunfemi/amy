import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { PrismaClient, User, Company } from "@amy/db";
import { env } from "@amy/config";
import {
  AuthUser,
  LoginRequest,
  SignupRequest,
  AuthResponse,
  PasswordResetToken,
  ChangePasswordRequest,
} from "./types";
import { sendPasswordResetEmail } from "./email";

interface JwtPayload {
  userId: string;
  email: string;
  role: string;
  companyId?: string;
  iat: number;
  exp: number;
}

export class AuthService {
  public prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  private hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 12);
  }

  private comparePassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  private generateAccessToken(user: AuthUser): string {
    return jwt.sign(
      {
        userId: user.id,
        email: user.email,
        role: user.role,
        companyId: user.companyId,
      },
      env.JWT_SECRET,
      { expiresIn: "15m" }
    );
  }

  async verifyToken(token: string): Promise<AuthUser> {
    try {
      const decoded = jwt.verify(token, env.JWT_SECRET) as JwtPayload;

      const user = await this.prisma.user.findUnique({
        where: { id: decoded.userId },
        include: { company: true, status: true },
      });

      if (!user) {
        throw new Error("User not found");
      }

      if (user.status?.isBlocked || user.status?.isDeleted) {
        throw new Error("Account is blocked or deleted");
      }

      return this.mapUserToAuthUser(user);
    } catch (error) {
      throw new Error("Invalid token");
    }
  }

  private generateRefreshToken(): string {
    return crypto.randomBytes(40).toString("hex");
  }

  private async saveRefreshToken(userId: string, token: string): Promise<void> {
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30); // 30 days

    await this.prisma.refreshToken.create({
      data: {
        token,
        userId,
        expiresAt,
      },
    });
  }

  private mapUserToAuthUser(
    user: User & {
      company?: Company;
      status?: { isBlocked: boolean; isDeleted: boolean };
    }
  ): AuthUser {
    const userStatus = user.status;
    const isBlocked = userStatus?.isBlocked || false;
    const isDeleted = userStatus?.isDeleted || false;

    let status: "ACTIVE" | "BLOCKED" | "DELETED" = "ACTIVE";
    if (isDeleted) status = "DELETED";
    else if (isBlocked) status = "BLOCKED";

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role as "ADMIN" | "RECRUITER",
      companyId: user.companyId || undefined,
      company: user.company || undefined,
      status,
      trialEndsAt: undefined, // Will be handled by subscription
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  async login(credentials: LoginRequest): Promise<AuthResponse> {
    const user = await this.prisma.user.findUnique({
      where: { email: credentials.email },
      include: { company: true, status: true },
    });

    if (!user) {
      throw new Error("Invalid email or password");
    }

    if (user.status?.isBlocked || user.status?.isDeleted) {
      throw new Error("Account is blocked or deleted");
    }

    const isValidPassword = await this.comparePassword(
      credentials.password,
      user.hash
    );

    if (!isValidPassword) {
      throw new Error("Invalid email or password");
    }

    const authUser = this.mapUserToAuthUser(user);
    const accessToken = this.generateAccessToken(authUser);
    const refreshToken = this.generateRefreshToken();

    await this.saveRefreshToken(user.id, refreshToken);

    return {
      user: authUser,
      accessToken,
      refreshToken,
    };
  }

  async refreshToken(refreshToken: string): Promise<AuthResponse> {
    const tokenRecord = await this.prisma.refreshToken.findUnique({
      where: { token: refreshToken },
      include: {
        user: {
          include: { company: true, status: true },
        },
      },
    });

    if (!tokenRecord || tokenRecord.expiresAt < new Date()) {
      throw new Error("Invalid refresh token");
    }

    if (
      tokenRecord.user.status?.isBlocked ||
      tokenRecord.user.status?.isDeleted
    ) {
      throw new Error("Account is blocked or deleted");
    }

    const authUser = this.mapUserToAuthUser(tokenRecord.user);
    const newAccessToken = this.generateAccessToken(authUser);
    const newRefreshToken = this.generateRefreshToken();

    await this.prisma.refreshToken.delete({
      where: { id: tokenRecord.id },
    });
    await this.saveRefreshToken(tokenRecord.user.id, newRefreshToken);

    return {
      user: authUser,
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    };
  }

  async logout(accessToken: string): Promise<void> {
    try {
      const decoded = jwt.verify(accessToken, env.JWT_SECRET) as JwtPayload;

      // Delete all refresh tokens for this user
      await this.prisma.refreshToken.deleteMany({
        where: { userId: decoded.userId },
      });
    } catch (error) {
      // Token is invalid, but we still want to clean up
      console.warn("Invalid token during logout:", error);
    }
  }

  async signup(data: SignupRequest): Promise<AuthResponse> {
    // Check if user already exists
    const existingUser = await this.prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existingUser) {
      throw new Error("User already exists");
    }

    // Create or find company if provided
    let companyId: string | undefined;
    if (data.companyName && data.companySlug) {
      const company = await this.prisma.company.upsert({
        where: { slug: data.companySlug },
        update: {},
        create: {
          name: data.companyName,
          slug: data.companySlug,
        },
      });
      companyId = company.id;
    }

    // Hash password
    const hashedPassword = await this.hashPassword(data.password);

    // Create user
    const user = await this.prisma.user.create({
      data: {
        email: data.email,
        hash: hashedPassword,
        name: data.name,
        role: data.role,
        companyId,
        status: {
          create: {
            isBlocked: false,
            isDeleted: false,
          },
        },
      },
      include: { company: true, status: true },
    });

    const authUser = this.mapUserToAuthUser(user);
    const accessToken = this.generateAccessToken(authUser);
    const refreshToken = this.generateRefreshToken();

    await this.saveRefreshToken(user.id, refreshToken);

    return {
      user: authUser,
      accessToken,
      refreshToken,
    };
  }

  async resetPassword(email: string): Promise<void> {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      // Don't reveal if user exists
      return;
    }

    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 1); // 1 hour

    await this.prisma.passwordResetToken.create({
      data: {
        token,
        userId: user.id,
        expiresAt,
      },
    });

    await sendPasswordResetEmail(user.email, token);
  }

  async verifyResetToken(token: string): Promise<void> {
    const resetToken = await this.prisma.passwordResetToken.findUnique({
      where: { token },
    });

    if (!resetToken || resetToken.expiresAt < new Date()) {
      throw new Error("Invalid or expired reset token");
    }
  }

  async setNewPassword(token: string, newPassword: string): Promise<void> {
    const resetToken = await this.prisma.passwordResetToken.findUnique({
      where: { token },
    });

    if (!resetToken || resetToken.expiresAt < new Date()) {
      throw new Error("Invalid or expired reset token");
    }

    const hashedPassword = await this.hashPassword(newPassword);

    await this.prisma.user.update({
      where: { id: resetToken.userId },
      data: { hash: hashedPassword },
    });

    await this.prisma.passwordResetToken.delete({
      where: { id: resetToken.id },
    });
  }

  async changePassword(
    userId: string,
    data: ChangePasswordRequest
  ): Promise<void> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new Error("User not found");
    }

    const isValidCurrentPassword = await this.comparePassword(
      data.currentPassword,
      user.hash
    );

    if (!isValidCurrentPassword) {
      throw new Error("Current password is incorrect");
    }

    const hashedNewPassword = await this.hashPassword(data.newPassword);

    await this.prisma.user.update({
      where: { id: userId },
      data: { hash: hashedNewPassword },
    });
  }
}
