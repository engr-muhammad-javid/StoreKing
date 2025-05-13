import express from "express";
import {
  createTax,
  getAllTaxes,
  getSingleTax,
  updateTax,
  deleteTax
} from "../controller/tax.controller.js";

const router = express.Router();

router.post("/", createTax);
router.get("/", getAllTaxes);
router.get("/:id", getSingleTax);
router.put("/:id", updateTax);
router.delete("/:id", deleteTax);

export default router;
