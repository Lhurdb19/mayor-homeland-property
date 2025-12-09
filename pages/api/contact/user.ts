// pages/api/contact/user.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { connectDB } from "@/lib/db";
import Contact from "@/models/Contact";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectDB();

  const session = await getServerSession(req, res, authOptions);
  if (!session) return res.status(401).json({ message: "Unauthorized" });

  if (req.method === "GET") {
    try {
      const contacts = await Contact.find({ userId: session.user.id }).sort({ createdAt: -1 });
      return res.status(200).json({ data: contacts });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Server error" });
    }
  }

  return res.status(405).json({ message: "Method not allowed" });
}
