const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const { addReview, getChefReviews } = require('../controllers/reviewController');

// Add Review
router.post('/', auth, addReview);

// Get Chef Reviews
router.get('/chef/:chefId', getChefReviews);

module.exports = router;
