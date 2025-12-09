import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]";
import { connectDB } from "@/lib/db";
import User from "@/models/User";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "PUT") return res.status(405).end();

  await connectDB();
  const session = await getServerSession(req, res, authOptions);
  if (!session) return res.status(401).json({ message: "Unauthorized" });

  await User.findByIdAndUpdate(session.user.id, {
    twoFASecret: null,
    twoFAEnabled: false,
  });

  return res.json({ message: "2FA disabled" });
}
