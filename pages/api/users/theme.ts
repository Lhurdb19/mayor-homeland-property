import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";
import { connectDB } from "@/lib/db";
import User from "@/models/User";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "PUT") return res.status(405).end();

  await connectDB();

  const session = await getServerSession(req, res, authOptions);
  if (!session) return res.status(401).json({ message: "Unauthorized" });

  const { theme } = req.body;

  if (!["light", "dark", "system"].includes(theme))
    return res.status(400).json({ message: "Invalid theme" });

  await User.findByIdAndUpdate(session.user.id, { theme });

  return res.json({ message: "Theme updated" });
}
