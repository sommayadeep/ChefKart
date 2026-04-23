const express = require('express');
const router = express.Router();
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const { auth } = require('../middleware/auth');
const User = require('../models/User');

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'chefkart_profiles',
        allowed_formats: ['jpg', 'png', 'jpeg'],
    },
});

const upload = multer({ storage: storage });

router.post('/image', auth, upload.single('image'), async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        user.profileImage = req.file.path;
        await user.save();
        res.json({ url: req.file.path });
    } catch (err) {
        console.error("Image Upload Error:", err);
        res.status(500).json({ error: err.message || "Cloudinary Upload Failed" });
    }
});

module.exports = router;
