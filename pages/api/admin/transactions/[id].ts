import type { NextApiRequest, NextApiResponse } from "next";
import { connectDB } from "@/lib/db";
import Transaction from "@/models/Transaction";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectDB();
  const { id } = req.query;

  if (req.method === "PUT") {
    const updated = await Transaction.findByIdAndUpdate(id, req.body, { new: true });
    return res.status(200).json(updated);
  }

  if (req.method === "DELETE") {
    await Transaction.findByIdAndDelete(id);
    return res.status(200).json({ message: "Transaction deleted" });
  }

  return res.status(405).json({ message: "Method not allowed" });
}
