const express = require('express');
const router = express.Router();
const { auth, authorize } = require('../middleware/auth');
const {
    listUsers,
    updateUser,
    deleteUser,
    listChefs,
    updateChef,
    deleteChef
} = require('../controllers/adminController');

router.use(auth, authorize('admin'));

router.get('/users', listUsers);
router.patch('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);

router.get('/chefs', listChefs);
router.patch('/chefs/:userId', updateChef);
router.delete('/chefs/:userId', deleteChef);

module.exports = router;
