import { NextApiRequest, NextApiResponse } from "next";
import { connectDB } from "@/lib/db";
import Property from "@/models/Property";
import User from "@/models/User";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectDB();

  const totalProperties = await Property.countDocuments();
  const availableProperties = await Property.countDocuments({ status: "available" });
  const soldProperties = await Property.countDocuments({ status: "sold" });
  const totalUsers = await User.countDocuments();
  const unverifiedUsers = await User.countDocuments({ isVerified: false });

  res.status(200).json({ totalProperties, availableProperties, soldProperties, totalUsers, unverifiedUsers });
}
