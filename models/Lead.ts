import mongoose, { Schema, model, models } from "mongoose";

const LeadSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    description: String,
    serviceId: {
      type: Schema.Types.ObjectId,
      ref: "Service",
      required: true,
    },
  },
  { timestamps: true },
);

LeadSchema.index({ phone: 1, serviceId: 1 }, { unique: true });

export const Lead = models.Lead || model("Lead", LeadSchema);
