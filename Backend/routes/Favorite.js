import express from "express";
import {
	addFavorite,
	removeFavorite,
	getFavroites,
} from "../controllers/Favorites.js";
import validateToken from "../middlewares/validateTokenHandling.js";
const router = express.Router();

router.route("/getAll").get(validateToken, getFavroites);

router.route("/add").post(validateToken, addFavorite);

router.route("/remove").post(validateToken, removeFavorite);

export default router;
