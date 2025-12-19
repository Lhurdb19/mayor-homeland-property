import type { NextApiRequest, NextApiResponse } from "next";
import { connectDB } from "@/lib/db";
import WalletTransaction from "@/models/WalletTransaction";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectDB();
  const { id } = req.query;

  if (req.method === "PUT") {
    try {
      const updated = await WalletTransaction.findByIdAndUpdate(id, req.body, { new: true });
      if (!updated) return res.status(404).json({ message: "Transaction not found" });
      return res.status(200).json(updated);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Server error" });
    }
  }

  if (req.method === "DELETE") {
    try {
      const deleted = await WalletTransaction.findByIdAndDelete(id);
      if (!deleted) return res.status(404).json({ message: "Transaction not found" });
      return res.status(200).json({ message: "Transaction deleted" });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Server error" });
    }
  }

  return res.status(405).json({ message: "Method not allowed" });
}
