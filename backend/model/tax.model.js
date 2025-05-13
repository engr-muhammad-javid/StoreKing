import mongoose, { Schema } from "mongoose";

const taxSchema = new Schema({
  name: { type: String, required: true },
  code: { type: String, required: true, unique: true },
  status: { type: String, enum: ["Active", "Inactive"], default: "Active" },
  taxRate: { type: Number, required: true } // Example: 5 for 5%
}, {
  timestamps: true
});

export default mongoose.model("Tax", taxSchema);
