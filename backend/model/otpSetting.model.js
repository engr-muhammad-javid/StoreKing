import mongoose, { Schema } from "mongoose";

const otpSettingSchema = new Schema({
  otpType: {
    type: String,
    enum: ["SMS", "Email", "Both"],
    required: true,
  },
  otpDigitLimit: {
    type: Number,
    enum: [4, 6, 8],
    required: true,
  },
  otpExpireTime: {
    type: String,
    enum: [
      "5 Minutes",
      "10 Minutes",
      "15 Minutes",
      "20 Minutes",
      "30 Minutes",
      "60 Minutes"
    ],
    required: true,
  },
}, {
  timestamps: true,
});

export default mongoose.model("OtpSetting", otpSettingSchema);
