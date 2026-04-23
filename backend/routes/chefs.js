const express = require('express');
const router = express.Router();
const ChefProfile = require('../models/ChefProfile');
const { auth } = require('../middleware/auth');
const User = require('../models/User');

// Get all chefs with filters
router.get('/', async (req, res) => {
    try {
        const { cuisine, rating, minPrice, maxPrice, lat, lng } = req.query;
        let query = {};
        
        if (cuisine) query.cuisines = { $in: [cuisine] };
        if (rating) query.rating = { $gte: Number(rating) };
        if (minPrice || maxPrice) {
            query.pricing = {};
            if (minPrice) query.pricing.$gte = Number(minPrice);
            if (maxPrice) query.pricing.$lte = Number(maxPrice);
        }

        // Geolocation query - wrapped in try/catch because some legacy users
        // have location stored as a string instead of GeoJSON, which crashes $near
        if (lat && lng) {
            try {
                const userLocation = await User.find({
                    'location.type': 'Point',
                    location: {
                        $near: {
                            $geometry: { type: "Point", coordinates: [Number(lng), Number(lat)] },
                            $maxDistance: 20000 // 20km
                        }
                    }
                }).select('_id');
                const chefIds = userLocation.map(u => u._id);
                if (chefIds.length > 0) {
                    query.userId = { $in: chefIds };
                } else {
                    console.log("No chefs found within 20km. Returning all chefs as fallback.");
                    // Do not set query.userId, allowing it to return all chefs
                }
            } catch (geoErr) {
                console.warn("Geolocation query failed, returning all chefs:", geoErr.message);
                // Fall through without geo filter
            }
        }

        const chefs = await ChefProfile.find(query).populate('userId', 'name email address profileImage location');
        console.log(`Found ${chefs.length} chefs for query:`, JSON.stringify(query));
        res.json(chefs);
    } catch (err) {
        console.error("CHEF FETCH ERROR:", err);
        res.status(500).json({ error: err.message });
    }
});

// Get single chef profile
router.get('/:id', async (req, res) => {
    try {
        const chef = await ChefProfile.findOne({ userId: req.params.id }).populate('userId', 'name email address profileImage');
        if (!chef) return res.status(404).json({ message: 'Chef profile not found' });
        res.json(chef);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update Chef Profile
router.patch('/:userId', auth, async (req, res) => {
    try {
        console.log("UPDATE REQUEST FOR:", req.params.userId);
        console.log("BODY:", req.body);
        const { pricing, experience, bio, specialties, availability, timeSlots, name, profileImage } = req.body;
        
        // Update User info
        if (name || profileImage) {
            const userUpdate = {};
            if (name) userUpdate.name = name;
            if (profileImage) userUpdate.profileImage = profileImage;
            console.log("UPDATING USER:", userUpdate);
            await User.findByIdAndUpdate(req.params.userId, userUpdate);
        }

        const chef = await ChefProfile.findOneAndUpdate(
            { userId: req.params.userId },
            { 
                pricing: Number(pricing) || 0, 
                experience: Number(experience) || 0, 
                bio: bio || '', 
                specialties: Array.isArray(specialties) ? specialties : [], 
                availability: Array.isArray(availability) ? availability : [], 
                timeSlots: Array.isArray(timeSlots) ? timeSlots : [] 
            },
            { new: true, upsert: true, setDefaultsOnInsert: true }
        ).populate('userId', 'name email profileImage address city state pincode');
        
        console.log("UPDATE SUCCESSFUL");
        res.json(chef);
    } catch (err) {
        console.error("Chef Update Error:", err);
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
