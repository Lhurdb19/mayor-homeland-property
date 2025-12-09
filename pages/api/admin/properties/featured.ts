//api/admin/properties/featured.ts

import { connectDB } from "@/lib/db";
import Property from "@/models/Property";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req:NextApiRequest, res:NextApiResponse) {
  await connectDB();

  const { method } = req;

  if (method === "GET") {
    const properties = await Property.find().sort({ createdAt: -1 });
    return res.json(properties);
  }

  if (method === "PUT") {
    const { id, featured } = req.body;
    const updated = await Property.findByIdAndUpdate(id, { featured }, { new: true });
    return res.json(updated);
  }

  res.status(405).json({ message: "Method not allowed" });
}
