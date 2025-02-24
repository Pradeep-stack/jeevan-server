import mongoose, { Schema } from "mongoose";

const transactionSchema = new Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, required: true },
    packageId: { type: mongoose.Schema.Types.ObjectId},
    price: { type: Number, required: true },
    transactionId: { type: String, required: true }, // Unique ID from payment
    status: { type: String, default: "pending" }, // e.g., pending, completed, failed
    createdAt: { type: Date, default: Date.now },
  },
);

export const Transaction = mongoose.model("Transaction", transactionSchema);
