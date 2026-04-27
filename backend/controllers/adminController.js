const User = require('../models/User');
const ChefProfile = require('../models/ChefProfile');
const Booking = require('../models/Booking');
const Review = require('../models/Review');

const listUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password').sort({ createdAt: -1 });
        return res.json(users);
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};

const updateUser = async (req, res) => {
    try {
        const { name, email, role, address, city, state, pincode, profileImage } = req.body;
        const update = {
            name,
            email,
            role,
            address,
            city,
            state,
            pincode,
            profileImage
        };

        Object.keys(update).forEach((key) => {
            if (update[key] === undefined) delete update[key];
        });

        const updatedUser = await User.findByIdAndUpdate(req.params.id, update, { new: true }).select('-password');
        if (!updatedUser) return res.status(404).json({ message: 'User not found' });

        if (updatedUser.role === 'chef') {
            await ChefProfile.findOneAndUpdate(
                { userId: updatedUser._id },
                { $setOnInsert: { experience: 0, pricing: 0 } },
                { new: true, upsert: true }
            );
        } else {
            await ChefProfile.findOneAndDelete({ userId: updatedUser._id });
        }

        return res.json(updatedUser);
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};

const deleteUser = async (req, res) => {
    try {
        const userId = req.params.id;
        const deletedUser = await User.findByIdAndDelete(userId).select('-password');
        if (!deletedUser) return res.status(404).json({ message: 'User not found' });

        await ChefProfile.deleteMany({ userId });
        await Booking.deleteMany({ $or: [{ userId }, { chefId: userId }] });
        await Review.deleteMany({ $or: [{ userId }, { chefId: userId }] });

        return res.json({ message: 'User deleted successfully', user: deletedUser });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};

const listChefs = async (req, res) => {
    try {
        const chefs = await ChefProfile.find()
            .populate('userId', 'name email role address city state pincode profileImage createdAt')
            .sort({ _id: -1 });
        return res.json(chefs);
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};

const updateChef = async (req, res) => {
    try {
        const { name, email, address, city, state, pincode, profileImage } = req.body;
        const { cuisines, experience, pricing, availability, bio, specialties, timeSlots, isVerified } = req.body;

        const userUpdate = { name, email, address, city, state, pincode, profileImage, role: 'chef' };
        Object.keys(userUpdate).forEach((key) => {
            if (userUpdate[key] === undefined) delete userUpdate[key];
        });

        const updatedUser = await User.findByIdAndUpdate(req.params.userId, userUpdate, { new: true }).select('-password');
        if (!updatedUser) return res.status(404).json({ message: 'Chef user not found' });

        const chefUpdate = {
            cuisines: Array.isArray(cuisines) ? cuisines : undefined,
            experience: experience !== undefined ? Number(experience) : undefined,
            pricing: pricing !== undefined ? Number(pricing) : undefined,
            availability: Array.isArray(availability) ? availability : undefined,
            bio,
            specialties: Array.isArray(specialties) ? specialties : undefined,
            timeSlots: Array.isArray(timeSlots) ? timeSlots : undefined,
            isVerified
        };
        Object.keys(chefUpdate).forEach((key) => {
            if (chefUpdate[key] === undefined) delete chefUpdate[key];
        });

        const chefProfile = await ChefProfile.findOneAndUpdate(
            { userId: req.params.userId },
            chefUpdate,
            { new: true, upsert: true, setDefaultsOnInsert: true }
        ).populate('userId', 'name email role address city state pincode profileImage createdAt');

        return res.json(chefProfile);
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};

const deleteChef = async (req, res) => {
    try {
        const userId = req.params.userId;

        const deletedUser = await User.findOneAndDelete({ _id: userId, role: 'chef' }).select('-password');
        if (!deletedUser) return res.status(404).json({ message: 'Chef user not found' });

        await ChefProfile.deleteMany({ userId });
        await Booking.deleteMany({ $or: [{ userId }, { chefId: userId }] });
        await Review.deleteMany({ $or: [{ userId }, { chefId: userId }] });

        return res.json({ message: 'Chef deleted successfully', user: deletedUser });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};

module.exports = {
    listUsers,
    updateUser,
    deleteUser,
    listChefs,
    updateChef,
    deleteChef
};
