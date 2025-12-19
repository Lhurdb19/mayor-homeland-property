import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await connectDB();

  const users = await User.aggregate([
    {
      $group: {
        _id: { $month: "$createdAt" },
        count: { $sum: 1 },
      },
    },
    { $sort: { "_id": 1 } },
  ]);

  const monthNames = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
  ];

  const growthData = monthNames.map((month, index) => {
    const found = users.find(u => u._id === index + 1);
    return {
      month,
      users: found ? found.count : 0,
    };
  });

  const totalUsers = growthData.reduce((a, b) => a + b.users, 0);

  res.status(200).json({
    totalUsers,
    growth: growthData,
  });
}
