import mongoose from "mongoose";

const BookingSchema = new mongoose.Schema({
    farmerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,      
    },
    farmerName: {
        type: String,
        required: true,
    },
    district: {
        type: String,
        required: true,
    },
    commodity: {
        type: String,
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
    },
    allottedDate: {
        type: String, // YYYY-MM-DD
        required: true,
    },
    allottedTime: {
        type: String, // e.g. "Morning", "Afternoon"
        required: true,
    },
    tokenNumber: {
        type: String, // e.g. "OPT-12345"
        required: true,
    },
    status: {
        type: String,
        enum: ['PENDING', 'APPROVED', 'REJECTED'],
        default: 'PENDING'
    }
}, { timestamps: true });

const Booking = mongoose.model('Booking', BookingSchema);

export default Booking;
