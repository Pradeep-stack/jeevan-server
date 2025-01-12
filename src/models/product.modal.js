import mongoose, { Schema } from "mongoose";

const productSchema = new Schema(
  {
    image: {
      type: String,
    //   required: true,
    },
    category: {
      type: String,
      required: true,
    },
    service_code: {
      type: String,
      required: true,
    },
    service_price: {
      type: String,
      required: true,
    },
    service_name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    associateDiscount:{
      type: Number,
      default: 0
    },
    userDiscount:{
      type: Number,
      default: 0
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

export const Product = mongoose.model("Product", productSchema)