import express from 'express';
import { Crop } from '../models/Crop.js';
import { Farm } from '../models/Farm.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Growth percentage mapping by stage
const STAGE_PROGRESS_MAP = {
  'Land Preparation': 10,
  'Sowing': 20,
  'Germination': 35,
  'Vegetative Growth': 55,
  'Flowering': 75,
  'Fruiting': 90,
  'Harvesting': 100,
  'Completed': 100,
};

// @desc    Get crops (filtered by farm if provided)
// @route   GET /api/crops
router.get('/', protect, async (req, res, next) => {
  try {
    const query = { farmer: req.user._id };
    if (req.query.farmId) {
      query.farm = req.query.farmId;
    }
    if (req.query.status) {
      query.status = req.query.status;
    }

    const crops = await Crop.find(query).populate('farm', 'farmName district state totalArea').sort({ createdAt: -1 });

    res.json({
      success: true,
      count: crops.length,
      crops,
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Create new crop record
// @route   POST /api/crops
router.post('/', protect, async (req, res, next) => {
  try {
    const {
      farmId,
      cropName,
      variety,
      category,
      sowingDate,
      expectedHarvestDate,
      fieldArea,
      areaUnit,
      growthStage,
      healthStatus,
      image,
    } = req.body;

    // Verify farm ownership
    const farm = await Farm.findById(farmId);
    if (!farm) {
      return res.status(404).json({ success: false, message: 'Associated farm not found' });
    }
    if (farm.owner.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Unauthorized: Farm does not belong to user' });
    }

    const stage = growthStage || 'Sowing';
    const growthPercentage = STAGE_PROGRESS_MAP[stage] || 20;

    const crop = await Crop.create({
      farm: farm._id,
      farmer: req.user._id,
      cropName,
      variety: variety || 'Standard Local',
      category: category || 'Cereal',
      sowingDate,
      expectedHarvestDate,
      fieldArea: fieldArea || farm.totalArea,
      areaUnit: areaUnit || farm.areaUnit,
      growthStage: stage,
      growthPercentage,
      healthStatus: healthStatus || 'Good',
      image: image || '',
    });

    res.status(201).json({
      success: true,
      message: 'Crop record created successfully',
      crop,
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Get single crop details
// @route   GET /api/crops/:id
router.get('/:id', protect, async (req, res, next) => {
  try {
    const crop = await Crop.findById(req.params.id)
      .populate('farm', 'farmName totalArea areaUnit state district soilType irrigationMethod')
      .populate('farmer', 'fullName email mobileNumber');

    if (!crop) {
      return res.status(404).json({ success: false, message: 'Crop not found' });
    }

    if (crop.farmer._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to view this crop record' });
    }

    res.json({
      success: true,
      crop,
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Update crop details / growth stage
// @route   PUT /api/crops/:id
router.put('/:id', protect, async (req, res, next) => {
  try {
    let crop = await Crop.findById(req.params.id);
    if (!crop) {
      return res.status(404).json({ success: false, message: 'Crop not found' });
    }

    if (crop.farmer.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to modify this crop record' });
    }

    const updatable = [
      'cropName',
      'variety',
      'category',
      'sowingDate',
      'expectedHarvestDate',
      'actualHarvestDate',
      'fieldArea',
      'areaUnit',
      'growthStage',
      'growthPercentage',
      'healthStatus',
      'status',
      'image',
    ];

    updatable.forEach(f => {
      if (req.body[f] !== undefined) crop[f] = req.body[f];
    });

    if (req.body.growthStage && !req.body.growthPercentage) {
      crop.growthPercentage = STAGE_PROGRESS_MAP[req.body.growthStage] || crop.growthPercentage;
    }

    const updatedCrop = await crop.save();

    res.json({
      success: true,
      message: 'Crop record updated successfully',
      crop: updatedCrop,
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Add irrigation, fertilizer, or observation log to crop
// @route   POST /api/crops/:id/activity
router.post('/:id/activity', protect, async (req, res, next) => {
  try {
    const crop = await Crop.findById(req.params.id);
    if (!crop) {
      return res.status(404).json({ success: false, message: 'Crop not found' });
    }

    if (crop.farmer.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }

    const { type, name, amount, quantity, note, stage, date } = req.body;
    const logDate = date || new Date();

    if (type === 'irrigation') {
      crop.irrigationLogs.push({ date: logDate, amount: amount || 'Scheduled irrigation', notes: note || '' });
    } else if (type === 'fertilizer') {
      crop.fertilizerLogs.push({ date: logDate, name: name || 'NPK Fertilizer', quantity: quantity || 'Standard dose', notes: note || '' });
    } else if (type === 'observation') {
      crop.observations.push({ date: logDate, note: note || 'General observation recorded', stage: stage || crop.growthStage });
    }

    await crop.save();

    res.json({
      success: true,
      message: 'Farming activity logged successfully',
      crop,
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Delete crop record
// @route   DELETE /api/crops/:id
router.delete('/:id', protect, async (req, res, next) => {
  try {
    const crop = await Crop.findById(req.params.id);
    if (!crop) {
      return res.status(404).json({ success: false, message: 'Crop not found' });
    }

    if (crop.farmer.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }

    await crop.deleteOne();

    res.json({
      success: true,
      message: 'Crop record deleted successfully',
    });
  } catch (error) {
    next(error);
  }
});

export default router;
