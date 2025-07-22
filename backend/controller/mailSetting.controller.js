import MailSetting from "../model/mailSetting.model.js";
import { sendResponse, sendError } from "../helper/response.js";

// Create (only if no record exists)
export const createMailSetting = async (req, res) => {
  try {
    const exists = await MailSetting.findOne();
    if (exists) return sendResponse(res, false, "Mail settings already exist");

    const setting = new MailSetting(req.body);
    const saved = await setting.save();
    return sendResponse(res, true, "Mail settings created", saved);
  } catch (err) {
    return sendError(res, err);
  }
};

// Get Mail Settings
export const getMailSetting = async (req, res) => {
  try {
    const setting = await MailSetting.findOne().lean();
    if (!setting) return sendResponse(res, false, "Mail settings not found");

    return sendResponse(res, true, "Mail settings fetched", setting);
  } catch (err) {
    return sendError(res, err);
  }
};

// Update Mail Settings (always updates the first record)
export const updateMailSetting = async (req, res) => {
  try {
    const setting = await MailSetting.findOne();
    if (!setting) return sendResponse(res, false, "Mail settings not found");

    const updated = await MailSetting.findByIdAndUpdate(setting._id, req.body, { new: true });
    return sendResponse(res, true, "Mail settings updated", updated);
  } catch (err) {
    return sendError(res, err);
  }
};
