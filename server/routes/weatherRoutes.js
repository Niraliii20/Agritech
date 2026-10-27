import express from 'express';
import { getWeatherByLocation } from '../services/weatherService.js';

const router = express.Router();

// @desc    Get weather report & agricultural advisory for a location
// @route   GET /api/weather
router.get('/', async (req, res, next) => {
  try {
    const location = req.query.q || req.query.district || 'Ludhiana';
    const weatherData = await getWeatherByLocation(location);

    res.json({
      success: true,
      data: weatherData,
    });
  } catch (error) {
    next(error);
  }
});

export default router;
