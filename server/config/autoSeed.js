import { User } from '../models/User.js';
import { Farm } from '../models/Farm.js';
import { Crop } from '../models/Crop.js';
import { Product } from '../models/Product.js';
import { Notification } from '../models/Notification.js';

export const autoSeedIfEmpty = async () => {
  try {
    const userCount = await User.countDocuments();
    if (userCount > 0) {
      console.log('[AutoSeed] Database already has users. Skipping auto-seed.');
      return;
    }

    console.log('[AutoSeed] Empty database detected. Populating demo users and essential records...');

    // 1. Create Farmer
    const farmer = await User.create({
      fullName: 'Rajesh Patel',
      email: 'farmer@agritech.in',
      mobileNumber: '+91 98765 43210',
      password: 'Farmer@123',
      state: 'Punjab',
      district: 'Ludhiana',
      preferredLanguage: 'en',
      role: 'farmer',
    });

    // 2. Create Admin
    const admin = await User.create({
      fullName: 'AgriTech Administrator',
      email: 'admin@agritech.in',
      mobileNumber: '+91 98765 00001',
      password: 'Admin@123',
      state: 'Maharashtra',
      district: 'Pune',
      preferredLanguage: 'en',
      role: 'admin',
    });

    // 3. Create Sample Farm
    const farm = await Farm.create({
      owner: farmer._id,
      farmName: 'Green Valley Agro Estate',
      totalArea: 14.5,
      areaUnit: 'Acres',
      state: 'Punjab',
      district: 'Ludhiana',
      villageOrLocation: 'Jagraon Block, Sector 4',
      soilType: 'Loamy',
      irrigationMethod: 'Tube Well / Borewell',
      waterSource: 'Deep Borewell with Solar Pump',
      notes: 'Primary cultivation of Wheat and Basmati rice with crop rotation.',
    });

    // 4. Create Sample Crop
    await Crop.create({
      farm: farm._id,
      farmer: farmer._id,
      cropName: 'Sharbati Wheat',
      variety: 'PBW-502 Certified',
      category: 'Cereal',
      sowingDate: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000),
      expectedHarvestDate: new Date(Date.now() + 75 * 24 * 60 * 60 * 1000),
      fieldArea: 9.0,
      areaUnit: 'Acres',
      growthStage: 'Vegetative Growth',
      growthPercentage: 55,
      healthStatus: 'Excellent',
      status: 'Active',
      image: 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?auto=format&fit=crop&w=800&q=80',
    });

    // 5. Create Sample Notification
    await Notification.create({
      user: farmer._id,
      title: 'Welcome to AgriTech!',
      message: 'Your smart farming account is ready. Explore live weather, crop tracking, and expert advisory.',
      type: 'general',
      severity: 'info',
      link: '/dashboard',
    });

    console.log('[AutoSeed] Initial demo farmer, admin, farm, and crop seeded successfully!');
  } catch (error) {
    console.error('[AutoSeed] Error during seeding:', error.message);
  }
};
