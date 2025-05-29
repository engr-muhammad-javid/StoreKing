// controllers/category.controller.js
import Category from "../model/category.model.js";
import { sendResponse, sendError } from "../helper/response.js";

export const createCategory = async (req, res) => {
  try {
    
    const { name, description, image, url_key, parent } = req.body;
    const existing = await Category.findOne({ url_key });
    if (existing) return sendResponse(res, false, "Category already exists");
  

    const newCat = new Category({ name, description, image, url_key, parent: parent || null });

      
    const result = await newCat.save();

    return sendResponse(res, true, "Category created", result);
  } catch (err) {
    return sendError(res, err);
  }
};

export const getAllCategories = async (req, res) => {
  try {
    

    const categories = await Category.find()
      .populate('parent', 'name') // This will populate the parent field with just the name
      .lean();
    
    // Optionally, you can transform the data to include parentName directly
    const categoriesWithParentName = categories.map(category => ({
      ...category
    }));
    
    return sendResponse(res, true, "All categories", categoriesWithParentName);
  } catch (err) {
    return sendError(res, err);
  }
};


export const getCategoryTree = async (req, res) => {
  try {
    const categories = await Category.find().lean();

    const buildTree = (parentId = null) => {
      return categories
        .filter(cat => String(cat.parent) === String(parentId))
        .map(cat => ({
          ...cat,
          children: buildTree(cat._id),
        }));
    };

    const tree = buildTree();
    return sendResponse(res, true, "Category tree", tree);
  } catch (err) {
    return sendError(res, err);
  }
};

export const getSingleCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await Category.findById(id).lean();
    if (!category) return sendResponse(res, false, "Category not found");

    return sendResponse(res, true, "Category found", category);
  } catch (err) {
    return sendError(res, err);
  }
};

export const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const update = await Category.findByIdAndUpdate(id, req.body, { new: true });
    if (!update) return sendResponse(res, false, "Category not found");
    return sendResponse(res, true, "Category updated", update);
  } catch (err) {
    return sendError(res, err);
  }
};

export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if this category has children
    const childExists = await Category.exists({ parent: id });
    if (childExists) {
      return sendResponse(
        res,
        false,
        "Cannot delete category: It has one or more subcategories"
      );
    }

    const deleted = await Category.findByIdAndDelete(id);
    if (!deleted) {
      return sendResponse(res, false, "Category not found");
    }

    return sendResponse(res, true, "Category deleted successfully");
  } catch (err) {
    return sendError(res, err);
  }
};
