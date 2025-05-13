import Page from "../model/page.model.js";
import { sendResponse, sendError } from "../helper/response.js";

// Create Page
export const createPage = async (req, res) => {
  try {
    const page = new Page(req.body);
    const saved = await page.save();
    return sendResponse(res, true, "Page created", saved);
  } catch (err) {
    return sendError(res, err);
  }
};

// Get All Pages
export const getAllPages = async (req, res) => {
  try {
    const pages = await Page.find().lean();
    return sendResponse(res, true, "All pages", pages);
  } catch (err) {
    return sendError(res, err);
  }
};

// Get Single Page
export const getSinglePage = async (req, res) => {
  try {
    const page = await Page.findById(req.params.id).lean();
    if (!page) return sendResponse(res, false, "Page not found");

    return sendResponse(res, true, "Page found", page);
  } catch (err) {
    return sendError(res, err);
  }
};

// Update Page
export const updatePage = async (req, res) => {
  try {
    const updated = await Page.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return sendResponse(res, false, "Page not found");

    return sendResponse(res, true, "Page updated", updated);
  } catch (err) {
    return sendError(res, err);
  }
};

// Delete Page
export const deletePage = async (req, res) => {
  try {
    const deleted = await Page.findByIdAndDelete(req.params.id);
    if (!deleted) return sendResponse(res, false, "Page not found");

    return sendResponse(res, true, "Page deleted");
  } catch (err) {
    return sendError(res, err);
  }
};
