import express from "express";
import {
  createPage,
  getAllPages,
  getSinglePage,
  updatePage,
  deletePage
} from "../controller/page.controller.js";

const router = express.Router();

router.post("/", createPage);
router.get("/", getAllPages);
router.get("/:id", getSinglePage);
router.put("/:id", updatePage);
router.delete("/:id", deletePage);

export default router;
