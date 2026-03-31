import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';

import studentRoutes from './routes/studentRoutes.js';
import authRoutes from './routes/authRoutes.js';
import Admin from './models/Admin.js';
import startDailyCron from './jobs/cron.js';

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/students', studentRoutes);
app.use('/api/auth', authRoutes);

// Database Connection
mongoose.connect(process.env.MONGO_URI)
.then(async () => {
  console.log('Connected to MongoDB');
  // Seed initial super admin if none exist
  const adminCount = await Admin.countDocuments();
  if (adminCount === 0) {
    const superAdmin = await Admin.create({
      username: 'superadmin',
      password: 'password123',
      role: 'superadmin',
    });
    console.log('Seed: Initial Super Admin created (superadmin/password123)');
  }
  
  // Start the daily cron job after successful DB connection
  startDailyCron();
  
  // Start Express server
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
})
.catch(err => {
  console.error('MongoDB connection error:', err.message);
  process.exit(1);
});

export default app; // Export for testing purposes
