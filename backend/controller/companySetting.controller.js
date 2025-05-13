import Company from "../model/companySetting.model.js";
import { sendResponse, sendError } from "../helper/response.js";

// Create (only if no record exists)
export const createCompany = async (req, res) => {
  try {
    const exists = await Company.findOne();
    if (exists) return sendResponse(res, false, "Company info already exists");

    const company = new Company(req.body);
    const saved = await company.save();
    return sendResponse(res, true, "Company info created", saved);
  } catch (err) {
    return sendError(res, err);
  }
};

// Get Company Info
export const getCompany = async (req, res) => {
  try {
    const company = await Company.findOne().lean();
    if (!company) return sendResponse(res, false, "Company info not found");

    return sendResponse(res, true, "Company info fetched", company);
  } catch (err) {
    return sendError(res, err);
  }
};

// Update Company Info (always updates the first record)
export const updateCompany = async (req, res) => {
  try {
    const company = await Company.findOne();
    if (!company) return sendResponse(res, false, "Company info not found");

    const updated = await Company.findByIdAndUpdate(company._id, req.body, { new: true });
    return sendResponse(res, true, "Company info updated", updated);
  } catch (err) {
    return sendError(res, err);
  }
};
