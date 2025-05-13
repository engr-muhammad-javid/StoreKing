import Supplier from "../model/supplier.model.js";
import { sendResponse, sendError } from "../helper/response.js";

// Create Supplier with duplicate email check
export const createSupplier = async (req, res) => {
  try {
    const { email } = req.body;

    const exists = await Supplier.findOne({ email });
    if (exists) return sendResponse(res, false, "Supplier with this email already exists");

    const supplier = new Supplier(req.body);
    const saved = await supplier.save();
    return sendResponse(res, true, "Supplier created", saved);
  } catch (err) {
    return sendError(res, err);
  }
};

// Get all suppliers
export const getAllSuppliers = async (req, res) => {
  try {
    const suppliers = await Supplier.find().lean();
    return sendResponse(res, true, "All suppliers", suppliers);
  } catch (err) {
    return sendError(res, err);
  }
};

// Get single supplier
export const getSingleSupplier = async (req, res) => {
  try {
    const { id } = req.params;
    const supplier = await Supplier.findById(id).lean();
    if (!supplier) return sendResponse(res, false, "Supplier not found");

    return sendResponse(res, true, "Supplier found", supplier);
  } catch (err) {
    return sendError(res, err);
  }
};

// Update supplier
export const updateSupplier = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await Supplier.findByIdAndUpdate(id, req.body, { new: true });
    if (!updated) return sendResponse(res, false, "Supplier not found");

    return sendResponse(res, true, "Supplier updated", updated);
  } catch (err) {
    return sendError(res, err);
  }
};

// Delete supplier
export const deleteSupplier = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Supplier.findByIdAndDelete(id);
    if (!deleted) return sendResponse(res, false, "Supplier not found");

    return sendResponse(res, true, "Supplier deleted successfully");
  } catch (err) {
    return sendError(res, err);
  }
};
