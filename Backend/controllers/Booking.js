import asyncHandler from 'express-async-handler';
import Booking from '../models/bookingModel.js';
import Property from '../models/propertyModel.js';
import User from '../models/userModel.js';
import { isValidObjectId } from 'mongoose';
import { createNotification } from './Notification.js';

export const getAllBookings = asyncHandler(
    async (req, res) => {
        const userId = req.user.id;
        const user = await User.findOne({ _id: userId }).select('-_id role');
        if (user.role !== 'admin') {
            res.status(500);
            throw new Error('can\'t handle that request');
        }

        const userBookings = await Booking.find()
        .populate({
            path: ['user', 'agent', 'property'],
            select: 'name picture propertyImages'
        })

        const BookingStats = await Booking.aggregate([
            {
                $group: {
                    _id: '$status',
                    count: { $sum: 1 }
                }
            },
        ])

        if (userBookings.length < 0) {
            res.status(400);
            throw new Error('no bookings found');
        }

        res.status(200).json({
            status: 200,
            total: userBookings.length,
            pendingBookings:  BookingStats[0]?.count || 0,
            acceptedBookings: BookingStats[1]?.count || 0,
            visitedBookings: BookingStats[2]?.count || 0,
            bookings: userBookings
        })

    }
)

export const getReceivedBookings = asyncHandler(
    async (req, res) => {
        const userId = req.user.id;
        const { status, sort } = req.query;

        const bookings = await Booking.aggregate([
            {
                $match: {
                    $expr: {
                        $and: [
                            { $eq: ["$agent", { $toObjectId: userId }] },
                            ...(status? [{ $eq: ["$status", status] }] : [])
                        ]
                    }
                }
            }, {
                $group: {
                    _id: "$status",
                    count: { $sum: 1 },
                    bookings: { $push: "$$ROOT" }
                }
            }, {
                $unwind: "$bookings"
            }, {
                $replaceRoot: {
                    newRoot: {
                        $mergeObjects: [
                            "$bookings",
                            {
                                statusCount: "$count",
                                statusGroup: "$_id"
                            }
                        ]
                    }
                }
            }, {
                $lookup: {
                    from: "properties",
                    let: { propertyId: "$property"},
                    pipeline: [
                        { $match: { $expr: { $eq: ["$_id", "$$propertyId"] } } },
                        { $project: {
                            name: 1,
                            status: 1
                        } }
                    ],
                    as: 'property'
                }
            }, {
                $unwind: "$property"
            }, {
                $lookup: {
                    from: 'users',
                    let: { userId: '$user' },
                    pipeline: [
                        { $match: { $expr: { $eq: ["$_id", "$$userId"] } } },
                        { $project: {
                            name: 1,
                            picture: 1,
                            jobTitle: 1,
                            isActive: 1,
                        } }
                    ],
                    as: 'user'
                }
            }, {
                $unwind: "$user"
            }, {
                $sort: { createdAt: sort === 'latest' || !sort ? -1 : 1 }
            }
        ])

        if (!bookings) {
            res.status(404);
            throw new Error('no booking invitations found');
        }

        res.status(200).json({ 
            status: 200, 
            total: bookings.length,
            bookings 
        });
    }
)

export const getOwnBookings = asyncHandler(
    async (req, res) => {
        const userId = req.user.id;

        const userBookings = await Booking.find({ user: userId })
        .populate({
            path: ['user', 'agent', 'property'],
            select: 'name picture propertyImages'
        })

        if (userBookings.length < 0) {
            res.status(400);
            throw new Error('you don\'t make any property invitation yet');
        }

        res.status(200).json({
            status: 200,
            total: userBookings.length,
            bookings: userBookings
        })

    }
)

export const createBooking = asyncHandler(
    async (req, res) => {
        const userId = req.user.id;
        const { name, email, phone, purpose, time, date, propertyId } = req.body;

        if (!name || !email || !phone || !purpose || !time || !date) {
            res.status(400);
            throw new Error('please, fill all feilds');
        }

        if (!isValidObjectId(propertyId)) {
            res.status(400);
            throw new Error('invalid property id');
        }
        
        const property = await Property.findOne({ _id: propertyId });
        if (!property) {
            res.status(404);
            throw new Error('property isn\'t found');
        }

        if (userId === property.user.toString()) {
            res.status(500);
            throw new Error('internal server error');
        }

        const existingBooking = await Booking.findOne({ user: userId, property });
        if (existingBooking) {
            res.status(400);
            throw new Error(`you\'ve already sent booking and ${existingBooking.status}`);
        }

        const sameScheduledBooking = await Booking.findOne({ time, date });
        if (sameScheduledBooking) {
            res.status(400);
            throw new Error(`this booking isn\'t available`);
        }

        const booking = await Booking.create({
            name,
            email,
            phone,
            purpose,
            time,
            date,
            status: 'pending',
            user: userId,
            agent: property.user,
            property: property._id
        })
        await booking.save();

        property.bookings.push(booking._id);
        await property.save();

        if (!booking) {
            res.status(500);
            throw new Error('internal server error');
        }

        await createNotification({
            event: 'newNotification',
            senderId: userId,
            receiverId: property.user.toString(),
            content: `sent to you booking invitation on ${property.name}`
        });

        res.status(201).json({
            status: 201,
            message: 'your booking has been sent successfully',
            booking
        })
    }
)

export const updateBooking = asyncHandler(
    async (req, res) => {
        const userId = req.user.id;
        const bookingId = req.params.id;
        const { status } = req.body;

        const booking = await Booking.findOne({
            _id: bookingId,
            agent: userId
        }).populate({
            path: 'property',
            select: 'name'
        })


        if (!booking) {
            res.status(400);
            throw new Error('no bookings found');
        }

        if (booking.status.includes(status)) {
            res.status(400);
            throw new Error(`the booking is already updated to ${status}`);
        }

        // func for notify sending
        async function sendNotification(content) {
            await createNotification({
                event: 'newNotification',
                senderId: userId,
                receiverId: booking.user.toString(),
                content
            });
        }

        if (booking.status === 'pending' && status.includes('accepted')) {
            booking.status = status;
            await booking.save();
            sendNotification(`${status} your booking invitation on ${booking.property.name}`);
        } else if (booking.status === 'accepted' && status.includes('visited')) {
            booking.status = status;
            await booking.save();
            sendNotification(`confirm your visiting on ${booking.property.name}, all the best`);
        } else if (booking.status === 'pending' && status.includes('rejected')) {
            sendNotification(`${status} your booking invitation on ${booking.property.name}, send it later`)
            await Booking.deleteOne({ _id: booking._id });
            res.status(200).json({ 
                status: 200, 
                message: 'booking invitation rejected successfully',
                deletedBooking: booking
            });
        } else {
            res.status(400);
            throw new Error('youn\'t update that booking invitation');
        }

        res.status(200).json({ status: 200, message: 'booking updated successfully', updatedBooking: booking })
    }
)

export const deleteBooking = asyncHandler(
    async (req, res) => {
        const bookingId = req.params.id;

        if (!isValidObjectId(bookingId)) {
            res.status(400);
            throw new Error('invalid booking id');
        }

        const booking = await Booking.findOne({ _id: bookingId, status: 'pending' });
        if (!booking) {
            res.status(400);
            throw new Error('the booking isn\'t found');
        }

        const deletedBooking = await Booking.findOneAndDelete({
            _id: booking._id,
        });

        res.status(200).json({ 
            status: 200,
            message: 'booking invitation cancelled successfully',
            deletedBooking
        });
    }
)