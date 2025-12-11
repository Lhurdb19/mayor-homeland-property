import type { NextApiRequest, NextApiResponse } from "next";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectDB();

  if (req.method === "GET") {
    const users = await User.find().sort({ createdAt: -1 });
    return res.status(200).json(users);
  }

  if (req.method === "POST") {
  const { firstName, lastName, email, phone, address, role, password, isVerified } = req.body;

  if (!firstName || !lastName || !email || !phone || !address || !password)
    return res.status(400).json({ message: "All fields are required" });

  const userExists = await User.findOne({ email });
  if (userExists) return res.status(400).json({ message: "Email already exists" });

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = await User.create({
    firstName,
    lastName,
    email,
    phone,
    address,
    role: role || "user",
    password: hashedPassword,
    isVerified: role === "admin" ? true : isVerified ?? false,
  });

  return res.status(201).json(newUser);
}


  return res.status(405).json({ message: "Method not allowed" });
}
