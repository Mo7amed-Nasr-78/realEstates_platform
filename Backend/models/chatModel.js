import mongoose from "mongoose";

const chatSchema = mongoose.Schema({
    participants: [{ 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }]
}, { timestamps: true });

export default mongoose.model('Chat', chatSchema);