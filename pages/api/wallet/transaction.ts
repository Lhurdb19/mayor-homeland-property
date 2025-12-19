import type { NextApiRequest, NextApiResponse } from "next";
import { connectDB } from "@/lib/db";
import WalletTransaction from "@/models/WalletTransaction";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") return res.status(405).end();

  const { userId } = req.query;
  if (!userId) {
    return res.status(400).json({ message: "User ID required" });
  }

  try {
    await connectDB();

    const transactions = await WalletTransaction.find({ user: userId })
      .sort({ createdAt: -1 })
      .limit(20)
      .lean();

    const formatted = transactions.map((tx: any) => ({
      id: tx._id.toString(),
      type: tx.type,
      amount: tx.amount,
      status: tx.status,
      description: tx.description,
      reference: tx.reference,
      date: tx.createdAt ? new Date(tx.createdAt).toISOString() : null,
    }));

    return res.status(200).json(formatted);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
}
