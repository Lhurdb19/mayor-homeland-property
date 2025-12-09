import { connectDB } from "@/lib/db";
import Inquiry from "@/models/Inquiry";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req:NextApiRequest, res:NextApiResponse) {
  await connectDB();
  const { id } = req.query;

  if (req.method === "PUT") {
    const { status } = req.body;
    const updated = await Inquiry.findByIdAndUpdate(id, { status }, { new: true });
    return res.json(updated);
  }

  if (req.method === "DELETE") {
    await Inquiry.findByIdAndDelete(id);
    return res.json({ message: "Inquiry deleted" });
  }

  res.status(405).json({ message: "Method not allowed" });
}
