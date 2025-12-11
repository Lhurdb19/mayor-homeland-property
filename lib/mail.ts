import nodemailer from "nodemailer";

const LOGO_URL = `${process.env.NEXTAUTH_URL}/mayor.png`;

export const sendEmail = async (to: string, subject: string, bodyHtml: string) => {
  if (
    !process.env.EMAIL_USER ||
    !process.env.EMAIL_PASS ||
    !process.env.EMAIL_FROM ||
    !process.env.EMAIL_HOST ||
    !process.env.EMAIL_PORT
  ) {
    throw new Error("Missing email credentials in .env");
  }

  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT),
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const html = `
  <div style="font-family:Arial, sans-serif; background:#f2f4f7; padding:30px;">
    <div style="
      max-width:600px;
      margin:auto;
      background:white;
      border-radius:12px;
      overflow:hidden;
      box-shadow:0 4px 12px rgba(0,0,0,0.08);
    ">

      <!-- Header -->
      <div style="background:#0070f3; padding:25px; text-align:center;">
        <img src="${LOGO_URL}" alt="Mayor Homeland Property"
          style="width:170px; height:auto; object-fit:contain;" />
        <h2 style="color:white; margin-top:15px; font-size:20px; font-weight:600;">
          Response From Mayor Homeland Property
        </h2>
      </div>

      <!-- Body -->
      <div style="padding:30px; color:#333; line-height:1.7; font-size:15px;">
        ${bodyHtml}
      </div>

      <!-- Footer -->
      <div style="background:#f9fafb; padding:20px; text-align:center; color:#888; font-size:12px;">
        <p style="margin:0;">© ${new Date().getFullYear()} Mayor Homeland Property.</p>
        <p style="margin:5px 0;">Ayekale, Osogbo, Osun State</p>
        <p style="margin:0;">If you didn’t request this message, you may safely ignore it.</p>
      </div>

    </div>
  </div>
  `;

  return transporter.sendMail({
    from: `"Mayor Homeland Property" <${process.env.EMAIL_FROM}>`,
    to,
    subject,
    html,
  });
};
