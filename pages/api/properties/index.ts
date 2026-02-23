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
        seed,
        sort = "default"
      } = req.query;

      const filter: any = { status: "available" };
      if (location && typeof location === "string" && location.trim() !== "") {
        filter.location = { $regex: location, $options: "i" };
      }
      if (type && type !== "any") {
        filter.type = type.toString().toLowerCase();
      }
      if (bedrooms && !isNaN(Number(bedrooms))) {
        filter.bedrooms = Number(bedrooms);
      }
      if (minPrice || maxPrice) {
        filter.price = {};
        if (minPrice) filter.price.$gte = Number(minPrice);
        if (maxPrice) filter.price.$lte = Number(maxPrice);
      }

      const perPage = limit ? Number(limit) : 20;
      const pageNum = page ? Number(page) : 1;
      const skip = (pageNum - 1) * perPage;
      const randomSeed = Number(seed) || 0;

      const pipeline: any[] = [
        { $match: filter },
      ];

      if (!sort || sort === "default" || sort === "any") {
  pipeline.push(
    {
      $addFields: {
        // We use a more "chaotic" math approach: 
        // Convert ID to string, take the length, multiply by seed, then mod.
        // Or simply add a larger multiplier to the ID timestamp.
        shuffleValue: { 
          $mod: [
            { $abs: { $multiply: [{ $toLong: { $toDate: "$_id" } }, Number(seed || 1)] } }, 
            1000000 
          ] 
        }
      }
    },
    {
      $sort: {
        featured: -1,     // Keep featured at the top
        shuffleValue: 1,  // Shuffled order
        createdAt: -1     // Tie-breaker
      }
    }
  );
} else {
        let sortStage: any = {};
        if (sort === "priceLowToHigh") sortStage = { price: 1 };
        if (sort === "priceHighToLow") sortStage = { price: -1 };
        if (sort === "oldest") sortStage = { createdAt: 1 };
        pipeline.push({ $sort: sortStage });
      }

      pipeline.push({
        $facet: {
          metadata: [{ $count: "total" }],
          data: [{ $skip: skip }, { $limit: perPage }]
        }
      });

      const result = await Property.aggregate(pipeline);
      
      const properties = result[0]?.data || [];
      const total = result[0]?.metadata[0]?.total || 0;

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