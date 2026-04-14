import express from "express";
import validateToken from "../middlewares/validateTokenHandling.js";
import {
	deleteProperty,
	getCertainProperty,
	getOwnProperties,
	getProperties,
	updateProperty,
	uploadProperty,
} from "../controllers/Property.js";
import multer from "../config/multer.js";
const router = express.Router();

router.route("/:id/details").get(getCertainProperty);

router.route("/:id/delete").delete(validateToken, deleteProperty);

router.route("/:id/update").patch(validateToken, updateProperty);

router.route("/get").get(validateToken, getOwnProperties);

router.route("/getAll").get(getProperties);

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

export default router;
