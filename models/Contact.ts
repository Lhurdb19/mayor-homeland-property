// models/Contact.ts
import mongoose, { Schema, Document, model, models } from "mongoose";

export interface IContact extends Document {
  name: string;
  email: string;
  phone?: string;
  message: string;
  userId?: mongoose.Types.ObjectId; // if logged in
  sender: "user" | "admin";
  createdAt: Date;
  updatedAt: Date;
}

const ContactSchema = new Schema<IContact>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String },
    message: { type: String, required: true },
    userId: { type: mongoose.Types.ObjectId, ref: "User" },
    sender: { type: String, enum: ["user", "admin"], required: true },
  },
  { timestamps: true }
);

export default models.Contact || model<IContact>("Contact", ContactSchema);
