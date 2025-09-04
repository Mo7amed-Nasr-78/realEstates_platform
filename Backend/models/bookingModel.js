import mongoose from 'mongoose';

const bookSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    purpose: {
        type: String,
        required: true,
        enum: ['buy', 'rent', 'investment']
    },
    status: {
        type: String,
        required: true,
        enum: ['pending', 'accepted', 'rejected', 'visited']
    },
    time: {
        type: String,
        required: true,
    },
    date: {
        type: String,
        required: true,
    },
    user: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'User',
        required: true
    },
    agent: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'User',
        required: true
    },
    property: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'Property',
        required: true
    }
}, {
    timestamps: true
});

export default mongoose.model('Booking', bookSchema);