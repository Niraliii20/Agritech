export const getMockDataForUrl = (url = '') => {
  const cleanUrl = url.split('?')[0].toLowerCase();

  if (cleanUrl.includes('/farms')) {
    return {
      success: true,
      count: 2,
      farms: [
        {
          _id: 'farm_001',
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
          cropsCount: 2,
          crops: [
            { farm: 'farm_001', cropName: 'Sharbati Wheat', growthStage: 'Vegetative Growth', status: 'Active' },
            { farm: 'farm_001', cropName: 'Pusa Basmati 1121', growthStage: 'Fruiting', status: 'Active' },
          ],
        },
        {
          _id: 'farm_002',
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
          cropsCount: 1,
          crops: [
            { farm: 'farm_002', cropName: 'Desi Mustard (Sarson)', growthStage: 'Flowering', status: 'Active' },
          ],
        },
      ],
    };
  }

  if (cleanUrl.includes('/crops')) {
    return {
      success: true,
      count: 3,
      crops: [
        {
          _id: 'crop_001',
          farm: 'farm_001',
          cropName: 'Sharbati Wheat',
          variety: 'PBW-502 Certified',
          category: 'Cereal',
          fieldArea: 9.0,
          areaUnit: 'Acres',
          growthStage: 'Vegetative Growth',
          growthPercentage: 55,
          healthStatus: 'Excellent',
          status: 'Active',
          sowingDate: '2026-09-12',
          expectedHarvestDate: '2026-12-25',
          image: 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?auto=format&fit=crop&w=800&q=80',
        },
        {
          _id: 'crop_002',
          farm: 'farm_001',
          cropName: 'Pusa Basmati 1121',
          variety: 'Pusa-1121 Premium Export',
          category: 'Cereal',
          fieldArea: 5.5,
          areaUnit: 'Acres',
          growthStage: 'Fruiting',
          growthPercentage: 85,
          healthStatus: 'Good',
          status: 'Active',
          sowingDate: '2026-07-28',
          expectedHarvestDate: '2026-11-20',
          image: 'https://images.unsplash.com/photo-1536939459926-301728717817?auto=format&fit=crop&w=800&q=80',
        },
        {
          _id: 'crop_003',
          farm: 'farm_002',
          cropName: 'Desi Mustard (Sarson)',
          variety: 'Pusa Bold High Oil',
          category: 'Oilseed',
          fieldArea: 5.2,
          areaUnit: 'Acres',
          growthStage: 'Flowering',
          growthPercentage: 65,
          healthStatus: 'Good',
          status: 'Active',
          sowingDate: '2026-10-01',
          expectedHarvestDate: '2027-01-15',
          image: 'https://images.unsplash.com/photo-1508873696983-2df5293cb39f?auto=format&fit=crop&w=800&q=80',
        },
      ],
    };
  }

  if (cleanUrl.includes('/weather')) {
    return {
      success: true,
      data: {
        city: 'Ludhiana',
        state: 'Punjab',
        temperature: 28,
        feelsLike: 29,
        tempMin: 22,
        tempMax: 30,
        humidity: 56,
        windSpeed: 3.6,
        pressure: 1012,
        condition: 'Clear Sky',
        description: 'Sunny and clear across agricultural zones',
        icon: '01d',
        forecast: [
          { day: 'Today', date: '27 Oct', temp: 28, min: 22, condition: 'Sunny', rainProb: '5%' },
          { day: 'Tue', date: '28 Oct', temp: 29, min: 21, condition: 'Clear Sky', rainProb: '0%' },
          { day: 'Wed', date: '29 Oct', temp: 28, min: 20, condition: 'Partly Cloudy', rainProb: '10%' },
          { day: 'Thu', date: '30 Oct', temp: 27, min: 19, condition: 'Sunny', rainProb: '0%' },
          { day: 'Fri', date: '31 Oct', temp: 26, min: 18, condition: 'Sunny', rainProb: '5%' },
        ],
        farmingAdvisory: 'Favorable daytime warmth for vegetative tillering. Early morning irrigation recommended.',
      },
    };
  }

  if (cleanUrl.includes('/soil')) {
    return {
      success: true,
      count: 1,
      reports: [
        {
          _id: 'soil_001',
          farmName: 'Green Valley Agro Estate',
          cropName: 'Sharbati Wheat',
          pH: 6.8,
          nitrogen: 280,
          phosphorus: 45,
          potassium: 210,
          soilMoisture: 42,
          soilType: 'Loamy',
          organicMatter: 0.72,
          overallHealthScore: 88,
          recommendations: 'Optimal nutrient balance. Maintain current vermicompost schedule.',
          createdAt: new Date().toISOString(),
        },
      ],
    };
  }

  if (cleanUrl.includes('/pest')) {
    return {
      success: true,
      alerts: [
        {
          _id: 'pest_001',
          cropName: 'Sharbati Wheat',
          pestName: 'Yellow Rust Early Warning',
          severity: 'Low',
          symptoms: 'Faint yellow stripes on lower foliage canopy during humid mornings',
          possibleCauses: 'Cool nights combined with heavy morning dew',
          preventionGuidance: 'Spray Propiconazole 25% EC at recommended dosage if spread exceeds 5% of canopy.',
          date: '2026-10-25',
        },
      ],
    };
  }

  if (cleanUrl.includes('/notifications')) {
    return {
      success: true,
      notifications: [
        {
          _id: 'notif_001',
          title: 'Weather Advisory: Clear Sowing Window',
          message: 'Ludhiana skies remain clear. Ideal conditions for light canal irrigation.',
          type: 'weather',
          severity: 'info',
          link: '/weather',
          read: false,
          createdAt: new Date(Date.now() - 3600000).toISOString(),
        },
        {
          _id: 'notif_002',
          title: 'Scheduled Irrigation: Sharbati Wheat',
          message: 'Plot #1 crown root watering cycle recommended in 48 hours.',
          type: 'irrigation',
          severity: 'warning',
          link: '/crops',
          read: false,
          createdAt: new Date(Date.now() - 86400000).toISOString(),
        },
      ],
    };
  }

  if (cleanUrl.includes('/products')) {
    return {
      success: true,
      products: [
        {
          _id: 'prod_001',
          name: 'Neem Coated Urea (45 kg)',
          category: 'Fertilizers',
          price: 266.5,
          rating: 4.8,
          stock: 120,
          unit: '45 kg Bag',
          imageUrl: 'https://images.unsplash.com/photo-1585314062340-f1a5a7c9328d?auto=format&fit=crop&w=600&q=80',
          description: 'Government subsidized high efficiency neem coated nitrogen fertilizer.',
        },
        {
          _id: 'prod_002',
          name: 'Certified Sharbati Wheat Seeds PBW-502',
          category: 'Seeds',
          price: 850,
          rating: 4.9,
          stock: 80,
          unit: '40 kg Bag',
          imageUrl: 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?auto=format&fit=crop&w=600&q=80',
          description: 'High germination rust-tolerant certified wheat seed.',
        },
        {
          _id: 'prod_003',
          name: 'Drip Irrigation Lateral Kit 16mm (1 Acre)',
          category: 'Equipment',
          price: 4999,
          rating: 4.7,
          stock: 25,
          unit: 'Complete Set',
          imageUrl: 'https://images.unsplash.com/photo-1563514227147-6d2ff665a6a0?auto=format&fit=crop&w=600&q=80',
          description: 'Micro irrigation inline drippers for water saving.',
        },
      ],
    };
  }

  return { success: true };
};
