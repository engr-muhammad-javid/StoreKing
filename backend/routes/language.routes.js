import express from "express";
import {
  createLanguage,
  getAllLanguages,
  getLanguage,
  updateLanguage,
  deleteLanguage
} from "../controller/language.controller.js";

const router = express.Router();

router.post("/", createLanguage);
router.get("/", getAllLanguages);
router.get("/:id", getLanguage);
router.put("/:id", updateLanguage);
router.delete("/:id", deleteLanguage);

export default router;
