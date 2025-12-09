import type { NextApiRequest, NextApiResponse } from "next";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).json({ message: "Method not allowed" });

  await connectDB();
  const { token, password } = req.body;

  const user = await User.findOne({ resetToken: token, resetTokenExpiry: { $gt: Date.now() } });
  if (!user) return res.status(400).json({ message: "Invalid or expired token" });

  user.password = await bcrypt.hash(password, 12);
  user.resetToken = undefined;
  user.resetTokenExpiry = undefined;

  await user.save();
  res.status(200).json({ message: "Password reset successful" });
}
