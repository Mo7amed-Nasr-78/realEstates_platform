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
	signout,
	getProfile,
	getOnlineUsers,
	updateUserStatus,
} from "../controllers/User.js";
import validateToken from "../middlewares/validateTokenHandling.js";
import multer from "../config/multer.js";

router.route("/:id/profile").get(getProfile);

router.route("/otp/verify").post(verifyOtp);

router.route("/signup").post(signup);

router.route("/signin").post(signin);

router.route("/signout").post(validateToken, signout);

router.route("/current").get(validateToken, currentUser);

router.route("/online").get(getOnlineUsers);

router.route("/user-status").post(validateToken, updateUserStatus);

router.route("/forgetpassword").post(forgetPassword);

router.route("/resetpassword").post(resetPassword);

router.route("/update").post(
	validateToken,
	multer.single("profileImg"),
	userUpdate
);

export default router;
