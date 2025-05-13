// routes/currency.routes.js
import express from "express";
import {
  createCurrency,
  getAllCurrencies,
  getSingleCurrency,
  updateCurrency,
  deleteCurrency
} from "../controller/currency.controller.js";

const router = express.Router();

router.post("/", createCurrency);
router.get("/", getAllCurrencies);
router.get("/:id", getSingleCurrency);
router.put("/:id", updateCurrency);
router.delete("/:id", deleteCurrency);

export default router;
