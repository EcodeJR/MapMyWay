// backend/index.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const authHandler = require('./routes/auth.routes');
const locationHandler = require('./routes/location.routes');
const uploadHandler = require('./routes/upload.routes'); // Add this line

const app = express();

// Connect to MongoDB
connectDB();

// Middlewares
app.use(express.json());
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? true  // Same origin in production
    : ['https://map-my-way.vercel.app', 'http://localhost:5173'], // Dev origins
  credentials: true
};

app.use(cors(corsOptions));
app.use('/uploads', express.static('uploads'));

// Mount routes
app.use('/api/auth', authHandler);
app.use('/api/locations', locationHandler);
app.use('/api/uploads', uploadHandler); // Add this line

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err);
  
  if (err.name === 'MulterError') {
    return res.status(400).json({ message: `Upload error: ${err.message}` });
  }
  
  res.status(500).json({ message: err.message || 'Server error' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));//'0.0.0.0',