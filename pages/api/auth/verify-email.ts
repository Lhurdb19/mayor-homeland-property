import type { NextApiRequest, NextApiResponse } from "next";
import { connectDB } from "@/lib/db";
import User from "@/models/User";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { token } = req.query;
  if (!token || typeof token !== "string") return res.status(400).send("Invalid verification link");

  await connectDB();
  const user = await User.findOne({ emailVerificationToken: token });
  if (!user) return res.status(400).send("Invalid or expired verification link");

  user.isVerified = true;
  user.emailVerificationToken = undefined;
  await user.save();

  res.status(200).send("Verified successfully");
}
