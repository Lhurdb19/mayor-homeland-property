// pages/api/auth/forgot.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import crypto from "crypto";
import { sendEmail } from "@/lib/mail";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).json({ message: "Method not allowed" });

  await connectDB();
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ message: "Email not found" });

  // Generate token
  const resetToken = crypto.randomBytes(32).toString("hex");
  user.resetToken = resetToken;
  user.resetTokenExpiry = Date.now() + 1000 * 60 * 60; // 1 hour
  await user.save();

  const resetUrl = `${process.env.NEXTAUTH_URL}/auth/reset/${resetToken}`;

  // Polished email body
  const bodyHtml = `
    <h2 style="text-align:center; color:#0070f3;">Hello ${user.firstName},</h2>
    <p style="text-align:center;">We received a request to reset your password. Click the button below to reset it. This link is valid for 1 hour.</p>
    <p style="text-align:center; margin: 20px 0;">
      <a href="${resetUrl}" style="padding:12px 25px; background-color:#0070f3; color:white; text-decoration:none; border-radius:6px; font-weight:bold;">Reset Password</a>
    </p>
  `;

  await sendEmail(email, "Reset Your Password", bodyHtml);

  res.status(200).json({ message: "Password reset link sent!" });
}
