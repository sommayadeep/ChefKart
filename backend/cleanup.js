const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config({ path: './.env' });

const ChefProfile = require('./models/ChefProfile');
const User = require('./models/User');

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/chefkart')
    .then(async () => {
        console.log('MongoDB Connected');
        // Find fake chefs by email or name
        const fakeUsers = await User.find({
            $or: [
                { email: /mock/i },
                { email: /fake/i },
                { name: 'Chef Priya Sharma' },
                { name: 'Chef Vikram Singh' },
                { email: 'priya@chefkart.com' },
                { email: 'vikram@chefkart.com' }
            ]
        });

        console.log(`Found ${fakeUsers.length} fake users.`);

        for (const user of fakeUsers) {
            await ChefProfile.deleteOne({ userId: user._id });
            await User.deleteOne({ _id: user._id });
            console.log(`Deleted fake user: ${user.name}`);
        }

        console.log('Cleanup complete.');
        process.exit(0);
    })
    .catch(err => {
        console.error(err);
        process.exit(1);
    });
