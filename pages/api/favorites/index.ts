import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";
import { connectDB } from "@/lib/db";
import Favorite from "@/models/Favorite";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectDB();

  const session = await getServerSession(req, res, authOptions);
  if (!session) return res.status(401).json({ message: "Unauthorized" });

  const userId = session.user.id;
  const { propertyId } = req.body;

  // ADD TO FAVORITE
  if (req.method === "POST") {
    const exists = await Favorite.findOne({ user: userId, property: propertyId });
    if (exists) return res.status(400).json({ message: "Already added" });

    const fav = await Favorite.create({ user: userId, property: propertyId });
    return res.status(201).json(fav);
  }

  // REMOVE FAVORITE
  if (req.method === "DELETE") {
    await Favorite.findOneAndDelete({ user: userId, property: propertyId });
    return res.status(200).json({ message: "Removed" });
  }

  return res.status(405).json({ message: "Method not allowed" });
}
