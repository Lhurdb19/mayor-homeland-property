import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "PUT") return res.status(405).end();

  await connectDB();

  const session = await getServerSession(req, res, authOptions);
  if (!session) return res.status(401).json({ message: "Unauthorized" });

  const { oldPassword, newPassword } = req.body;

  if (!oldPassword || !newPassword)
    return res.status(400).json({ message: "Missing fields" });

  const user = await User.findById(session.user.id).select("+password");
  if (!user) return res.status(404).json({ message: "User not found" });

  const isMatch = await bcrypt.compare(oldPassword, user.password);
  if (!isMatch)
    return res.status(400).json({ message: "Old password incorrect" });

  if (newPassword.length < 6)
    return res.status(400).json({ message: "New password too short" });

  const hashed = await bcrypt.hash(newPassword, 10);

  await User.findByIdAndUpdate(user._id, { password: hashed });

  return res.json({ message: "Password updated successfully" });
}
