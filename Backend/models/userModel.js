import mongoose from "mongoose";

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please Enter Your Name"],
        trim: true
    },
    email: {
        type: String,
        required: [true, "Please Enter Your Email"],
        unique: [true, "this email is used"],
        validate: {
            validator: function (v) {
                return /^[a-zA-Z0-9._]+@(gmail|outlook|hotmail|live|yahoo|icloud|me)\.com$/.test(v);
            },
            message: 'Please Enter Valid Email'
        },
        trim: true
    },
    password: {
        type: String,
        required: [true, "Please Enter Your Password"],
        trim: true
    },
    jobTitle: {
        type: String,
        default: ''
    },
    aboutMe: {
        type: String,
        required: false,
        default: ''
    },
    address: {
        type: String,
        required: false,
        default: 'unknown'
    },
    phone: {
        type: String,
        default: 'unknown'
    },
    gender: {
        type: String,
        required: false,
        default: '',
    },
    age: {
        type: String,
        required: false,
        default: '',
    },
    googleId: {
        type: String,
        required: false,
        default: ''
    },
    facebookId: {
        type: String,
        required: false,
        default: ''
    },
    picture: {
        type: String,
        required: false,
        default: ''
    },
    isActive: {
        type: Boolean,
        required: false,
        default: false,
    },
    verify: {
        type: Boolean,
        default: false,
    },
    socialMediaHandles: {
        type: Map,
        of: String,
        default: {
            facebook: '',
            instagram: '',
            twitterX: ''
        }
    },
    certifications: {
        type: Array,
        default: []
    },
    role: {
        type: String,
        enum: ['finder', 'agent', 'guest', 'admin'],
        required: [ true, 'Invalid Role!' ],
    },
    languages: {
        type: Array,
        of: String
    },
    lastSeen: {
        type: Date
    },
    // Relation
    otp: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Otp' 
    },
    properties: [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Property' 
    }],
    favorites: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Favorite'
    }],
    notifications: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Notification'
    }]
}, {
    timestamps: true
})

export default mongoose.model("User", userSchema);