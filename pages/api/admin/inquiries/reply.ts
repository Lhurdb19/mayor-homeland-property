// pages/api/admin/inquiries/reply.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { sendEmail } from "@/lib/mail";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST")
    return res.status(405).json({ error: "Method not allowed" });

  const { email, subject, message } = req.body;

  try {
    const html = `
      <h2 style="color:#0070f3; margin-bottom:10px;">Hello,</h2>
      <p style="font-size:16px; color:#444;">
        Thank you for reaching out to <strong>Mayor Homeland Property</strong>.
      </p>

      <p style="font-size:16px; margin-top:15px; color:#444;">
        Below is our response to your inquiry:
      </p>

      <div style="
        background:#f1f4ff;
        padding:18px;
        border-left:4px solid #0070f3;
        border-radius:6px;
        margin-top:15px;
        font-size:15px;
        color:#333;
      ">
        ${message}
      </div>

      <p style="margin-top:25px; font-size:15px; color:#444;">
        If you need more details, feel free to contact our support team anytime.
      </p>

      <p style="margin-top:15px; font-size:15px; font-weight:bold; color:#222;">
        – Mayor Homeland Property Team
      </p>
    `;

    await sendEmail(email, subject, html);

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("Email Error:", error);
    return res.status(500).json({ error: "Failed to send email" });
  }
}
