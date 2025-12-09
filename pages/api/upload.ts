// pages/api/upload.ts
import { v2 as cloudinary } from "cloudinary";
import formidable from "formidable";
import { NextApiRequest, NextApiResponse } from "next";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const config = { api: { bodyParser: false } };

export default async function handler(req:NextApiRequest, res:NextApiResponse) {
  const form = new formidable.IncomingForm();
  form.parse(req, async (err, fields, files) => {
    const file = files.file;
    const result = await cloudinary.uploader.upload(file.filepath, { folder: "realestate" });
    res.json(result);
  });
}
