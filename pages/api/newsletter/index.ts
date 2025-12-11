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

    // Prevent duplicates
    const exists = await Newsletter.findOne({ email });
    if (exists) {
      return res.status(400).json({ message: "Email already subscribed" });
    }

    const newsletter = await Newsletter.create({ email, userId });

    // Admin notification
    await sendNotification({
      recipientType: "admin",
      title: "New Newsletter Subscription",
      message: `New subscriber: ${email}`,
      link: "/dashboard/admin/newsletter",
      type: "info",
    });

    // Auto-response email to subscriber
    try {
      await sendEmail(
        email,
        "🎉 Welcome to Mayor HomeLand Property Newsletter",
        `
          <h2 style="color:#0070f3; margin-bottom:10px;">Welcome to Mayor Homeland Property!</h2>
          <p>Hi there,</p>
          <p>Thanks for subscribing to our newsletter! You will now receive:</p>

          <ul>
            <li>🔥 Exclusive property listings</li>
            <li>🏡 Real estate market insights</li>
            <li>💼 Investment opportunities</li>
            <li>📩 Early access to new updates</li>
          </ul>

          <p>We’re excited to have you on board.</p>

          <p style="margin-top:20px;">
            Warm regards,  
            <br/><strong>Mayor Homeland Property Team</strong>
          </p>
        `
      );
    } catch (err) {
      console.log("Welcome email failed:", err);
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
