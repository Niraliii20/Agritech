import mongoose from 'mongoose';

const cropSchema = new mongoose.Schema(
  {
    farm: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Farm',
      required: [true, 'Associated farm is required'],
      index: true,
    },
    farmer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    cropName: {
      type: String,
      required: [true, 'Crop name is required'],
      trim: true,
    },
    variety: {
      type: String,
      trim: true,
      default: 'Standard Hybrid',
    },
    category: {
      type: String,
      enum: ['Cereal', 'Pulse', 'Oilseed', 'Fiber', 'Cash Crop', 'Vegetable', 'Fruit', 'Spice', 'Fodder'],
      default: 'Cereal',
    },
    sowingDate: {
      type: Date,
      required: [true, 'Sowing date is required'],
    },
    expectedHarvestDate: {
      type: Date,
    },
    actualHarvestDate: {
      type: Date,
    },
    fieldArea: {
      type: Number,
      required: [true, 'Field area is required'],
    },
    areaUnit: {
      type: String,
      enum: ['Acres', 'Hectares', 'Bigha', 'Guntha'],
      default: 'Acres',
    },
    growthStage: {
      type: String,
      enum: [
        'Land Preparation',
        'Sowing',
        'Germination',
        'Vegetative Growth',
        'Flowering',
        'Fruiting',
        'Harvesting',
        'Completed',
      ],
      default: 'Sowing',
    },
    growthPercentage: {
      type: Number,
      min: 0,
      max: 100,
      default: 10,
    },
    healthStatus: {
      type: String,
      enum: ['Excellent', 'Good', 'Fair', 'Needs Attention', 'Critical'],
      default: 'Good',
    },
    irrigationLogs: [
      {
        date: { type: Date, default: Date.now },
        amount: String,
        notes: String,
      },
    ],
    fertilizerLogs: [
      {
        date: { type: Date, default: Date.now },
        name: String,
        quantity: String,
        notes: String,
      },
    ],
    observations: [
      {
        date: { type: Date, default: Date.now },
        note: String,
        stage: String,
      },
    ],
    status: {
      type: String,
      enum: ['Active', 'Harvested', 'Failed'],
      default: 'Active',
    },
    image: {
      type: String,
      default: '',
    },
  },
  { timestamps: true }
);

export const Crop = mongoose.model('Crop', cropSchema);
