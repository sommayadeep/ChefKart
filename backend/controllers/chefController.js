const ChefProfile = require('../models/ChefProfile');
const User = require('../models/User');

const getAllChefs = async (req, res) => {
    try {
        const { cuisine, rating, minPrice, maxPrice, lat, lng } = req.query;
        const query = {};

        if (cuisine) query.cuisines = { $in: [cuisine] };
        if (rating) query.rating = { $gte: Number(rating) };
        if (minPrice || maxPrice) {
            query.pricing = {};
            if (minPrice) query.pricing.$gte = Number(minPrice);
            if (maxPrice) query.pricing.$lte = Number(maxPrice);
        }

        if (lat && lng) {
            try {
                const userLocation = await User.find({
                    'location.type': 'Point',
                    location: {
                        $near: {
                            $geometry: { type: 'Point', coordinates: [Number(lng), Number(lat)] },
                            $maxDistance: 20000
                        }
                    }
                }).select('_id');
                const chefIds = userLocation.map((u) => u._id);
                if (chefIds.length > 0) {
                    query.userId = { $in: chefIds };
                } else {
                    console.log('No chefs found within 20km. Returning all chefs as fallback.');
                }
            } catch (geoErr) {
                console.warn('Geolocation query failed, returning all chefs:', geoErr.message);
            }
        }

        const chefs = await ChefProfile.find(query).populate('userId', 'name email address profileImage location');
        console.log(`Found ${chefs.length} chefs for query:`, JSON.stringify(query));
        return res.json(chefs);
    } catch (err) {
        console.error('CHEF FETCH ERROR:', err);
        return res.status(500).json({ error: err.message });
    }
};

const getChefByUserId = async (req, res) => {
    try {
        const chef = await ChefProfile.findOne({ userId: req.params.id }).populate('userId', 'name email address profileImage');
        if (!chef) return res.status(404).json({ message: 'Chef profile not found' });
        return res.json(chef);
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};

const updateChefProfile = async (req, res) => {
    try {
        console.log('UPDATE REQUEST FOR:', req.params.userId);
        console.log('BODY:', req.body);
        const { pricing, experience, bio, specialties, availability, timeSlots, name, profileImage } = req.body;

        if (name || profileImage) {
            const userUpdate = {};
            if (name) userUpdate.name = name;
            if (profileImage) userUpdate.profileImage = profileImage;
            console.log('UPDATING USER:', userUpdate);
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

        console.log('UPDATE SUCCESSFUL');
        return res.json(chef);
    } catch (err) {
        console.error('Chef Update Error:', err);
        return res.status(500).json({ error: err.message });
    }
};

module.exports = {
    getAllChefs,
    getChefByUserId,
    updateChefProfile
};
