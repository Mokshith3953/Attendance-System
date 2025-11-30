const express = require('express');
const router = express.Router();
const { getAllAttendance ,getAttendanceStats } = require('../controllers/managerController');
const { protect, admin } = require('../middleware/authMiddleware');

// Protect ensures they are logged in.
// Admin ensures they have role === 'manager'
router.get('/all', protect, admin, getAllAttendance);
router.get('/stats', protect, admin, getAttendanceStats);

module.exports = router;