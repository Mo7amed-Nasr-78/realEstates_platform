import express from 'express';
const router = express.Router();
import validateToken from '../middlewares/validateTokenHandle.js';
import { getNotification, readNotifications, clearNotifications } from '../controllers/Notification.js';

router.route('/get').get(validateToken, getNotification);

router.route('/read').put(validateToken, readNotifications);

router.route('/clearAll').delete(validateToken, clearNotifications);

export default router;