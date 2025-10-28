const express = require('express');
const connectDB = require('./db');
const dotenv = require('dotenv');
const moodRoutes = require('./routes/mood');

dotenv.config();

const app = express();
app.use(express.json()); // Parse JSON body

connectDB(); // Connect to DB

// Middleware untuk API Key auth sederhana
app.use((req, res, next) => {
  const apiKey = req.headers['x-api-key'];
  if (apiKey !== process.env.API_KEY) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  next();
});

// Routes
app.use('/mood', moodRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));