import mongoose, { Schema } from "mongoose";

const brandSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String },
  image: { type: String },
  slug: { type: String, required: true, unique: true },
  isActive: { type: Boolean, default: true },
}, {
  timestamps: true
});

export default mongoose.model("Brand", brandSchema);
