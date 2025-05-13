import Benefit from "../model/benefit.model.js";
import { sendResponse, sendError } from "../helper/response.js";

// Create Benefit
export const createBenefit = async (req, res) => {
  try {
    const benefit = new Benefit(req.body);
    const saved = await benefit.save();
    return sendResponse(res, true, "Benefit created", saved);
  } catch (err) {
    return sendError(res, err);
  }
};

// Get All Benefits
export const getAllBenefits = async (req, res) => {
  try {
    const benefits = await Benefit.find().lean();
    return sendResponse(res, true, "All benefits", benefits);
  } catch (err) {
    return sendError(res, err);
  }
};

// Get Single Benefit
export const getSingleBenefit = async (req, res) => {
  try {
    const benefit = await Benefit.findById(req.params.id).lean();
    if (!benefit) return sendResponse(res, false, "Benefit not found");

    return sendResponse(res, true, "Benefit found", benefit);
  } catch (err) {
    return sendError(res, err);
  }
};

// Update Benefit
export const updateBenefit = async (req, res) => {
  try {
    const updated = await Benefit.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return sendResponse(res, false, "Benefit not found");

    return sendResponse(res, true, "Benefit updated", updated);
  } catch (err) {
    return sendError(res, err);
  }
};

// Delete Benefit
export const deleteBenefit = async (req, res) => {
  try {
    const deleted = await Benefit.findByIdAndDelete(req.params.id);
    if (!deleted) return sendResponse(res, false, "Benefit not found");

    return sendResponse(res, true, "Benefit deleted");
  } catch (err) {
    return sendError(res, err);
  }
};
