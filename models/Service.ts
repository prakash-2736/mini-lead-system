import mongoose, { Schema, model, models } from "mongoose";

const ServiceSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
  },
  { timestamps: true },
);

export const Service = models.Service || model("Service", ServiceSchema);
