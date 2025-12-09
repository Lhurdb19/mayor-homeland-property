import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import * as speakeasy from "speakeasy";
import QRCode from "qrcode";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") return res.status(405).end();

  await connectDB();
  const session = await getServerSession(req, res, authOptions);
  if (!session) return res.status(401).json({ message: "Unauthorized" });

  const secret = speakeasy.generateSecret({
    name: "Dream Land (2FA)",
  });

  const qrCodeDataURL = await QRCode.toDataURL(secret.otpauth_url!);

  return res.json({
    secret: secret.base32,
    qr: qrCodeDataURL,
  });
}
