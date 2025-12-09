// pages/api/admin/settings.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { connectDB } from "@/lib/db";
import mongoose, { Schema, model, models } from "mongoose";

await connectDB();

const SettingsSchema = new Schema({
  commissionRate: { type: Number, default: 5 },
  featuredListings: { type: Boolean, default: true },
  darkMode: { type: Boolean, default: false },

  // ADD THIS 👇
  whatsappNumbers: { type: [String], default: [] },
});

const Settings = models.Settings || model("Settings", SettingsSchema);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
  let settings = await Settings.findOne();
  if (!settings) settings = await Settings.create({});
  return res.status(200).json(settings);
}

  if (req.method === "PUT") {
    const { commissionRate, featuredListings, darkMode, whatsappNumbers } = req.body;
    let settings = await Settings.findOne();
    if (!settings) settings = new Settings();

    settings.commissionRate = commissionRate ?? settings.commissionRate;
    settings.featuredListings = featuredListings ?? settings.featuredListings;
    settings.darkMode = darkMode ?? settings.darkMode;

    // UPDATE WHATSAPP
    settings.whatsappNumbers = whatsappNumbers ?? settings.whatsappNumbers;

    await settings.save();
    return res.status(200).json(settings);
  }

  return res.status(405).json({ message: "Method not allowed" });
}
