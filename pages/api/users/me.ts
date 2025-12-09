import type { NextApiRequest, NextApiResponse } from "next";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectDB();

  const session = await getServerSession(req, res, authOptions);
  const email = session?.user?.email;
  const role = session?.user?.role;

  // =========================================
  // 2️⃣ GET LOGGED-IN USER PROFILE
  // =========================================
  if (req.method === "GET") {
    if (!session) return res.status(401).json({ message: "Unauthorized" });

    const user = await User.findOne({ email }).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    return res.status(200).json(user);
  }

  // =========================================
  // 3️⃣ UPDATE PROFILE (LOGGED-IN USER)
  // =========================================
  if (req.method === "PUT") {
    if (!session) return res.status(401).json({ message: "Unauthorized" });

    const { firstName, lastName, phone, address } = req.body;

    const updatedUser = await User.findOneAndUpdate(
      { email },
      { firstName, lastName, phone, address },
      { new: true, runValidators: true }
    ).select("-password");

    return res.status(200).json(updatedUser);
  }

  return res.status(405).json({ message: "Method not allowed" });
}
