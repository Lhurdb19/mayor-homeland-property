import mongoose, { Schema, Document, models, model } from "mongoose";

export interface IWalletTransaction extends Document {
  user: mongoose.Types.ObjectId;
  type: "credit" | "debit";
  amount: number;
  status: "success" | "pending" | "failed";
  description: string;
  reference: string;
  createdAt: Date;
}

const WalletTransactionSchema = new Schema<IWalletTransaction>(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    type: {
      type: String,
      enum: ["credit", "debit"],
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["success", "pending", "failed"],
      default: "success",
    },
    description: {
      type: String,
      required: true,
    },
    reference: {
      type: String,
      required: true,
      unique: true,
    },
  },
  { timestamps: true }
);

export default models.WalletTransaction ||
  model<IWalletTransaction>("WalletTransaction", WalletTransactionSchema);
