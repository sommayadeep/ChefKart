const express = require('express');
const router = express.Router();
const Review = require('../models/Review');
const ChefProfile = require('../models/ChefProfile');
const { auth } = require('../middleware/auth');

// Add Review
router.post('/', auth, async (req, res) => {
    try {
        const { chefId, bookingId, rating, comment } = req.body;
        const review = new Review({
            userId: req.user.id,
            chefId,
            bookingId,
            rating,
            comment
        });
        await review.save();

        // Update Chef average rating
        const reviews = await Review.find({ chefId });
        const avgRating = reviews.reduce((acc, item) => item.rating + acc, 0) / reviews.length;
        
        await ChefProfile.findOneAndUpdate(
            { userId: chefId },
            { rating: avgRating, numReviews: reviews.length }
        );

        res.status(201).json(review);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get Chef Reviews
router.get('/chef/:chefId', async (req, res) => {
    try {
        const reviews = await Review.find({ chefId: req.params.chefId }).populate('userId', 'name profileImage');
        res.json(reviews);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
