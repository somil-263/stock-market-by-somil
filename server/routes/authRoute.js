const express = require('express');
const router = express.Router();

const { registerUser, loginUser, getUserProfile, verifyOTP } = require('../controllers/authController');
const {protect} = require('../middlewares/authMiddleware')

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/verify', verifyOTP);

router.get('/profile', protect, getUserProfile);

module.exports = router;