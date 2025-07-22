import OtpSetting from "../model/otpSetting.model.js";
import { sendResponse, sendError } from "../helper/response.js";

// Create (only if no record exists)
export const createOtpSetting = async (req, res) => {
  try {
    const exists = await OtpSetting.findOne();
    if (exists) return sendResponse(res, false, "OTP settings already exist");

    const setting = new OtpSetting(req.body);
    const saved = await setting.save();
    return sendResponse(res, true, "OTP settings created", saved);
  } catch (err) {
    return sendError(res, err);
  }
};

// Get OTP Settings
export const getOtpSetting = async (req, res) => {
  try {
    const setting = await OtpSetting.findOne().lean();
    if (!setting) return sendResponse(res, false, "OTP settings not found");

    return sendResponse(res, true, "OTP settings fetched", setting);
  } catch (err) {
    return sendError(res, err);
  }
};

// Update OTP Settings (always updates the first record)
export const updateOtpSetting = async (req, res) => {
  try {
    const setting = await OtpSetting.findOne();
    if (!setting) return sendResponse(res, false, "OTP settings not found");

    const updated = await OtpSetting.findByIdAndUpdate(setting._id, req.body, { new: true });
    return sendResponse(res, true, "OTP settings updated", updated);
  } catch (err) {
    return sendError(res, err);
  }
};
