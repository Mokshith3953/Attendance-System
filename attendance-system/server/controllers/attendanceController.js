const Attendance = require('../models/Attendance');

// @desc    Check In (Start Day)
// @route   POST /api/attendance/checkin
// @access  Private (Employee)
const checkIn = async (req, res) => {
  try {
    const userId = req.user.id; // Comes from Auth Middleware
    const today = new Date().toISOString().split('T')[0]; // Format: YYYY-MM-DD

    // 1. Check if already checked in today
    const existingAttendance = await Attendance.findOne({ userId, date: today });
    if (existingAttendance) {
      return res.status(400).json({ message: 'You have already checked in today' });
    }

    // 2. Determine Status (Late Logic)
    // Assumption: Work starts at 9:30 AM. 
    const now = new Date();
    const startHour = 9; 
    const startMinute = 30;
    
    let status = 'present';
    if (now.getHours() > startHour || (now.getHours() === startHour && now.getMinutes() > startMinute)) {
      status = 'late';
    }

    // 3. Create Record
    const newAttendance = new Attendance({
      userId,
      date: today,
      checkInTime: now,
      status: status,
    });

    await newAttendance.save();
    res.status(201).json({ message: 'Checked in successfully', data: newAttendance });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Check Out (End Day)
// @route   POST /api/attendance/checkout
// @access  Private (Employee)
const checkOut = async (req, res) => {
  try {
    const userId = req.user.id;
    const today = new Date().toISOString().split('T')[0];

    // 1. Find today's record
    const attendance = await Attendance.findOne({ userId, date: today });

    if (!attendance) {
      return res.status(400).json({ message: 'You have not checked in today' });
    }

    // 2. Update Check Out Time
    attendance.checkOutTime = new Date();

    // 3. Calculate Total Hours
    // Math: (End Time - Start Time) in milliseconds / 1000 / 60 / 60
    const durationMs = attendance.checkOutTime - attendance.checkInTime;
    const hours = durationMs / (1000 * 60 * 60);
    attendance.totalHours = parseFloat(hours.toFixed(2)); // Round to 2 decimals

    // Optional: Half-day logic (e.g., if < 4 hours)
    if (attendance.totalHours < 4) {
      attendance.status = 'half-day';
    }

    await attendance.save();
    res.status(200).json({ message: 'Checked out successfully', data: attendance });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get Today's Status
// @route   GET /api/attendance/today
const getTodayStatus = async (req, res) => {
  try {
    const userId = req.user.id;
    const today = new Date().toISOString().split('T')[0];

    const attendance = await Attendance.findOne({ userId, date: today });
    
    // Return null if not checked in yet
    res.status(200).json(attendance || null);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = { checkIn, checkOut, getTodayStatus };