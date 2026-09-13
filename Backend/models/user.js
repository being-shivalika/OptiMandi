import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,      
    },
    email: {
        type: String,
        required: true,
        unique: [true, 'Email already exists']
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ['FARMER', 'OFFICIAL'],
        default: 'OFFICIAL'
    }
}, { timestamps: true });

const User = mongoose.model('User', UserSchema);

export default User;