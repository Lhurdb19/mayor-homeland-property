import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import { connectDB } from "@/lib/db";
import User from "@/models/User";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectDB();
  const session = await getServerSession(req, res, authOptions);
  if (!session) return res.status(401).json({ message: "Unauthorized" });

  const email = session.user?.email;
  if (!email) return res.status(400).json({ message: "No user email found" });

  if (req.method === "GET") {
    const user = await User.findOne({ email }).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    return res.status(200).json(user);
  }

  if (req.method === "PUT") {
    try {
      const { firstName, lastName, phone, address, image } = req.body;

      // Only update allowed fields
      const updateData: any = { firstName, lastName, phone, address };
      if (image) updateData.image = image;

      const updatedUser = await User.findOneAndUpdate(
        { email },
        updateData,
        { new: true }
      ).select("-password");

      return res.status(200).json(updatedUser);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Failed to update user", error: err });
    }
  }

  return res.status(405).json({ message: "Method not allowed" });
}
