import mongoose, { Schema, Document, model, models } from "mongoose";

export interface IProperty extends Document {
  title: string;
  description: string;
  price: number;
  location: string;
  images: string[];
  status: "available" | "sold";
  type: "sale" | "rent" | "lease" | "land";
  bedrooms?: number;
  bathrooms?: number;
  sqft?: number;
  latitude: Number,
  longitude: Number,
  phone?: string;
  email?: string;
  featured?: boolean;
  createdBy: mongoose.Types.ObjectId;
  rentedBy?: mongoose.Types.ObjectId;
  views: number;
  reviews: {
    user: mongoose.Types.ObjectId;
    rating: number;
    comment: string;
    createdAt: Date;
  }[];
  createdAt: Date;
  updatedAt: Date;
}

const PropertySchema = new Schema<IProperty>({
  title: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  location: { type: String, required: true },
  type: { type: String, enum: ["sale", "rent", "lease", "land"], required: true },
  status: { type: String, enum: ["available", "sold", "rented", "leased"], default: "available" },
  bedrooms: { type: Number },
  bathrooms: { type: Number },
  sqft: { type: Number },
  phone: { type: String },
  email: { type: String },
  images: [{ type: String }],
  featured: { type: Boolean, default: false },
  createdBy: { type: mongoose.Types.ObjectId, ref: "User" },
  rentedBy: { type: mongoose.Types.ObjectId, ref: "User" },
  views: { type: Number, default: 0 },
  reviews: [
    {
      user: { type: mongoose.Types.ObjectId, ref: "User", required: false },
      name: { type: String, required: true },
      rating: { type: Number, required: true },
      comment: { type: String, required: true },
      createdAt: { type: Date, default: Date.now },
    }
  ],
}, { timestamps: true });

export default models.Property || model<IProperty>("Property", PropertySchema);
