import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req:NextApiRequest, res:NextApiResponse) {
  await connectDB();

  if (req.method !== "DELETE")
    return res.status(405).json({ message: "Method not allowed" });

  const session = await getServerSession(req, res, authOptions);
  if (!session) return res.status(401).json({ message: "Unauthorized" });

  const email = session.user.email;

  try {
    await User.findOneAndDelete({ email });

    return res.status(200).json({ message: "Account deleted successfully" });
  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }
}
