import mongoose, { Schema, Document, models, model } from "mongoose";

export interface IInquiry extends Document {
  name: string;
  email: string;
  phone?: string;
  message: string;
  propertyId?: mongoose.Types.ObjectId;
  status: "pending" | "handled";
  createdAt: Date;
  updatedAt: Date;
}

const InquirySchema = new Schema<IInquiry>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String },
    message: { type: String, required: true },
    propertyId: { type: mongoose.Types.ObjectId, ref: "Property" },
    status: { type: String, enum: ["pending", "handled"], default: "pending" },
  },
  { timestamps: true }
);

export default models.Inquiry || model<IInquiry>("Inquiry", InquirySchema);
