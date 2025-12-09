import type { NextApiRequest, NextApiResponse } from "next";
import { connectDB } from "@/lib/db";
import Property from "@/models/Property";
import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectDB();
  const { id } = req.query;

  if (req.method !== "POST") return res.status(405).json({ message: "Method not allowed" });

  try {
    const session = await getServerSession(req, res, authOptions);

    const { rating, comment, name: guestName } = req.body;

    if (!rating || !comment) return res.status(400).json({ message: "Missing fields" });

    const property = await Property.findById(id);
    if (!property) return res.status(404).json({ message: "Property not found" });

    // Determine reviewer
    const reviewerName = session?.user?.name || guestName || "Anonymous";
    const reviewerId = session?.user?.id || null;

    // Prevent duplicate review for logged-in users
    if (reviewerId) {
      const existingReview = property.reviews.find(r => r.user?.toString() === reviewerId);
      if (existingReview) return res.status(400).json({ message: "You already reviewed this property" });
    }

    property.reviews.push({
      user: reviewerId,
      name: reviewerName,
      rating,
      comment,
      createdAt: new Date(),
    });

    await property.save();

    return res.status(201).json({ reviews: property.reviews });

  } catch (error) {
    console.error("Review Error:", error);
    return res.status(500).json({ message: "Server error" });
  }
}
