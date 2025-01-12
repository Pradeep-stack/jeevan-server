import mongoose, { Schema } from "mongoose";
const orderSchema = new Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  quantity: { type: Number, required: true },
  totalPrice: { type: Number, required: true },
  status: {
    type: String,
    enum: ["Pending", "Reject", "Approve"],
    default: "Pending"
  },
  createdAt: { type: Date, default: Date.now },
});

export const Order = mongoose.model("Order", orderSchema);
