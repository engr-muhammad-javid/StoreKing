import mongoose, { Schema } from "mongoose";

const supplierSchema = new Schema({
  company: { type: String, required: true },
  name: { type: String, required: true },
  email: { type: String },
  phone: { type: String },
  image: { type: String },
  address: { type: String }
}, {
  timestamps: true
});

export default mongoose.model("Supplier", supplierSchema);
