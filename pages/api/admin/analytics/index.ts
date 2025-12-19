import { connectDB } from "@/lib/db";
import Property from "@/models/Property";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req:NextApiRequest, res:NextApiResponse) {
  await connectDB();

  // Example: sales per month (mock or from createdAt)
  const sales = await Property.aggregate([
    { $match: { status: "sold" } },
    { $group: { _id: { $month: "$createdAt" }, count: { $sum: 1 } } },
    { $sort: { "_id": 1 } },
  ]);

  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  const salesData = monthNames.map((m, i) => {
    const monthSale = sales.find(s => s._id === i + 1);
    return { month: m, sales: monthSale ? monthSale.count : 0 };
  });

  res.json({ sales: salesData });
}
