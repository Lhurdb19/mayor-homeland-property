import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";
import { connectDB } from "@/lib/db";
import Property from "@/models/Property";
import { uploadImage } from "@/lib/cloudinary";

export const config = {
  api: {
    bodyParser: { sizeLimit: "10mb" },
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectDB();

  const session = await getServerSession(req, res, authOptions);
  if (!session) return res.status(401).json({ message: "Unauthorized" });

  if (req.method === "POST") {
    try {
      const {
        title,
        description,
        price,
        location,
        type,
        images,
        bedrooms,
        bathrooms,
        sqft,
        phone,
        email,
        latitude,
        longitude,
        featured,
      } = req.body;

      // Validation
      if (!title || !price || !location || !type) {
        return res.status(400).json({ message: "Title, price, location, and type are required" });
      }

      if (!images || !Array.isArray(images) || images.length === 0) {
        return res.status(400).json({ message: "At least one image is required" });
      }

      // Upload images
      const uploadedImages = await Promise.all(
        images.map(async (img: string) => {
          const uploaded = await uploadImage(img);
          return uploaded.secure_url;
        })
      );

      // Save property as pending
      const property = await Property.create({
        title,
        description,
        price: Number(price),
        location,
        type: type.toLowerCase(),
        bedrooms: bedrooms ? Number(bedrooms) : undefined,
        bathrooms: bathrooms ? Number(bathrooms) : undefined,
        sqft: sqft ? Number(sqft) : undefined,
        phone: phone || null,
        email: email || null,
        latitude: latitude ? Number(latitude) : undefined,
        longitude: longitude ? Number(longitude) : undefined,
        featured: !!featured,
        images: uploadedImages,
        createdBy: session.user.id,
        status: "pending", // NEW: pending approval
      });

      return res.status(201).json(property);
    } catch (err) {
      console.error("POST /properties/user error:", err);
      return res.status(500).json({ message: "Failed to add property" });
    }
  } else if (req.method === "GET") {
    try {
      const userProperties = await Property.find({ createdBy: session.user.id })
        .sort({ createdAt: -1 })
        .lean();
      return res.status(200).json(userProperties);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Failed to fetch user properties" });
    }
  } else {
    res.setHeader("Allow", ["POST", "GET"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
