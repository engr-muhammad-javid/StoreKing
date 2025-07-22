import express from "express";
import {
  createNotificationSetting,
  getNotificationSetting,
  updateNotificationSetting
} from "../controller/notificationSetting.controller.js";

import { isAuth } from "../middleware/isAuth.js";
import { handleUpload } from "../middleware/uploadWrapper.js";
import { dynamicUpload } from "../middleware/dynamicUpload.js";

const router = express.Router();

// Routes
router.post(
  "/",
  isAuth,
  handleUpload(dynamicUpload('firebase', 'firebaseJsonFile')),
  createNotificationSetting
);

router.get(
  "/",
  isAuth,
  getNotificationSetting
);

router.put(
  "/",
  isAuth,
  handleUpload(dynamicUpload('firebase', 'firebaseJsonFile')),
  updateNotificationSetting
);

export default router;
