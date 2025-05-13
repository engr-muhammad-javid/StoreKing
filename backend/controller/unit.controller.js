import Unit from "../model/unit.model.js";
import { sendResponse, sendError } from "../helper/response.js";

// Create Unit (check for duplicate code)
export const createUnit = async (req, res) => {
  try {
    const exists = await Unit.findOne({ code: req.body.code });
    if (exists) return sendResponse(res, false, "Unit with this code already exists");

    const unit = new Unit(req.body);
    const saved = await unit.save();
    return sendResponse(res, true, "Unit created", saved);
  } catch (err) {
    return sendError(res, err);
  }
};

// Get All Units
export const getAllUnits = async (req, res) => {
  try {
    const units = await Unit.find().lean();
    return sendResponse(res, true, "All units", units);
  } catch (err) {
    return sendError(res, err);
  }
};

// Get Single Unit
export const getSingleUnit = async (req, res) => {
  try {
    const unit = await Unit.findById(req.params.id).lean();
    if (!unit) return sendResponse(res, false, "Unit not found");

    return sendResponse(res, true, "Unit found", unit);
  } catch (err) {
    return sendError(res, err);
  }
};

// Update Unit
export const updateUnit = async (req, res) => {
  try {
    const updated = await Unit.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return sendResponse(res, false, "Unit not found");

    return sendResponse(res, true, "Unit updated", updated);
  } catch (err) {
    return sendError(res, err);
  }
};

// Delete Unit
export const deleteUnit = async (req, res) => {
  try {
    const deleted = await Unit.findByIdAndDelete(req.params.id);
    if (!deleted) return sendResponse(res, false, "Unit not found");

    return sendResponse(res, true, "Unit deleted");
  } catch (err) {
    return sendError(res, err);
  }
};
