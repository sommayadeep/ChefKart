const Review = require('../models/Review');
const ChefProfile = require('../models/ChefProfile');

const addReview = async (req, res) => {
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

        const reviews = await Review.find({ chefId });
        const avgRating = reviews.reduce((acc, item) => item.rating + acc, 0) / reviews.length;

        await ChefProfile.findOneAndUpdate(
            { userId: chefId },
            { rating: avgRating, numReviews: reviews.length }
        );

        return res.status(201).json(review);
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};

const getChefReviews = async (req, res) => {
    try {
        const reviews = await Review.find({ chefId: req.params.chefId }).populate('userId', 'name profileImage');
        return res.json(reviews);
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};

module.exports = {
    addReview,
    getChefReviews
};
