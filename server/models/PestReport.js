import mongoose from 'mongoose';

const pestReportSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    crop: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Crop',
    },
    cropName: {
      type: String,
      required: [true, 'Crop name is required'],
      trim: true,
    },
    pestOrDiseaseName: {
      type: String,
      required: [true, 'Observed pest or disease name is required'],
      trim: true,
    },
    symptoms: {
      type: String,
      required: [true, 'Please provide observed symptoms'],
      trim: true,
    },
    severity: {
      type: String,
      enum: ['Low', 'Medium', 'High'],
      default: 'Medium',
    },
    observationDate: {
      type: Date,
      default: Date.now,
    },
    possibleCauses: [
      {
        type: String,
      },
    ],
    preventionGuidance: [
      {
        type: String,
      },
    ],
    treatmentHistory: [
      {
        treatment: String,
        dateApplied: { type: Date, default: Date.now },
        notes: String,
      },
    ],
    imageUrl: {
      type: String,
      default: '',
    },
    isPreliminaryDiagnosis: {
      type: Boolean,
      default: true,
    },
    status: {
      type: String,
      enum: ['Active', 'Under Control', 'Resolved'],
      default: 'Active',
    },
  },
  { timestamps: true }
);

export const PestReport = mongoose.model('PestReport', pestReportSchema);
