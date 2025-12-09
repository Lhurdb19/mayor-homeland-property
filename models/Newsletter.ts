import mongoose, { Schema, Document, model, models } from "mongoose";

export interface INewsletter extends Document {
  email: string;
  userId?: mongoose.Types.ObjectId;
  createdAt: Date;
}

const NewsletterSchema = new Schema<INewsletter>(
  {
    email: { type: String, required: true, unique: true },
    userId: { type: mongoose.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

export default models.Newsletter || model<INewsletter>("Newsletter", NewsletterSchema);
