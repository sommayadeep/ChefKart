const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const ChefProfile = require('../models/ChefProfile');
const { auth } = require('../middleware/auth');
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Register
router.post('/register', async (req, res) => {
    try {
        const { name, email, password, googleId, role, address, city, state, pincode, lat, lng } = req.body;
        let user = await User.findOne({ email });
        if (user) return res.status(400).json({ message: 'User already exists' });

        user = new User({ 
            name, 
            email, 
            password,
            googleId,
            role, 
            address,
            city,
            state,
            pincode,
            location: {
                type: 'Point',
                coordinates: [lng || 0, lat || 0]
            }
        });
        await user.save();

        if (role === 'chef') {
            const chefProfile = new ChefProfile({ 
                userId: user._id,
                experience: req.body.experience || 0,
                pricing: req.body.pricing || 0
            });
            await chefProfile.save();
        }

        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET || 'secret', { expiresIn: '1d' });
        res.cookie('token', token, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 });
        res.status(201).json({ user: { id: user._id, name, email, role } });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Google Login
router.post('/google', async (req, res) => {
    try {
        const { tokenId, role, lat, lng } = req.body;
        const ticket = await client.verifyIdToken({
            idToken: tokenId,
            audience: process.env.GOOGLE_CLIENT_ID
        });
        const { name, email, sub, picture } = ticket.getPayload();

        let user = await User.findOne({ email });
        if (!user) {
            user = new User({ 
                name, 
                email, 
                googleId: sub, 
                role: role || 'user',
                profileImage: picture,
                location: {
                    type: 'Point',
                    coordinates: [lng || 0, lat || 0]
                }
            });
            await user.save();
            
            if (user.role === 'chef') {
                const chefProfile = new ChefProfile({ 
                    userId: user._id,
                    experience: 0,
                    pricing: 0
                });
                await chefProfile.save();
            }
        }

        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET || 'secret', { expiresIn: '1d' });
        res.cookie('token', token, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 });
        res.json({ user: { id: user._id, name: user.name, email, role: user.role } });
    } catch (err) {
        console.error("GOOGLE LOGIN BACKEND ERROR:", err.message);
        res.status(500).json({ error: err.message });
    }
});
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user || !(await user.comparePassword(password))) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET || 'secret', { expiresIn: '1d' });
        res.cookie('token', token, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 });
        res.json({ user: { id: user._id, name: user.name, email, role: user.role } });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Logout
router.post('/logout', (req, res) => {
    res.clearCookie('token');
    res.json({ message: 'Logged out successfully' });
});

// Get User
router.get('/me', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update User Profile
router.patch('/update', auth, async (req, res) => {
    try {
        const { name, address, city, state, pincode, profileImage } = req.body;
        const user = await User.findByIdAndUpdate(
            req.user.id,
            { name, address, city, state, pincode, profileImage },
            { new: true }
        ).select('-password');
        res.json(user);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
