import mongoose, { Schema } from "mongoose";

const deliveryZoneSchema = new Schema({
  name: { type: String, required: true },
  latitude: { type: Number },
  longitude: { type: Number },
  email: { type: String },
  phone: { type: String },
  deliveryRadiusKm: { type: Number },
  deliveryChargePerKm: { type: Number },
  minimumOrderAmount: { type: Number },
  status: { type: String, enum: ['active', 'inactive'], default: 'active' },
  address: { type: String }
}, {
  timestamps: true,
});

export default mongoose.model("DeliveryZone", deliveryZoneSchema);
