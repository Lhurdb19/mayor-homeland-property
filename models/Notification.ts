import mongoose, { Schema, Document, model, models } from "mongoose";

export interface INotification extends Document {
  recipient?: mongoose.Types.ObjectId | null;
  recipientType: "user" | "admin";
  title: string;
  message: string;
  link?: string;
  type: "info" | "success" | "warning" | "error";
  read: boolean;
  createdAt: Date;
}

const NotificationSchema = new Schema<INotification>(
  {
    recipient: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      default: null, // ✅ admin notifications
    },
    recipientType: {
      type: String,
      enum: ["user", "admin"],
      required: true,
    },
    title: { type: String, required: true },
    message: { type: String, required: true },
    link: { type: String },
    type: {
      type: String,
      enum: ["info", "success", "warning", "error"],
      default: "info",
    },
    read: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default models.Notification ||
  model<INotification>("Notification", NotificationSchema);
