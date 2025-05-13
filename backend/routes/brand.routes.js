// routes/brand.routes.js
import express from "express";
import {
  createBrand,
  getAllBrands,
  getSingleBrand,
  updateBrand,
  deleteBrand
} from "../controller/brand.controller.js";

const router = express.Router();

router.post("/", createBrand);
router.get("/", getAllBrands);
router.get("/:id", getSingleBrand);
router.put("/:id", updateBrand);
router.delete("/:id", deleteBrand);

export default router;
