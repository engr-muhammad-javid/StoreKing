import DeliveryZone from "../model/deliveryZone.model.js";
import { sendResponse, sendError } from "../helper/response.js";

// Create
export const createDeliveryZone = async (req, res) => {
  try {
    // Check for duplicate name
    const exists = await DeliveryZone.findOne({ name: req.body.name });
    if (exists) {
      return sendResponse(res, false, "Delivery Zone with this name already exists");
    }

    const longlatexists = await DeliveryZone.findOne({ latitude: req.body.latitude, longitude: req.body.longitude });
    if (longlatexists) {
    return sendResponse(res, false, "A Delivery Zone already exists at this location");
    }

    const zone = new DeliveryZone(req.body);
    const saved = await zone.save();
    return sendResponse(res, true, "Delivery Zone created", saved);
  } catch (err) {
    return sendError(res, err);
  }
};

// Get All
export const getDeliveryZones = async (req, res) => {
  try {
    const zones = await DeliveryZone.find().sort({ createdAt: -1 }).lean();
    return sendResponse(res, true, "Delivery Zones fetched", zones);
  } catch (err) {
    return sendError(res, err);
  }
};

// Get One
export const getDeliveryZone = async (req, res) => {
  try {
    const zone = await DeliveryZone.findById(req.params.id).lean();
    if (!zone) return sendResponse(res, false, "Delivery Zone not found");
    return sendResponse(res, true, "Delivery Zone fetched", zone);
  } catch (err) {
    return sendError(res, err);
  }
};

// Update
export const updateDeliveryZone = async (req, res) => {
  try {
    const updated = await DeliveryZone.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return sendResponse(res, false, "Delivery Zone not found");
    return sendResponse(res, true, "Delivery Zone updated", updated);
  } catch (err) {
    return sendError(res, err);
  }
};

// Delete
export const deleteDeliveryZone = async (req, res) => {
  try {
    const deleted = await DeliveryZone.findByIdAndDelete(req.params.id);
    if (!deleted) return sendResponse(res, false, "Delivery Zone not found");
    return sendResponse(res, true, "Delivery Zone deleted", deleted);
  } catch (err) {
    return sendError(res, err);
  }
};
