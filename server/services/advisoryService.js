// Pest and disease diagnostic library for Indian agriculture
export const analyzePestSymptoms = (cropName, symptomsText, observedPest) => {
  const query = `${cropName || ''} ${symptomsText || ''} ${observedPest || ''}`.toLowerCase();

  let possibleCauses = [];
  let preventionGuidance = [];
  let severity = 'Medium';

  if (query.includes('rust') || query.includes('yellow stripes') || query.includes('pustules')) {
    possibleCauses = ['Yellow Rust (Puccinia striiformis)', 'Brown / Leaf Rust', 'Fungal spore proliferation in cool humid weather'];
    preventionGuidance = [
      'Spray Propiconazole 25% EC @ 1ml/liter water upon initial observation.',
      'Sow rust-resistant varieties approved by ICAR for your agro-climatic zone.',
      'Avoid late sowing of wheat to evade spore development periods.',
    ];
    severity = 'High';
  } else if (query.includes('blast') || query.includes('spindle') || query.includes('leaf lesion')) {
    possibleCauses = ['Rice Blast (Magnaporthe oryzae)', 'Excessive nitrogen fertilization', 'High relative humidity (>90%)'];
    preventionGuidance = [
      'Apply Tricyclazole 75% WP @ 0.6g/liter water or Kasugamycin.',
      'Avoid high doses of nitrogenous fertilizers in cloudy humid weather.',
      'Maintain field sanitation and burn infected stubble.',
    ];
    severity = 'High';
  } else if (query.includes('bollworm') || query.includes('pink') || query.includes('cotton')) {
    possibleCauses = ['Pink Bollworm (Pectinophora gossypiella)', 'American Bollworm', 'Continuous cotton cropping'];
    preventionGuidance = [
      'Install pheromone traps @ 5 traps/acre for monitoring and mass trapping.',
      'Release Trichogramma egg parasitoids @ 60,000/acre.',
      'Apply Emamectin Benzoate 5% SG @ 4g/10 liters water if ETL exceeds 10% rosette flowers.',
    ];
    severity = 'High';
  } else if (query.includes('aphid') || query.includes('whitefly') || query.includes('sucking') || query.includes('curling')) {
    possibleCauses = ['Aphids / Jassids / Whitefly infestation', 'Vector for Leaf Curl Virus', 'Dry warm conditions'];
    preventionGuidance = [
      'Install yellow sticky traps @ 10-15 traps/acre.',
      'Spray Neem oil (Azadirachtin 10,000 ppm) @ 2ml/liter as prophylactic measure.',
      'If ETL exceeded, spray Imidacloprid 17.8% SL @ 0.5ml/liter or Acetamiprid.',
    ];
    severity = 'Medium';
  } else if (query.includes('blight') || query.includes('rot') || query.includes('wilting')) {
    possibleCauses = ['Early / Late Blight', 'Bacterial or Fusarium Wilt', 'Poor soil drainage and stagnant water'];
    preventionGuidance = [
      'Apply Copper Oxychloride 50% WP @ 2.5g/liter or Mancozeb 75% WP @ 2g/liter.',
      'Drench root zone with Trichoderma viride bio-fungicide (50g/10 liters water).',
      'Ensure proper drainage trenches around raised beds.',
    ];
    severity = 'Medium';
  } else {
    possibleCauses = ['General foliar stress or nutrient imbalance', 'Early stage fungal or insect damage'];
    preventionGuidance = [
      'Inspect underside of leaves with a hand lens for active insects or fungal mycelium.',
      'Apply broad-spectrum organic bio-neem formulation as first line of defense.',
      'Take clear photo and submit an Expert Consultation request for verified diagnosis.',
    ];
    severity = 'Low';
  }

  return {
    possibleCauses,
    preventionGuidance,
    severity,
    isPreliminaryDiagnosis: true,
  };
};
