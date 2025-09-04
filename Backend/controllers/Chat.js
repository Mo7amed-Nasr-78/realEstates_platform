import { isValidObjectId } from "mongoose";
import asyncHandler from "express-async-handler";
// Models
import Chat from "../models/chatModel.js";
import Message from "../models/messageModel.js";
// Socket.io
import { getIO, getUsersTracking } from "../config/socket.io.js";


export const createChat = asyncHandler(
	async (req, res) => {
		const userId = req.user.id;
		const otherUserId = req.params.otherUserId;

		const existingChat = await Chat.findOne({
			$expr: {
				$and: [
					{ $eq: [{ $size: "$participants" }, 2 ] },
					{
						$setIsSubset: [
							[
								{ $toObjectId: userId },
								{ $toObjectId: otherUserId }
							],
							"$participants"
						]
					}
				]
			}
		})

		if (!existingChat) {
			const newChat = await Chat.create({
				participants: [userId, otherUserId]
			});

			res.status(201).json({ status: 201, message: 'new chat created successfully', chat: newChat })
		}

		res.status(200).json({ status: 200, message: 'chat is already existed', chat: existingChat });
	}
)

// Message creation
export const createMessage = asyncHandler(async (req, res) => {
	let chat;
	const userId = req.user.id;
	const otherUserId = req.params.otherUserId;
	const { content } = req.body;

	if (!isValidObjectId(otherUserId)) {
		res.status(400);
		throw new Error("invalid receiver id");
	}

	chat = await Chat.findOne({
		participants: { $all: [userId, otherUserId] }
	});

	if (!chat) {
		chat = await Chat.create({
			participants: [userId, otherUserId]
		});
	}
	
	const message = await Message.create({
		sender: userId,
		receiver: otherUserId,
		content,
		chat
	});

	const io = getIO();
	const usersSet = getUsersTracking();
	const userSocket = usersSet.get(otherUserId);
	if (userSocket) {
		io.to(userSocket).emit("newMessage", message);
	}

	res.status(201).json({ status: 201, message });
});

// Message Delelation
export const deleteMessage = asyncHandler(
	async (req, res) => {
		const senderId = req.user.id;
		const msgId = req.params.id;

		if (!isValidObjectId(msgId)) {
			res.status(400);
			throw new Error('invalid message id')
		}
		
		const deletedMsg = await Message.findOneAndDelete({ _id: msgId, sender: senderId });

		if (!deletedMsg) {
			res.status(404);
			throw new Error('the message isn\'t found');
		}

		res.status(200).json({ 
			status: 200, 
			message: 'message has been deleted',
			deletedMessage: deletedMsg
		});
	}
)

// Get all current conversations
export const getCuurentConversations = asyncHandler(
	async (req, res) => {
		const userId = req.user.id;
		const receiverName = req.query.name || '';

		const conversations = await Chat.aggregate([
			{
				$match: { 
					$expr: {
						$in: [{ $toObjectId: userId }, "$participants"],
					}
				}
			}, {
				$lookup: {
					from: 'messages',
					let: { chatId: '$_id' },
					pipeline: [
						{ $match: { $expr: { $eq: ["$chat", "$$chatId"] } } },
						{ $sort: { createdAt: -1 } },
						{ $limit: 1 }
					],
					as: 'lastMessage'
				}
			}, {
				$unwind: "$lastMessage"
			}, {
				$addFields: {
					otherUser: {
						$arrayElemAt: [
							{ $setDifference: ["$participants", [{ $toObjectId: userId }]] },
							0
						]
					}
				}
			}, {
				$lookup: {
					from: 'users',
					let: { otherUser: "$otherUser" },
					pipeline: [
						{ $match: { $expr: { $eq: ["$_id", "$$otherUser"] } } },
						{ $project: {
							name: 1,
							picture: 1,
							isActive: 1
						} }
					],
					as: "otherUser"
				}
			}, {
				$unwind: "$otherUser"
			}, {
				$match: { 
					$expr: {
						$regexMatch: { input: "$otherUser.name", regex: receiverName, options: 'i' }
					}
				}
			}, {
				$sort: { "lastMessage.createdAt": -1 }
			}
		])

		res.status(200).json({ 
			status: 200, 
			conversations 
		})
	}
)

// Get specific coversation
export const getConversation = asyncHandler(async (req, res) => {
	const userId = req.user.id;
	const chatId = req.params.chatId;

	const messages = await Message.aggregate([
		{
			$match: { $expr: { $eq: ["$chat", { $toObjectId: chatId }] } }
		},
	])

	const chat = await Chat.findById(chatId)
	.populate({
		path: 'participants',
		select: 'name picture isActive lastSeen'
	});

	const otherUser = chat.participants.find((p) => {
		return p._id.toString() !== userId.toString();
	});

	res.status(200).json({ 
		status: 200,
		otherUser,
		messages
	});
});

// Mark messages as read
export const readMessages = asyncHandler(
	async (req, res) => {

	}
)

