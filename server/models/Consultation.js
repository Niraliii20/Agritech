import mongoose from 'mongoose';

const consultationSchema = new mongoose.Schema(
  {
    farmer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    expert: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Expert',
      required: true,
    },
    cropType: {
      type: String,
      required: true,
      trim: true,
    },
    farmLocation: {
      type: String,
      required: true,
      trim: true,
    },
    question: {
      type: String,
      required: [true, 'Please explain your farming question or issue'],
      trim: true,
    },
    status: {
      type: String,
      enum: ['Pending', 'In Review', 'Answered', 'Closed'],
      default: 'Pending',
    },
    expertReply: {
      type: String,
      default: '',
    },
    repliedAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

export const Consultation = mongoose.model('Consultation', consultationSchema);
