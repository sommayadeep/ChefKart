const mongoose = require('mongoose');
const User = require('./models/User');
const ChefProfile = require('./models/ChefProfile');
const dotenv = require('dotenv');

dotenv.config();

const chefs = [
    {
        name: 'Chef Rajesh Kumar',
        email: 'rajesh@chef.com',
        password: 'password123',
        role: 'chef',
        address: 'Indiranagar, Bangalore',
        city: 'Bangalore',
        state: 'Karnataka',
        pincode: '560038',
        location: {
            type: 'Point',
            coordinates: [77.6408, 12.9716] // Bangalore [lng, lat]
        },
        profileImage: 'https://images.unsplash.com/photo-1583394293214-28dea15ee548?auto=format&fit=crop&q=80&w=600',
        profile: {
            cuisines: ['South Indian', 'North Indian'],
            experience: 8,
            pricing: 500,
            bio: 'Expert in traditional Indian cuisines with a modern twist. Specializing in healthy home-style meals.',
            specialties: ['Masala Dosa', 'Butter Chicken', 'Weekly Meal Prep'],
            availability: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
            timeSlots: ['Breakfast', 'Lunch', 'Dinner']
        }
    },
    {
        name: 'Chef Maria Gomez',
        email: 'maria@chef.com',
        password: 'password123',
        role: 'chef',
        address: 'Koramangala, Bangalore',
        city: 'Bangalore',
        state: 'Karnataka',
        pincode: '560034',
        location: {
            type: 'Point',
            coordinates: [77.6245, 12.9352] // Bangalore [lng, lat]
        },
        profileImage: 'https://images.unsplash.com/photo-1581299894007-aaa50297cf16?auto=format&fit=crop&q=80&w=600',
        profile: {
            cuisines: ['Italian', 'Continental'],
            experience: 12,
            pricing: 800,
            bio: 'Certified Italian chef with passion for pasta and wood-fired pizzas. I bring the taste of Italy to your kitchen.',
            specialties: ['Handmade Pasta', 'Risotto', 'Tiramisu'],
            availability: ['Mon', 'Wed', 'Fri', 'Sat', 'Sun'],
            timeSlots: ['Lunch', 'Dinner']
        }
    },
    {
        name: 'Chef Arjun Reddy',
        email: 'arjun@chef.com',
        password: 'password123',
        role: 'chef',
        address: 'Banjara Hills, Hyderabad',
        city: 'Hyderabad',
        state: 'Telangana',
        pincode: '500034',
        location: {
            type: 'Point',
            coordinates: [78.4492, 17.4126] // Hyderabad [lng, lat]
        },
        profileImage: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&q=80&w=600',
        profile: {
            cuisines: ['Hyderabadi', 'Mughlai', 'Tandoori'],
            experience: 15,
            pricing: 700,
            bio: 'Born and raised in Hyderabad, I specialize in authentic Hyderabadi Biryani and royal Mughlai dishes passed down through generations.',
            specialties: ['Hyderabadi Biryani', 'Haleem', 'Seekh Kebabs', 'Dum Pukht'],
            availability: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            timeSlots: ['Lunch', 'Dinner']
        }
    },
    {
        name: 'Chef Priya Sharma',
        email: 'priya@chef.com',
        password: 'password123',
        role: 'chef',
        address: 'Vijayawada Central',
        city: 'Vijayawada',
        state: 'Andhra Pradesh',
        pincode: '520001',
        location: {
            type: 'Point',
            coordinates: [80.6480, 16.5062] // Vijayawada [lng, lat]
        },
        profileImage: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&q=80&w=600',
        profile: {
            cuisines: ['Andhra', 'South Indian', 'Keto'],
            experience: 6,
            pricing: 450,
            bio: 'Health-conscious chef specializing in Andhra flavors with a modern, low-carb twist. Perfect for fitness enthusiasts who love spicy food!',
            specialties: ['Andhra Meals', 'Pesarattu', 'Gongura Chicken', 'Keto Meals'],
            availability: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
            timeSlots: ['Breakfast', 'Lunch', 'Dinner']
        }
    },
    {
        name: 'Chef Vikram Singh',
        email: 'vikram@chef.com',
        password: 'password123',
        role: 'chef',
        address: 'MG Road, Vijayawada',
        city: 'Vijayawada',
        state: 'Andhra Pradesh',
        pincode: '520010',
        location: {
            type: 'Point',
            coordinates: [80.6200, 16.5100] // Vijayawada [lng, lat]
        },
        profileImage: 'https://images.unsplash.com/photo-1600565193348-f74bd3c7ccdf?auto=format&fit=crop&q=80&w=600',
        profile: {
            cuisines: ['Chinese', 'Thai', 'Pan-Asian'],
            experience: 10,
            pricing: 600,
            bio: 'Trained in Bangkok and Beijing, I bring authentic Asian street food flavors right to your doorstep.',
            specialties: ['Pad Thai', 'Dim Sum', 'Szechuan Chicken', 'Tom Yum'],
            availability: ['Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            timeSlots: ['Lunch', 'Dinner']
        }
    }
];

const seedDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/chefkart');
        console.log('Connected to DB for seeding');

        // Delete only seeded chef users (by email pattern) and all chef profiles
        const seedEmails = chefs.map(c => c.email);
        await User.deleteMany({ email: { $in: seedEmails } });
        await ChefProfile.deleteMany({});
        console.log('Cleared old seed data and chef profiles');

        // Also fix existing chef users with broken locations using raw updates
        // (bypasses schema validation for legacy data like object-typed address fields)
        const chefUsers = await User.find({ role: 'chef' }).lean();
        for (const u of chefUsers) {
            const fixes = {};
            if (typeof u.location === 'string' || !u.location?.type) {
                fixes.location = { type: 'Point', coordinates: [0, 0] };
            }
            if (typeof u.address === 'object') {
                fixes.address = u.address?.city || u.address?.house || 'Unknown';
            }
            if (Object.keys(fixes).length > 0) {
                await User.updateOne({ _id: u._id }, { $set: fixes });
                console.log(`Fixed legacy data for user: ${u.name}`, Object.keys(fixes));
            }
            // Ensure they have a chef profile
            const existing = await ChefProfile.findOne({ userId: u._id });
            if (!existing) {
                const profile = new ChefProfile({
                    userId: u._id,
                    cuisines: ['Home Style'],
                    experience: 1,
                    pricing: 300,
                    bio: 'Home chef offering fresh, homemade meals.',
                    specialties: ['Home Cooking'],
                    availability: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
                    timeSlots: ['Lunch', 'Dinner']
                });
                await profile.save();
                console.log(`Created chef profile for existing user: ${u.name}`);
            }
        }

        // Seed new chefs
        for (const c of chefs) {
            const user = new User({
                name: c.name,
                email: c.email,
                password: c.password,
                role: c.role,
                address: c.address,
                city: c.city,
                state: c.state,
                pincode: c.pincode,
                location: c.location,
                profileImage: c.profileImage
            });
            await user.save();

            const profile = new ChefProfile({
                userId: user._id,
                ...c.profile
            });
            await profile.save();
            console.log(`Seeded chef: ${c.name}`);
        }

        console.log('\n✅ Seed successful! Created', chefs.length, 'new chefs.');
        process.exit();
    } catch (err) {
        console.error('Seed error:', err);
        process.exit(1);
    }
};

seedDB();
