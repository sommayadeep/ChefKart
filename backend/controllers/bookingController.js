const Booking = require('../models/Booking');

const createBooking = async (req, res) => {
    try {
        const { chefId, date, timeSlot, totalAmount, notes, paymentId } = req.body;
        const booking = new Booking({
            userId: req.user.id,
            chefId,
            date,
            timeSlot,
            totalAmount,
            notes,
            paymentId,
            paymentStatus: paymentId ? 'paid' : 'pending'
        });
        await booking.save();

        const io = req.app.get('io');
        io.to(chefId.toString()).emit('newBooking', {
            message: 'New booking request received!',
            booking
        });

        return res.status(201).json(booking);
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};

const getUserBookings = async (req, res) => {
    try {
        const bookings = await Booking.find({ userId: req.user.id }).populate('chefId', 'name email');
        return res.json(bookings);
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};

const getChefBookings = async (req, res) => {
    try {
        const bookings = await Booking.find({ chefId: req.user.id }).populate('userId', 'name email');
        return res.json(bookings);
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};

const updateBookingStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const booking = await Booking.findById(req.params.id);
        if (!booking) return res.status(404).json({ message: 'Booking not found' });

        if (booking.chefId.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized' });
        }

        booking.status = status;
        await booking.save();

        const io = req.app.get('io');
        io.to(booking.userId.toString()).emit('bookingStatusUpdate', {
            message: `Your booking status has been updated to ${status}`,
            bookingId: booking._id,
            status
        });

        return res.json(booking);
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};

module.exports = {
    createBooking,
    getUserBookings,
    getChefBookings,
    updateBookingStatus
};
