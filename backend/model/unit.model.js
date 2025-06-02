import mongoose, { Schema } from "mongoose";

const unitSchema = new Schema({
  name: { type: String, required: true },
  code: { type: String, required: true },
  isActive: {type: Boolean,default: true}
}, {
  timestamps: true
});

export default mongoose.model("Unit", unitSchema);
