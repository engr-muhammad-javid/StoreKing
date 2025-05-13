import express from "express";
import {
  createBenefit,
  getAllBenefits,
  getSingleBenefit,
  updateBenefit,
  deleteBenefit
} from "../controller/benefit.controller.js";

const router = express.Router();

router.post("/", createBenefit);
router.get("/", getAllBenefits);
router.get("/:id", getSingleBenefit);
router.put("/:id", updateBenefit);
router.delete("/:id", deleteBenefit);

export default router;
