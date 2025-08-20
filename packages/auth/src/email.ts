import nodemailer from "nodemailer";
import { env } from "@amy/config";

// Create transporter
const transporter = nodemailer.createTransport({
  host: env.SMTP_HOST,
  port: env.SMTP_PORT,
  secure: false, // true for 465, false for other ports
  auth: {
    user: env.SMTP_USER,
    pass: env.SMTP_PASS,
  },
});

export async function sendPasswordResetEmail(
  email: string,
  token: string
): Promise<void> {
  const resetUrl = `${
    process.env.FRONTEND_URL || "http://localhost:5173"
  }/reset-password?token=${token}`;

  const mailOptions = {
    from: env.SMTP_FROM,
    to: email,
    subject: "Reset Your Amy Password",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #e11d48;">Reset Your Password</h2>
        <p>Hello,</p>
        <p>You requested to reset your password for your Amy account.</p>
        <p>Click the button below to reset your password:</p>
        <a href="${resetUrl}" 
           style="display: inline-block; background-color: #e11d48; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0;">
          Reset Password
        </a>
        <p>Or copy and paste this link into your browser:</p>
        <p style="word-break: break-all; color: #666;">${resetUrl}</p>
        <p>This link will expire in 1 hour.</p>
        <p>If you didn't request this password reset, please ignore this email.</p>
        <p>Best regards,<br>The Amy Team</p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
}
