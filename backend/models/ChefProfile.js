const mongoose = require('mongoose');

const ChefProfileSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    cuisines: [{ type: String }],
    experience: { type: Number, required: true }, // in years
    pricing: { type: Number, required: true }, // per session/day
    availability: { type: [String], default: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'] },
    rating: { type: Number, default: 0 },
    numReviews: { type: Number, default: 0 },
    bio: { type: String },
    specialties: [{ type: String }],
    timeSlots: { type: [String], default: ['Breakfast (8:00 AM - 10:00 AM)', 'Lunch (12:00 PM - 2:00 PM)', 'Dinner (7:00 PM - 9:00 PM)'] },
    isVerified: { type: Boolean, default: false }
});

module.exports = mongoose.model('ChefProfile', ChefProfileSchema);
