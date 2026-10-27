import express from 'express';
import { Farm } from '../models/Farm.js';
import { Crop } from '../models/Crop.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// @desc    Get all farms for the logged-in farmer
// @route   GET /api/farms
router.get('/', protect, async (req, res, next) => {
  try {
    const query = req.user.role === 'admin' && req.query.all === 'true' ? {} : { owner: req.user._id };
    const farms = await Farm.find(query).sort({ createdAt: -1 });

    // Include associated crops count
    const farmIds = farms.map(f => f._id);
    const crops = await Crop.find({ farm: { $in: farmIds } }).select('farm cropName growthStage status');

    const farmsWithCrops = farms.map(farm => {
      const associatedCrops = crops.filter(c => c.farm.toString() === farm._id.toString());
      return {
        ...farm.toObject(),
        cropsCount: associatedCrops.length,
        crops: associatedCrops,
      };
    });

    res.json({
      success: true,
      count: farmsWithCrops.length,
      farms: farmsWithCrops,
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Create a new farm
// @route   POST /api/farms
router.post('/', protect, async (req, res, next) => {
  try {
    const { farmName, totalArea, areaUnit, state, district, villageOrLocation, soilType, irrigationMethod, waterSource, notes } = req.body;

    const farm = await Farm.create({
      owner: req.user._id,
      farmName,
      totalArea,
      areaUnit: areaUnit || 'Acres',
      state: state || req.user.state,
      district: district || req.user.district,
      villageOrLocation,
      soilType,
      irrigationMethod,
      waterSource,
      notes,
    });

    res.status(201).json({
      success: true,
      message: 'Farm created successfully',
      farm,
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Get farm details with crops and activities
// @route   GET /api/farms/:id
router.get('/:id', protect, async (req, res, next) => {
  try {
    const farm = await Farm.findById(req.params.id).populate('owner', 'fullName email mobileNumber state district');
    if (!farm) {
      return res.status(404).json({ success: false, message: 'Farm not found' });
    }

    // Access check: owner or admin
    if (farm.owner._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to access this farm profile' });
    }

    const crops = await Crop.find({ farm: farm._id }).sort({ createdAt: -1 });

    res.json({
      success: true,
      farm,
      crops,
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Update farm details
// @route   PUT /api/farms/:id
router.put('/:id', protect, async (req, res, next) => {
  try {
    let farm = await Farm.findById(req.params.id);
    if (!farm) {
      return res.status(404).json({ success: false, message: 'Farm not found' });
    }

    if (farm.owner.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to modify this farm profile' });
    }

    const updatableFields = [
      'farmName',
      'totalArea',
      'areaUnit',
      'state',
      'district',
      'villageOrLocation',
      'soilType',
      'irrigationMethod',
      'waterSource',
      'notes',
    ];

    updatableFields.forEach(field => {
      if (req.body[field] !== undefined) farm[field] = req.body[field];
    });

    const updatedFarm = await farm.save();

    res.json({
      success: true,
      message: 'Farm updated successfully',
      farm: updatedFarm,
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Delete farm
// @route   DELETE /api/farms/:id
router.delete('/:id', protect, async (req, res, next) => {
  try {
    const farm = await Farm.findById(req.params.id);
    if (!farm) {
      return res.status(404).json({ success: false, message: 'Farm not found' });
    }

    if (farm.owner.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this farm profile' });
    }

    // Cascade delete associated crops
    await Crop.deleteMany({ farm: farm._id });
    await farm.deleteOne();

    res.json({
      success: true,
      message: 'Farm and associated crop records deleted successfully',
    });
  } catch (error) {
    next(error);
  }
});

export default router;
