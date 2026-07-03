const express = require('express');
const { getDashboardStats, getRevenueChart } = require('../controllers/adminController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect, adminOnly);

router.get('/dashboard-stats', getDashboardStats);
router.get('/revenue-chart', getRevenueChart);

module.exports = router;
