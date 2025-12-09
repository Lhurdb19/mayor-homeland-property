import mongoose, { Schema, model, models } from "mongoose";

const FavoriteSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    property: { type: Schema.Types.ObjectId, ref: "Property", required: true },
  },
  { timestamps: true }
);

export default models.Favorite || model("Favorite", FavoriteSchema);
