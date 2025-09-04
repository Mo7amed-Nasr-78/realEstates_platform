import express from "express";
import validateToken from "../middlewares/validateTokenHandle.js";
import { deleteProperty, getCertainProperty, getOwnProperties, getProperties, updateProperty, uploadProperty } from "../controllers/Property.js";
import multer from "../config/multer.js";
const router = express.Router();

router.route('/get').get(validateToken, getOwnProperties);

router.route('/getAll').get(getProperties);

router.route('/details/:id').get(getCertainProperty);

router.route("/upload").post(
	validateToken,
	multer.fields([
		{ name: "img1", maxCount: 1 },
		{ name: "img2", maxCount: 1 },
		{ name: "img3", maxCount: 1 },
		{ name: "img4", maxCount: 1 },
	]),
	uploadProperty
);

router.route('/delete/:id').delete(validateToken, deleteProperty);

router.route('/update/:id').patch(validateToken, updateProperty);

export default router;
