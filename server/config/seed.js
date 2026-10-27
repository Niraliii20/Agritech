import dotenv from 'dotenv';
import mongoose from 'mongoose';

import { User } from '../models/User.js';
import { Farm } from '../models/Farm.js';
import { Crop } from '../models/Crop.js';
import { SoilReport } from '../models/SoilReport.js';
import { PestReport } from '../models/PestReport.js';
import { Product } from '../models/Product.js';
import { Order } from '../models/Order.js';
import { Expert } from '../models/Expert.js';
import { Consultation } from '../models/Consultation.js';
import { CommunityPost } from '../models/CommunityPost.js';
import { Comment } from '../models/Comment.js';
import { Notification } from '../models/Notification.js';

dotenv.config();

const seedData = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/agritech';
    console.log(`[Seed] Connecting to MongoDB: ${mongoUri}`);
    await mongoose.connect(mongoUri);

    console.log('[Seed] Clearing existing collections...');
    await Promise.all([
      User.deleteMany(),
      Farm.deleteMany(),
      Crop.deleteMany(),
      SoilReport.deleteMany(),
      PestReport.deleteMany(),
      Product.deleteMany(),
      Order.deleteMany(),
      Expert.deleteMany(),
      Consultation.deleteMany(),
      CommunityPost.deleteMany(),
      Comment.deleteMany(),
      Notification.deleteMany(),
    ]);

    console.log('[Seed] Creating demo users...');
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

    console.log('[Seed] Creating demo farms...');
    const farm1 = await Farm.create({
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

    const farm2 = await Farm.create({
      owner: farmer._id,
      farmName: 'Suryoday Organic Orchard',
      totalArea: 5.2,
      areaUnit: 'Acres',
      state: 'Punjab',
      district: 'Ludhiana',
      villageOrLocation: 'Samrala Road, Plot 18',
      soilType: 'Alluvial',
      irrigationMethod: 'Drip',
      waterSource: 'Canal feed and overhead tank',
      notes: 'Dedicated organic vegetable cultivation and experimental nursery.',
    });

    console.log('[Seed] Creating demo crops...');
    const crop1 = await Crop.create({
      farm: farm1._id,
      farmer: farmer._id,
      cropName: 'Sharbati Wheat',
      variety: 'PBW-502 Certified',
      category: 'Cereal',
      sowingDate: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000), // 45 days ago
      expectedHarvestDate: new Date(Date.now() + 75 * 24 * 60 * 60 * 1000),
      fieldArea: 9.0,
      areaUnit: 'Acres',
      growthStage: 'Vegetative Growth',
      growthPercentage: 55,
      healthStatus: 'Excellent',
      irrigationLogs: [
        { date: new Date(Date.now() - 40 * 24 * 60 * 60 * 1000), amount: 'Crown Root Initiation (CRI) 5 cm', notes: 'First vital watering after 21 days' },
        { date: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000), amount: 'Tillering Stage 4 cm', notes: 'Scheduled canal irrigation' },
      ],
      fertilizerLogs: [
        { date: new Date(Date.now() - 44 * 24 * 60 * 60 * 1000), name: 'DAP & MOP Basal', quantity: '50 kg/acre DAP, 20 kg/acre MOP', notes: 'Banded at sowing' },
        { date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000), name: 'Neem Coated Urea', quantity: '45 kg/acre', notes: 'Top dressing before watering' },
      ],
      observations: [
        { date: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000), note: 'Strong tillering observed. 4-5 tillers per plant.', stage: 'Vegetative Growth' },
      ],
      status: 'Active',
      image: 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?auto=format&fit=crop&w=800&q=80',
    });

    const crop2 = await Crop.create({
      farm: farm1._id,
      farmer: farmer._id,
      cropName: 'Pusa Basmati 1121',
      variety: 'Pusa-1121 Premium Export',
      category: 'Cereal',
      sowingDate: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
      expectedHarvestDate: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000),
      fieldArea: 5.5,
      areaUnit: 'Acres',
      growthStage: 'Fruiting',
      growthPercentage: 85,
      healthStatus: 'Good',
      irrigationLogs: [
        { date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), amount: 'Standing water 3 cm', notes: 'Grain filling stage requirement' },
      ],
      fertilizerLogs: [
        { date: new Date(Date.now() - 50 * 24 * 60 * 60 * 1000), name: 'Zinc Sulphate 33%', quantity: '5 kg/acre', notes: 'Foliar correction for khaira disease' },
      ],
      observations: [
        { date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), note: 'Panicles fully formed, grains hardening nicely.', stage: 'Fruiting' },
      ],
      status: 'Active',
      image: 'https://images.unsplash.com/photo-1536939459926-301728717817?auto=format&fit=crop&w=800&q=80',
    });

    const crop3 = await Crop.create({
      farm: farm2._id,
      farmer: farmer._id,
      cropName: 'Organic Tomato (Abhinav)',
      variety: 'Syngenta Abhinav F1',
      category: 'Vegetable',
      sowingDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      expectedHarvestDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
      fieldArea: 3.0,
      areaUnit: 'Acres',
      growthStage: 'Flowering',
      growthPercentage: 70,
      healthStatus: 'Excellent',
      irrigationLogs: [
        { date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), amount: 'Drip 2 hours daily', notes: 'Morning cycle at 6:00 AM' },
      ],
      fertilizerLogs: [
        { date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), name: 'Jeev Amrit & Panchagavya', quantity: '200 L/acre via fertigation', notes: 'Organic booster' },
      ],
      status: 'Active',
      image: 'https://images.unsplash.com/photo-1592841200221-a6898f307baa?auto=format&fit=crop&w=800&q=80',
    });

    console.log('[Seed] Creating demo soil report...');
    await SoilReport.create({
      user: farmer._id,
      farm: farm1._id,
      sampleName: 'North Block Soil Health Card',
      soilType: 'Loamy',
      targetCrop: 'Wheat',
      ph: 6.8,
      nitrogen: 320,
      phosphorus: 19,
      potassium: 210,
      moisture: 38,
      organicCarbon: 0.65,
      healthScore: 88,
      status: 'Optimal',
      recommendations: [
        'Soil nutrients and pH (6.8) are in the optimal agronomic range for cereal cropping.',
        'Apply standard balanced NPK 120:60:40 kg/ha in split intervals for wheat.',
        'Incorporate green manure during fallow summer to sustain organic carbon level above 0.75%.',
      ],
    });

    console.log('[Seed] Creating demo pest report...');
    await PestReport.create({
      user: farmer._id,
      crop: crop1._id,
      cropName: 'Sharbati Wheat',
      pestOrDiseaseName: 'Foliar Yellow Rust Signs',
      symptoms: 'Small chlorotic streaks and powdery yellow pustules arranged in linear stripes on flag leaves.',
      severity: 'Medium',
      observationDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      possibleCauses: ['Puccinia striiformis fungal spores carried by northwest wind', 'Cool morning dew and temperatures between 10-18C'],
      preventionGuidance: [
        'Foliar spray of Tilt 25% EC (Propiconazole) @ 200 ml in 200 liters of water per acre.',
        'Avoid flood irrigation during high spore alert conditions.',
      ],
      treatmentHistory: [
        { treatment: 'Tilt 25% EC foliar spray applied using power sprayer', dateApplied: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), notes: 'Pustule expansion arrested.' },
      ],
      status: 'Under Control',
      imageUrl: 'https://images.unsplash.com/photo-1599818817282-53d9e836b856?auto=format&fit=crop&w=800&q=80',
    });

    console.log('[Seed] Creating demo products...');
    const products = await Product.create([
      {
        name: 'PBW-502 Certified Wheat Seed',
        category: 'Seeds',
        description: 'High-yielding, rust-resistant certified wheat seed bred for Northern and Central Indian plains. Superior chapati-making qualities with 12% protein content.',
        price: 640,
        originalPrice: 750,
        unit: '20 kg Bag',
        inStock: true,
        stockQuantity: 120,
        rating: 4.8,
        reviewsCount: 36,
        imageUrl: 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?auto=format&fit=crop&w=600&q=80',
        brand: 'National Seeds Corp',
        features: ['Certified Germination > 85%', 'Resistant to stripe rust', 'Yield potential: 22-24 quintals/acre'],
      },
      {
        name: 'Pusa Basmati 1121 Foundation Seeds',
        category: 'Seeds',
        description: 'World renowned extra long slender grain aromatic Basmati variety. High elongation ratio upon cooking, high market demand.',
        price: 920,
        originalPrice: 1100,
        unit: '10 kg Pack',
        inStock: true,
        stockQuantity: 80,
        rating: 4.9,
        reviewsCount: 42,
        imageUrl: 'https://images.unsplash.com/photo-1536939459926-301728717817?auto=format&fit=crop&w=600&q=80',
        brand: 'IARI Pusa',
        features: ['Maturity: 140-145 days', 'Aromatic slender grains', 'Cooked grain length up to 22 mm'],
      },
      {
        name: 'Water Soluble NPK 19:19:19 Complex',
        category: 'Fertilizers',
        description: '100% water-soluble foliar and fertigation grade fertilizer. Supplies nitrogen, phosphorus, and potassium equally for balanced vegetative and reproductive growth.',
        price: 1450,
        originalPrice: 1700,
        unit: '25 kg Bag',
        inStock: true,
        stockQuantity: 65,
        rating: 4.7,
        reviewsCount: 29,
        imageUrl: 'https://images.unsplash.com/photo-1585314062340-f1a5a7c9328d?auto=format&fit=crop&w=600&q=80',
        brand: 'IFFCO Agro',
        features: ['Fully water soluble', 'Rapid nutrient uptake', 'Ideal for drip systems'],
      },
      {
        name: 'Pure Neem Cake Organic Bio-Fertilizer',
        category: 'Organic Farming Products',
        description: 'Cold-pressed organic neem cake powder. Enriches soil organic matter, deters nematodes, and acts as a natural nitrification inhibitor when blended with urea.',
        price: 490,
        originalPrice: 600,
        unit: '25 kg Bag',
        inStock: true,
        stockQuantity: 90,
        rating: 4.8,
        reviewsCount: 54,
        imageUrl: 'https://images.unsplash.com/photo-1628352081506-83c43123ed6d?auto=format&fit=crop&w=600&q=80',
        brand: 'Krishi Rasayan Organic',
        features: ['100% Natural cold-pressed', 'Rich in Azadirachtin', 'Combats subterranean termites and nematodes'],
      },
      {
        name: 'Automated 1-Acre Drip Irrigation Kit',
        category: 'Irrigation Equipment',
        description: 'Complete micro-irrigation set including 16mm inline drip lateral pipes, screen filter, venturi injector for fertigation, control valves, and joiners.',
        price: 4899,
        originalPrice: 6200,
        unit: 'Complete 1-Acre Kit',
        inStock: true,
        stockQuantity: 30,
        rating: 4.9,
        reviewsCount: 19,
        imageUrl: 'https://images.unsplash.com/photo-1563514227147-6d2ff665a6a0?auto=format&fit=crop&w=600&q=80',
        brand: 'Jain Irrigation Systems',
        features: ['Saves up to 60% water', 'Clog-resistant emitters', 'UV stabilized virgin HDPE'],
      },
      {
        name: '16L Dual-Battery Knapsack Sprayer',
        category: 'Farming Tools',
        description: 'High pressure 12V 12Ah lithium rechargeable battery sprayer with stainless steel telescopic lance and 4 interchangeable brass nozzles for efficient spraying.',
        price: 2499,
        originalPrice: 3200,
        unit: 'Piece',
        inStock: true,
        stockQuantity: 45,
        rating: 4.6,
        reviewsCount: 68,
        imageUrl: 'https://images.unsplash.com/photo-1599818817282-53d9e836b856?auto=format&fit=crop&w=600&q=80',
        brand: 'Kisan Power Tools',
        features: ['Spray 25-30 tanks per charge', 'Auto pressure cut-off regulator', 'Lightweight ergonomic tank'],
      },
      {
        name: 'Bio-Neem Pest Repellent (Azadirachtin 10,000 ppm)',
        category: 'Crop Protection Products',
        description: 'High-potency organic botanical insecticide. Broad spectrum repellent and anti-feedant against sucking pests, bollworms, whiteflies, and aphids.',
        price: 780,
        originalPrice: 950,
        unit: '1 Liter Bottle',
        inStock: true,
        stockQuantity: 85,
        rating: 4.8,
        reviewsCount: 31,
        imageUrl: 'https://images.unsplash.com/photo-1589923188900-85dae523342b?auto=format&fit=crop&w=600&q=80',
        brand: 'EcoAgro Protection',
        features: ['Certified Organic by NPOP', 'Zero chemical residue', 'Safe for pollinators and earthworms'],
      },
      {
        name: 'Vermicompost Enriched Organic Manure',
        category: 'Organic Farming Products',
        description: 'Premium Eisenia fetida vermicompost enriched with mycorrhiza and beneficial rhizosphere bacteria. Improves water holding capacity and microbial flora.',
        price: 360,
        originalPrice: 450,
        unit: '40 kg Bag',
        inStock: true,
        stockQuantity: 110,
        rating: 4.9,
        reviewsCount: 77,
        imageUrl: 'https://images.unsplash.com/photo-1591857177580-dc82b9ac4e1e?auto=format&fit=crop&w=600&q=80',
        brand: 'NatureHarvest Organics',
        features: ['Rich humic acid and trace elements', 'Odorless and weed-seed free', 'Improves soil porosity'],
      },
    ]);

    console.log('[Seed] Creating demo agricultural experts...');
    const expert1 = await Expert.create({
      name: 'Dr. Vikramaditya Sharma',
      title: 'Principal Agronomist & Soil Scientist',
      specialization: 'Soil Health & Crop Nutrition',
      qualification: 'Ph.D. Agronomy, Punjab Agricultural University (PAU)',
      experienceYears: 18,
      institution: 'Punjab Agricultural University, Ludhiana',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
      languages: ['English', 'Hindi', 'Punjabi'],
      rating: 4.9,
      consultationsCount: 145,
      isAvailable: true,
      bio: 'Advises farmers on balanced fertilization, soil health restoration, and maximizing crop yields in Northern cereal belts.',
    });

    const expert2 = await Expert.create({
      name: 'Dr. Ananya Deshmukh',
      title: 'Senior Plant Pathologist',
      specialization: 'Pest & Disease Diagnosis',
      qualification: 'Ph.D. Plant Pathology, MPKV Rahuri',
      experienceYears: 14,
      institution: 'Mahatma Phule Krishi Vidyapeeth',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80',
      languages: ['English', 'Hindi', 'Marathi'],
      rating: 4.9,
      consultationsCount: 118,
      isAvailable: true,
      bio: 'Specialist in fungal leaf blights, rust epidemics, and biological pest control in cash crops and horticulture.',
    });

    const expert3 = await Expert.create({
      name: 'Er. Harpreet Singh Gill',
      title: 'Micro-Irrigation Specialist',
      specialization: 'Irrigation & Water Engineering',
      qualification: 'M.Tech Agricultural Engineering, IIT Kharagpur',
      experienceYears: 12,
      institution: 'Central Institute of Agricultural Engineering',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
      languages: ['English', 'Hindi', 'Punjabi'],
      rating: 4.8,
      consultationsCount: 92,
      isAvailable: true,
      bio: 'Dedicated to precision water management, drip layout design, solar pumping, and fertigation automation.',
    });

    console.log('[Seed] Creating demo consultation...');
    await Consultation.create({
      farmer: farmer._id,
      expert: expert1._id,
      cropType: 'Sharbati Wheat',
      farmLocation: 'Ludhiana, Punjab',
      question: 'What is the optimal timing and dose of second urea top-dressing after first irrigation in sandy loam soil?',
      status: 'Answered',
      expertReply:
        'For sandy loam soils in Punjab, apply 45 kg Neem Coated Urea per acre just prior to the second irrigation (around 40-45 days after sowing at late tillering). Split application prevents leaching and ensures maximum nitrogen uptake during jointing.',
      repliedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    });

    console.log('[Seed] Creating demo community posts...');
    const post1 = await CommunityPost.create({
      author: farmer._id,
      title: 'Experience with Drip Irrigation in Vegetable Farming — 50% Water Savings',
      content:
        'Last Kharif season, I installed a 1-acre drip kit on my tomato and capsicum plot. The results were extraordinary: water consumption dropped by half, weed growth reduced significantly because water is delivered right at the roots, and yield increased by 22%. Fellow farmers, do consider government subsidies under PM-KUSUM and Micro Irrigation schemes!',
      category: 'Irrigation',
      likes: [farmer._id, admin._id],
      commentsCount: 2,
    });

    await Comment.create({
      post: post1._id,
      author: admin._id,
      content: 'Great initiative Rajesh ji! AgriTech provides complete guidance on district-level subsidy portals as well.',
    });

    await Comment.create({
      post: post1._id,
      author: farmer._id,
      content: 'Happy to share pipe layouts and pump pressure specs with anyone interested!',
    });

    const post2 = await CommunityPost.create({
      author: admin._id,
      title: 'Advisory: Prevention of Yellow Rust in Wheat Across North-Western Plains',
      content:
        'Due to recent morning dew and overcast conditions, farmers are advised to regularly scout the lower canopy of wheat plants for yellow powder lines. If noticed, spray Propiconazole 25% EC without delay to safeguard tillering potential.',
      category: 'Pest Control',
      likes: [farmer._id],
      commentsCount: 1,
    });

    await Comment.create({
      post: post2._id,
      author: farmer._id,
      content: 'Thank you for the timely warning. Checked my fields today and applied foliar spray.',
    });

    console.log('[Seed] Creating demo notifications...');
    await Notification.create([
      {
        user: farmer._id,
        title: 'Weather Update: Ideal Sowing Window',
        message: 'Clear skies and daytime temperatures of 26-28°C in Ludhiana offer favorable conditions for field cultivation.',
        type: 'weather',
        severity: 'info',
        link: '/weather',
      },
      {
        user: farmer._id,
        title: 'Crop Reminder: Irrigation Due',
        message: 'Sharbati Wheat plot #1 is due for scheduled light watering.',
        type: 'irrigation',
        severity: 'warning',
        link: '/crops',
      },
      {
        user: farmer._id,
        title: 'New Expert Reply Posted',
        message: 'Dr. Vikramaditya Sharma replied to your wheat top-dressing consultation.',
        type: 'general',
        severity: 'info',
        link: '/expert-advice',
      },
    ]);

    console.log('[Seed] Creating demo order...');
    await Order.create({
      user: farmer._id,
      items: [
        {
          product: products[0]._id,
          name: products[0].name,
          price: products[0].price,
          quantity: 2,
          imageUrl: products[0].imageUrl,
          unit: products[0].unit,
        },
        {
          product: products[3]._id,
          name: products[3].name,
          price: products[3].price,
          quantity: 1,
          imageUrl: products[3].imageUrl,
          unit: products[3].unit,
        },
      ],
      totalAmount: 640 * 2 + 490,
      shippingAddress: {
        fullName: 'Rajesh Patel',
        street: 'Green Valley Agro Estate, Jagraon Block',
        district: 'Ludhiana',
        state: 'Punjab',
        pincode: '141001',
        phone: '+91 98765 43210',
      },
      status: 'Processing',
      paymentMethod: 'Cash on Delivery (Demo Checkout)',
      notes: 'Please call before dispatching to the farm gate.',
      isDemoOrder: true,
    });

    console.log('[Seed] Database successfully populated with realistic Indian agricultural demonstration data!');
    process.exit(0);
  } catch (error) {
    console.error('[Seed] Error populating database:', error);
    process.exit(1);
  }
};

seedData();
