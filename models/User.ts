import mongoose, { Schema, Document, model, models } from "mongoose";

export interface IUser extends Document {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: string;
  phone: string;
  address: string;
  isVerified?: boolean;
  emailVerificationToken?: string;
  resetToken?: string;
  resetTokenExpiry?: number;
  createdAt: Date;
  updatedAt: Date;
  theme: string;
  twoFAEnabled: boolean;
  twoFASecret?: string | null;
}

const UserSchema = new Schema<IUser>(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, default: "user" },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    isVerified: { type: Boolean, default: false },
    emailVerificationToken: { type: String },
    resetToken: { type: String },
    resetTokenExpiry: { type: Number },
    theme: { type: String, default: "system" },
    twoFAEnabled: { type: Boolean, default: false },
    twoFASecret: { type: String, default: null },
  },
  { timestamps: true }
);

// Virtual field for full name
UserSchema.virtual("name").get(function () {
  return `${this.firstName} ${this.lastName}`;
});

// Ensure virtual fields are serialized
UserSchema.set("toJSON", { virtuals: true });
UserSchema.set("toObject", { virtuals: true });

export default models.User || model<IUser>("User", UserSchema);
