import mongoose from "mongoose";

const messageModel = mongoose.Schema(
	{
		sender: {
			type: mongoose.SchemaTypes.ObjectId,
			ref: "User",
			required: true,
		},
		receiver: {
			type: mongoose.SchemaTypes.ObjectId,
			ref: "User",
			required: true,
		},
		content: {
			type: String,
		},
		read: {
			type: Boolean,
			default: false,
		},
		chat: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Chat',
			required: true
		}
	},
	{
		timestamps: true,
	}
);

export default mongoose.model("Message", messageModel);
