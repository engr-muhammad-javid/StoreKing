import Tax from "../model/tax.model.js";
import { sendResponse, sendError } from "../helper/response.js";

// Create Tax
export const createTax = async (req, res) => {
  try {
    const exists = await Tax.findOne({ code: req.body.code });
    if (exists) return sendResponse(res, false, "Tax with this code already exists");

    const tax = new Tax(req.body);
    const saved = await tax.save();
    return sendResponse(res, true, "Tax created", saved);
  } catch (err) {
    return sendError(res, err);
  }
};

// Get All Taxes
export const getAllTaxes = async (req, res) => {
  try {
    const taxes = await Tax.find().lean();
    return sendResponse(res, true, "All taxes", taxes);
  } catch (err) {
    return sendError(res, err);
  }
};

// Get Single Tax
export const getSingleTax = async (req, res) => {
  try {
    const tax = await Tax.findById(req.params.id).lean();
    if (!tax) return sendResponse(res, false, "Tax not found");

    return sendResponse(res, true, "Tax found", tax);
  } catch (err) {
    return sendError(res, err);
  }
};

// Update Tax
export const updateTax = async (req, res) => {
  try {
    const updated = await Tax.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return sendResponse(res, false, "Tax not found");

    return sendResponse(res, true, "Tax updated", updated);
  } catch (err) {
    return sendError(res, err);
  }
};

// Delete Tax
export const deleteTax = async (req, res) => {
  try {
    const deleted = await Tax.findByIdAndDelete(req.params.id);
    if (!deleted) return sendResponse(res, false, "Tax not found");

    return sendResponse(res, true, "Tax deleted");
  } catch (err) {
    return sendError(res, err);
  }
};
