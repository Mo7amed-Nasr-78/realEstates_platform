import express from 'express';
import { googleAuth, googleRedirect, facebookAuth } from '../controllers/Auth.js';
const router = express.Router();

router.route("/google/callback").get(googleAuth);

router.route("/google").get(googleRedirect);

router.route("/facebook/callback").post(facebookAuth)

export default router;


