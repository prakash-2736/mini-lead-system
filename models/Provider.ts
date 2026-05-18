import mongoose, { Schema, model, models } from "mongoose";

const ProviderSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    monthlyQuota: {
      type: Number,
      default: 10,
    },
    quotaRemaining: {
      type: Number,
      default: 10,
    },
  },
  { timestamps: true },
);

export const Provider = models.Provider || model("Provider", ProviderSchema);
