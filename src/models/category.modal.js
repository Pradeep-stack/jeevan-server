import mongoose, { Schema } from "mongoose";

const categorySchem = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    image: {
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

export const Category = mongoose.model("Category", categorySchem);
