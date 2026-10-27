import mongoose from 'mongoose';

const farmSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    farmName: {
      type: String,
      required: [true, 'Farm name is required'],
      trim: true,
    },
    totalArea: {
      type: Number,
      required: [true, 'Farm area is required'],
      min: [0.1, 'Farm area must be greater than 0'],
    },
    areaUnit: {
      type: String,
      enum: ['Acres', 'Hectares', 'Bigha', 'Guntha'],
      default: 'Acres',
    },
    state: {
      type: String,
      required: [true, 'State is required'],
      trim: true,
    },
    district: {
      type: String,
      required: [true, 'District is required'],
      trim: true,
    },
    villageOrLocation: {
      type: String,
      trim: true,
      default: '',
    },
    soilType: {
      type: String,
      enum: ['Alluvial', 'Black', 'Red', 'Laterite', 'Sandy', 'Clay', 'Loamy', 'Other'],
      default: 'Loamy',
    },
    irrigationMethod: {
      type: String,
      enum: ['Drip', 'Sprinkler', 'Canal / Flood', 'Rainfed', 'Tube Well / Borewell', 'Other'],
      default: 'Tube Well / Borewell',
    },
    waterSource: {
      type: String,
      default: 'Borewell',
    },
    notes: {
      type: String,
      default: '',
    },
  },
  { timestamps: true }
);

export const Farm = mongoose.model('Farm', farmSchema);
