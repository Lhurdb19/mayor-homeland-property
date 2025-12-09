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
  await sendEmail(email, "Reset Your Password", `<p>Click <a href="${resetUrl}">here</a> to reset your password</p>`);

  res.status(200).json({ message: "Password reset link sent!" });
}
