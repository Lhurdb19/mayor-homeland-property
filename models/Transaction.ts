import mongoose, { Schema, Document, model, models } from "mongoose";

export interface ITransaction extends Document {
  propertyId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  amount: number;
  status: "pending" | "completed" | "refunded";
  method: "bank" | "card" | "wallet";
  createdAt: Date;
  updatedAt: Date;
}

const TransactionSchema = new Schema<ITransaction>(
  {
    propertyId: { type: mongoose.Types.ObjectId, ref: "Property", required: true },
    userId: { type: mongoose.Types.ObjectId, ref: "User", required: true },
    amount: { type: Number, required: true },
    status: { type: String, enum: ["pending", "completed", "refunded"], default: "pending" },
    method: { type: String, enum: ["bank", "card", "wallet"], default: "card" },
  },
  { timestamps: true }
);

export default models.Transaction || model<ITransaction>("Transaction", TransactionSchema);
