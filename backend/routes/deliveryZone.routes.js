import express from "express";
import {
  createDeliveryZone,
  getDeliveryZones,
  getDeliveryZone,
  updateDeliveryZone,
  deleteDeliveryZone
} from "../controller/deliveryZone.controller.js";

const router = express.Router();

router.post("/", createDeliveryZone);
router.get("/", getDeliveryZones);
router.get("/:id", getDeliveryZone);
router.put("/:id", updateDeliveryZone);
router.delete("/:id", deleteDeliveryZone);

export default router;
