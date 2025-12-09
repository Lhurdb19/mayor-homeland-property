// pages/api/contact.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { connectDB } from "@/lib/db";
import Contact from "@/models/Contact";
import { sendNotification } from "@/lib/notify";
import { sendEmail } from "@/lib/mail";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectDB();

  if (req.method === "POST") {
    const { name, email, phone, message, userId } = req.body;

    if (!name || !email || !message) return res.status(400).json({ message: "Missing fields" });

    try {
      // Save to DB
      const contact = await Contact.create({
          name,
          email,
          phone,
          message,
          userId,
          sender: "user",
        });


      // Notify Admin
      await sendNotification({
        recipientType: "admin",
        title: "New Contact Form Submission",
        message: `New message from ${name} (${email})`,
        link: "/dashboard/admin/contact",
      });

      // Auto-reply to user
      await sendEmail(
        email,
        "We received your message",
        `<p>Hi ${name},</p><p>Thank you for contacting us! We will get back to you shortly.</p>`
      );

      return res.status(201).json({ message: "Message sent successfully", contact });
    } catch (err: any) {
      console.error(err);
      return res.status(500).json({ message: "Server error" });
    }
  }

  return res.status(405).json({ message: "Method not allowed" });
}
