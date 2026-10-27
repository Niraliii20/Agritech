import express from 'express';
import mongoose from 'mongoose';
import { User } from '../models/User.js';
import { generateToken } from '../utils/generateToken.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// @desc    Register a new user
// @route   POST /api/auth/register
router.post('/register', async (req, res, next) => {
  try {
    const { fullName, email, mobileNumber, password, state, district, preferredLanguage, role, adminSecret } = req.body;

    const userExists = await User.findOne({ email: email.toLowerCase() });
    if (userExists) {
      return res.status(400).json({ success: false, message: 'An account with this email address already exists' });
    }

    // Role security check: public registration CANNOT create admin unless valid admin secret provided
    let assignedRole = 'farmer';
    if (role === 'admin') {
      if (adminSecret && adminSecret === process.env.ADMIN_CREATION_SECRET) {
        assignedRole = 'admin';
      } else {
        return res.status(403).json({
          success: false,
          message: 'Admin account creation requires administrative authorization credentials.',
        });
      }
    }

    const user = await User.create({
      fullName,
      email: email.toLowerCase(),
      mobileNumber,
      password,
      state,
      district,
      preferredLanguage: preferredLanguage || 'en',
      role: assignedRole,
    });

    const token = generateToken(user._id, user.role);

    res.status(201).json({
      success: true,
      message: 'Account registered successfully',
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        mobileNumber: user.mobileNumber,
        state: user.state,
        district: user.district,
        preferredLanguage: user.preferredLanguage,
        role: user.role,
      },
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide both email and password' });
    }

    const normalizedEmail = (email || '').trim().toLowerCase();

    // ── Instant demo login (NO MongoDB connection required) ──
    if (normalizedEmail === 'farmer@agritech.in' && password === 'Farmer@123') {
      const demoFarmer = {
        id: '65f000000000000000000001',
        _id: '65f000000000000000000001',
        fullName: 'Rajesh Patel',
        email: 'farmer@agritech.in',
        mobileNumber: '+91 98765 43210',
        state: 'Punjab',
        district: 'Ludhiana',
        preferredLanguage: 'en',
        role: 'farmer',
      };
      const token = generateToken(demoFarmer.id, demoFarmer.role);
      return res.json({
        success: true,
        message: 'Logged in successfully (Demo Farmer Mode - No DB Required)',
        token,
        user: demoFarmer,
      });
    }

    if (normalizedEmail === 'admin@agritech.in' && password === 'Admin@123') {
      const demoAdmin = {
        id: '65f000000000000000000002',
        _id: '65f000000000000000000002',
        fullName: 'AgriTech Administrator',
        email: 'admin@agritech.in',
        mobileNumber: '+91 98765 00001',
        state: 'Maharashtra',
        district: 'Pune',
        preferredLanguage: 'en',
        role: 'admin',
      };
      const token = generateToken(demoAdmin.id, demoAdmin.role);
      return res.json({
        success: true,
        message: 'Logged in successfully (Demo Admin Mode - No DB Required)',
        token,
        user: demoAdmin,
      });
    }

    // Guard if database is not connected for regular users
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({
        success: false,
        message: 'Database is connecting to MongoDB. Please use demo credentials or retry in a few seconds.',
      });
    }

    const user = await User.findOne({ email: normalizedEmail }).select('+password');
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const token = generateToken(user._id, user.role);

    res.json({
      success: true,
      message: 'Logged in successfully',
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        mobileNumber: user.mobileNumber,
        state: user.state,
        district: user.district,
        preferredLanguage: user.preferredLanguage,
        role: user.role,
      },
    });
  } catch (error) {
    next(error);
  }
});
        mobileNumber: user.mobileNumber,
        state: user.state,
        district: user.district,
        preferredLanguage: user.preferredLanguage,
        role: user.role,
      },
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Get current user profile
// @route   GET /api/auth/me
router.get('/me', protect, async (req, res) => {
  res.json({
    success: true,
    user: req.user,
  });
});

// @desc    Update user profile
// @route   PUT /api/auth/profile
router.put('/profile', protect, async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const { fullName, mobileNumber, state, district, preferredLanguage } = req.body;
    if (fullName) user.fullName = fullName;
    if (mobileNumber) user.mobileNumber = mobileNumber;
    if (state) user.state = state;
    if (district) user.district = district;
    if (preferredLanguage) user.preferredLanguage = preferredLanguage;

    const updatedUser = await user.save();

    res.json({
      success: true,
      message: 'Profile updated successfully',
      user: {
        id: updatedUser._id,
        fullName: updatedUser.fullName,
        email: updatedUser.email,
        mobileNumber: updatedUser.mobileNumber,
        state: updatedUser.state,
        district: updatedUser.district,
        preferredLanguage: updatedUser.preferredLanguage,
        role: updatedUser.role,
      },
    });
  } catch (error) {
    next(error);
  }
});

export default router;
