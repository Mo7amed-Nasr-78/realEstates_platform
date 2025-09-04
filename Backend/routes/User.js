import express from "express";
const router = express.Router();

import {
	signup,
	signin,
	forgetPassword,
	verifyOtp,
	resendOtp,
	resetPassword,
	currentUser,
	userUpdate,
	logOutUser,
	getProfile,
	getOnlineUsers,
	updateUserStatus
} from "../controllers/User.js";
import validateToken from '../middlewares/validateTokenHandle.js';
import multer from '../config/multer.js'

router.route("/profile/:id").get(getProfile); 

router.route("/otp/verify").post(verifyOtp);

router.route("/signup").post(signup);

router.route("/signin").post(signin);

router.route("/logout").get(validateToken, logOutUser);

router.route("/current").get(validateToken, currentUser);

router.route("/online").get(getOnlineUsers);

router.route("/userStatus").post(validateToken, updateUserStatus);

router.route("/forgetpassword").post(forgetPassword);

router.route("/resetpassword").post(resetPassword);

router.route("/update").post(
	validateToken,
	multer.single('profileImg'),
	userUpdate
);


export default router;
