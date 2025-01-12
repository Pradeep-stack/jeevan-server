import mongoose, { Schema } from "mongoose";

const PurchaseSchema = new Schema({
  productId: {
    type: Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  quantity: {
    type: Number,
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  name: { type: String, required: true },
  email: { type: String, required: true },
  mobile: { type: String, required: true },
  address: { type: String, required: true },
  serviceName: { type: String, required: true },
  serviceFor: { type: String, enum: ["Self", "Client"], default: "Self" },
  requiredDocuments: { type: String, required: true },
  comment: { type: String },
  purchaseDate: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    enum: ["Pending", "Reject", "Approve","Paid", "Failed"],
    default: "Pending",
  },
});

export const Purchase = mongoose.model("Purchase", PurchaseSchema);
