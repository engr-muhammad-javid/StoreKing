import mongoose, { Schema } from "mongoose";

const benefitSchema = new Schema({
  title: { type: String, required: true },
  status: { type: String, enum: ["Active", "Inactive"], default: "Active" },
  image: { type: String },
  description: { type: String }
}, {
  timestamps: true
});

export default mongoose.model("Benefit", benefitSchema);
