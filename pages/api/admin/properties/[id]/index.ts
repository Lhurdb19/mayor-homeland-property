import type { NextApiRequest, NextApiResponse } from "next";
import { connectDB } from "@/lib/db";
import Property from "@/models/Property";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectDB();

  const { id } = req.query;

  if (!id || typeof id !== "string") {
    return res.status(400).json({ message: "Invalid property ID" });
  }

  switch (req.method) {
    // =====================================================
    // GET → Single property
    // =====================================================
    case "GET":
      try {
        const property = await Property.findById(id);
        if (!property) return res.status(404).json({ message: "Property not found" });
        return res.status(200).json(property);
      } catch (err) {
        console.error("GET /admin/properties/[id] error:", err);
        return res.status(500).json({ message: "Failed to fetch property" });
      }

    // =====================================================
    // POST → Add Review
    // =====================================================
    case "POST":
      try {
        const { rating, comment, user } = req.body;

        if (!rating || !comment || !user) {
          return res.status(400).json({ message: "All fields are required" });
        }

        const property = await Property.findById(id);
        if (!property) return res.status(404).json({ message: "Property not found" });

        property.reviews.push({
          rating,
          comment,
          user,
          createdAt: new Date(),
        });

        await property.save();

        return res.status(201).json({ message: "Review added successfully" });
      } catch (err) {
        console.error("POST Review error:", err);
        return res.status(500).json({ message: "Failed to submit review" });
      }

    // =====================================================
    // PUT → Update (admin / Map coordinates)
    // =====================================================
    case "PUT":
      try {
        // Only update fields that are provided
        const updateData: any = {};
        const allowedFields = [
          "title",
          "description",
          "price",
          "location",
          "status",
          "type",
          "images",
          "bedrooms",
          "bathrooms",
          "sqft",
          "phone",
          "email",
          "latitude",
          "longitude",
          "featured",
        ];

        allowedFields.forEach((field) => {
          if (req.body[field] !== undefined) {
            updateData[field] = req.body[field];
          }
        });

        const updated = await Property.findByIdAndUpdate(id, updateData, { new: true });
        if (!updated) return res.status(404).json({ message: "Property not found" });

        return res.status(200).json(updated);
      } catch (err) {
        console.error("PUT /admin/properties/[id] error:", err);
        return res.status(500).json({ message: "Failed to update property" });
      }

    // =====================================================
    // DELETE → Remove (admin)
    // =====================================================
    case "DELETE":
      try {
        await Property.findByIdAndDelete(id);
        return res.status(200).json({ message: "Property deleted" });
      } catch (err) {
        console.error("DELETE error:", err);
        return res.status(500).json({ message: "Failed to delete property" });
      }

    // =====================================================
    // METHOD NOT ALLOWED
    // =====================================================
    default:
      res.setHeader("Allow", ["GET", "POST", "PUT", "DELETE"]);
      return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
