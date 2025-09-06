import asyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import sendMail from "../config/nodeMailer.js";
import dotenv from "dotenv";
import { v2 as cloudinary } from "cloudinary";
import { createReadStream } from "streamifier";
import { isValidObjectId } from "mongoose";
dotenv.config();

// DB Models
import User from "../models/userModel.js";
import Otp from "../models/otpModel.js";

// @Desc user register
// @URL <POST> /api/users/
// @Access public
export const signup = asyncHandler(async (req, res) => {
	const { name, email, password } = req.body;
	const role = req.query.role;

	await User.validate({ ...req.body, role });

	const userAvailable = await User.findOne({ email });
	if (userAvailable) {
		res.status(400);
		throw new Error("the email is already used");
	}

	const hashedPassword = await bcrypt.hash(password, 10);
	const user = await User.create({
		role,
		name,
		email,
		password: hashedPassword,
		picture: "https://res.cloudinary.com/de5sekaom/image/upload/v1755117756/default-profile-img_f7br6d.jpg",
	});

	if (user) {
		res.status(201).json({
			status: 201,
			message: "the account has been created successfully",
			redirectUrl: "/signin",
		});
	} else {
		res.status(500);
		throw new Error("internal server error");
	}
});

// @Desc signin
// @URL <POST> /api/users/login
// @Access public
export const signin = asyncHandler(async (req, res) => {
	const { email, password } = req.body;
	if (!email || !password) {
		res.status(400);
		throw new Error("Please enter both of email and password");
	}

	const user = await User.findOne({ email });

	if (!user) {
		res.status(404);
		throw new Error("the account is not found");
	}

	if (!(await bcrypt.compare(password, user.password))) {
		res.status(400);
		throw new Error("please enter your correct password");
	}

	const accessToken = jwt.sign(
		{
			id: user.id,
			email: user.email,
		},
		process.env.ACCESS_TOKEN_SECRET,
		{
			expiresIn: "60000s", // Token is valid for 1 hour
		}
	);

	res.cookie("accessToken", accessToken, {
		secure: true,
		httpOnly: true,
		sameSite: "none",
		maxAge: 24 * 60 * 60 * 1000,
	});

	res.status(200).json({
		status: 200,
		message: "you've signed in successfully",
		accessToken: accessToken,
		redirectUrl: "/",
	});
});

// @Desc current
// @URL <GET> /api/users/current
// @Access private
export const currentUser = asyncHandler(async (req, res) => {
	const { email } = req.user;
	const user = await User.findOne({ email });

	// console.log(req.headers["user-agent"]);
	if (!user) {
		res.status(404).json({ meg: "user isn't found!" });
	}

	res.status(200).json({ status: 200, user });
});

// @Desc logOut
// @URL <GET> /api/users/logout
// @Access private
export const logOutUser = asyncHandler(async (req, res) => {
	res.clearCookie("accessToken");
	res.json({ status: 200, meg: "Logged Out" });
});

// @Desc Forget-Password
// @URL <POST> /api/users/forgetpassword
// @Access Public
export const forgetPassword = asyncHandler(async (req, res) => {
	const { email } = req.body;

	if (!email) {
		res.status(400);
		throw new Error("please enter your email first !");
	}

	const userExisting = await User.findOne({ email });
	if (!userExisting) {
		res.status(404);
		throw new Error("the account isn't found");
	}

	const otpNums = generateOtp();
	await sendMail(email, "Your OTP Code", `your otp code is: ${otpNums}`);

	const otp = await Otp.findOneAndUpdate(
		{ user: userExisting._id },
		{
			otp: jwt.sign({ otpNums }, process.env.ACCESS_TOKEN_SECRET, {
				expiresIn: "5m",
			}),
			attempts: 0,
			user: userExisting._id,
		},
		{ upsert: true, new: true }
	);

	userExisting.otp = otp._id;
	await userExisting.save();

	const token = jwt.sign({ email }, process.env.ACCESS_TOKEN_SECRET, {
		expiresIn: "10m",
	});

	res.status(200).json({
		status: 200,
		message: "OTP has been sent successfully",
		redirectUrl: `/otp/?e=${token}`,
	});
});

// @Desc OTP Verification
// @URL <POST> /api/users/otp/verify
// @Access Public
export const verifyOtp = asyncHandler(async (req, res) => {
	const { otp, token } = req.body;
	const email = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET).email;
	const user = await User.findOne({ email }).populate("otp");

	const storedOtp = jwt.verify(
		user.otp.otp,
		process.env.ACCESS_TOKEN_SECRET
	);

	if (storedOtp.otpNums === parseInt(otp)) {
		await Otp.updateOne({ _id: user.otp._id }, { $set: { otp: "" } });
		res.status(200).json({
			status: 200,
			message: "OTP has been verified",
			redirectUrl: `/resetpassword?e=${token}`,
		});
	} else {
		if (user.otp.attempts < 5) {
			user.otp.attempts++;
			await user.otp.save();
		} else {
			await Otp.updateOne(
				{ _id: user.otp._id },
				{ $set: { otp: "" } }
			);

			res.status(403);
			throw new Error("something went wrong, try again");
		}

		res.status(400);
		throw new Error("Invalid OTP");
	}
});

// @Desc OTP Resending
// @URL <POST> /api/users/otp/resend
// @Access Public
export const resendOtp = async (req, res) => {
	const { token } = req.body;
	const email = jwt.decode(token);
	const newOtp = generateOtp();

	await sendMail(email, "Your OTP Code", `your otp code is: ${newOtp}`);

	const userExisting = await User.findOne({ email });
	if (!userExisting) {
		res.status(404);
		throw new Error("the account isn't found");
	}

	const otp = await Otp.findOneAndUpdate(
		{ user: userExisting._id },
		{
			otp: jwt.sign({ otpNums }, process.env.ACCESS_TOKEN_SECRET, {
				expiresIn: "5m",
			}),
			attempts: 0,
			user: userExisting._id,
		},
		{ upsert: true, new: true }
	);

	userExisting.otp = otp._id;
	await userExisting.save();

	res.status(200).json({
		status: 200,
		message: "OTP has been resend successfully",
	});
};

// @Desc Reset-Password
// @URL <POST> /api/users/otp/resend
// @Access Public
export const resetPassword = asyncHandler(async (req, res) => {
	const { newPass, confirmPass, token } = req.body;
	const email = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET).email;

	if (!newPass || !confirmPass) {
		res.status(400);
		throw new Error("password is't identical");
	}

	if (!token) {
		res.status(500);
		throw new Error("internal server error");
	}

	if (newPass !== confirmPass) {
		res.status(400);
		throw new Error("password is't identical");
	}

	const hashedNewPass = await bcrypt.hash(newPass, 10);

	await User.updateOne({ email }, { password: hashedNewPass });

	res.status(200).json({
		status: 200,
		message: "your password has been updated successfully",
		redirectUrl: "/signin",
	});
});

// @Desc Update User Info
// @URL <POST> /api/users/update
// @Access Private
export const userUpdate = asyncHandler(async (req, res) => {
	const userId = req.user.id;
	let { certifications, socials, languages, ...info } = req.body;

	// Parsing data
	socials = JSON.parse(socials);
	languages = JSON.parse(languages);
	certifications = JSON.parse(certifications);

	const user = await User.findOne({ _id: userId });

	// Profile picture updating if it's exsiting
	if (req.file) {
		const result = await new Promise((resolve, reject) => {
			const stream = cloudinary.uploader.upload_stream(
				{
					folder: `uploads/${req.user.id}/`,
					public_id: `profileImg-${req.user.id}`,
					overwrite: true,
					transformation: [
						{ width: 300, height: 300, crop: "fill" },
					],
				},
				(err, result) => {
					if (err) reject(err);
					else resolve(result);
				}
			);
			createReadStream(req.file.buffer).pipe(stream);
		});

		user.picture = result.secure_url;
		await user.save();
	}

	// Personal details updating if it's exsiting
	for (const [key, value] of Object.entries(info)) {
		if (value !== "") {
			user[key] = info[key];
			await user.save();
		}
	}

	// Socials updating if it's exsiting
	for (const [key, value] of Object.entries(socials)) {
		if (value !== "") {
			user.socialMediaHandles.set(key, value);
			await user.save();
		}
	}

	// Languages updating if it's exsiting
	if (languages.length > 0) {
		user.languages = languages;
		await user.save();
	}

	// Certifications updating if it's exsiting
	if (certifications.length > 0) {
		for (const index in certifications) {
			for (const value of Object.values(certifications[index])) {
				console.log(value);
				if (!value) {
					res.status(400);
					throw new Error(
						"please, fill your certification details"
					);
				}
			}
		}
	}

	user.certifications = certifications;
	await user.save();

	res.status(200).json({
		status: 200,
		message: "profile has been updated successflly",
		user,
	});
});

// @Desc Profile Fetching
// @URL <Get> /api/users/profile/:id
// @Access public
export const getProfile = asyncHandler(async (req, res) => {
	const profileId = req.params.id;

	if (!isValidObjectId(profileId)) {
		res.status(400);
		throw new Error("invalid profile id");
	}

	const user = await User.findOne({ _id: profileId })
	.select('-password');

	if (!user) {
		res.status(404);
		throw new Error("the account is't found");
	}

	res.status(200).json({ status: 200, profile: user });
});

// @Desc online users Fetching
// @URL <Get> /api/users/online
// @Access public
export const getOnlineUsers = asyncHandler(async (req, res) => {
	
	const onlineUsers = await User.find({ isActive: true });
	if (!onlineUsers) {
		res.status(400);
		throw new Error('no online users found');
	}
	res.status(200).json({ status: 200, onlineUsers });

});

// @Desc user status
// @URL <Get> /api/users/userStatus
// @Access private
export const updateUserStatus = asyncHandler(async (req, res) => {
	const { userId, status } = req.body;

	const user = await User.findOne({ _id: userId }).select('-password');
	if (status === 'online') {
		user.isActive = true;
		await user.save();
	}

	if (status === 'offline') {
		user.isActive = false;
		await user.save();
	}

	res.status(200).json({ 
		status: 200, 
		status: user.isActive,
		message: 'user status has been updated',
	});

});

const generateOtp = () => {
	return Math.floor(Math.random() * 900000) + 100000;
};
