const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');

// 1. Config & DB Connection
const dbConfig = require('./config/db'); 
dotenv.config();

// Handle DB connection logic
if (typeof dbConfig === 'function') {
    dbConfig();
} else if (typeof dbConfig.connectDB === 'function') {
    dbConfig.connectDB();
} else {
    console.error("CRITICAL ERROR: connectDB is not a function. It is:", dbConfig);
}

const app = express();

// 2. Middleware
app.use(cors());
app.use(express.json()); 

// 3. API Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/attendance', require('./routes/attendanceRoutes'));
app.use('/api/manager', require('./routes/managerRoutes'));

// 4. Root Route (Add this BEFORE app.listen)
app.get('/', (req, res) => {
  res.send('Backend is Running Successfully! 🚀');
});

// 5. Define PORT and Start Server
const PORT = process.env.PORT || 5000; // Defined HERE

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});