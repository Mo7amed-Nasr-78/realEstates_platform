import express from 'express';
const router = express.Router();
import { createChat, createMessage, deleteMessage, getConversation, getCuurentConversations } from '../controllers/Chat.js'
import validateToken from '../middlewares/validateTokenHandle.js';

router.route('/create/:otherUserId').get(validateToken, createChat);

router.route('/conversations/:chatId').get(validateToken, getConversation);

router.route('/message/:otherUserId').post(validateToken, createMessage);

router.route('/message/:id').delete(validateToken, deleteMessage);

router.route('/conversations').get(validateToken, getCuurentConversations);



export default router;