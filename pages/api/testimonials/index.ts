import type { NextApiRequest, NextApiResponse } from "next";
import { connectDB } from "@/lib/db";
import Property from "@/models/Property";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await connectDB();

  if (req.method !== "GET")
    return res.status(405).json({ message: "Method not allowed" });

  try {
    // Get all reviews from all properties
    const properties = await Property.find({}, { reviews: 1 });

    const testimonials = properties
      .flatMap((p) => p.reviews)
      .map((r, index) => ({
        id: index + 1,
        name: r.name || "Anonymous",
        image: "/images/users/default.jpg",
        review: r.comment,
        rating: r.rating,
        createdAt: r.createdAt,
      }))
      .reverse(); // latest first

    res.status(200).json(testimonials);
  } catch (error) {
    console.error("Testimonials Error:", error);
    res.status(500).json({ message: "Server error" });
  }
}
