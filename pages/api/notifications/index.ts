// pages/api/notifications/index.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import { connectDB } from "@/lib/db";
import Notification from "@/models/Notification";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectDB();
  const session = await getServerSession(req, res, authOptions);
  if (!session) return res.status(401).json({ message: "Unauthorized" });

  const recipientType = session.user.role === "admin" ? "admin" : "user";

  if (req.method === "GET") {
    const notifications = await Notification.find({
      recipientType,
      recipient: session.user.role === "admin" ? undefined : session.user.id,
    })
      .sort({ createdAt: -1 })
      .limit(20);

    return res.status(200).json(notifications);
  }

  return res.status(405).json({ message: "Method not allowed" });
}
