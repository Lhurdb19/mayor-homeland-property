// pages/api/notifications/[id].ts
import type { NextApiRequest, NextApiResponse } from "next";
import { connectDB } from "@/lib/db";
import Notification from "@/models/Notification";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectDB();
  const { id } = req.query;

  if (req.method === "PUT") {
    const notification = await Notification.findByIdAndUpdate(id, { read: true }, { new: true });
    return res.status(200).json(notification);
  }

  if (req.method === "DELETE") {
    await Notification.findByIdAndDelete(id);
    return res.status(200).json({ message: "Deleted" });
  }

  return res.status(405).json({ message: "Method not allowed" });
}
