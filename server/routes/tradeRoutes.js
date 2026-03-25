const express = require('express');
const router = express.Router();

const { buyStock, getPortfolio } = require('../controllers/tradeController');
const { protect } = require('../middlewares/authMiddleware');

router.post('/buy', protect, buyStock);
router.get('/portfolio', protect, getPortfolio);

module.exports = router;