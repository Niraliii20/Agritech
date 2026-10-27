import express from 'express';
import { SoilReport } from '../models/SoilReport.js';
import { analyzeSoilMetrics } from '../services/soilAnalysisService.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// @desc    Perform instant soil health analysis calculation
// @route   POST /api/soil/analyze
router.post('/analyze', async (req, res) => {
  const { ph, nitrogen, phosphorus, potassium, moisture, soilType, targetCrop } = req.body;

  const analysis = analyzeSoilMetrics({
    ph: Number(ph),
    nitrogen: Number(nitrogen),
    phosphorus: Number(phosphorus),
    potassium: Number(potassium),
    moisture: Number(moisture),
    soilType,
    targetCrop,
  });

  res.json({
    success: true,
    data: analysis,
  });
});

// @desc    Save a new soil health report
// @route   POST /api/soil
router.post('/', protect, async (req, res, next) => {
  try {
    const { sampleName, farmId, soilType, targetCrop, ph, nitrogen, phosphorus, potassium, moisture, organicCarbon } = req.body;

    const analysis = analyzeSoilMetrics({
      ph: Number(ph),
      nitrogen: Number(nitrogen),
      phosphorus: Number(phosphorus),
      potassium: Number(potassium),
      moisture: Number(moisture),
      soilType,
      targetCrop,
    });

    const report = await SoilReport.create({
      user: req.user._id,
      farm: farmId || null,
      sampleName: sampleName || `Soil Test - ${new Date().toLocaleDateString('en-IN')}`,
      soilType: soilType || 'Loamy',
      targetCrop,
      ph: Number(ph),
      nitrogen: Number(nitrogen),
      phosphorus: Number(phosphorus),
      potassium: Number(potassium),
      moisture: Number(moisture),
      organicCarbon: organicCarbon ? Number(organicCarbon) : 0.5,
      healthScore: analysis.healthScore,
      status: analysis.status,
      recommendations: analysis.recommendations,
    });

    res.status(201).json({
      success: true,
      message: 'Soil health report saved successfully',
      report,
      analysis,
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Get user's saved soil reports
// @route   GET /api/soil
router.get('/', protect, async (req, res, next) => {
  try {
    const reports = await SoilReport.find({ user: req.user._id })
      .populate('farm', 'farmName district state')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: reports.length,
      reports,
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Get single soil report
// @route   GET /api/soil/:id
router.get('/:id', protect, async (req, res, next) => {
  try {
    const report = await SoilReport.findById(req.params.id).populate('farm', 'farmName district state totalArea');
    if (!report) {
      return res.status(404).json({ success: false, message: 'Soil report not found' });
    }

    if (report.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }

    res.json({
      success: true,
      report,
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Delete soil report
// @route   DELETE /api/soil/:id
router.delete('/:id', protect, async (req, res, next) => {
  try {
    const report = await SoilReport.findById(req.params.id);
    if (!report) {
      return res.status(404).json({ success: false, message: 'Soil report not found' });
    }

    if (report.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }

    await report.deleteOne();

    res.json({
      success: true,
      message: 'Soil report deleted successfully',
    });
  } catch (error) {
    next(error);
  }
});

export default router;
