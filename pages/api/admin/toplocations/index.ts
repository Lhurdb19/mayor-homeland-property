// import type { NextApiRequest, NextApiResponse } from "next";
// import { connectDB } from "@/lib/db";
// import TopLocation from "@/models/TopLocation";

// export default async function handler(req: NextApiRequest, res: NextApiResponse) {
//   await connectDB();

//   if (req.method === "GET") {
//     try {
//       const locations = await TopLocation.find().lean();
//       return res.status(200).json(locations);
//     } catch (err) {
//       console.error(err);
//       return res.status(500).json({ message: "Failed to fetch top locations" });
//     }
//   }

//   if (req.method === "POST") {
//     try {
//       const { name, image } = req.body;
//       if (!name || !image) {
//         return res.status(400).json({ message: "Name and image are required" });
//       }

//       const existing = await TopLocation.findOne({ name });
//       if (existing) {
//         return res.status(400).json({ message: "Top location already exists" });
//       }

//       const topLocation = await TopLocation.create({ name, image });
//       return res.status(201).json(topLocation);
//     } catch (err) {
//       console.error(err);
//       return res.status(500).json({ message: "Failed to add top location" });
//     }
//   }

//   if (req.method === "PUT") {
//     try {
//       const { id, name, image } = req.body;
//       const updated = await TopLocation.findByIdAndUpdate(id, { name, image }, { new: true });
//       return res.status(200).json(updated);
//     } catch (err) {
//       console.error(err);
//       return res.status(500).json({ message: "Failed to update top location" });
//     }
//   }

//   if (req.method === "DELETE") {
//     try {
//       const { id } = req.body;
//       await TopLocation.findByIdAndDelete(id);
//       return res.status(200).json({ message: "Deleted successfully" });
//     } catch (err) {
//       console.error(err);
//       return res.status(500).json({ message: "Failed to delete top location" });
//     }
//   }

//   res.setHeader("Allow", ["GET", "POST", "PUT", "DELETE"]);
//   return res.status(405).end(`Method ${req.method} Not Allowed`);
// }
