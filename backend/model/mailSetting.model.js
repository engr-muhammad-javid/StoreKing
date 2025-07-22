import mongoose, { Schema } from "mongoose";

const mailSettingSchema = new Schema({
  mailHost: { type: String, required: true },
  mailPort: { type: Number, required: true },
  mailUsername: { type: String, required: true },
  mailPassword: { type: String, required: true },
  mailFromName: { type: String, required: true },
  mailFromEmail: { type: String, required: true },
  mailEncryption: { type: String, enum: ["SSL", "TLS"], required: true },
}, {
  timestamps: true,
});

export default mongoose.model("MailSetting", mailSettingSchema);
