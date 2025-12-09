import type { NextApiRequest, NextApiResponse } from "next";
import { connectDB } from "@/lib/db";
import Newsletter from "@/models/Newsletter";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    await connectDB();
    const newsletters = await Newsletter.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: newsletters });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
}
