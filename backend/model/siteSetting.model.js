import mongoose, { Schema } from "mongoose";

const siteSettingSchema = new Schema({
  dateFormat: { type: String, default: "d-m-Y", required: true }, // e.g., 03-06-2025
  timeFormat: { type: String, enum: ["12 Hour", "24 Hour"], default: "12 Hour", required: true }, // 12 Hour or 24 Hour
  defaultTimezone: { type: String, default: "Asia/Dhaka", required: true },
  defaultLanguage: { type: String, default: "English", required: true },
  defaultSmsGateway: { type: String, default: "" },
  copyright: { type: String, required: true },
  androidAppLink: { type: String },
  iosAppLink: { type: String },
  nonPurchaseProductMaxQty: { type: Number, default: 100, required: true },
  digitAfterDecimal: { type: Number, default: 2, required: true },
  defaultCurrency: { type: String, default: "Dollars ($)", required: true },
  currencyPosition: {
    type: String,
    enum: ["left", "right"],
    default: "left",
    required: true,
  }, // ($) Left or Right ($)
  cashOnDelivery: { type: Boolean, default: true, required: true }, // Enable or Disable
  isReturnPriceToCredit: { type: Boolean, default: false, required: true }, // Enable or Disable
  onlinePaymentGateway: { type: Boolean, default: true, required: true }, // Enable or Disable
  languageSwitch: { type: Boolean, default: true, required: true }, // Enable or Disable
  pickUp: { type: Boolean, default: false, required: true }, // Enable or Disable
  emailVerification: { type: Boolean, default: false, required: true }, // Enable or Disable
  phoneVerification: { type: Boolean, default: false, required: true }, // Enable or Disable
  appDebug: { type: Boolean, default: false, required: true }, // Enable or Disable
  googleMapKey: { type: String, required: true },
}, {
  timestamps: true,
});

export default mongoose.model("SiteSetting", siteSettingSchema);