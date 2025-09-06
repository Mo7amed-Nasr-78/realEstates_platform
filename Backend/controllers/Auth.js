import asyncHandler from 'express-async-handler';
import axios from 'axios';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt'
dotenv.config();
// DB Models
import User from '../models/userModel.js'

const url = process.env.FRONT_END_URL;

const createToken = (payload) => {
	const accessToken = jwt.sign(
		payload
		,
		process.env.ACCESS_TOKEN_SECRET,
		{
			expiresIn: "60000s",
		}
	);

	return accessToken;
};

export const googleRedirect = async (req, res) => {
	const role = req.query.role;
	const redirectUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${process.env.GOOGLE_CLIENT_ID}&redirect_uri=${process.env.REDIRECT_URI}&response_type=code&scope=openid%20email%20profile&state=${role}`;
	res.redirect(redirectUrl);
};

export const googleAuth = asyncHandler(async (req, res) => {
	const code = req.query.code;
	const role = req.query.state;

	const { data } = await axios.post(
		`https://oauth2.googleapis.com/token`,
		null,
		{
			params: {
				code,
				client_id: process.env.GOOGLE_CLIENT_ID,
				client_secret: process.env.GOOGLE_CLIENT_SECRET,
				redirect_uri: process.env.REDIRECT_URI,
				grant_type: "authorization_code",
			},
		}
	);

	const idToken = data.id_token;
	const decoded = jwt.decode(idToken);

	const existingUser = await User.findOne({ email: decoded.email });

	if (existingUser) {
		const { password, ...user } = existingUser._doc;
		const accessToken = createToken({
			id: user._id,
			email: user.email
		});
		if (existingUser.googleId === decoded.sub) {
			res.cookie("accessToken", accessToken, {
				secure: true,
				httpOnly: true,
				sameSite: "strict",
				maxAge: 24 * 60 * 60 * 1000
			});
			
			res.redirect(url);
		}

		existingUser.googleId = decoded.sub;
		await existingUser.save();
		res.cookie("accessToken", accessToken, {
			secure: true,
			httpOnly: true,
			sameSite: "none",
			maxAge: 24 * 60 * 60 * 1000
		});
			
		res.redirect(url);
	}

	const newUser = await User.create({
		role,
		name: decoded.name,
		email: decoded.email,
		googleId: decoded.sub,
		password: await bcrypt.hash(decoded.sub, 10),
		picture: "https://res.cloudinary.com/de5sekaom/image/upload/v1755117756/default-profile-img_f7br6d.jpg",
	});

	const accessToken = createToken({ 
		id: newUser._doc._id,
		email: newUser._doc.email,
	});
	res.cookie("accessToken", accessToken, {
		secure: true,
		httpOnly: true,
		sameSite: "none",
	});

	res.redirect(url);
});

export const facebookAuth = asyncHandler(
	async (req, res) => {
		const { facebookId, accessToken } = req.body;

		const response = await fetch(`https://graph.facebook.com/me?access_token=${accessToken}`);
		const fbUser = await response.json();

		if (fbUser.id !== facebookId) {
			res.status(400);
			throw new Error('invalid facebook token');
		}

		let user = await User.findOne({ $or: [{ facebookId }, { email }] });

		console.log(user);
		if (!user) {
			user = new User({ 
				facebookId,
				// name,
				// email,
				picture
			});

			await user.save();
		}

		const token = createToken({ 
			id: user._id,
			email: user.email,
		});
		res.cookie("accessToken", token, {
			secure: true,
			httpOnly: true,
			sameSite: "none",
		});

		res.redirect(url)
	}
)
