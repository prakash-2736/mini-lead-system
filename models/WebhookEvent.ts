import { Schema, model, models } from "mongoose";

const WebhookEventSchema = new Schema(
  {
    eventKey: {
      type: String,
      required: true,
      unique: true,
    },
    processedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true },
);

export const WebhookEvent =
  models.WebhookEvent || model("WebhookEvent", WebhookEventSchema);
