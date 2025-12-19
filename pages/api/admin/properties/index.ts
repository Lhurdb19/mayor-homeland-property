import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]";
import { connectDB } from "@/lib/db";
import Property from "@/models/Property";
import { uploadImage } from "@/lib/cloudinary";

export const config = { api: { bodyParser: { sizeLimit: "10mb" } } };

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectDB();
  const session = await getServerSession(req, res, authOptions);

  if (!session) return res.status(401).json({ message: "Unauthorized" });
  if (session.user.role !== "admin") return res.status(403).json({ message: "Admin access required" });

  if (req.method === "GET") {
    try {
      const { location, type, bedrooms, bathrooms, minPrice, maxPrice, sort, time, limit, page, featured, status } = req.query;

      const filter: any = {};

      if (location) filter.location = { $regex: location, $options: "i" };
      if (type && type !== "any") filter.type = type.toString().toLowerCase();
      if (bedrooms) filter.bedrooms = Number(bedrooms);
      if (bathrooms) filter.bathrooms = Number(bathrooms);
      if (minPrice || maxPrice) {
        filter.price = {};
        if (minPrice) filter.price.$gte = Number(minPrice);
        if (maxPrice) filter.price.$lte = Number(maxPrice);
      }
      if (featured === "true") filter.featured = true;
      if (status) filter.status = status; // NEW: fetch by status (pending, available, etc.)
      if (time) {
        const days = Number(time);
        if (!isNaN(days) && days > 0) {
          const since = new Date();
          since.setDate(since.getDate() - days);
          filter.createdAt = { $gte: since };
        }
      }

      const perPage = limit ? Math.max(1, Number(limit)) : 20;
      const pageNum = page ? Math.max(1, Number(page)) : 1;
      const skip = (pageNum - 1) * perPage;

      let sortQuery: any = { createdAt: -1 };
      if (sort === "priceLowToHigh") sortQuery = { price: 1 };
      if (sort === "priceHighToLow") sortQuery = { price: -1 };
      if (sort === "oldest") sortQuery = { createdAt: 1 };

      const total = await Property.countDocuments(filter);
      const properties = await Property.find(filter).sort(sortQuery).skip(skip).limit(perPage).lean();

      return res.status(200).json({
        data: properties,
        meta: { total, page: pageNum, perPage, totalPages: Math.ceil(total / perPage) },
      });
    } catch (err) {
      console.error("GET /admin/properties error:", err);
      return res.status(500).json({ message: "Failed to fetch properties" });
    }
  }

  if (req.method === "POST") {
    try {
      const { title, description, price, location, status, type, images, bedrooms, bathrooms, sqft, phone, email, latitude, longitude, featured } = req.body;
      if (!title || !description || !price || !location || !status || !type) return res.status(400).json({ message: "Missing required fields" });
      if (!images || !Array.isArray(images) || images.length === 0) return res.status(400).json({ message: "At least one image is required" });

      const uploadedImages = await Promise.all(images.map(async (img: string) => (await uploadImage(img)).secure_url));

      const property = await Property.create({
        title,
        description,
        price: Number(price),
        location,
        status,
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
      });

      return res.status(201).json(property);
    } catch (err) {
      console.error("POST /admin/properties error:", err);
      return res.status(500).json({ message: "Failed to create property" });
    }
  }

  res.setHeader("Allow", ["GET", "POST"]);
  return res.status(405).end(`Method ${req.method} Not Allowed`);
}
