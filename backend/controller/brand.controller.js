import Brand from "../model/brand.model.js";
import { sendResponse, sendError } from "../helper/response.js";

export const createBrand = async (req, res) => {
  try {
    const { name, description, image, slug, isActive } = req.body;

    const existing = await Brand.findOne({ slug });
    if (existing) return sendResponse(res, false, "Brand already exists");

    const newBrand = new Brand({
      name,
      description,
      image,
      slug,
      isActive: isActive ?? true,
    });

    const result = await newBrand.save();
    return sendResponse(res, true, "Brand created", result);
  } catch (err) {
    return sendError(res, err);
  }
};

export const getAllBrands = async (req, res) => {
  try {
    const brands = await Brand.find().lean();
    return sendResponse(res, true, "All brands", brands);
  } catch (err) {
    return sendError(res, err);
  }
};

export const getSingleBrand = async (req, res) => {
  try {
    const { id } = req.params;
    const brand = await Brand.findById(id).lean();
    if (!brand) return sendResponse(res, false, "Brand not found");

    return sendResponse(res, true, "Brand found", brand);
  } catch (err) {
    return sendError(res, err);
  }
};

export const updateBrand = async (req, res) => {
  try {
    const { id } = req.params;
    const update = await Brand.findByIdAndUpdate(id, req.body, { new: true });
    if (!update) return sendResponse(res, false, "Brand not found");

    return sendResponse(res, true, "Brand updated", update);
  } catch (err) {
    return sendError(res, err);
  }
};

export const deleteBrand = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await Brand.findByIdAndDelete(id);
    if (!deleted) return sendResponse(res, false, "Brand not found");

    return sendResponse(res, true, "Brand deleted successfully");
  } catch (err) {
    return sendError(res, err);
  }
};
