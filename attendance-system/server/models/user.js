const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // Will be hashed
  role: { type: String, enum: ['employee', 'manager'], default: 'employee' },
  employeeId: { type: String, unique: true, required: true }, // e.g., EMP001
  department: { type: String },
}, { timestamps: true }); // Automatically adds createdAt

module.exports = mongoose.model('User', userSchema);