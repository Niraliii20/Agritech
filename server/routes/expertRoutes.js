import express from 'express';
import { Expert } from '../models/Expert.js';
import { Consultation } from '../models/Consultation.js';
import { Notification } from '../models/Notification.js';
import { protect } from '../middleware/auth.js';
import { requireAdmin } from '../middleware/adminAuth.js';

const router = express.Router();

// @desc    Get all agricultural experts
// @route   GET /api/experts
router.get('/', async (req, res, next) => {
  try {
    const experts = await Expert.find({ isAvailable: true }).sort({ rating: -1 });
    res.json({
      success: true,
      count: experts.length,
      experts,
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Submit consultation request to expert
// @route   POST /api/experts/consult
router.post('/consult', protect, async (req, res, next) => {
  try {
    const { expertId, cropType, farmLocation, question } = req.body;

    const expert = await Expert.findById(expertId);
    if (!expert) {
      return res.status(404).json({ success: false, message: 'Expert not found' });
    }

    const consultation = await Consultation.create({
      farmer: req.user._id,
      expert: expert._id,
      cropType,
      farmLocation: farmLocation || `${req.user.district}, ${req.user.state}`,
      question,
      status: 'Pending',
    });

    await Notification.create({
      user: req.user._id,
      title: 'Consultation Request Submitted',
      message: `Your query regarding "${cropType}" has been forwarded to Dr. ${expert.name}. You will be notified when an advisory reply is posted.`,
      type: 'general',
      severity: 'info',
      link: '/expert-advice',
    });

    res.status(201).json({
      success: true,
      message: 'Consultation request submitted successfully',
      consultation,
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Get farmer's consultations
// @route   GET /api/experts/my-consultations
router.get('/my-consultations', protect, async (req, res, next) => {
  try {
    const consultations = await Consultation.find({ farmer: req.user._id })
      .populate('expert', 'name title specialization qualification avatar')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: consultations.length,
      consultations,
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Admin: Get all consultation requests
// @route   GET /api/experts/admin/all
router.get('/admin/all', protect, requireAdmin, async (req, res, next) => {
  try {
    const consultations = await Consultation.find()
      .populate('farmer', 'fullName email mobileNumber district state')
      .populate('expert', 'name specialization')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: consultations.length,
      consultations,
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Admin / Expert: Reply to consultation
// @route   PUT /api/experts/admin/reply/:id
router.put('/admin/reply/:id', protect, requireAdmin, async (req, res, next) => {
  try {
    const { reply, status = 'Answered' } = req.body;
    const consultation = await Consultation.findById(req.params.id).populate('expert', 'name');
    if (!consultation) {
      return res.status(404).json({ success: false, message: 'Consultation request not found' });
    }

    consultation.expertReply = reply;
    consultation.status = status;
    consultation.repliedAt = new Date();
    await consultation.save();

    await Notification.create({
      user: consultation.farmer,
      title: 'Expert Advisory Reply Received',
      message: `Agricultural advisory reply posted by ${consultation.expert.name} for your query on "${consultation.cropType}".`,
      type: 'general',
      severity: 'info',
      link: '/expert-advice',
    });

    res.json({
      success: true,
      message: 'Advisory response posted successfully',
      consultation,
    });
  } catch (error) {
    next(error);
  }
});

export default router;
