import express from 'express';
import {register, login, profile, upload_pic, updateProfile, changePass } from "../controller/auth.controller.js";
import {isAuth, isAuthorize} from '../middleware/isAuth.js';
import { upload } from  '../middleware/storage.js';
const router = express.Router();

router.post("/login", login);
router.post("/register", register);
router.get("/profile", isAuth, isAuthorize(['user', 'admin']), profile);

router.put("/update/profile", isAuth, updateProfile);
router.put("/change/password", isAuth, changePass);
router.put("/upload/picture", isAuth, upload, upload_pic);


export default router;