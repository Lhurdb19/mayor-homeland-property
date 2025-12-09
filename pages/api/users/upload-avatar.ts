// pages/api/users/upload-avatar.ts
import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import formidable from "formidable";
import { v2 as cloudinary } from "cloudinary";

export const config = { api: { bodyParser: false } };

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).json({ message: "Method not allowed" });

  await connectDB();
  const session = await getServerSession(req, res, authOptions);
  if (!session) return res.status(401).json({ message: "Unauthorized" });

  const form = new formidable.IncomingForm();
  form.parse(req, async (err, fields, files) => {
    if (err) return res.status(500).json({ message: "Form parse error" });

    if (!files.file) return res.status(400).json({ message: "No file uploaded" });
    const file = Array.isArray(files.file) ? files.file[0] : files.file;

    const result = await cloudinary.uploader.upload((file as any).filepath, { folder: "real_estate" });

    const updatedUser = await User.findOneAndUpdate(
      { email: session.user.email },
      { image: result.secure_url },
      { new: true }
    ).select("-password");

    res.status(200).json({ url: result.secure_url, user: updatedUser });
  });
}
