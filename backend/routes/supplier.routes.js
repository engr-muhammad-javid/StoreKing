import express from "express";
import {
  createSupplier,
  getAllSuppliers,
  getSingleSupplier,
  updateSupplier,
  deleteSupplier
} from "../controller/supplier.controller.js";

const router = express.Router();

router.post("/", createSupplier);
router.get("/", getAllSuppliers);
router.get("/:id", getSingleSupplier);
router.put("/:id", updateSupplier);
router.delete("/:id", deleteSupplier);

export default router;
