import Language from "../model/language.model.js";
import { sendResponse, sendError } from "../helper/response.js";

// Create Language
export const createLanguage = async (req, res) => {
  try {
    const exists = await Language.findOne({ code: req.body.code });
    if (exists) return sendResponse(res, false, "Language already exists");

    const language = new Language(req.body);
    const saved = await language.save();
    return sendResponse(res, true, "Language created", saved);
  } catch (err) {
    return sendError(res, err);
  }
};

// Get All Languages
export const getAllLanguages = async (req, res) => {
  try {
    const languages = await Language.find().lean();
    return sendResponse(res, true, "All languages", languages);
  } catch (err) {
    return sendError(res, err);
  }
};

// Get Single Language
export const getLanguage = async (req, res) => {
  try {
    const language = await Language.findById(req.params.id).lean();
    if (!language) return sendResponse(res, false, "Language not found");

    return sendResponse(res, true, "Language found", language);
  } catch (err) {
    return sendError(res, err);
  }
};

// Update Language
export const updateLanguage = async (req, res) => {
  try {
    const updated = await Language.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return sendResponse(res, false, "Language not found");

    return sendResponse(res, true, "Language updated", updated);
  } catch (err) {
    return sendError(res, err);
  }
};

// Delete Language
export const deleteLanguage = async (req, res) => {
  try {
    const deleted = await Language.findByIdAndDelete(req.params.id);
    if (!deleted) return sendResponse(res, false, "Language not found");

    return sendResponse(res, true, "Language deleted");
  } catch (err) {
    return sendError(res, err);
  }
};
