// lib/mail.ts
import nodemailer from "nodemailer";

// Hosted logo URL
const LOGO_URL = `${process.env.NEXTAUTH_URL}/mayor.png`;

export const sendEmail = async (to: string, subject: string, bodyHtml: string) => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS || !process.env.EMAIL_FROM || !process.env.EMAIL_HOST || !process.env.EMAIL_PORT) {
    throw new Error("Missing email credentials in .env");
  }

  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT),
    secure: false, // false for port 587
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const html = `
  <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color:#f4f6f8; padding: 30px;">
    <div style="max-width: 600px; margin: auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.1);">
      
      <!-- Logo Section -->
      <div style="text-align: center; padding: 25px; background-color: #0070f3;">
        <img src="${LOGO_URL}" alt="Mayor Homeland Property" style="width: 160px; height: auto; object-fit: contain;" />
      </div>

      <!-- Body Section -->
      <div style="padding: 30px; color: #333; line-height: 1.6;">
        ${bodyHtml}
      </div>

      <!-- Button / CTA -->
      <div style="padding: 0 30px 30px; text-align: center;">
        <a href="${bodyHtml.includes('href') ? '' : '#'}" 
          style="display: inline-block; padding: 12px 25px; background-color: #0070f3; color: white; text-decoration: none; border-radius: 6px; font-weight: bold; margin-top: 10px;">
          ${bodyHtml.includes('href') ? '' : 'Click Here'}
        </a>
      </div>

      <!-- Footer -->
      <div style="padding: 20px; background-color: #f9f9f9; text-align: center; font-size: 12px; color: #888;">
        If you didn’t request this email, you can safely ignore it.
      </div>

    </div>
  </div>
  `;

  const info = await transporter.sendMail({
    from: `"Mayor Homeland Property" <${process.env.EMAIL_FROM}>`,
    to,
    subject,
    html,
  });

  return info;
};
