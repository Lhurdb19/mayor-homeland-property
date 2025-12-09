// api/properties/featured.ts
import { connectDB } from "@/lib/db";
import Property from "@/models/Property";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectDB();

  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    // Only fetch properties that admin set featured = true
    const featured = await Property.find({ featured: true }).sort({ createdAt: -1 });

    return res.json(featured);
  } catch (error) {
    return res.status(500).json({ message: "Failed to load featured properties" });
  }
}
