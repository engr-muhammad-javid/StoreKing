import express from "express";
import {
  createCompany,
  getCompany,
  updateCompany
} from "../controller/companySetting.controller.js";

const router = express.Router();

router.post("/", createCompany);
router.get("/", getCompany);
router.put("/", updateCompany); // No ID needed, auto-fetches first record

export default router;
