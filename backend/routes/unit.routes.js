import express from "express";
import {
  createUnit,
  getAllUnits,
  getSingleUnit,
  updateUnit,
  deleteUnit
} from "../controller/unit.controller.js";

const router = express.Router();

router.post("/", createUnit);
router.get("/", getAllUnits);
router.get("/:id", getSingleUnit);
router.put("/:id", updateUnit);
router.delete("/:id", deleteUnit);

export default router;
