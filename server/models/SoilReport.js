import mongoose from 'mongoose';

const soilReportSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    farm: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Farm',
    },
    sampleName: {
      type: String,
      default: 'Field Sample',
      trim: true,
    },
    soilType: {
      type: String,
      enum: ['Alluvial', 'Black', 'Red', 'Laterite', 'Sandy', 'Clay', 'Loamy', 'Other'],
      default: 'Loamy',
    },
    targetCrop: {
      type: String,
      required: [true, 'Crop being cultivated is required'],
      trim: true,
    },
    ph: {
      type: Number,
      required: [true, 'Soil pH is required'],
      min: [0, 'pH must be at least 0'],
      max: [14, 'pH must be at most 14'],
    },
    nitrogen: {
      type: Number,
      required: [true, 'Nitrogen (N) value is required'],
      min: 0,
    },
    phosphorus: {
      type: Number,
      required: [true, 'Phosphorus (P) value is required'],
      min: 0,
    },
    potassium: {
      type: Number,
      required: [true, 'Potassium (K) value is required'],
      min: 0,
    },
    moisture: {
      type: Number,
      required: [true, 'Soil moisture percentage is required'],
      min: 0,
      max: 100,
    },
    organicCarbon: {
      type: Number,
      default: 0.5,
    },
    healthScore: {
      type: Number,
      default: 75,
    },
    status: {
      type: String,
      enum: ['Optimal', 'Moderate', 'Needs Attention', 'Critical Deficiency'],
      default: 'Moderate',
    },
    recommendations: [
      {
        type: String,
      },
    ],
    disclaimer: {
      type: String,
      default:
        'This assessment is based on user-entered values and standard agricultural agronomy benchmarks. For critical farming decisions and precision fertilizer doses, consult your local Krishi Vigyan Kendra (KVK) or an accredited soil testing laboratory.',
    },
  },
  { timestamps: true }
);

export const SoilReport = mongoose.model('SoilReport', soilReportSchema);
