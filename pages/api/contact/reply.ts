// pages/api/contact/reply.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { connectDB } from "@/lib/db";
import Contact from "@/models/Contact";
import { sendEmail } from "@/lib/mail";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectDB();

  if (req.method === "POST") {
    const { contactId, message } = req.body;
    if (!contactId || !message) return res.status(400).json({ message: "Missing fields" });

    try {
      // Find the original user message
      const contact = await Contact.findById(contactId);
      if (!contact) return res.status(404).json({ message: "Contact not found" });

      // Create a new Contact document for the admin reply
      const adminReply = await Contact.create({
        name: contact.name,
        email: contact.email,
        message,
        userId: contact.userId,
        sender: "admin",
      });

      // Send email notification
      await sendEmail(contact.email, "Response from Dream Land", `<p>${message}</p>`);

      return res.status(201).json({ message: "Reply sent successfully", contact: adminReply });
    } catch (err: any) {
      console.error(err);
      return res.status(500).json({ message: "Server error" });
    }
  }

  return res.status(405).json({ message: "Method not allowed" });
}
