import mongoose, { Schema } from "mongoose";

const videoSchema = new Schema(
  {
    url: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    region:{
      type: String,
      enum:["india", "nepal"],
      required: true
    }
  },
  {
    timestamps: true,
  }
);

export const Video = mongoose.model("Video", videoSchema)