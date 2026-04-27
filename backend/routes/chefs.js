const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const {
    getAllChefs,
    getChefByUserId,
    updateChefProfile
} = require('../controllers/chefController');

// Get all chefs with filters
router.get('/', getAllChefs);

// Get single chef profile
router.get('/:id', getChefByUserId);

// Update Chef Profile
router.patch('/:userId', auth, updateChefProfile);

module.exports = router;
