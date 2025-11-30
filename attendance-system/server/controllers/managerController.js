const User = require("../models/User");
const Attendance = require("../models/Attendance");

// @desc    Get All Employees & Their Attendance
// @route   GET /api/manager/all
const getAllAttendance = async (req, res) => {
  try {
    // Fetch all users with role 'employee' (exclude password)
    const employees = await User.find({ role: "employee" }).select("-password");

    // Fetch today's attendance records
    const today = new Date().toISOString().split("T")[0];
    const attendanceRecords = await Attendance.find({ date: today });

    // Combine data: Attach attendance status to each employee
    const data = employees.map((emp) => {
      const record = attendanceRecords.find(
        (r) => r.userId.toString() === emp._id.toString()
      );
      return {
        _id: emp._id,
        name: emp.name,
        department: emp.department,
        status: record ? record.status : "absent", // Default to absent if no record found
        checkInTime: record ? record.checkInTime : null,
        checkOutTime: record ? record.checkOutTime : null,
      };
    });

    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc    Get 7-Day Attendance Statistics
// @route   GET /api/manager/stats
const getAttendanceStats = async (req, res) => {
  try {
    // 1. Get dates for the last 7 days
    const last7Days = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      last7Days.push(d.toISOString().split("T")[0]); // Format: YYYY-MM-DD
    }

    // 2. Query database for counts
    const stats = await Promise.all(
      last7Days.map(async (date) => {
        const presentCount = await Attendance.countDocuments({
          date,
          status: { $in: ["present", "late", "half-day"] },
        });
        const absentCount = await Attendance.countDocuments({
          date,
          status: "absent",
        });

        // Note: If you want to count "Absent" as "Total Employees - Present",
        // you would fetch total user count instead. For now, this counts explicit records.

        return {
          name: new Date(date).toLocaleDateString("en-US", {
            weekday: "short",
          }), // "Mon", "Tue"
          Present: presentCount,
          Absent: absentCount, // Or calculate (TotalEmployees - Present) if rows don't exist
        };
      })
    );

    res.json(stats);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};
module.exports = { getAllAttendance, getAttendanceStats };
