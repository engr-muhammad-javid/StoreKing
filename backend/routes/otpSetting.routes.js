import express from "express";
import {
  createOtpSetting,
  getOtpSetting,
  updateOtpSetting
} from "../controller/otpSetting.controller.js";

const router = express.Router();

router.post("/", createOtpSetting);
router.get("/", getOtpSetting);
router.put("/", updateOtpSetting); // Always updates the first record

export default router;
