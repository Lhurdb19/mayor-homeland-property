// pages/api/contact/get.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { connectDB } from "@/lib/db";
import Contact from "@/models/Contact";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectDB();

  if (req.method === "GET") {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    return res.status(200).json({ data: contacts });
  }

  return res.status(405).json({ message: "Method not allowed" });
}
