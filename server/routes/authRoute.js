const express = require('express');
const router = express.Router();

const { registerUser, loginUser, getUserProfile, verifyOTP, forgotPassword, resetPassword } = require('../controllers/authController');
const {protect} = require('../middlewares/authMiddleware')

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/verify', verifyOTP);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

router.get('/profile', protect, getUserProfile);

module.exports = router;