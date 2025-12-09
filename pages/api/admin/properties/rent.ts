import type { NextApiRequest, NextApiResponse } from "next";
import { connectDB } from "@/lib/db";
import Property from "@/models/Property";
import User from "@/models/User";
import Notification from "@/models/Notification";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectDB();

  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const { propertyId, userId } = req.body;

    if (!propertyId || !userId) {
      return res.status(400).json({ message: "propertyId and userId are required" });
    }

    const property = await Property.findById(propertyId);
    if (!property) return res.status(404).json({ message: "Property not found" });
    if (property.rentedBy) return res.status(400).json({ message: "Property already rented" });

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Mark property as rented
    property.rentedBy = userId;
    await property.save();

    // Create notification for user
    await Notification.create({
      recipient: userId,
      recipientType: "user",
      title: "Property Rented Successfully",
      message: `You have successfully rented "${property.title}".`,
      link: `/dashboard/properties/${propertyId}`,
      type: "success",
      read: false,
    });

    // Create notification for admin
    await Notification.create({
      recipientType: "admin",
      title: "Property Rented",
      message: `"${property.title}" was rented by ${user.name || user.email}.`,
      link: `/dashboard/admin/properties/${propertyId}`,
      type: "info",
      read: false,
    });

    return res.status(200).json({ message: "Property rented and notifications sent" });
  } catch (err: any) {
    console.error(err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
}
