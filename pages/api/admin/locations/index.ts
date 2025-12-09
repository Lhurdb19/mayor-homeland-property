// // pages/api/admin/locations.ts
// import type { NextApiRequest, NextApiResponse } from "next";
// import { connectDB } from "@/lib/db";
// import Property from "@/models/Property";

// export default async function handler(req: NextApiRequest, res: NextApiResponse) {
//   await connectDB();

//   if (req.method !== "GET") {
//     res.setHeader("Allow", "GET");
//     return res.status(405).end(`Method ${req.method} Not Allowed`);
//   }

//   try {
//     const locations = await Property.distinct("location");
//     return res.status(200).json(locations);
//   } catch (err) {
//     console.error(err);
//     return res.status(500).json({ message: "Failed to fetch locations" });
//   }
// }
