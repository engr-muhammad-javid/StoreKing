// routes/category.routes.js
import express from "express";
import {
  createCategory,
  getAllCategories,
  getCategoryTree,
  getSingleCategory,
  updateCategory,
  deleteCategory,
} from "../controller/category.controller.js";

const router = express.Router();

router.post("/", createCategory);
router.get("/", getAllCategories);
router.get("/tree", getCategoryTree);
router.get("/:id", getSingleCategory);
router.put("/:id", updateCategory);
router.delete("/:id", deleteCategory);

export default router;
