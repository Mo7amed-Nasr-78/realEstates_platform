import asyncHandler from "express-async-handler";
import { v2 as cloudinary } from "cloudinary";
import { createReadStream } from "streamifier";
import { isValidObjectId } from "mongoose";
import User from "../models/userModel.js";
import Property from "../models/propertyModel.js";
import Booking from "../models/bookingModel.js";
import { createNotification } from './Notification.js'

export const getProperties = asyncHandler(
	async (req, res) => {
		const page = parseInt(req.query.page) || 1;
		const perPage = parseInt(req.query.perPage) || 9;
		const skip = (page - 1) * perPage;
		const { q, minPrice, maxPrice, category, rooms, bathrooms } = req.query;

		const properties = await Property.aggregate([
			{
				$match: { 
					$and: [
						{ status: { $eq: 'pending' } },
						{ verification: { $eq: true } },
						...(q? [{ name: { $regex: q, $options: 'i' } }]: []),
						...(minPrice || maxPrice ? [{
							forSale: {
								...(minPrice ? { $gte: parseInt(minPrice) } : []),
								...(maxPrice ? { $lte: parseInt(maxPrice) } : []),
							}
						}]: []),
						...(category? [{ category: { $eq: category } }]: []),
						...(rooms? [{ 
							rooms: {
								$gt: 0,
								$lte: parseInt(rooms)
							}
						}]: []),
						...(bathrooms? [{ 
							bathrooms: {
								$gt: 0,
								$lte: parseInt(bathrooms)
							}
						}]: [])
					]
				}
			}, {
				$sort: { createdAt: -1 }
			}, {
				$skip: skip
			}, {
				$limit: perPage
			}
		]);

		res.status(200).json({ status: 200, total: properties.length, properties });
	}
)

export const getCertainProperty = asyncHandler(
	async (req, res) => {
		const propertyId = req.params.id;

		if (!isValidObjectId(propertyId)) {
			res.status(400);
			throw new Error('invalid property id');
		}
			
		const property = await Property.findOne({ _id: propertyId }).populate('user');
		if (!property) {
			res.status(400);
			throw new Error('property is\'t found');
		}

		res.status(200).json({ status: 200, property });
	}
)

export const getOwnProperties = asyncHandler(
	async (req, res) => {
		const userId = req.user.id;
		const user = await User.findOne({ _id: userId });

		if (!user) {
			res.status(400);
			throw new Error("The account isn't found");
		}

		if (user.role !== 'agent') {
			res.status(400);
			throw new Error("there aren't properties found");
		}

		const properties = await Property.aggregate([
			{
				$match: { user: user._id }
			},	
			{
				$lookup: {
					from: 'bookings',
					localField: '_id',
					foreignField: 'property',
					as: 'bookings'
				}
			},
			{ $unwind: { path: "$bookings", preserveNullAndEmptyArrays: true } },
			{
				$group: {
					_id: { propertyId: "$_id", status: "$bookings.status" },
					name: { $first: "$name" },
					images: { $first: "$propertyImages" },
					status: { $first: '$status' },
					price: { $first: '$forSale' },
					createdAt: { $first: "$createdAt" },
					totalBookings: { $sum: 1 }
				}
			},
			{
				$group: {
					_id: "$_id.propertyId",
					name: { $first: "$name" },
					images: { $first: "$images" },
					status: { $first: '$status' },
					price: { $first: '$price' },
					createdAt: { $first: "$createdAt" },
					pendingBookings: {
						$sum: { $cond: [{ $eq: ['$_id.status', 'pending']}, '$totalBookings', 0 ] }
					},
					acceptedBookings: {
						$sum: { $cond: [{ $eq: ['$_id.status', 'accepted']}, '$totalBookings', 0 ] }
					},
					visitedBookings: {
						$sum: { $cond: [{ $eq: ['$_id.status', 'visited']}, '$totalBookings', 0 ] }
					}
				}
			},
			{
				$sort: { createdAt: -1 }
			}
		]);

		res.status(200).json({ status: 200, properties });
	}
)

export const uploadProperty = asyncHandler(
	async (req, res) => {
		const userId = req.user.id;
		const images = req.files;

		const user = await User.findOne({ _id: userId });
		if (user.role !== 'agent') {
			res.status(400);
			throw new Error('you can\'t handle that request');
		}

		if (images.length < 1) {
			res.status(400);
			throw new Error('please enter property\'s images');
		}

		let {
			name,
			address,
			rooms,
			bathrooms,
			garages,
			yearBuilt,
			area,
			category,
			forSale,
			forRent,
			description,
			features,
			insights,
			financials,
		} = req.body;
		
		for (const item of Object.values(req.body)) {
			if (!item) {
				res.status(400);
				throw new Error('please enter all property\'s details');
			}
		}

		console.log(category);

		area = parseInt(area);
		rooms = parseInt(rooms);
		garages = parseInt(garages);
		forSale = parseInt(forSale);
		forRent = parseInt(forRent);
		bathrooms = parseInt(bathrooms);

		if (isNaN(rooms) || isNaN(bathrooms) || isNaN(garages) || isNaN(area) || isNaN(forSale) || isNaN(forRent)) {
			res.status(400); 
			throw new Error('please, enter valid data');
		}

		let imagePaths = [];
		const uploadToCloudinary = (fileBuffer) => {
			return new Promise((resolve, reject) => {
				let stream = cloudinary.uploader.upload_stream(
				{ 
					folder: `uploads/${req.user.id}`,
					public_id: `property-${Date.now()}`
				},
				(error, result) => {
					if (result) resolve(result);
					else reject(error);
				}
				);
				createReadStream(fileBuffer).pipe(stream);
			});
		};

		for (const image of Object.values(images)) {
			const result = await uploadToCloudinary(image[0].buffer);
			imagePaths.push(result.secure_url);
		}


		const property = new Property({
			name,
			address,
			rooms,
			bathrooms,
			garages,
			yearBuilt,
			area,
			category,
			forSale,
			forRent,
			description,
			status: 'pending',
			propertyImages: imagePaths,
			propertyFeatures: JSON.parse(features),
			neighborhoodInsights: JSON.parse(insights),
			financialInfo: JSON.parse(financials),
			user: userId
		});
		await property.save();

		await createNotification({
			event: 'notification',
			senderId: userId,
			receiverId: booking.user.toString(),
			content: `your ${property.name} property uploaded and wait for confirm`
		});

		user.properties.push(property._id);
		await user.save();

		res.status(201).json({ status: 201, message: "property has been uploaded", property });
	}
);

export const deleteProperty = asyncHandler(
	async (req, res) => {
		const propertyId = req.params.id;
		if (!isValidObjectId(propertyId)) {
			res.status(400);
			throw new Error("invalid property id");
		}

		const userId = req.user.id;
		const user = await User.findOne({ _id: userId }).select('role');
		if (user.role !== 'agent') {
			res.status(400);
			throw new Error("You don't have access to update that Property" + propertyId);
		}

		const property = await Property.findOne({ _id: propertyId });
		if (!property) {
			res.status(400);
			throw new Error("property isn't found");
		}

		const deletedProperty = await Property.deleteOne({ _id: propertyId, status: 'pending' });
		if (deletedProperty.deletedCount < 1) {
			res.status(400);
			throw new Error('you can\'t delete property cause it\'s ' + property.status);
		}

		await Booking.deleteMany({ property, status: 'pending' });

		res.status(200).json({ status: 200, message: 'Property has been deleted successfully' });
	}
)

export const updateProperty = asyncHandler(
	async (req, res) => {

	}
)
