import crypto from "crypto";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import { sendEmail } from "@/lib/mail";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "POST") return res.status(405).json({ message: "Method not allowed" });

    await connectDB();
    const { firstName, lastName, email, password, role, phone, address } = req.body;

    // Validate Nigerian phone number
    const phoneRegex = /^(?:\+234|0)[789]\d{9}$/;
    if (!phoneRegex.test(phone)) return res.status(400).json({ message: "Invalid Nigerian phone number" });

    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: "Email already exists" });

    const hashedPassword = await bcrypt.hash(password, 12);
    const verificationToken = crypto.randomBytes(32).toString("hex");

    const newUser = await User.create({
        firstName,
        lastName,
        email,
        password: hashedPassword,
        role: role || "user",
        phone,
        address,
        emailVerificationToken: verificationToken,
    });

    // Send verification link
    const verifyUrl = `${process.env.NEXTAUTH_URL}/auth/verify-email?token=${verificationToken}`;
    await sendEmail(
        email,
        "Verify Your Email",
        `<p>Welcome ${firstName},</p><p>Click <a href="${verifyUrl}">here</a> to verify your email and complete your registration.</p>`
    );

    res.status(201).json({ success: true, message: "Account created successfully! Check your email to verify." });
}
