import mongoose, { Schema } from "mongoose";

const packagesSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    packagePlan: {
      type: String,
      enum: ["package-1", "package-2", "package-3"],
    },
    plan: {
      type: String,
      required: true,
    },
    benefits: {
      type: [String],
      required: true,
    },
    subscription: {
      type: String,
      required: true,
    },
    lifetime: {
      type: Boolean,
      default: false,
    },
    renewable: {
      type: Boolean,
      default: false,
    },
    workingArea: {
      type: String,
      required: true,
    },
    overseas: {
      type: Boolean,
      default: false,
    },
    region:{
      type: String,
      enum:["india", "nepal"],
      required: true
    },
    status: {
      type: String,
      enum: ["Pending", "Reject", "Approve"],
      default: "Pending"
    }
  },
  {
    timestamps: true,
  }
);

export const Packages = mongoose.model("Packages", packagesSchema);
