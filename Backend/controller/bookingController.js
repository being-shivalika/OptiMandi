import Booking from "../models/booking.js";

// FARMER: Request a new slot
export const requestSlot = async (req, res) => {
    try {
        const { commodity, quantity, district } = req.body;
        
        if (!commodity || !quantity || !district) {
            return res.status(400).json({ success: false, message: "All fields are required" });
        }

        // Auto-generation logic (Mock for prototype)
        // Set date to 2 days from now
        const futureDate = new Date();
        futureDate.setDate(futureDate.getDate() + 2);
        const allottedDate = futureDate.toISOString().split('T')[0];
        
        // Randomly assign Morning or Afternoon
        const allottedTime = Math.random() > 0.5 ? 'Morning' : 'Afternoon';
        
        // Generate a 6-character random token
        const tokenNumber = 'OPT-' + Math.floor(100000 + Math.random() * 900000);

        const newBooking = await Booking.create({
            farmerId: req.user.id,
            farmerName: req.user.name || "Farmer",
            district,
            commodity,
            quantity: Number(quantity),
            allottedDate,
            allottedTime,
            tokenNumber,
            status: 'APPROVED' // Auto-approved for prototype
        });

        res.status(201).json({ success: true, booking: newBooking });
    } catch (error) {
        console.error("requestSlot error:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

// FARMER: View own slots
export const getMySlots = async (req, res) => {
    try {
        const bookings = await Booking.find({ farmerId: req.user.id }).sort({ createdAt: -1 });
        res.status(200).json({ success: true, bookings });
    } catch (error) {
        console.error("getMySlots error:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

// OFFICIAL: View all slots
export const getAllSlots = async (req, res) => {
    try {
        const bookings = await Booking.find().sort({ createdAt: -1 });
        res.status(200).json({ success: true, bookings });
    } catch (error) {
        console.error("getAllSlots error:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

// OFFICIAL: Update slot status
export const updateSlotStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const { id } = req.params;

        if (!['APPROVED', 'REJECTED'].includes(status)) {
            return res.status(400).json({ success: false, message: "Invalid status" });
        }

        const booking = await Booking.findByIdAndUpdate(id, { status }, { new: true });
        
        if (!booking) {
            return res.status(404).json({ success: false, message: "Booking not found" });
        }

        res.status(200).json({ success: true, booking });
    } catch (error) {
        console.error("updateSlotStatus error:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};
