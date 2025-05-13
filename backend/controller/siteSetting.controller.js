import SiteSetting from "../model/siteSetting.model.js";
import { sendResponse, sendError } from "../helper/response.js";

// Create (only if no record exists)
export const createSiteSetting = async (req, res) => {
  try {
    const exists = await SiteSetting.findOne();
    if (exists) return sendResponse(res, false, "Site settings already exist");

    const setting = new SiteSetting(req.body);
    const saved = await setting.save();
    return sendResponse(res, true, "Site settings created", saved);
  } catch (err) {
    return sendError(res, err);
  }
};

// Get Site Setting Info
export const getSiteSetting = async (req, res) => {
  try {
    const setting = await SiteSetting.findOne().lean();
    if (!setting) return sendResponse(res, false, "Site settings not found");

    return sendResponse(res, true, "Site settings fetched", setting);
  } catch (err) {
    return sendError(res, err);
  }
};

// Update Site Setting Info (updates first record)
export const updateSiteSetting = async (req, res) => {
  try {
    const setting = await SiteSetting.findOne();
    if (!setting) return sendResponse(res, false, "Site settings not found");

    const updated = await SiteSetting.findByIdAndUpdate(setting._id, req.body, { new: true });
    return sendResponse(res, true, "Site settings updated", updated);
  } catch (err) {
    return sendError(res, err);
  }
};
