import mongoose from 'mongoose';

const expertSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    title: {
      type: String,
      required: true,
    },
    specialization: {
      type: String,
      required: true,
    },
    qualification: {
      type: String,
      default: 'Ph.D. / M.Sc. Agriculture',
    },
    experienceYears: {
      type: Number,
      default: 10,
    },
    institution: {
      type: String,
      default: 'Indian Agricultural Research Institute',
    },
    avatar: {
      type: String,
      default: '',
    },
    languages: [
      {
        type: String,
      },
    ],
    rating: {
      type: Number,
      default: 4.8,
    },
    consultationsCount: {
      type: Number,
      default: 42,
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
    bio: {
      type: String,
    },
  },
  { timestamps: true }
);

export const Expert = mongoose.model('Expert', expertSchema);
