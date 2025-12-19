// pages/api/wallet.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import WalletTransaction from "@/models/WalletTransaction";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const { userId } = req.query;
  if (!userId) {
    return res.status(400).json({ message: "User ID is required" });
  }

  try {
    await connectDB();

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const transactions = await WalletTransaction.find({ user: userId });

    const income = transactions
      .filter(tx => tx.type === "credit" && tx.status === "success")
      .reduce((sum, tx) => sum + tx.amount, 0);

    const expense = transactions
      .filter(tx => tx.type === "debit" && tx.status === "success")
      .reduce((sum, tx) => sum + tx.amount, 0);

    res.json({
      balance: user.walletBalance || 0,
      income,
      expense,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
}
