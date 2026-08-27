import express from 'express';
import jwt from 'jsonwebtoken';
import Admin from '../models/Admin.js';
import { protect, isSuperAdmin, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'fallback_secret', {
    expiresIn: '30d',
  });
};

// @desc    Guest login & get token
// @route   POST /api/auth/guest
// @access  Public
router.post('/guest', async (req, res) => {
  try {
    const token = jwt.sign(
      { id: 'guest', role: 'guest' },
      process.env.JWT_SECRET || 'fallback_secret',
      { expiresIn: '30d' }
    );

    res.json({
      _id: 'guest',
      username: 'Guest User',
      role: 'guest',
      mustChangePassword: false,
      token,
    });
  } catch (error) {
    console.error('Guest login error:', error);
    res.status(500).json({ message: 'Server error during guest login' });
  }
});

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
// @access  Private (SuperAdmin only)
router.post('/update-password', protect, isSuperAdmin, async (req, res) => {
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
// @access  Private (Admin / SuperAdmin)
router.post('/register-admin', protect, requireAdmin, async (req, res) => {
  const { username, password, role } = req.body;

  try {
    if (req.user.role === 'admin' && role === 'superadmin') {
      return res.status(403).json({ message: 'Standard Admins are not permitted to create Super Admin accounts.' });
    }

    const assignedRole = req.user.role === 'superadmin' ? (role || 'admin') : 'admin';

    const adminExists = await Admin.findOne({ username });

    if (adminExists) {
      return res.status(400).json({ message: 'Admin with this username already exists' });
    }

    const admin = await Admin.create({
      username,
      password,
      role: assignedRole,
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
    res.status(500).json({ message: 'Server error registering admin' });
  }
});

// @desc    Get all admins
// @route   GET /api/auth/admins
// @access  Private (Admin / SuperAdmin)
router.get('/admins', protect, requireAdmin, async (req, res) => {
  try {
    const admins = await Admin.find({}).select('-password');
    res.json(admins);
  } catch (error) {
    res.status(500).json({ message: 'Server error retrieving admins' });
  }
});

export default router;
