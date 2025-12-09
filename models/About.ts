// models/About.ts
import mongoose, { Schema, Document, models } from "mongoose";

export interface IAbout extends Document {
    foundedYear: string;
    foundedLocation: string;
    mission: string;
    vision: string;
    story: string;
    ownerName: string;
    ownerImage: string;
    bannerImage: string;
    team: { name: string; role: string; image: string }[];
    createdAt: Date;
    updatedAt: Date;
}

const TeamMemberSchema = new Schema({
    name: String,
    role: String,
    image: String,
    facebook: String,
    instagram: String,
    twitter: String,
    linkedin: String,
});


const AboutSchema = new Schema<IAbout>(
    {
        foundedYear: { type: String, required: true },
        foundedLocation: { type: String, required: true },
        mission: { type: String, required: true },
        vision: { type: String, required: true },
        story: { type: String, required: true },
        ownerName: { type: String, required: true },
        ownerImage: { type: String, required: true },
        bannerImage: { type: String, required: true },
        team: [TeamMemberSchema],
    },
    { timestamps: true }
);

export default models.About || mongoose.model<IAbout>("About", AboutSchema);
