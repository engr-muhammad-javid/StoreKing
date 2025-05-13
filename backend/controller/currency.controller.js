import Currency from "../model/currency.model.js";
import { sendResponse, sendError } from "../helper/response.js";

export const createCurrency = async (req, res) => {
  try {
    const { name, symbol, code, isCryptocurrency, exchangeRate } = req.body;

    const exists = await Currency.findOne({ code });
    if (exists) return sendResponse(res, false, "Currency already exists");

    const newCurrency = new Currency({
      name,
      symbol,
      code,
      isCryptocurrency: isCryptocurrency ?? false,
      exchangeRate,
    });

    const result = await newCurrency.save();
    return sendResponse(res, true, "Currency created", result);
  } catch (err) {
    return sendError(res, err);
  }
};

export const getAllCurrencies = async (req, res) => {
  try {
    const currencies = await Currency.find().lean();
    return sendResponse(res, true, "All currencies", currencies);
  } catch (err) {
    return sendError(res, err);
  }
};

export const getSingleCurrency = async (req, res) => {
  try {
    const { id } = req.params;
    const currency = await Currency.findById(id).lean();
    if (!currency) return sendResponse(res, false, "Currency not found");

    return sendResponse(res, true, "Currency found", currency);
  } catch (err) {
    return sendError(res, err);
  }
};

export const updateCurrency = async (req, res) => {
  try {
    const { id } = req.params;
    const update = await Currency.findByIdAndUpdate(id, req.body, { new: true });
    if (!update) return sendResponse(res, false, "Currency not found");

    return sendResponse(res, true, "Currency updated", update);
  } catch (err) {
    return sendError(res, err);
  }
};

export const deleteCurrency = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await Currency.findByIdAndDelete(id);
    if (!deleted) return sendResponse(res, false, "Currency not found");

    return sendResponse(res, true, "Currency deleted successfully");
  } catch (err) {
    return sendError(res, err);
  }
};
