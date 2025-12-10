// pages/api/properties/index.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { connectDB } from "@/lib/db";
import Property from "@/models/Property";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectDB();

  if (req.method === "GET") {
    try {
      const {
        location = "",
        type = "any",
        bedrooms = "",
        minPrice = "",
        maxPrice = "",
        limit,
        page,
      } = req.query;

      const filter: any = { status: "available" }; // KEEPING YOUR ORIGINAL WORK

      // ⭐ LOCATION FILTER
      if (location && typeof location === "string" && location.trim() !== "") {
        filter.location = { $regex: location, $options: "i" };
      }

      // ⭐ TYPE FILTER
      if (type && type !== "any") {
        filter.type = type.toString().toLowerCase();
      }

      // ⭐ BEDROOMS FILTER
      if (bedrooms && !isNaN(Number(bedrooms))) {
        filter.bedrooms = Number(bedrooms);
      }

      // ⭐ PRICE RANGE
      if (minPrice) {
        filter.price = { ...filter.price, $gte: Number(minPrice) };
      }
      if (maxPrice) {
        filter.price = { ...filter.price, $lte: Number(maxPrice) };
      }

      // ⭐ PAGINATION (YOUR ORIGINAL)
      const perPage = limit ? Number(limit) : 20;
      const pageNum = page ? Number(page) : 1;
      const skip = (pageNum - 1) * perPage;

      const total = await Property.countDocuments(filter);

      // ⭐ SORT (Your original: newest first)
      const properties = await Property.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(perPage)
        .lean();

      return res.status(200).json({
        data: properties,
        meta: {
          total,
          page: pageNum,
          perPage,
          totalPages: Math.ceil(total / perPage),
        },
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Failed to fetch properties" });
    }
  }

  res.setHeader("Allow", ["GET"]);
  return res.status(405).end(`Method ${req.method} Not Allowed`);
}
