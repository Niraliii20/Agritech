import express from 'express';
import { PestReport } from '../models/PestReport.js';
import { analyzePestSymptoms } from '../services/advisoryService.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// @desc    Instant preliminary diagnosis for crop symptoms
// @route   POST /api/pest/diagnose
router.post('/diagnose', (req, res) => {
  const { cropName, symptoms, observedPest } = req.body;
  const advisory = analyzePestSymptoms(cropName, symptoms, observedPest);

  res.json({
    success: true,
    data: advisory,
  });
});

// @desc    Log a pest/disease observation report
// @route   POST /api/pest
router.post('/', protect, async (req, res, next) => {
  try {
    const { cropId, cropName, pestOrDiseaseName, symptoms, severity, observationDate, imageUrl, treatment } = req.body;

    const advisory = analyzePestSymptoms(cropName, symptoms, pestOrDiseaseName);

    const report = await PestReport.create({
      user: req.user._id,
      crop: cropId || null,
      cropName,
      pestOrDiseaseName,
      symptoms,
      severity: severity || advisory.severity || 'Medium',
      observationDate: observationDate || new Date(),
      possibleCauses: advisory.possibleCauses,
      preventionGuidance: advisory.preventionGuidance,
      treatmentHistory: treatment ? [{ treatment, dateApplied: new Date(), notes: 'Initial treatment' }] : [],
      imageUrl: imageUrl || '',
      isPreliminaryDiagnosis: true,
    });

    res.status(201).json({
      success: true,
      message: 'Pest observation recorded successfully',
      report,
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Get current user's pest reports
// @route   GET /api/pest
router.get('/', protect, async (req, res, next) => {
  try {
    const reports = await PestReport.find({ user: req.user._id })
      .populate('crop', 'cropName variety')
      .sort({ observationDate: -1 });

    res.json({
      success: true,
      count: reports.length,
      reports,
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Get regional active alerts (public or farmer dashboard)
// @route   GET /api/pest/recent
router.get('/recent', async (req, res, next) => {
  try {
    const alerts = await PestReport.find({ status: 'Active' })
      .populate('user', 'state district')
      .sort({ createdAt: -1 })
      .limit(10);

    res.json({
      success: true,
      alerts,
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Add treatment history to pest report
// @route   PUT /api/pest/:id/treatment
router.put('/:id/treatment', protect, async (req, res, next) => {
  try {
    const report = await PestReport.findById(req.params.id);
    if (!report) {
      return res.status(404).json({ success: false, message: 'Report not found' });
    }

    if (report.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }

    const { treatment, notes, status } = req.body;
    report.treatmentHistory.push({
      treatment,
      dateApplied: new Date(),
      notes,
    });

    if (status) report.status = status;

    await report.save();

    res.json({
      success: true,
      message: 'Treatment logged successfully',
      report,
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Delete pest report
// @route   DELETE /api/pest/:id
router.delete('/:id', protect, async (req, res, next) => {
  try {
    const report = await PestReport.findById(req.params.id);
    if (!report) {
      return res.status(404).json({ success: false, message: 'Report not found' });
    }

    if (report.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }

    await report.deleteOne();

    res.json({
      success: true,
      message: 'Report deleted',
    });
  } catch (error) {
    next(error);
  }
});

export default router;
