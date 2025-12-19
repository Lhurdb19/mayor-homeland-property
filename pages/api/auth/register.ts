// pages/api/auth/register.ts
import crypto from "crypto";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import { sendEmail } from "@/lib/mail";
import { NextApiRequest, NextApiResponse } from "next";
import Notification from "@/models/Notification";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST")
    return res.status(405).json({ message: "Method not allowed" });

  await connectDB();
  const { firstName, lastName, email, password, role, phone, address } = req.body;

  // Validate Nigerian phone number
  const phoneRegex = /^(?:\+234|0)[789]\d{9}$/;
  if (!phoneRegex.test(phone))
    return res.status(400).json({ message: "Invalid Nigerian phone number" });

  // Check if user exists
  const userExists = await User.findOne({ email });
  if (userExists)
    return res.status(400).json({ message: "Email already exists" });

  // Hash password and generate verification token
  const hashedPassword = await bcrypt.hash(password, 12);
  const verificationToken = crypto.randomBytes(32).toString("hex");

  const user = await User.create({
    firstName,
    lastName,
    email,
    password: hashedPassword,
    role: role || "user",
    phone,
    address,
    emailVerificationToken: verificationToken,
  });


  // 🔔 ADMIN NOTIFICATION
  await Notification.create({
    recipientType: "admin",
    title: "New User Registration",
    message: `${firstName} ${lastName} registered and needs verification.`,
    link: `/admin/users/${user._id}`,
    type: "info",
  });

  const verifyUrl = `${process.env.NEXTAUTH_URL}/auth/verify-email?token=${verificationToken}`;

  // Polished email template
  const bodyHtml = `
    <h2 style="text-align:center; color:#0070f3;">Welcome ${firstName}!</h2>
    <p style="text-align:center; color:#333;">Thank you for registering at Mayor Homeland Property. Click the button below to verify your email and complete your registration.</p>
    <p style="text-align:center; margin: 20px 0;">
      <a href="${verifyUrl}" style="padding:12px 25px; background-color:#0070f3; color:white; text-decoration:none; border-radius:6px; font-weight:bold;">Verify Email</a>
    </p>
    <p style="text-align:center; font-size:12px; color:#888;">If you did not register, you can safely ignore this email.</p>
  `;

  await sendEmail(email, "Verify Your Email", bodyHtml);

  res.status(201).json({ success: true, message: "Account created successfully! Check your email to verify." });
}
