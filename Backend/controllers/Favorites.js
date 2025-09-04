import asyncHandler from 'express-async-handler';
import Favorite from '../models/favoriteModel.js'
import { isValidObjectId } from 'mongoose';

export const getFavroites = asyncHandler(
    async (req, res) => { 
        const userId = req.user.id;
        const page = req.query.page;
        const perPage = parseInt(req.query.perPage) || 9;
        const skip = (page - 1) * 9 || perPage - 9;

        const favorites = await Favorite.aggregate([
            {
                $match: { $expr: { $eq: ["$user", { $toObjectId: userId }] } }
            }, {
                $lookup: {
                    from: 'properties',
                    localField: 'property',
                    foreignField: '_id',
                    as: 'property'
                }
            }, {
                $unwind: "$property"
            }, {
                $sort: { createdAt: -1 }
            }, {
                $skip: skip
            }, {
                $limit: perPage
            }, {
                $replaceRoot: { newRoot: "$property" }
            }
        ])

        res.status(200).json({ status: 200, favorites });
    }
)

export const addFavorite = asyncHandler(
    async (req, res) => {
        const userId = req.user.id;
        const { propertyId } = req.body;

        if (!isValidObjectId(propertyId)) {
            res.status(400);
            throw new Error('invalid property id');
        }

        const favoriteExisting = await Favorite.findOne({ property: propertyId, user: userId });

        if (favoriteExisting) {
            res.status(400);
            throw new Error('property is already added to your favorite list');
        }

        const favorite = new Favorite({
            user: userId,
            property: propertyId
        });
        await favorite.save();
        await favorite.populate({
            path: 'user property',
            select: '-password'
        })

        res.status(200).json({ status: 200, message: 'property added to your favorite list' })
    }
)

export const deleteFavorite = asyncHandler(
    async (req, res) => {
        const { propertyId } = req.body;

        const deletedProperty = await Favorite.deleteOne({ property: propertyId });
        if (deletedProperty.deletedCount === 0) {
            res.status(400);
            throw new Error('property is\'t found');
        }

        res.status(200).json({ status: 200, message: 'property deleted from your favorite list' });
    }
)