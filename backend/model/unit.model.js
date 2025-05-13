import mongoose, { Schema } from "mongoose";

const unitSchema = new Schema({
  name: { type: String, required: true },
  code: { type: String, required: true },
  status: { type: String, enum: ["Active", "Inactive"], default: "Active" }
}, {
  timestamps: true
});

export default mongoose.model("Unit", unitSchema);
