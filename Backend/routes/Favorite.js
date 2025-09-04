import express from 'express';
import { addFavorite, deleteFavorite, getFavroites } from '../controllers/Favorites.js';
import validateToken from '../middlewares/validateTokenHandle.js';
const router = express.Router();

router.route('/getAll').get(validateToken, getFavroites);

router.route('/add').post(validateToken, addFavorite);

router.route('/delete').post(validateToken, deleteFavorite);

export default router;