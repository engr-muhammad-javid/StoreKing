import mongoose, { Schema } from "mongoose";

const companySettingSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String },
  website: { type: String },
  phone: { type: String },
  latitude: { type: Number },
  longitude: { type: Number },
  city: { type: String },
  state: { type: String },
  zipCode: { type: String },
  address: { type: String },
  countryCode: { type: String },
}, {
  timestamps: true,
});

export default mongoose.model("CompanySetting", companySettingSchema);
