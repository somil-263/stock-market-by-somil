const express = require('express');
const router = express.Router();

const { buyStock, getPortfolio, sellStock, getPassbook } = require('../controllers/tradeController');
const { protect } = require('../middlewares/authMiddleware');

router.post('/buy', protect, buyStock);
router.post('/sell', protect, sellStock);

router.get('/portfolio', protect, getPortfolio);
router.get('/passbook', protect, getPassbook);

module.exports = router;