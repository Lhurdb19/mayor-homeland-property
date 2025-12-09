import crypto from "crypto";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { sendEmail } from "@/lib/mail";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).json({ message: "Method not allowed" });

  await connectDB();
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ message: "Email not found" });

  // ✅ generate a secure token
  const resetToken = crypto.randomBytes(32).toString("hex");
  user.resetToken = resetToken;
  user.resetTokenExpiry = Date.now() + 1000 * 60 * 60; // 1 hour
  await user.save();

  const resetUrl = `${process.env.NEXTAUTH_URL}/auth/reset/${resetToken}`;

  await sendEmail(
    email,
    "Reset Your Password",
    `<h2>Hello ${user.firstName},</h2>
     <p>Click the button below to reset your password. This link expires in 1 hour.</p>
     <p style="text-align:center; margin:20px 0;">
       <a href="${resetUrl}" style="display:inline-block; padding:10px 20px; background-color:#0070f3; color:white; text-decoration:none; border-radius:5px;">Reset Password</a>
     </p>`
  );

  res.status(200).json({ message: "Password reset link sent!" });
}
