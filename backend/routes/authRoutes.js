import express from 'express';
import jwt from 'jsonwebtoken';
import Admin from '../models/Admin.js';
import { protect, isSuperAdmin } from '../middleware/auth.js';

const router = express.Router();

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'fallback_secret', {
    expiresIn: '30d',
  });
};

// @desc    Auth admin & get token
// @route   POST /api/auth/login
// @access  Public
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const admin = await Admin.findOne({ username });

    if (admin && (await admin.comparePassword(password))) {
      res.json({
        _id: admin._id,
        username: admin.username,
        role: admin.role,
        mustChangePassword: admin.mustChangePassword,
        token: generateToken(admin._id),
      });
    } else {
      res.status(401).json({ message: 'Invalid username or password' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Update admin password
// @route   POST /api/auth/update-password
// @access  Private
router.post('/update-password', protect, async (req, res) => {
  const { newPassword } = req.body;

  try {
    const admin = await Admin.findById(req.user._id);

    if (admin) {
      admin.password = newPassword;
      admin.mustChangePassword = false;
      await admin.save();
      res.json({ message: 'Password updated successfully' });
    } else {
      res.status(404).json({ message: 'Admin not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Register a new admin
// @route   POST /api/auth/register-admin
// @access  Private/SuperAdmin
router.post('/register-admin', protect, isSuperAdmin, async (req, res) => {
  const { username, password, role } = req.body;

  try {
    const adminExists = await Admin.findOne({ username });

    if (adminExists) {
      return res.status(400).json({ message: 'Admin already exists' });
    }

    const admin = await Admin.create({
      username,
      password,
      role: role || 'admin',
    });

    if (admin) {
      res.status(201).json({
        _id: admin._id,
        username: admin.username,
        role: admin.role,
      });
    } else {
      res.status(400).json({ message: 'Invalid admin data' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Get all admins
// @route   GET /api/auth/admins
// @access  Private/SuperAdmin
router.get('/admins', protect, isSuperAdmin, async (req, res) => {
  try {
    const admins = await Admin.find({}).select('-password');
    res.json(admins);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
