import axios from "axios";
import type { NextApiRequest, NextApiResponse } from "next";
import { connectDB } from "@/lib/db";
import WalletTransaction from "@/models/WalletTransaction";
import Notification from "@/models/Notification";
import User from "@/models/User";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    await connectDB();

    const { transaction_id, userId, amount } = req.body;

    if (!transaction_id || !userId || !amount) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // 🔍 Verify with Flutterwave
    const verifyRes = await axios.get(
      `https://api.flutterwave.com/v3/transactions/${transaction_id}/verify`,
      {
        headers: {
          Authorization: `Bearer ${process.env.FLW_SECRET_KEY}`,
        },
      }
    );

    if (verifyRes.data.status !== "success") {
      return res.status(400).json({ message: "Verification failed" });
    }

    // 🔁 Prevent duplicate credit
    const existingTx = await WalletTransaction.findOne({
      reference: transaction_id,
    });

    if (existingTx) {
      return res.status(200).json({
        message: "Transaction already processed",
      });
    }

    // 👤 Find user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // 💰 Update wallet balance
    user.walletBalance = (user.walletBalance || 0) + amount;
    await user.save();

    // 🧾 Save wallet transaction (FIXED)
    await WalletTransaction.create({
      user: user._id,                 // ✅ REQUIRED FIELD
      type: "credit",
      amount,
      status: "success",              // ✅ VALID ENUM
      description: "Wallet top-up via Flutterwave",
      reference: transaction_id,
    });

    // 🔔 CREATE USER NOTIFICATION
await Notification.create({
  recipient: user._id,
  recipientType: "user",
  title: "Wallet Credited",
  message: `Your wallet has been credited with ₦${amount.toLocaleString()}.`,
  type: "success",
});


    return res.status(200).json({
      success: true,
      balance: user.walletBalance,
    });
  } catch (error) {
    console.error("Flutterwave Verify Error:", error);
    return res.status(500).json({ message: "Server error" });
  }
}
