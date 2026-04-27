const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const {
    register,
    googleLogin,
    login,
    logout,
    getMe,
    updateProfile
} = require('../controllers/authController');

// Register
router.post('/register', register);

// Google Login
router.post('/google', googleLogin);
router.post('/login', login);

// Logout
router.post('/logout', logout);

// Get User
router.get('/me', auth, getMe);

// Update User Profile
router.patch('/update', auth, updateProfile);

module.exports = router;
