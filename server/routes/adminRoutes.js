import express from 'express';
import { User } from '../models/User.js';
import { Farm } from '../models/Farm.js';
import { Crop } from '../models/Crop.js';
import { Product } from '../models/Product.js';
import { Order } from '../models/Order.js';
import { Consultation } from '../models/Consultation.js';
import { CommunityPost } from '../models/CommunityPost.js';
import { SoilReport } from '../models/SoilReport.js';
import { PestReport } from '../models/PestReport.js';
import { protect } from '../middleware/auth.js';
import { requireAdmin } from '../middleware/adminAuth.js';

const router = express.Router();

// All admin routes require protect + requireAdmin
router.use(protect, requireAdmin);

// @desc    Get aggregate platform statistics for admin dashboard
// @route   GET /api/admin/stats
router.get('/stats', async (req, res, next) => {
  try {
    const [
      totalFarmers,
      totalFarms,
      totalCrops,
      totalProducts,
      totalOrders,
      totalConsultations,
      pendingConsultations,
      totalPosts,
      totalSoilReports,
      totalPestReports,
    ] = await Promise.all([
      User.countDocuments({ role: 'farmer' }),
      Farm.countDocuments(),
      Crop.countDocuments({ status: 'Active' }),
      Product.countDocuments(),
      Order.countDocuments(),
      Consultation.countDocuments(),
      Consultation.countDocuments({ status: 'Pending' }),
      CommunityPost.countDocuments(),
      SoilReport.countDocuments(),
      PestReport.countDocuments(),
    ]);

    const recentOrders = await Order.find()
      .populate('user', 'fullName email district state')
      .sort({ createdAt: -1 })
      .limit(5);

    const recentUsers = await User.find({ role: 'farmer' })
      .select('fullName email mobileNumber state district createdAt')
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({
      success: true,
      metrics: {
        totalFarmers,
        totalFarms,
        totalCrops,
        totalProducts,
        totalOrders,
        totalConsultations,
        pendingConsultations,
        totalPosts,
        totalSoilReports,
        totalPestReports,
      },
      recentOrders,
      recentUsers,
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Get users list with role filtering
// @route   GET /api/admin/users
router.get('/users', async (req, res, next) => {
  try {
    const { role, search } = req.query;
    const query = {};
    if (role) query.role = role;
    if (search) {
      query.$or = [
        { fullName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { district: { $regex: search, $options: 'i' } },
      ];
    }

    const users = await User.find(query).select('-password').sort({ createdAt: -1 });

    res.json({
      success: true,
      count: users.length,
      users,
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Update user role (Farmer <-> Admin)
// @route   PUT /api/admin/users/:id/role
router.put('/users/:id/role', async (req, res, next) => {
  try {
    const { role } = req.body;
    if (!['farmer', 'admin'].includes(role)) {
      return res.status(400).json({ success: false, message: 'Invalid role specified' });
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    user.role = role;
    await user.save();

    res.json({
      success: true,
      message: `User role updated to ${role}`,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Delete user account
// @route   DELETE /api/admin/users/:id
router.delete('/users/:id', async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Prevent deleting self
    if (user._id.toString() === req.user._id.toString()) {
      return res.status(400).json({ success: false, message: 'Cannot delete your own administrator account' });
    }

    // Clean up user resources
    await Farm.deleteMany({ owner: user._id });
    await Crop.deleteMany({ farmer: user._id });
    await SoilReport.deleteMany({ user: user._id });
    await PestReport.deleteMany({ user: user._id });
    await user.deleteOne();

    res.json({
      success: true,
      message: 'User account and associated records deleted successfully',
    });
  } catch (error) {
    next(error);
  }
});

export default router;
