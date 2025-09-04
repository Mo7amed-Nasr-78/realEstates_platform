import asyncHandler from "express-async-handler";
// Models
import Notification from "../models/notificationModel.js";
import { getSseClients } from "../config/initSSE.js";

export const getNotification = asyncHandler(
	async (req, res) => {
		const userId = req.user.id;

		const notifications = await Notification.find({ receiver: userId })
		.sort({ createdAt: -1 })
		.populate({
			path: 'sender receiver',
			select: 'name picture'
		});
		
		if (notifications.length < 0) {
			res.status(400);
			throw new Error('no notifications found');
		}
		
		const unreadNotifications = await Notification.find({ receiver: userId, read: false });

		res.status(200).json({ 
			status: 200,
			unreadNotifications,
			allNotifications: notifications
		})
	}
)

export const createNotification = asyncHandler (
	async ({ event, senderId, receiverId, content }) => {

		const notification = await Notification.create({
			sender: senderId,
			receiver: receiverId,
			content,
		});
		await notification.populate({
			path: 'sender receiver',
			select: 'name picture'
		});

		if (!notification) {
			res.status(500);
			throw new Error("internal server error");
		}

		const usersSet = getSseClients();
		const receiverSse = usersSet.get(receiverId);
		receiverSse.write(`event: ${event}\n`);
		receiverSse.write(`data: ${JSON.stringify(notification)}\n\n`);
	}
)

export const readNotifications = asyncHandler (
	async (req, res) => {
		const receiverId = req.user.id;
		const updatedNotifications = await Notification.updateMany(
			{ 
				receiver: receiverId,
				read: false,
			},
			{
				$set: { read: true }
			}
		)

		if (updatedNotifications.modifiedCount < 1) {
			res.status(400);
			throw new Error('no notifications found to update');
		}

		res.status(200).json({ status: 200, message: 'all notifications marked as read' });
	}
)

export const clearNotifications = asyncHandler(
	async (req, res) => {
		const userId = req.user.id;
		await Notification.deleteMany({ receiver: userId });
		res.status(200).json({ status: 200, message: 'all notifications cleared' });
	}
)

