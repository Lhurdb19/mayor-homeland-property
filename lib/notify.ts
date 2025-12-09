import Notification from "@/models/Notification";
import mongoose from "mongoose";

/**
 * Send a notification to a user or admin
 * @param recipientId - Mongo ObjectId of the recipient
 * @param recipientType - 'user' | 'admin'
 * @param title - Notification title
 * @param message - Notification message
 * @param link - Optional link for redirection
 * @param type - 'info' | 'success' | 'warning' | 'error'
 */
export const sendNotification = async ({
  recipientId,
  recipientType,
  title,
  message,
  link,
  type = "info",
}: {
  recipientId?: string | mongoose.Types.ObjectId;
  recipientType: "user" | "admin";
  title: string;
  message: string;
  link?: string;
  type?: "info" | "success" | "warning" | "error";
}) => {
  try {
    const notification = await Notification.create({
      recipient: recipientId,
      recipientType,
      title,
      message,
      link,
      type,
    });
    return notification;
  } catch (err) {
    console.error("Notification Error:", err);
    throw new Error("Failed to send notification");
  }
};
