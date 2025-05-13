import mongoose, { Schema } from "mongoose";

const siteSettingSchema = new Schema({
  siteName: { type: String, required: true },
  logoUrl: { type: String },
  faviconUrl: { type: String },
  supportEmail: { type: String },
  contactNumber: { type: String },
  metaTitle: { type: String },
  metaDescription: { type: String },
  metaKeywords: { type: String },
  footerText: { type: String },
  currencyPosition: { type: String, enum: ["left", "right"], default: "left" }, // ($) Left or Right ($)
  cashOnDelivery: { type: Boolean, default: true }, // Enable or Disable
  isReturnPriceToCredit: { type: Boolean, default: false }, // Yes or No
  onlinePaymentGateway: { type: Boolean, default: true }, // Enable or Disable
  languageSwitch: { type: Boolean, default: true }, // Enable or Disable
  pickUp: { type: Boolean, default: false }, // Enable or Disable
  emailVerification: { type: Boolean, default: false }, // Enable or Disable
  phoneVerification: { type: Boolean, default: false }, // Enable or Disable
  appDebug: { type: Boolean, default: false }, // Enable or Disable

}, {
  timestamps: true,
});

export default mongoose.model("SiteSetting", siteSettingSchema);
