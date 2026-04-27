const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const {
    createBooking,
    getUserBookings,
    getChefBookings,
    updateBookingStatus
} = require('../controllers/bookingController');

// Create Booking
router.post('/', auth, createBooking);

// Get User Bookings
router.get('/user', auth, getUserBookings);

// Get Chef Bookings
router.get('/chef', auth, getChefBookings);

// Update Booking Status
router.patch('/:id', auth, updateBookingStatus);

module.exports = router;
