// models/SiteSettings.ts
import mongoose, { Schema, Document, models, model } from "mongoose";

export interface ISiteSettings extends Document {
  commissionRate: number;
  featuredListings: boolean;
  darkMode: boolean;
  whatsappNumbers: [];
}

const SiteSettingsSchema = new Schema<ISiteSettings>({
  commissionRate: { type: Number, default: 5 },
  featuredListings: { type: Boolean, default: true },
  darkMode: { type: Boolean, default: false },
  whatsappNumbers: { type: [String], default: [] },
});

export default models.SiteSettings || model<ISiteSettings>("SiteSettings", SiteSettingsSchema);
