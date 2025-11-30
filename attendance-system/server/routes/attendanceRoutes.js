const express = require('express');
const router = express.Router();
const { checkIn, checkOut, getTodayStatus } = require('../controllers/attendanceController');
const { protect } = require('../middleware/authMiddleware');

// Check In Route
router.post('/checkin', protect, checkIn);

// Check Out Route
router.post('/checkout', protect, checkOut);

// Get Today's Status Route
router.get('/today', protect, getTodayStatus);

// VITAL: This line must be here!
module.exports = router;