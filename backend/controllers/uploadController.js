const User = require('../models/User');

const uploadProfileImage = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        user.profileImage = req.file.path;
        await user.save();
        return res.json({ url: req.file.path });
    } catch (err) {
        console.error('Image Upload Error:', err);
        return res.status(500).json({ error: err.message || 'Cloudinary Upload Failed' });
    }
};

module.exports = {
    uploadProfileImage
};
