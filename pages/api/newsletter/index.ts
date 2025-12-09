import type { NextApiRequest, NextApiResponse } from "next";
import { connectDB } from "@/lib/db";
import Newsletter from "@/models/Newsletter";
import { sendNotification } from "@/lib/notify";
import { sendEmail } from "@/lib/mail";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  await connectDB();

  try {
    const { email, userId } = req.body;

    if (!email || !email.includes("@")) {
      return res.status(400).json({ message: "Invalid email" });
    }

    // Check duplicate
    const exists = await Newsletter.findOne({ email });
    if (exists) {
      return res.status(400).json({ message: "Email already subscribed" });
    }

    const newsletter = await Newsletter.create({ email, userId });

    // Send notification to admin
    await sendNotification({
      recipientType: "admin",
      title: "New Newsletter Subscription",
      message: `New subscriber: ${email}`,
      link: "/dashboard/admin/newsletter",
      type: "info",
    });

    // Optional: send welcome email
    try {
      await sendEmail(
        email,
        "Welcome to Dream Land Newsletter",
        `<p>Hi! Thanks for subscribing to Dream Land newsletter.</p>`
      );
    } catch (err) {
      console.log("Email send failed", err);
    }

    return res.status(200).json({
      message: "Subscribed successfully",
      newsletter,
    });
  } catch (err) {
    console.error("Newsletter Error:", err);
    return res.status(500).json({ message: "Server error" });
  }
}
