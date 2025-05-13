import express from "express";
import {
  createSiteSetting,
  getSiteSetting,
  updateSiteSetting
} from "../controller/siteSetting.controller.js";

const router = express.Router();

router.post("/", createSiteSetting);
router.get("/", getSiteSetting);
router.put("/", updateSiteSetting); // Always updates first record

export default router;
