import { isValidObjectId } from "mongoose";
import asyncHandler from "express-async-handler";
// Models
import User from "../models/userModel.js";
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
	const io = getIO();
	const usersSet = getUsersTracking();

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
		chat,
	});

	const chatMsgsCount = await Message.countDocuments({ chat });
	if (chatMsgsCount === 1) {

		const otherUser = await User.findOne({ _id: userId })
		.select('name picture isActive lastSeen');

		const userSocket = usersSet.get(otherUserId);
		if (userSocket) {
			io.to(userSocket).emit("newChat", {
				_id: chat._id,
				lastMessage: message,
				otherUser,
				createdAt: chat.createdAt
			});
		}
	}

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

		const io = getIO();
		const usersSet = getUsersTracking();
		const userSocket = usersSet.get(deletedMsg.receiver.toString());
		if (userSocket) {
			io.to(userSocket).emit("deleteMessage", deletedMsg);
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
	const markRead = req.query.markRead;
	
	const unreadMessages = await Message.find({ chat: chatId, receiver: userId, read: false }, { _id: 1 });
	const unreadMessagesIds = unreadMessages.map((msg) => msg._id.toString());

	const readMessages = await Message.updateMany({ chat: chatId, receiver: userId, read: false }, { $set: { read: markRead } });

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

	if (readMessages.modifiedCount > 0) {
		const io = getIO();
		const usersSet = getUsersTracking();
		const senderSocket = usersSet.get(otherUser._id.toString());

		if (senderSocket) {
			io.to(senderSocket).emit('markUnreadMessages', unreadMessagesIds);
		}
	} 

	res.status(200).json({ 
		status: 200,
		otherUser,
		messages
	});
});

// Mark messages as read
export const markMessageAsRead = asyncHandler(
	async (req, res) => {
		const messageId = req.params.messageId;
		const io = getIO();
		const usersSet = getUsersTracking();

		const msg = await Message.findOneAndUpdate({ _id: messageId }, { $set: { read: true } }, { new: true });

		if (!msg) {
			res.status(400);
			throw new Error('message isn\'t found');
		}

		const userSocket = usersSet.get(msg.sender.toString());
		if (userSocket) {
			io.to(userSocket).emit('readMessage', msg);
		}

		res.status(200).json({ 
			status: 400,
			message: 'message marked as read',
			message: msg
		})
	}
)

export const markAllMessagesAsRead = asyncHandler(
	async (req, res) => {
		const chatId = req.params.chatId;
		const io = getIO();
		const usersSet = getUsersTracking();

		const msgs = await  Message.findAndUpdate({ chat: chatId }, { $set: { read: true } }, { new: true })

		if (msgs.length < 1) {
			res.status(400);
			throw new Error('messages aren\'t found');
		}

		const senderSocket = usersSet.get(msgs[0].sender.toString());
		if (senderSocket) {
			io.to(senderSocket).emit('chat:realAll', msgs);
			// console.log('All messages have been marked as read');
		}

		// return true;
		res.status(200).json({
			status: 200,
			message: 'all chat messages marked as read',
			messages: msgs
		})
	}
)
