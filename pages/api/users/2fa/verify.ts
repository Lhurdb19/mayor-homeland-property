import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import * as speakeasy from "speakeasy";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end();

  await connectDB();
  const session = await getServerSession(req, res, authOptions);
  if (!session) return res.status(401).json({ message: "Unauthorized" });

  const { token, secret } = req.body;

  const verified = speakeasy.totp.verify({
    secret,
    encoding: "base32",
    token,
    window: 1,
  });

  if (!verified)
    return res.status(400).json({ message: "Invalid token" });

  const updatedUser = await User.findByIdAndUpdate(
    session.user.id,
    {
      twoFASecret: secret,
      twoFAEnabled: true,
    },
    { new: true }
  );

  return res.json({
    message: "2FA enabled successfully",
    twoFAEnabled: updatedUser.twoFAEnabled,
  });
}
