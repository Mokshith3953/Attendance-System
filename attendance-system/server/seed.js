const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Attendance = require('./models/Attendance');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const seedData = async () => {
  try {
    // 1. Clear existing data
    await User.deleteMany({});
    await Attendance.deleteMany({});
    console.log('Existing data cleared.');

    // 2. Create Manager
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('password123', salt);
    
    await User.create({
      name: 'Manager User',
      email: 'manager@company.com',
      password: hashedPassword,
      role: 'manager',
      employeeId: 'MGR001',
      department: 'Management'
    });

    // 3. Create Employees
    const departments = ['IT', 'HR', 'Sales', 'Marketing'];
    const employees = [];
    
    for (let i = 1; i <= 5; i++) {
      const emp = await User.create({
        name: `Employee ${i}`,
        email: `employee${i}@company.com`,
        password: hashedPassword,
        role: 'employee',
        employeeId: `EMP00${i}`,
        department: departments[Math.floor(Math.random() * departments.length)]
      });
      employees.push(emp);
    }
    console.log('Users created.');

    // 4. Create Attendance for last 7 days
    const attendanceRecords = [];
    const today = new Date();

    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];

      // Mark attendance for each employee
      for (const emp of employees) {
        // Randomly decide if present (80% chance)
        if (Math.random() > 0.2) {
          attendanceRecords.push({
            userId: emp._id,
            date: dateStr,
            checkInTime: new Date(date.setHours(9, 0, 0)),
            checkOutTime: new Date(date.setHours(17, 0, 0)),
            status: Math.random() > 0.1 ? 'present' : 'late', // 10% chance of being late
            totalHours: 8
          });
        } else {
            // If absent, we simply don't create a record (or create an 'absent' one depending on your logic)
            // For this logic, we'll explicitly create 'absent' for the dashboard stats to count them easily
             attendanceRecords.push({
                userId: emp._id,
                date: dateStr,
                status: 'absent'
              });
        }
      }
    }

    await Attendance.insertMany(attendanceRecords);
    console.log('Attendance history created.');

    process.exit();
  } catch (error) {
    console.error('Error with seed script:', error);
    process.exit(1);
  }
};

seedData();