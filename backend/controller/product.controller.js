import Product from "../model/product.model.js";
import { sendResponse, sendError } from "../helper/response.js";
import { msg } from "../i18n/text.js";

// Add Product
export const addProduct = async (req, res) => {
  try {
    const { sku } = req.body;

    if (!sku) {
      return sendResponse(res, false, "SKU is required");
    }

    const existing = await Product.findOne({ sku });
    if (existing) {
      return sendResponse(res, false, "Product with this SKU already exists");
    }

    const newProduct = new Product(req.body);
    const saved = await newProduct.save();
    return sendResponse(res, true, "Product created successfully", saved);
  } catch (error) {
    return sendError(res, error.message || error);
  }
};

// Get All Products
export const getAllProducts = async (req, res) => {
  try {

    const products = await Product.find().sort({ createdAt: -1 });
    
    return sendResponse(res, true, "Products fetched successfully", products);
  } catch (error) {
    return sendError(res, error.message || error);
  }
};

// Get Single Product
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return sendResponse(res, false, "Product not found");
    return sendResponse(res, true, "Product fetched successfully", product);
  } catch (error) {
    return sendError(res, error.message || error);
  }
};

// Update Product
export const updateProduct = async (req, res) => {
  try {
    const updated = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updated) return sendResponse(res, false, "Product not found");

    return sendResponse(res, true, "Product updated successfully", updated);
  } catch (error) {
    return sendError(res, error.message || error);
  }
};

// Delete Product
export const deleteProduct = async (req, res) => {
  try {
    const deleted = await Product.findByIdAndDelete(req.params.id);
    if (!deleted) return sendResponse(res, false, "Product not found");

    return sendResponse(res, true, "Product deleted successfully", deleted);
  } catch (error) {
    return sendError(res, error.message || error);
  }
};
