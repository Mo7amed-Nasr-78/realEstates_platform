import mongoose from "mongoose";

const favoritesSchema = mongoose.Schema({
    property: { 
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'Property', 
        required: true 
    },
    user: { 
        type: mongoose.SchemaTypes.ObjectId, 
        ref: 'User', 
        required: true 
    }
}, 
{
    timestamps: true
});

favoritesSchema.index({ user: 1, property: 1 }, { unique: true });

export default mongoose.model('Favorite', favoritesSchema);