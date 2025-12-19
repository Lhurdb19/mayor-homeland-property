import type { NextApiRequest, NextApiResponse } from "next";
import { connectDB } from "@/lib/db";
import Property from "@/models/Property";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectDB();
  const { id } = req.query;
  if (!id || typeof id !== "string") return res.status(400).json({ message: "Invalid property ID" });

  switch (req.method) {
    case "GET":
      try {
        const property = await Property.findById(id);
        if (!property) return res.status(404).json({ message: "Property not found" });
        return res.status(200).json(property);
      } catch (err) {
        console.error("GET /admin/properties/[id] error:", err);
        return res.status(500).json({ message: "Failed to fetch property" });
      }

    case "PUT":
      try {
        const updateData: any = {};
        const allowedFields = ["title","description","price","location","status","type","images","bedrooms","bathrooms","sqft","phone","email","latitude","longitude","featured"];
        allowedFields.forEach(field => { if (req.body[field] !== undefined) updateData[field] = req.body[field]; });

        const updated = await Property.findByIdAndUpdate(id, updateData, { new: true });
        if (!updated) return res.status(404).json({ message: "Property not found" });
        return res.status(200).json(updated);
      } catch (err) {
        console.error("PUT /admin/properties/[id] error:", err);
        return res.status(500).json({ message: "Failed to update property" });
      }

    case "DELETE":
      try {
        await Property.findByIdAndDelete(id);
        return res.status(200).json({ message: "Property deleted" });
      } catch (err) {
        console.error("DELETE /admin/properties/[id] error:", err);
        return res.status(500).json({ message: "Failed to delete property" });
      }

    default:
      res.setHeader("Allow", ["GET","PUT","DELETE"]);
      return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
