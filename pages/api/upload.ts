// pages/api/upload.ts
import { v2 as cloudinary } from "cloudinary";
import formidable, { File } from "formidable";
import { NextApiRequest, NextApiResponse } from "next";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Disable Next.js body parser for file uploads
export const config = { api: { bodyParser: false } };

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const form = new formidable.IncomingForm();

  form.parse(req, async (err, fields, files) => {
    if (err) {
      return res.status(500).json({ message: "Form parsing error", error: err });
    }

    // Ensure file exists
    const uploaded = files.file;
    if (!uploaded) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    // Handle single or multiple files
    const file: File = Array.isArray(uploaded) ? uploaded[0] : uploaded;

    if (!file.filepath) {
      return res.status(400).json({ message: "Invalid file structure" });
    }

    try {
      const result = await cloudinary.uploader.upload(file.filepath, {
        folder: "realestate",
      });

      return res.status(200).json(result);
    } catch (error) {
      console.error("Cloudinary Upload Error:", error);
      return res.status(500).json({ message: "Cloudinary upload failed" });
    }
  });
}
