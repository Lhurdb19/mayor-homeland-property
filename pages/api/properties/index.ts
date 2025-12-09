// pages/api/properties/index.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { connectDB } from "@/lib/db";
import Property from "@/models/Property";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectDB();

  if (req.method === "GET") {
    try {
      const { type, limit, page } = req.query;

      const filter: any = { status: "available" }; // show only available properties

      if (type && type !== "any") filter.type = type.toLowerCase();

      const perPage = limit ? Number(limit) : 1000;
      const pageNum = page ? Number(page) : 1;
      const skip = (pageNum - 1) * perPage;

      const total = await Property.countDocuments(filter);

      const properties = await Property.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(perPage)
        .lean();

      return res.status(200).json({
        data: properties,
        meta: { total, page: pageNum, perPage, totalPages: Math.ceil(total / perPage) },
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Failed to fetch properties" });
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
