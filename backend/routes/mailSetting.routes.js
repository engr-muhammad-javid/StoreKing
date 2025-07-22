import express from "express";
import {
  createMailSetting,
  getMailSetting,
  updateMailSetting
} from "../controller/mailSetting.controller.js";

const router = express.Router();

router.post("/", createMailSetting);
router.get("/", getMailSetting);
router.put("/", updateMailSetting); // Always updates the first record

export default router;
