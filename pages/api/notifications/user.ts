// pages/api/notifications/user.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { connectDB } from "@/lib/db";
import Notification from "@/models/Notification";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectDB();

  const session = await getServerSession(req, res, authOptions);
  if (!session) return res.status(401).json({ message: "Unauthorized" });

  const userId = session.user.id;

  if (req.method === "GET") {
    // fetch only notifications for this user
    const notifications = await Notification.find({
      recipientType: "user",
      recipient: userId,
    }).sort({ createdAt: -1 });

    return res.status(200).json(notifications);
  }

  return res.status(405).json({ message: "Method not allowed" });
}
