import mongoose, { Schema } from "mongoose";

const notificationSettingSchema = new Schema({
  firebaseVapidKey: { type: String, required: true },
  firebaseApiKey: { type: String, required: true },
  firebaseAuthDomain: { type: String, required: true },
  firebaseProjectId: { type: String, required: true },
  firebaseStorageBucket: { type: String, required: true },
  firebaseMessageSenderId: { type: String, required: true },
  firebaseAppId: { type: String, required: true },
  firebaseMeasurementId: { type: String, required: true },
  firebaseJsonFile: { type: String }, // store uploaded filename
}, {
  timestamps: true,
});

export default mongoose.model("NotificationSetting", notificationSettingSchema);
