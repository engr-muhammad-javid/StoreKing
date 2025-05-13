import mongoose, { Schema } from "mongoose";

const outletSchema = new Schema({
  name: { type: String, required: true },
  latitude: { type: Number },
  longitude: { type: Number },
  email: { type: String },
  phone: { type: String },
  deliveryZone: { type: Schema.Types.ObjectId, ref: "DeliveryZone", required: true },
  status: { type: String, enum: ["Active", "Inactive"], default: "Active" },
  address: { type: String }
}, {
  timestamps: true
});

export default mongoose.model("Outlet", outletSchema);
