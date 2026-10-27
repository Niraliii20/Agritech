import mongoose from 'mongoose';

const farmingActivitySchema = new mongoose.Schema(
  {
    farmer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    farm: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Farm',
    },
    crop: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Crop',
    },
    cropName: String,
    activityType: {
      type: String,
      enum: [
        'Irrigation',
        'Fertilizer Application',
        'Pesticide Spray',
        'Weeding',
        'Harvesting',
        'Soil Test',
        'Sowing',
        'General Maintenance',
      ],
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    scheduledDate: {
      type: Date,
      required: true,
    },
    isCompleted: {
      type: Boolean,
      default: false,
    },
    completedDate: Date,
    notes: String,
  },
  { timestamps: true }
);

export const FarmingActivity = mongoose.model('FarmingActivity', farmingActivitySchema);
