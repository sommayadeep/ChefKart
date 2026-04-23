const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const { auth } = require('../middleware/auth');

// Create Booking
router.post('/', auth, async (req, res) => {
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
        
        // Notify Chef
        const io = req.app.get('io');
        io.to(chefId.toString()).emit('newBooking', {
            message: 'New booking request received!',
            booking
        });

        res.status(201).json(booking);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get User Bookings
router.get('/user', auth, async (req, res) => {
    try {
        const bookings = await Booking.find({ userId: req.user.id }).populate('chefId', 'name email');
        res.json(bookings);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get Chef Bookings
router.get('/chef', auth, async (req, res) => {
    try {
        const bookings = await Booking.find({ chefId: req.user.id }).populate('userId', 'name email');
        res.json(bookings);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update Booking Status
router.patch('/:id', auth, async (req, res) => {
    try {
        const { status } = req.body;
        const booking = await Booking.findById(req.params.id);
        if (!booking) return res.status(404).json({ message: 'Booking not found' });
        
        // Only the assigned chef or admin can update status
        if (booking.chefId.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized' });
        }

        booking.status = status;
        await booking.save();

        // Notify User
        const io = req.app.get('io');
        io.to(booking.userId.toString()).emit('bookingStatusUpdate', {
            message: `Your booking status has been updated to ${status}`,
            bookingId: booking._id,
            status
        });

        res.json(booking);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
