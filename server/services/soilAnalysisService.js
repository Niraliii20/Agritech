// Agronomic analysis engine for soil metrics
export const analyzeSoilMetrics = ({ ph, nitrogen, phosphorus, potassium, moisture, soilType, targetCrop }) => {
  let score = 100;
  const recommendations = [];
  const statusDetails = [];

  // pH Evaluation
  let phStatus = 'Optimal';
  if (ph < 5.5) {
    score -= 25;
    phStatus = 'Strongly Acidic';
    recommendations.push(
      'Soil is strongly acidic. Apply agricultural lime (calcium carbonate) or dolomite at 200-300 kg/acre to neutralize acidity.'
    );
  } else if (ph < 6.2) {
    score -= 10;
    phStatus = 'Slightly Acidic';
    recommendations.push(
      'Slight acidity detected. Suitable for tea or potatoes; consider moderate liming if planting legumes or cereals.'
    );
  } else if (ph > 8.5) {
    score -= 25;
    phStatus = 'Strongly Alkaline / Saline';
    recommendations.push(
      'High alkalinity/salinity observed. Apply agricultural gypsum (calcium sulphate) and incorporate organic farmyard manure (FYM).'
    );
  } else if (ph > 7.5) {
    score -= 10;
    phStatus = 'Moderately Alkaline';
    recommendations.push(
      'Mild alkaline soil. Avoid alkaline-forming fertilizers like sodium nitrate; prefer ammonium sulfate or urea.'
    );
  } else {
    statusDetails.push('Soil pH is in the optimal range (6.2 - 7.5) for nutrient bioavailability.');
  }

  // Nitrogen (N) - Benchmark: 280 - 560 kg/ha is medium
  let nStatus = 'Medium';
  if (nitrogen < 240) {
    score -= 20;
    nStatus = 'Low (Deficient)';
    recommendations.push(
      `Nitrogen is low (${nitrogen} kg/ha). Apply split doses of Neem-coated Urea or incorporate nitrogen-fixing green manure (Dhaincha/Sunn hemp).`
    );
  } else if (nitrogen > 560) {
    score -= 5;
    nStatus = 'Excessive';
    recommendations.push(
      'High nitrogen levels detected. Curtail top-dressing urea to avoid vegetative lodging and increased pest attraction.'
    );
  }

  // Phosphorus (P) - Benchmark: 10 - 25 kg/ha is medium
  let pStatus = 'Medium';
  if (phosphorus < 11) {
    score -= 15;
    pStatus = 'Low (Deficient)';
    recommendations.push(
      `Phosphorus is low (${phosphorus} kg/ha). Apply Single Super Phosphate (SSP) or DAP banded at root level during basal application.`
    );
  } else if (phosphorus > 25) {
    statusDetails.push('Available phosphorus levels are rich.');
  }

  // Potassium (K) - Benchmark: 110 - 280 kg/ha is medium
  let kStatus = 'Medium';
  if (potassium < 110) {
    score -= 15;
    kStatus = 'Low (Deficient)';
    recommendations.push(
      `Potassium is deficient (${potassium} kg/ha). Apply Muriate of Potash (MOP) to enhance stalk strength, drought resistance, and grain filling.`
    );
  }

  // Moisture (%)
  let moistureStatus = 'Adequate';
  if (moisture < 25) {
    score -= 10;
    moistureStatus = 'Dry';
    recommendations.push(
      'Soil moisture is below optimal threshold. Schedule field irrigation before sowing or fertilizer application.'
    );
  } else if (moisture > 70) {
    score -= 10;
    moistureStatus = 'Waterlogged';
    recommendations.push('High moisture content with risk of waterlogging. Ensure trench drainage to avoid root rot.');
  }

  // Crop-specific planting notes
  if (targetCrop) {
    const crop = targetCrop.toLowerCase();
    if (crop.includes('wheat')) {
      recommendations.push('Wheat Advisory: Ensure firm seedbed with pre-sowing Rauni irrigation; target N:P:K ratio around 4:2:1.');
    } else if (crop.includes('rice') || crop.includes('paddy')) {
      recommendations.push('Paddy Advisory: Maintain 2-3 cm standing water in nursery and early vegetative tillering stage.');
    } else if (crop.includes('cotton')) {
      recommendations.push('Cotton Advisory: Adequate potassium is critical for boll retention and fiber development.');
    } else if (crop.includes('sugarcane')) {
      recommendations.push('Sugarcane Advisory: Heavy feeder; apply well-rotted compost (5-10 tons/acre) alongside inorganic NPK.');
    }
  }

  // Final status rating
  score = Math.max(20, Math.min(100, score));
  let status = 'Optimal';
  if (score < 50) status = 'Critical Deficiency';
  else if (score < 70) status = 'Needs Attention';
  else if (score < 85) status = 'Moderate';

  return {
    healthScore: score,
    status,
    evaluations: {
      ph: phStatus,
      nitrogen: nStatus,
      phosphorus: pStatus,
      potassium: kStatus,
      moisture: moistureStatus,
    },
    recommendations: recommendations.length > 0 ? recommendations : ['Soil nutrients are well-balanced for cultivation.'],
    disclaimer:
      'This guidance is generated from farmer-entered values and agronomic benchmarks. Always consult an official soil testing lab or local KVK before large-scale fertilizer expenditure.',
  };
};
