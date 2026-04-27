const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const User = require('../models/User');
const ChefProfile = require('../models/ChefProfile');

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const SYSTEM_ADMIN_EMAIL = 'sommayadeepsaha@gmail.com';

const cookieOptions = {
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000,
    sameSite: 'none',
    secure: true
};

const signToken = (user) => jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET || 'secret',
    { expiresIn: '1d' }
);

const normalizeEmail = (email) => (email || '').trim().toLowerCase();

const enforceSystemAdmin = async (user) => {
    if (!user) return user;

    const isSystemAdminEmail = normalizeEmail(user.email) === normalizeEmail(SYSTEM_ADMIN_EMAIL);
    if (!isSystemAdminEmail) return user;

    if (user.role !== 'admin') {
        // Use updateOne to avoid full-document validation failures on legacy records.
        await User.updateOne({ _id: user._id }, { $set: { role: 'admin' } });
        user.role = 'admin';
    }

    // Ensure the system admin is not treated as chef in listings.
    await ChefProfile.deleteMany({ userId: user._id });
    return user;
};

const register = async (req, res) => {
    try {
        const { name, email, password, googleId, role, address, city, state, pincode, lat, lng } = req.body;
        const normalizedEmail = normalizeEmail(email);
        const normalizedGoogleId = typeof googleId === 'string' ? googleId.trim() : '';

        if (!normalizedEmail) {
            return res.status(400).json({ message: 'Email is required' });
        }

        let user = await User.findOne({ email: normalizedEmail });
        if (user) return res.status(400).json({ message: 'User already exists' });

        user = new User({
            name,
            email: normalizedEmail,
            password,
            googleId: normalizedGoogleId || undefined,
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

        const token = signToken(user);
        res.cookie('token', token, cookieOptions);
        return res.status(201).json({ user: { id: user._id, name, email: normalizedEmail, role } });
    } catch (err) {
        if (err?.code === 11000) {
            return res.status(400).json({ message: 'User already exists' });
        }
        if (err?.name === 'ValidationError') {
            const firstError = Object.values(err.errors || {})[0]?.message;
            return res.status(400).json({ message: firstError || 'Invalid registration details' });
        }
        return res.status(500).json({ message: 'Registration failed', error: err.message });
    }
};

const googleLogin = async (req, res) => {
    try {
        const { tokenId, role, lat, lng } = req.body;
        if (!tokenId) {
            return res.status(400).json({ message: 'Google token is required' });
        }

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

        user = await enforceSystemAdmin(user);
        const token = signToken(user);
        res.cookie('token', token, cookieOptions);
        return res.json({ user: { id: user._id, name: user.name, email, role: user.role } });
    } catch (err) {
        console.error('GOOGLE LOGIN BACKEND ERROR:', err.message);
        return res.status(401).json({ message: 'Google verification failed', error: err.message });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const normalizedEmail = normalizeEmail(email);
        let user = await User.findOne({ email: normalizedEmail });
        if (!user || !(await user.comparePassword(password))) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        user = await enforceSystemAdmin(user);

        const token = signToken(user);
        res.cookie('token', token, cookieOptions);
        return res.json({ user: { id: user._id, name: user.name, email, role: user.role } });
    } catch (err) {
        console.error('LOGIN ERROR:', err.message);
        return res.status(500).json({ error: err.message });
    }
};

const logout = (req, res) => {
    res.clearCookie('token', {
        httpOnly: true,
        sameSite: 'none',
        secure: true
    });
    return res.json({ message: 'Logged out successfully' });
};

const getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        return res.json(user);
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};

const updateProfile = async (req, res) => {
    try {
        const { name, address, city, state, pincode, profileImage } = req.body;
        const user = await User.findByIdAndUpdate(
            req.user.id,
            { name, address, city, state, pincode, profileImage },
            { new: true }
        ).select('-password');
        return res.json(user);
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};

module.exports = {
    register,
    googleLogin,
    login,
    logout,
    getMe,
    updateProfile
};
