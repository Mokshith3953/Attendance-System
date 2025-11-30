const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');

// DEBUGGING: Let's see what we are importing
const dbConfig = require('./config/db'); 
console.log("What is dbConfig?", dbConfig); 

// Load env vars
dotenv.config();

// FIX: If dbConfig is an object like { connectDB: [Function] }, we handle it.
// If it's just the function, we call it directly.
if (typeof dbConfig === 'function') {
    dbConfig();
} else if (typeof dbConfig.connectDB === 'function') {
    dbConfig.connectDB();
} else {
    console.error("CRITICAL ERROR: connectDB is not a function. It is:", dbConfig);
}

const app = express();
// ... (keep the rest of your file the same)

// Middleware
app.use(cors());
app.use(express.json()); // Body parser

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/attendance', require('./routes/attendanceRoutes'));
app.use('/api/manager', require('./routes/managerRoutes'));
// app.use('/api/manager', require('./routes/managerRoutes')); // (We will create this later)

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});