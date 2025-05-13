import mongoose, { Schema } from "mongoose";

const pageSchema = new Schema({
  title: { type: String, required: true },
  menuSection: { type: String }, // e.g., Header, Footer, Sidebar
  status: { type: String, enum: ["Active", "Inactive"], default: "Active" },
  menuTemplate: { type: String }, // e.g., default, template1, etc.
  image: { type: String },
  description: { type: String }, // Store rich text HTML
}, {
  timestamps: true
});

export default mongoose.model("Page", pageSchema);
