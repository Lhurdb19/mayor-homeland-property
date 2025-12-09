// pages/api/admin/me.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import type { Session } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { connectDB } from "@/lib/db";
import User from "@/models/User";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await connectDB();

  const session = (await getServerSession(req, res, authOptions as any)) as
    | (Session & { user: { id: string } })
    | null;
  if (!session) return res.status(401).json({ message: "Unauthorized" });
  if (!session) return res.status(401).json({ message: "Unauthorized" });

  const userId = session.user.id; // logged-in user's id

  const user = await User.findById(userId);
  if (!user) return res.status(404).json({ message: "User not found" });

  if (req.method === "GET") {
    return res.status(200).json(user);
  }

  if (req.method === "PUT") {
    const { firstName, lastName, email, phone, password } = req.body;

    user.firstName = firstName ?? user.firstName;
    user.lastName = lastName ?? user.lastName;
    user.email = email ?? user.email;
    user.phone = phone ?? user.phone;
    if (password) user.password = password; // hash if needed

    await user.save();
    return res.status(200).json(user);
  }

  return res.status(405).json({ message: "Method not allowed" });
}
