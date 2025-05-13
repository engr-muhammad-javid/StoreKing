import mongoose, { Schema } from "mongoose";

const languageSchema = new Schema({
  name: { type: String, required: true },
  code: { type: String, required: true, unique: true },
  image: { type: String }, // URL or filename
  displayMode: { type: String, enum: ["LTR", "RTL"], default: "LTR" },
  status: { type: String, enum: ["Active", "Inactive"], default: "Active" }
}, {
  timestamps: true
});

export default mongoose.model("Language", languageSchema);
