import mongoose, { Schema, model, models } from "mongoose";

const RoundRobinStateSchema = new Schema(
  {
    serviceId: {
      type: Schema.Types.ObjectId,
      ref: "Service",
      required: true,
      unique: true,
    },
    cursorIndex: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true },
);

export const RoundRobinState =
  models.RoundRobinState || model("RoundRobinState", RoundRobinStateSchema);
