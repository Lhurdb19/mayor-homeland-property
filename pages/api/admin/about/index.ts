// pages/api/admin/about/index.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { connectDB } from "@/lib/db";
import About from "@/models/About";
import { uploadImage } from "@/lib/cloudinary";

export const config = {
    api: {
        bodyParser: {
            sizeLimit: "10mb",
        },
    },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    await connectDB();


    if (req.method === "GET") {
        try {
            const about = await About.findOne();
            return res.status(200).json({ success: true, data: about });
        } catch (err) {
            console.error(err);
            return res.status(500).json({ success: false, message: "Server error" });
        }
    }

    if (req.method === "PUT") {
        try {
            const payload = req.body;

            // Extract fields
            const {
                foundedYear,
                foundedLocation,
                mission,
                vision,
                story,
                ownerName,
                ownerImage,
                bannerImage,
                team = [],
            } = payload;

            // Helper: upload if base64 data URL
            const maybeUpload = async (val: string) => {
                if (!val) return val;
                if (typeof val === "string" && val.startsWith("data:")) {
                    const result = await uploadImage(val);
                    return result.secure_url;
                }
                return val;
            };

            const uploadedOwnerImage = await maybeUpload(ownerImage);
            const uploadedBannerImage = await maybeUpload(bannerImage);

            // Team member image uploads
            const processedTeam = [];
            for (const member of team) {
                const img = await maybeUpload(member.image || "");
                processedTeam.push({
                    name: member.name || "",
                    role: member.role || "",
                    image: img || "",
                    facebook: member.facebook || "",
                    instagram: member.instagram || "",
                    twitter: member.twitter || "",
                    linkedin: member.linkedin || "",
                });

            }

            const about = await About.findOneAndUpdate(
                {},
                {
                    foundedYear,
                    foundedLocation,
                    mission,
                    vision,
                    story,
                    ownerName,
                    ownerImage: uploadedOwnerImage,
                    bannerImage: uploadedBannerImage,
                    team: processedTeam,
                },
                { upsert: true, new: true }
            );

            return res.status(200).json({ success: true, data: about });
        } catch (err) {
            console.error(err);
            return res.status(500).json({ success: false, message: "Server error" });
        }
    }

    res.setHeader("Allow", "GET, PUT");
    return res.status(405).end("Method Not Allowed");
}
