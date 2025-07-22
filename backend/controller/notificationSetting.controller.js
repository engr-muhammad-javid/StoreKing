import NotificationSetting from "../model/notificationSetting.model.js";
import { sendResponse, sendError } from "../helper/response.js";

// Create (only if no record exists)
export const createNotificationSetting = async (req, res) => {
  try {
    const exists = await NotificationSetting.findOne();
    if (exists) return sendResponse(res, false, "Notification settings already exist");
    const data = {
      ...req.body,
      firebaseJsonFile: req.file ? req.file.filename : undefined,
    };
    

    const setting = new NotificationSetting(data);
    const saved = await setting.save();
    return sendResponse(res, true, "Notification settings created", saved);
  } catch (err) {
    return sendError(res, err);
  }
};

// Get Notification Settings
export const getNotificationSetting = async (req, res) => {
  try {
    const setting = await NotificationSetting.findOne().lean();
    if (!setting) return sendResponse(res, false, "Notification settings not found");

    return sendResponse(res, true, "Notification settings fetched", setting);
  } catch (err) {
    return sendError(res, err);
  }
};

// Update Notification Settings
export const updateNotificationSetting = async (req, res) => {
  try {
    const setting = await NotificationSetting.findOne();
    if (!setting) return sendResponse(res, false, "Notification settings not found");

    const updateData = {
      ...req.body,
    };

    if (req.file) {
      updateData.firebaseJsonFile = req.file.filename;
    }

    const updated = await NotificationSetting.findByIdAndUpdate(setting._id, updateData, { new: true });
    return sendResponse(res, true, "Notification settings updated", updated);
  } catch (err) {
    return sendError(res, err);
  }
};
