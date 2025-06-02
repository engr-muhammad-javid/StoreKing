import Product from "../model/product.model.js";
import Brand from "../model/brand.model.js";
import Category from "../model/category.model.js";
import Tax from "../model/tax.model.js";
import Unit from "../model/unit.model.js";

import { sendResponse, sendError } from "../helper/response.js";
import { msg } from "../i18n/text.js";



// Add Product
export const addProduct = async (req, res) => {
  try {
    const { sku, brand_id, category_id, tax_id, unit_id } = req.body;

    if (!sku) {
      return sendResponse(res, false, "SKU is required");
    }

    const existing = await Product.findOne({ sku });
    if (existing) {
      return sendResponse(res, false, "Product with this SKU already exists");
    }

    // Validate foreign references
    const [brand, category, tax, unit] = await Promise.all([
      Brand.findById(brand_id),
      Category.findById(category_id),
      Tax.findById(tax_id),
      Unit.findById(unit_id)
    ]);

    if (!brand) return sendResponse(res, false, "Invalid brand_id");
    if (!category) return sendResponse(res, false, "Invalid category_id");
    if (!tax) return sendResponse(res, false, "Invalid tax_id");
    if (!unit) return sendResponse(res, false, "Invalid unit_id");

    // Save Product
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
    const products = await Product.find()
      .sort({ createdAt: -1 })
      .populate("brand_id", "name")
      .populate("category_id", "name")
      .populate("tax_id", "name")
      .populate("unit_id", "name");

    return sendResponse(res, true, "Products fetched successfully", products);
  } catch (error) {
    return sendError(res, error.message || error);
  }
};

// Get Single Product
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate("brand_id", "name")
      .populate("category_id", "name")
      .populate("tax_id", "name")
      .populate("unit_id", "name");

    if (!product) return sendResponse(res, false, "Product not found");

    return sendResponse(res, true, "Product fetched successfully", product);
  } catch (error) {
    return sendError(res, error.message || error);
  }
};

// Update Product
export const updateProduct = async (req, res) => {
  try {
    const { brand_id, category_id, tax_id, unit_id } = req.body;

    // Check if provided references are valid (only if they're in the payload)
    const validationErrors = [];

    if (brand_id && !(await Brand.findById(brand_id))) {
      validationErrors.push("Invalid brand_id");
    }
    if (category_id && !(await Category.findById(category_id))) {
      validationErrors.push("Invalid category_id");
    }
    if (tax_id && !(await Tax.findById(tax_id))) {
      validationErrors.push("Invalid tax_id");
    }
    if (unit_id && !(await Unit.findById(unit_id))) {
      validationErrors.push("Invalid unit_id");
    }

    if (validationErrors.length > 0) {
      return sendResponse(res, false, validationErrors.join(", "));
    }

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
