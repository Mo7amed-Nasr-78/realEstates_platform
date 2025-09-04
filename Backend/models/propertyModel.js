import mongoose from "mongoose";

const PropertySchema = mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
			default: "",
			trim: true
		},
		rooms: {
			type: Number,
			required: true,
			default: 0,
		},
		bathrooms: {
			type: Number,
			required: true,
			default: 0,
		},
		area: {
			type: Number,
			required: true,
			default: 0,
		},
		garages: {
			type: Number,
			required: false,
			default: 0,
		},
		yearBuilt: {
			type: String,
			required: true,
			default: "",
		},
		description: {
			type: String,
			required: true,
			default: "",
		},
		address: {
			type: String,
			required: true,
		},
		propertyFeatures: {
			type: Array,
			required: [true, "Must be at least 1 feature"]
		},
		neighborhoodInsights: {
			type: Array,
			required: [true, 'Must be at least 1 insight']
		},
		financialInfo: {
			type: Array,
			required: [true, "Must be at least 1 financial"]
		},
		forSale: {
			type: Number,
			required: false,
			default: "0",
		},
		forRent: {
			type: Number,
			required: false,
			default: "0",
		},
		propertyImages: {
			type: Array,
			required: [true, "Must be at least 1 image"],
		},
		status: {
			type: String,
			enum: ['pending', 'sold', 'rented']
		},
		category: {
			type: String,
			enum: ['residential', 'industerial', 'commercial', 'investment'],
			required: false
		},
		tags: {
			type: String,
			enum: ['sell', 'rent'],
			required: false
		},
		views: {
			type: String,
			default: ''
		},
		verification: {
			type: Boolean,
			default: false
		},
		user: { 
			type: mongoose.Schema.Types.ObjectId, 
			ref: 'User', 
			required: true 
		},
		bookings: [{
			type: mongoose.Schema.Types.ObjectId, 
			ref: 'Booking', 
			required: true 
		}]
	},
	{
		timestamps: true,
	}
);

export default mongoose.model("Property", PropertySchema);
