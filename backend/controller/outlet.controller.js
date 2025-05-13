import Outlet from "../model/outlet.model.js";
import { sendResponse, sendError } from "../helper/response.js";

// Create Outlet
export const createOutlet = async (req, res) => {
  try {
    const outlet = new Outlet(req.body);
    const saved = await outlet.save();
    return sendResponse(res, true, "Outlet created", saved);
  } catch (err) {
    return sendError(res, err);
  }
};

// Get all Outlets with populated Delivery Zone
export const getAllOutlets = async (req, res) => {
  try {
    const outlets = await Outlet.find().populate("deliveryZone").lean();
    return sendResponse(res, true, "All outlets", outlets);
  } catch (err) {
    return sendError(res, err);
  }
};

// Get single Outlet
export const getSingleOutlet = async (req, res) => {
  try {
    const outlet = await Outlet.findById(req.params.id).populate("deliveryZone").lean();
    if (!outlet) return sendResponse(res, false, "Outlet not found");

    return sendResponse(res, true, "Outlet found", outlet);
  } catch (err) {
    return sendError(res, err);
  }
};

// Update Outlet
export const updateOutlet = async (req, res) => {
  try {
    const outlet = await Outlet.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!outlet) return sendResponse(res, false, "Outlet not found");

    return sendResponse(res, true, "Outlet updated", outlet);
  } catch (err) {
    return sendError(res, err);
  }
};

// Delete Outlet
export const deleteOutlet = async (req, res) => {
  try {
    const outlet = await Outlet.findByIdAndDelete(req.params.id);
    if (!outlet) return sendResponse(res, false, "Outlet not found");

    return sendResponse(res, true, "Outlet deleted");
  } catch (err) {
    return sendError(res, err);
  }
};
