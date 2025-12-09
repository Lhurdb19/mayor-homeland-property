import type { NextApiRequest, NextApiResponse } from "next";
import { connectDB } from "@/lib/db";
import Transaction from "@/models/Transaction";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectDB();

  if (req.method === "GET") {
    const transactions = await Transaction.find()
      .populate("userId", "firstName lastName email")
      .populate("propertyId", "title location price")
      .sort({ createdAt: -1 });
    return res.status(200).json(transactions);
  }

  if (req.method === "POST") {
    const { propertyId, userId, amount, status, method } = req.body;
    if (!propertyId || !userId || !amount) return res.status(400).json({ message: "Missing required fields" });

    const transaction = await Transaction.create({
      propertyId,
      userId,
      amount,
      status: status || "pending",
      method: method || "card",
    });

    return res.status(201).json(transaction);
  }

  return res.status(405).json({ message: "Method not allowed" });
}
