const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: String, required: true }, // Format: YYYY-MM-DD for easy querying
  checkInTime: { type: Date },
  checkOutTime: { type: Date },
  status: { 
    type: String, 
    enum: ['present', 'absent', 'late', 'half-day'], 
    default: 'absent' 
  },
  totalHours: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Attendance', attendanceSchema);