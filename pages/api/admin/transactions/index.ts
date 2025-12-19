import type { NextApiRequest, NextApiResponse } from "next";
import { connectDB } from "@/lib/db";
import WalletTransaction from "@/models/WalletTransaction";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectDB();

  if (req.method === "GET") {
    try {
      const transactions = await WalletTransaction.find()
        .populate("user", "firstName lastName email") // populate user details
        .sort({ createdAt: -1 });
      return res.status(200).json(transactions);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Server error" });
    }
  }

  if (req.method === "POST") {
    const { user, type, amount, status, description, reference } = req.body;
    if (!user || !type || !amount || !description || !reference) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    try {
      const transaction = await WalletTransaction.create({
        user,
        type,
        amount,
        status: status || "pending",
        description,
        reference,
      });
      return res.status(201).json(transaction);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Server error" });
    }
  }

  return res.status(405).json({ message: "Method not allowed" });
}
