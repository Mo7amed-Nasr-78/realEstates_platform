import express from "express";
const router = express.Router();
import {
	createChat,
	createMessage,
	deleteMessage,
	getConversation,
	getCuurentConversations,
	markMessageAsRead,
	markAllMessagesAsRead,
} from "../controllers/Chat.js";
import validateToken from "../middlewares/validateTokenHandling.js";

router.route("/message/:messageId/read").patch(
	validateToken,
	markMessageAsRead
);

// router.route('/:chatId/readAll').patch(validateToken, markAllMessagesAsRead);

router.route("/create/:otherUserId").get(validateToken, createChat);

router.route("/:chatId/messages").get(validateToken, getConversation);

router.route("/message/:otherUserId").post(validateToken, createMessage);

router.route("/message/:id").delete(validateToken, deleteMessage);

router.route("/conversations").get(validateToken, getCuurentConversations);

export default router;
