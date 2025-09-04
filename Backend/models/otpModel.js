import mongoose from 'mongoose';

const otpModel = mongoose.Schema(
	{
		otp: {
			type: String,
			required: true,
			default: "",
		},

		attempts: {
			type: Number,
			required: true,
			default: 0,
		},

		user: { type: mongoose.Schema.ObjectId, ref: 'User', required: true }
	},
	{
		timestamps: true,
	}
);

export default mongoose.model("Otp", otpModel);
