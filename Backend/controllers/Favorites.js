import asyncHandler from 'express-async-handler';
import Favorite from '../models/favoriteModel.js';
import User from '../models/userModel.js';
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
        ]);

        if (favorites.length === 0) {
            res.status(200).json({
                status: 200,
                message: "Favorites not found",
                favorites: []
            })
        }

        res.status(200).json({ status: 200, favorites });
    }
)

export const addFavorite = asyncHandler(
    async (req, res) => {
        const userId = req.user.id;
        const { propertyId } = req.body;

        if (!isValidObjectId(propertyId)) {
            res.status(400);
            throw new Error('Invalid property id');
        }

        const favorite = await Favorite.findOne({ property: propertyId, user: userId });
        if (favorite) {
            res.status(400);
            throw new Error('Property is already added to your favorites');
        }
        
        const newFavorite = new Favorite({
            user: userId,
            property: propertyId
        });
        await newFavorite.save();
        await User.findByIdAndUpdate(
            userId,
            { $addToSet: { favorites: newFavorite._id } },
            { new: true }
        );

        res.status(200).json({ 
            status: 200, 
            message: 'Property added to your favorites',
            favorite: newFavorite
        })
    }
)

export const removeFavorite = asyncHandler(
    async (req, res) => {
        const userId = req.user.id;
        const { propertyId } = req.body;

        const deletedFavorite = await Favorite.findOneAndDelete({ property: propertyId, user: userId  });
        if (!deletedFavorite) {
            res.status(200).json({
                status: 200,
                message: "Favorite not found"
            })
        }

        await User.findByIdAndUpdate(
            userId,
            { $pull: { favorites: deletedFavorite._id } },
            { new: true }
        );

        res.status(200).json({ 
            status: 200, 
            message: 'Property removed from your favorites',
            deletedFavorite
        });
    }
)