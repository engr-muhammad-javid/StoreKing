import mongoose, { Schema } from "mongoose";

const taxSchema = new Schema({
  name: { type: String, required: true },
  code: { type: String, required: true, unique: true },
  isActive: {type: Boolean,default: true},
  taxRate: { type: Number, required: true } // Example: 5 for 5%
}, {
  timestamps: true
});

export default mongoose.model("Tax", taxSchema);
