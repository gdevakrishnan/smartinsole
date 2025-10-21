// app.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const patientRoutes = require('./routers/patientRouter');

dotenv.config(); // Load environment variables from .env

const app = express();

// Middleware
app.use(express.json());

// ✅ Enable CORS for all origins, methods, and headers
app.use(cors()); // This allows everything

mongoose.connect(process.env.MONGO_URI)
.then(() => console.log('✅ MongoDB connected'))
.catch(err => console.error('❌ MongoDB connection error:', err));

// Use patient routes
app.use('/api/patients', patientRoutes);

// Default route
app.get('/', (req, res) => {
  res.send('API is running...');
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
