import express from "express";
import {
  createOutlet,
  getAllOutlets,
  getSingleOutlet,
  updateOutlet,
  deleteOutlet
} from "../controller/outlet.controller.js";

const router = express.Router();

router.post("/", createOutlet);
router.get("/", getAllOutlets);
router.get("/:id", getSingleOutlet);
router.put("/:id", updateOutlet);
router.delete("/:id", deleteOutlet);

export default router;
