import type { NextApiRequest, NextApiResponse } from "next";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import Notification from "@/models/Notification";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectDB();
  const { id } = req.query;

  const user = await User.findById(id);
  if (!user) return res.status(404).json({ message: "User not found" });

  if (req.method === "PUT") {
  const { firstName, lastName, email, phone, address, role, isVerified } = req.body;

  user.firstName = firstName || user.firstName;
  user.lastName = lastName || user.lastName;
  user.email = email || user.email;
  user.phone = phone || user.phone;
  user.address = address || user.address;
  user.role = role || user.role;

  if (typeof isVerified === "boolean") {
    user.isVerified = isVerified;

      await Notification.create({
        recipient: user._id,
        recipientType: "user",
        title: isVerified ? "Account Verified" : "Account Rejected",
        message: isVerified
          ? "Your account has been successfully verified."
          : "Your account verification was rejected.",
        type: isVerified ? "success" : "error",
      })
  }

  await user.save();
  return res.status(200).json(user);
}


  if (req.method === "DELETE") {
    await user.deleteOne();
    return res.status(200).json({ message: "User deleted" });
  }

  return res.status(405).json({ message: "Method not allowed" });
}
