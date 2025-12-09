import { connectDB } from "@/lib/db";
import Inquiry from "@/models/Inquiry";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req:NextApiRequest, res:NextApiResponse) {
  await connectDB();

  if (req.method === "GET") {
    const inquiries = await Inquiry.find().sort({ createdAt: -1 }).populate("propertyId");
    return res.json(inquiries);
  }

  if (req.method === "POST") {
    const { name, email, phone, message, propertyId } = req.body;
    const newInquiry = await Inquiry.create({ name, email, phone, message, propertyId });
    return res.status(201).json(newInquiry);
  }

  res.status(405).json({ message: "Method not allowed" });
}
