import express from 'express';
import {register, login, profile, upload_pic, updateProfile, changePass, addAddress, updateAddress, deleteAddress, getAddresses, getSingleAddress } from "../controller/auth.controller.js";
import {isAuth, isAuthorize} from '../middleware/isAuth.js';
import { handleUpload } from '../middleware/uploadWrapper.js';
import { dynamicUpload } from '../middleware/dynamicUpload.js';

const router = express.Router();

router.post("/login", login);
router.post("/register", register);
router.get("/profile", isAuth, isAuthorize(['user', 'admin']), profile);


// Upload Full Profile
router.put(
    "/update/profile",
    isAuth,
    handleUpload(dynamicUpload('profile', 'profile')),
    updateProfile
);

// Upload profile image
router.put(
    "/upload/picture",
    isAuth,
    handleUpload(dynamicUpload('profile', 'profile')),
    upload_pic
);

router.put("/change/password", isAuth, changePass);

router.post("/address",isAuth, addAddress);
router.get("/address", isAuth, getAddresses);
router.get("/address/:addressId", isAuth, getSingleAddress);
router.put("/address", isAuth, updateAddress);
router.delete("/address", isAuth, deleteAddress);


export default router;